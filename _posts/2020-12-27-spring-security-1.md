---
layout: post
title: Spring Security를 사용해 보자.
categories: [Spring Security]
---

### Spring Security 란?

Spring Security는 Spring 기반의 **인증과 권한 그리고 인가**을 담당하는 스프링 프레임워크중 하나이다. Spring Security를 사용함으로써 보안 관련하여 체계적으로 로직을 제공해 주기에 개발자로서는 보안 관련 로직을 일일이 작성하지 않아도 되는 편리함이 있다. (잘 작성된 로직이다 보니 초보 개발자로서는 더 유용하게 사용할 수 있다.)  
Spring Security는 Filter 흐름 기반으로 인증, 인가 처리를 한다. Filter는 클라이언트 요청이 들어오면 요청 전 후 처리를 도와준다. 이 점만 보면 Interceptor와 차이가 없다 생각하지만 Filter와 Interceptor는 실행 위치가 다르다는 점이 있다. Filter는 Dispatcher Servlert이 요청 받기 전에 클라이언트 요청을 받아서 처리와, Dispatcher Servlert의 최종 처리가 끝난 후 처리를 하며 Interceptor는 Controller 들어가기 전후 처리를 한다. 또한 Filter는 Web Application(Tomcat)에 등록하고 Interceptor는 Spring Context에 등록한다. 이 처럼 실행 시점이 다르다는 점과 등록하는 곳이 다른점이 있다.
전후 처리를 도와주는 Filter와 Interceptor 그리고 AOP 처리 순서는 Filter -> Interceptor -> AOP -> Interceptor -> Filter 순으로 처리 된다. 전체적인 Flow를 그림으로 보면 좀 더 이해하는데 도움이 될거 같다.

<img src="/assets/images/spring-security/spring-security-1/spring-flow.png" alt="spring-flow">

### Spring Security 시작

Spring Security를 시작하기 위해선 의존성 추가를 해야 한다.

```java
  implementation 'org.springframework.boot:spring-boot-starter-security'
```

해당 의존성을 추가하고 서버를 기동하면 Spring Security 초기화 및 기본 보안 설정이 적용된다.즉 별도의 설정이나 구현을 하지 않아도 기본적인 웹 보안 기능이 현재 웹 사이트에 적용 된다. 기본 설정으로 보안이 적용된 만큼 모든 요청은 인증이 있어야 접근이 가능하다.  
Spring Security에 처음 적용하면 일어나는 일들을 순서대로 나열해 보겠다.

1. 모든 요청은 인증이 되어야 접근이 가능하다.
2. 인증 방식은 Form Login 방식과 httpBasic login 방식을 제공한다.
3. 기본 로그인 페이지 제공한다.
4. 기본 계정 한 개를 제공 한다.

서버를 기동하게 되면 기본 로그인 페이지 제공와 아이디를 제공 받는다. 아이디는 spring application을 기동할때 확인 할 수 있다.

기본 WebSecurityConfigurerAdapter 설정은 다음 포스트에 설명하도록 하겠다.

### 참조

- [[SpringBoot] Spring Security란? - 망나니개발자](https://mangkyu.tistory.com/76)
- [스프링 시큐리티 - Spring Boot 기반으로 개발하는 Spring Security - 정수원](https://www.inflearn.com/course/%EC%BD%94%EC%96%B4-%EC%8A%A4%ED%94%84%EB%A7%81-%EC%8B%9C%ED%81%90%EB%A6%AC%ED%8B%B0/dashboard)
