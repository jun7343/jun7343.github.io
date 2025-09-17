---
layout: post
title: OpenAPI로 AWS API Gateway 리소스 유연하게 생성하기 By Terraform
categories: [AWS, Terraform, DevOps, OpenAPI]
excerpt: OpenAPI로 AWS API Gateway 리소스 유연하게 생성하기 By Terraform
---

API Gateway 모듈은 Git Repo에 많지만 Terraform 버전 이슈로 사용하지 못하게 되어 직접 모듈을 구성하던 중, 기본적으로 알고 있을 수도 있는 내용이지만 **OpenAPI Spec으로 API Gateway의 API 리소스를 효율적으로 생성하는 방법**을 공유하려 합니다.  

[API Gateway 모듈 생성 Ref](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_account)

---

사실 모듈 구성은 딱히 어렵지 않습니다. Terraform은 클라우드 벤더별 설명이 잘 되어 있고, 특히 AWS는 더욱더 잘 정리되어 있습니다.  
여튼, 다만 API Gateway의 경우 리소스 생성 과정 중 약간의 봉착(?)에 부딪히는 부분이 있습니다.  

바로 **aws_api_gateway_resource** 리소스를 생성해야 할 때입니다.

![AWS API Gateway Console](/assets/images/terraform-gateway/aws-gateway-console.png)
> AWS Gateway 리소스(API Path)와 리소스 통합구성 화면

```tf
resource "aws_api_gateway_rest_api" "MyDemoAPI" {
  name        = "MyDemoAPI"
  description = "This is my API for demonstration purposes"
}

resource "aws_api_gateway_resource" "MyDemoResource" {
  rest_api_id = aws_api_gateway_rest_api.MyDemoAPI.id
  parent_id   = aws_api_gateway_rest_api.MyDemoAPI.root_resource_id
  path_part   = "mydemoresource"
}
```
> terraform aws_api_gateway_resource 생성 예시

AWS 콘솔에서 API Gateway를 생성해보시면 아시겠지만, API Gateway 리소스를 만들고, 메서드를 만들고, 통합하는 등 수많은 리소스를 반복해서 작업하게 됩니다.  
그러다 보니 Terraform에서도 리소스를 만들고, 메서드를 만들고, 통합하는 리소스들을 일일이 생성해야 하는 거 아닌가? 라는 생각이 들 수 있습니다.  

> 리소스 생성, 메서드 생성, 통합, 그리고 하위 리소스 연결까지 고려하면 정말 말도 안 되는 일이 됩니다...

하지만! AWS는 역시나 편리하게 생성할 수 있는 방법을 제공합니다. 바로 **OpenAPI Spec을 통한 리소스 일괄적 생성 방법**입니다.  
정확히는 OpenAPI Spec을 확장한 개념을 정의하여 사용하면 AWS API Gateway 리소스를 일괄적으로 생성할 수 있습니다.  

> 물론 AWS 콘솔에서도 OpenAPI Spec 정의를 적용하여 API Gateway를 생성할 수 있습니다.  
> [API Gateway에서 OpenAPI를 사용하여 REST API 개발](https://docs.aws.amazon.com/ko_kr/apigateway/latest/developerguide/api-gateway-import-api.html)

---

```yaml
openapi: "3.0.1"
info:
  title: "Media"
  version: "1.0"

paths:
  /api/media/{proxy+}:
    get:
      parameters:
        - name: proxy
          in: path
          required: true
          schema:
            type: string
      security:
        - api_key: []
      x-amazon-apigateway-integration:
        uri: http://test.com/media/{proxy}
        httpMethod: get
        type: HTTP_PROXY
        passthroughBehavior: when_no_templates
        requestParameters:
          integration.request.path.proxy: method.request.path.proxy
components:
  securitySchemes:
    api_key:
      type: apiKey
      name: x-api-key
      in: header
```
> [API Gateway용 OpenAPI 확장 프로그램](https://docs.aws.amazon.com/ko_kr/apigateway/latest/developerguide/api-gateway-swagger-extensions.html)

예시를 보면 OpenAPI Spec의 확장 명세를 통해 API Gateway 리소스를 유연하게 생성할 수 있습니다.  
우리는 해당 OpenAPI Spec이 변경되어 Terraform에 의해 적용될 때마다 API Gateway 배포를 적용하기 위해 다음과 같이 구성할 수 있습니다.  

```tf
resource "aws_api_gateway_rest_api" "this" {
  name        = var.name
  description = var.description

  body = (
    var.openapi_file != null && var.openapi_file != ""
    ? jsonencode(yamldecode(file(var.openapi_file)))
    : var.body
  )

  ...
}

resource "aws_api_gateway_deployment" "this" {
  rest_api_id = aws_api_gateway_rest_api.this.id

  triggers = {
    redeploy_hash = sha1(jsonencode([
      aws_api_gateway_rest_api.this.body
    ]))
  }

  depends_on = [ 
    aws_api_gateway_rest_api.this
  ]

  ...
}
```
> API Gateway 리소스

```tf
module "api" {
  source = "../modules/apigateway_v1"

  name               = "tf-gw-media-api-gateway"
  openapi_file       = "yamls/media-openapi.yaml"
  stages             = ["dev"]

  ...
}
```
> API Gateway 모듈

OpenAPI yaml 파일이 기존 body와 달라지면, `aws_api_gateway_rest_api` 리소스가 갱신되고, 이어서 `aws_api_gateway_deployment` 설정에 따라 새 배포가 적용됩니다.

---

## 정리

이를 통해 우리는 Terraform으로 API Gateway 모듈을 구성할 때, 리소스를 하나하나 번거롭게 생성하지 않고 **OpenAPI Spec 확장 명세를 활용해 일괄적으로 생성**하고, 즉각적으로 **API Gateway에 배포**까지 할 수 있게 되었습니다.






