---
layout: post
title: NCP(naver cloud platform)에서 okHttp gRPC client 연동 이슈
categories: [NCP, gRPC, Network]
excerpt: NCP에서 okHttp gRPC client 연동이 안되었던 이슈를 공유합니다.
---

okHttp gRPC client가 netty 기반 gRPC 서버 요청 실패한 이슈를 공유드립니다.

## 이슈 발생

사용자의 외부 광고 매체 접근 정보를 확인하기 위해, 광고 매체에 장착된 비콘을 안드로이드가 수신하여 서버에 전달하고 저장 및 가공하는 서비스 프로젝트에서 서버 개발을 맡아 진행했습니다.

이 서비스는 광고 매체가 주변에 많을수록 안드로이드 SDK에 의해 스캔되는 비콘 수가 증가하고, 그만큼 서버로 전송되는 비콘 정보도 늘어나 네트워크 비용에 대한 우려가 있었습니다.    

저희는 내부에서 주로 사용하는 gRPC 프로토콜을 통해 송수신할 경우 네트워크 비용을 최적화할 수 있다고 판단하여, 안드로이드와 서버 간 통신은 gRPC 프로토콜을 사용하기로 협의했습니다.      
👉 [gRPC와 REST의 차이점은 무엇인가요?](https://aws.amazon.com/ko/compare/the-difference-between-grpc-and-rest/)

서버 개발을 진행하면서 Netty 기반의 gRPC 클라이언트를 통해 테스트했을 때는 문제가 없었고, 로컬 환경에서 안드로이드 SDK와 테스트할 때도 정상 동작을 확인했습니다.(Postman으로 테스트 진행. Postman은 gRPC 테스트도 지원합니다.)    
그러나 클라우드 서버(NCP)에 배포한 뒤, 안드로이드 SDK가 gRPC 요청을 전달하지 못하는 이슈(ALPN 실패)가 발생했습니다.    
ALB -> Target 으로 데이터 전달과정에서 발생했으며, 안드로이드에서 서버로 요청시 **"gRPC는 h1(HTTP/1.1)를 지원하지 않는다"** 라는 에러 메세지를 응답하게 됩니다.

![grpc error](/assets/images/ncp-grpc-issue/grpc-error.png)

## 원인 파악

원인은 ALB → Target으로 요청이 전달되는 과정에서 발생했습니다. Target이 gRPC를 지원하지 않아 HTTP 프로토콜만 선택하게 되었고, 그 결과 ALB 리스너가 HTTP/2 요청을 받아도 Target에는 HTTP/1.1로 전달하게 되었습니다. 이 때문에 서버가 요청을 제대로 수신하지 못하는 문제가 생긴 것입니다.
> (참고: AWS는 Target Group에서 gRPC 프로토콜을 지원하지만, NCP는 Target 프로토콜로 HTTP/1.0, 1.1만 지원합니다.)

![NCP Ask](/assets/images/ncp-grpc-issue/ask.png)
![NCP Ask](/assets/images/ncp-grpc-issue/answer.png)

정확히는 [ALPN(Application-Layer Protocol Negotiation)](https://datatracker.ietf.org/doc/html/rfc7301#page-3) 협상 실패로 인해 서버가 요청을 거부한 이슈였습니다.
그동안 저는 프로토콜 협상에 대해 깊이 생각해보지 않았습니다. 단순히 클라이언트와 서버 간에 커넥션만 잘 맺어지고 통신만 된다면 끝이라고 여겼던 안일한 생각 때문에 이번 문제를 겪게 된 것이 큽니다.

### ALPN이란?

ALPN은 TLS 확장 개념으로, 클라이언트와 서버가 TLS 핸드셰이크 과정에서 프로토콜을 협상하는 단계입니다.
- 클라이언트: **“안녕? 내가 지원하는 프로토콜은 HTTP/1.1, HTTP/2야!”**
- 서버: **“그래 안녕? 그럼 HTTP/2로 통신하자!”**

이처럼 클라이언트와 서버가 자동으로 프로토콜을 협상해, 하나의 포트에서도 동적으로 프로토콜을 선택해 통신할 수 있게 해줍니다.

![ALPN](/assets/images/ncp-grpc-issue/alpn.png)

설명을 보다싶이 우리는 ALB는 클라이언트(안드로이드 SDK)와 ALPN 협상에는 성공했지만, ALB 에서 Target 전달하는 과정에서 Target이 HTTP/1.0과 1.1만 지원하다 보니 서버 입장에서는 **“뭐야, HTTP/2를 지원하지 않잖아? 협상 거부!”** 라는 응답을 하게 된 것입니다.
> 정확히는 서버에서 요청거부이기 보다, 맞지않는 프로토콜이라 에러가 발생하며 서버에서는 해당 에러를 “ALPN negotiation failed” 혹은 “protocol error”처럼 표현되는 경우가 있습니다.

## 해결 방법

고심 끝에 세 가지 방법을 정리했습니다.

1. ALB(HTTPS) → Target(HTTPS) → Nginx → App  
2. ALB(HTTPS) → Target(HTTP) → Armeria  
3. ALB(HTTPS) → Target(HTTP) → Envoy Proxy → App  

### 1번: Nginx를 통한 TLS 처리

Target에 Nginx를 두어 TLS 인증을 수행하는 방식입니다.  
ALB와 Nginx 양쪽에서 TLS 검증을 진행하여 gRPC 서버로 HTTP/2 통신이 도달할 수 있도록 합니다.

단점은 동일한 인증서를 클라우드와 서버에 각각 등록해야 한다는 점입니다. 관리 포인트가 늘어나고, 인증서 교체 시 Nginx를 재시작해야 합니다. 큰 중단은 아닐 수 있으나 무중단 서비스를 지향하는 환경에서는 바람직하지 않습니다.

### 2번: Armeria를 통한 gRPC 변환

Nginx 대신 **Armeria 서버**를 도입하여 HTTP/1.0·1.1 기반의 gRPC 요청을 수신하고, 이를 서비스로 전달하는 프록시 역할을 수행합니다.

![Line Blog](/assets/images/ncp-grpc-issue/line-blog.png)  
> 출처: [Armeria로 Reactive Streams와 놀자! - 2](https://engineering.linecorp.com/ko/blog/reactive-streams-with-armeria-2)

gRPC는 스트리밍을 지원하기 위해 멀티플렉싱이 필수적이며, 이 때문에 공식적으로는 HTTP/2만 지원합니다.  
그렇다면 Armeria는 어떻게 HTTP/1.1 환경에서도 gRPC를 처리할 수 있을까요? 자세한 내용은 아래 글을 참고하세요. (저는 아직 완전히 이해하지 못했습니다 😅)

👉 [Armeria는 어떻게 gRPC를 HTTP/1.1에서 사용할까?](https://easywritten.com/post/how-does-armeria-use-grpc-over-http-1/)

단, 이 방법은 Armeria 도입을 위해 **Spring Boot MVC 제거, 컨트롤러 코드 수정** 등 많은 변경이 필요합니다. 즉, 통신 문제를 해결하려다 오히려 더 큰 코드 변경 부담이 생길 수 있습니다.

### 3번: Envoy Proxy 활용

**Envoy Proxy**를 활용해 프로토콜을 변환하여 애플리케이션으로 전달하는 방법입니다.

![envoy proxy](/assets/images/ncp-grpc-issue/envoy-proxy.png)
> [Envoy Proxy](https://www.envoyproxy.io/)

Envoy Proxy는 L7(애플리케이션 계층)에서 동작하는 오픈소스 프록시로, 다양한 프로토콜을 이해하고 고급 기능 및 프로토콜 변환을 지원합니다.  

이 방식을 선택하면 **기존 코드 수정 없이도 문제를 해결**할 수 있고, 추후 gRPC 서비스를 추가할 때도 확장성 측면에서 유리합니다.  

실행 방법도 간단합니다.  
- `envoy.yaml`에 리스너와 클러스터(서버) 정의  
- 다운스트림/업스트림 프로토콜 지정  
- `docker-compose`에서 볼륨으로 등록  

```yaml
services:
  envoy:
    image: envoyproxy/envoy:v1.31.0
    container_name: envoy
    command: ["-c", "/etc/envoy/envoy.yaml", "--log-level", "info"]
    ports:
      - "9090:9090"   # 다운스트림(gRPC-Web 등) 수신
      - "9901:9901"   # Envoy Admin
    volumes:
      - ~/docker/envoy-proxy/envoy.yaml:/etc/envoy/envoy.yaml
    healthcheck:
      test: ["CMD", "curl", "-fsS", "http://127.0.0.1:9901/server_info"]
      interval: 10s
      timeout: 3s
      retries: 5
    restart: unless-stopped
    networks:
      - envoynet
networks:
  envoynet:
    driver: bridge
```
> docker-compose.yaml

이렇게 하면 Envoy Proxy를 앞단에 두고 앱 서비스를 운영할 수 있습니다.

## ALPN 과 NPN

ALPN이 등장하기 전, 구글이 개발한 **NPN(Next Protocol Negotiation)** 을 통해서도 프로토콜 협상이 가능했습니다.  
두 방식의 차이는 여러 가지가 있지만, 대표적으로는 다음과 같습니다.
- **ALPN**: 클라이언트가 지원 가능한 프로토콜 목록을 서버에 전달하고, 서버가 그중 하나를 선택  
- **NPN**: 서버가 지원하는 프로토콜을 클라이언트에 사후적으로 전달  

| 구분 | NPN (Next Protocol Negotiation) | ALPN (Application-Layer Protocol Negotiation) |
|------|---------------------------------|-----------------------------------------------|
| 협상 시점 | 핸드셰이크 이후, 서버가 결과만 알림 | 핸드셰이크 중(ServerHello) 클라·서버가 합의 |
| 주도권 | 서버가 일방적으로 선택 | 클라이언트가 목록 제시, 서버가 선택 |
| 클라이언트 입장 | 선택된 프로토콜을 **나중에야 알 수 있음** | **핸드셰이크 완료 전 미리 알 수 있음** |
| 표준화 | 비표준(구글 제안, 폐기) | IETF RFC 7301 (표준) |
| 활용 | SPDY, 초기 HTTP/2 테스트 | HTTP/2, HTTP/3, gRPC 등 현행 표준 |

![netty grpc](/assets/images/ncp-grpc-issue/netty-doc.png)
> [Netty](https://netty.io/wiki/requirements-for-4.x.html)

Netty는 ALPN을 지원하지 않는 환경에서, 호환성을 위해 NPN을 이용해 프로토콜 협상을 지원할 수 있도록 하고 있습니다.

## 결론

gRPC 통신 과정에서 발생한 ALPN 실패를 계기로 ALPN 동작 방식과 Envoy Proxy 오픈소스를 새롭게 이해할 수 있었습니다.  
아직 Envoy Proxy를 깊이 있게 알고 있다고 말할 수는 없지만, 이번 경험을 통해 해당 프록시로 문제를 해결하며 의미 있는 학습과 경험을 얻을 수 있었습니다.