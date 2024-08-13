---
layout: post
title: NCP(naver cloud platform)에서 gRPC protocol 연동 이슈
categories: [NCP, gRPC]
excerpt: NCP에서 loadbalancer를 통해 gRPC 연동하는 방법입니다.
---

NCP에서 loadbalancer를 통해 gRPC 연동하는 방법입니다.

연동하는 과정중에 netty 기반의 client에서는 요청 성공되지만 okHttp(android)기반 client에서는 요청 실패한 이슈를 공유드립니다.

## 1.Load Balancer 선택

![load balancer](/assets/images/ncp-grpc-issue/1.png)
NCP에는 4가지 loadbalancer가 있는데 ALB의 경우 리스너가 HTTP2를 지원하지만 target으로 전달되는 프로토콜은 HTTP2가 지원되지 않습니다.(target HTTP 1.x 만 지원)

즉 ALB에서 HTTP2를 요청 받아도 HTTP2로 요청 응답을 할 수 없기에 HTTP2 기반의 gRPC 프로토콜은 처리할 수 없습니다. (2024년 8월 6일 기준 지원 안됨)

![load balancer](/assets/images/ncp-grpc-issue/2.png)
![load balancer](/assets/images/ncp-grpc-issue/3.png)
HTTP2 기반 gRPC 요청처리를 위해서는 Network LoadBalancer 혹은 Network Proxy LoadBalancer를 이용해야 합니다.

HTTP2은 TLS 사용이 필수이기에 Network Proxy Loadbalancer를 사용하여 TLS 적용하면 됩니다.

## 2. okHTTP gRPC client 요청 이슈

Network LoadBalancer Proxy를 통해 로드밸런서를 구성할시 okHTTP(android client) 기반 client는 ALPN 이슈가 발생하면서 요청이 거부됩니다. (ALPN 관련 직접적 에러 또는 이용할 수 없다는 에러 메세지가 발생합니다.)

HTTP2의 경우 TLS 핸드셰이크 과정중 어떠한 protocol로 통신할지 client 와 server간 협상하는 단계가 있는데 이것을 ALPN이라하며 이를 통해 HTTP2 통신을 진행할 수 있습니다.

NCP의 Network Proxy LoadBalancer에는 ALPN 확장 정책이 지원되지 않으며 ALPN 정책을 사용하기 위해서는 target app 단에서 TLS + ALPN 과정을 처리해야 합니다.

![load balancer](/assets/images/ncp-grpc-issue/4.png)

즉 Target App에서 nginx 서버를 통해 TLS 처리 또는 App에서 직접적으로 TLS + ALPN 처리를 해야 okHTTP 기반 grpc client의 요청을 받아 처리할 수 있습니다.

Netty기반 gRPC Client의 경우 서버가 ALPN을 지원하지 않는 경우 netty 자체내에  NPN이라는 다른 협상을 통해 HTTP2 프로토콜을 이용할 수 있게하기 때문에 굳이 target app에서 TLS처리하지 않고 NPL(Network Proxy Loadbalancer)에서 TLS 요청을 받으면 될 것 같습니다.

![load balancer](/assets/images/ncp-grpc-issue/5.png)
https://netty.io/wiki/requirements-for-4.x.html