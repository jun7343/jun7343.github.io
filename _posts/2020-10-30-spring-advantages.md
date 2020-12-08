---
layout: post
title: "Spring의 장점"
comments: true
categories: 
  - back-end
tags: 
  - spring
  - back-end
---

### 포스트 내용

Spring Framework를 사용하면서 Spring에 대한 이해를 자세히 하고 넘어가는가?? 단지 학원에서 또는 학창시절 Spring Framework를 사용하여 과제나 프로젝트를 수행했기 때문에 익숙해서 사용하는가?? 물론 똑똑하고 개발에 대한 흥미가 많은 사람들은 해당 Framework를 왜 사용하는지 알 것이다. 나는 Spring을 통해 개입 웹 프로젝트를 진행하다 문득 Spring에 대한 장점이 무엇이 있을까 생각이 들었다. 솔직히 Spring말고 백엔드 Framework가 많은데 왜 Spring을 사용해야하는지 설명하라 하면 구체적으로 설명할 자신이 없을것 같지만 이번 학습을 통해 보완을 해보도록 하겠다.    
<br><br>

### Spring 학습 링크

- [스프링 프레임워크(Spring Framework)에 대한 간단한 소개 - FREESTROKES DEVLOG](https://freestrokes.tistory.com/79)
- [Spring 입문 - Spring의 장점(Spring을 쓰는 이유) - 최느님 프알못](https://csw7432.tistory.com/entry/Spring-입문-Spring의-장점)
- [Spring framework의 장점. - SCV Group](https://scvgroup.tistory.com/61)    
<br><br>

### Spring 학습 요약


- **IOC(Inversion of Control) 제어 역행**
  - >스프링은 그 자체가 구조를 설계할 수 있도록 만들어져 있어서 개발자가 부품을 만들어 조립하는 형태의 개발이 가능합니다. 이렇게 조립된 코드의 최종 호출은 개발자가 결정하는 것이 아니라 프레임워크 내부에서 결정된 대로 이루어지게 되는데 이것을 '제어의 역행(IoC, Inversion of Control)' 이라고 합니다.    
  <small>참조: 스프링 프레임워크(Spring Framework)에 대한 간단한 소개</small>
- **DI(Dependency Injection) 의존성 주입**
  - >'의존성 주입(DI, Dependency Injection)' 은 제어의 역행이 일어나는 것을 전제 조건으로 하여 스프링 내부의 객체(스프링에서는 bean이라는 용어로 표현)들 간의 관계를 관리할 때 사용됩니다. 의존성 주입은 말 그대로 특정 객체에 필요한 객체를 외부에서 결정하여 연결시키는 것을 의미합니다. 좀 더 쉽게 설명하면 자바에서 인터페이스를 사용하여 의존적인 관계를 처리하는 것에 비유할 수 있습니다.    
  <small>참조: 스프링 프레임워크(Spring Framework)에 대한 간단한 소개</small>
  - 의존성 주입 방법은 생성자 주입, Set 메서드로 주입, Spring의 Annotation(Inject, autowired)으로 주입    
  (Spring에서 autowired annotation을 통한 의존성 주입은 추천하지 않는다. 생성자를 통한 의존성 주입을 추천한다.) <small>[생성자 주입을 사용해야 하는 이유, 필드인젝션이 좋지 않은 이유 - YABOONG](https://yaboong.github.io/spring/2019/08/29/why-field-injection-is-bad/)</small>
- **POJO 기반의 구성**
  - POJO(Plain Old Java Object) 의 구성만으로 가능하도록 제작하며 특정 규약과 환경에 종속되지 않고 단일 책임 원칙을 지키는 클래스.
- **AOP지원**
  - >AOP(Aspect oriented programming): 기존의 절차지향이나 객체지향에서 기능의 모듈화는    
  프로그램을 복잡하게만들며, 수정 및 유지보수가 힘들게 함.    
  공통된 부분등, 특정 부분들(핵심 관심사) 로 나누어 관리함으로써,프로그램을 모듈화 하는 방식.    
  장점    
  1) 개발자는 비즈니스 로직에만 집중해서 코드를 개발할 수 있음    
  2) 각 프로젝트마다 다른 관심사를 적용할때 코드의 수정을 최소화 시킬수 있음    
  3) 원하는 관심사의 유지보수가 수월한 코드를 구성 할 수 있음.    
  <small>참조: Spring framework의 장점.</small>
- **트랜잭션의 지원**
  - >데이터베이스를 연동하여 사용할 때 반드시 신경써야하는 부분은 하나의 업무가 여러 작업으로 이루어지는 경우에 대한 트랜잭션 처리입니다
  트랜잭션 처리는 상황에 따라 코드를 이용하여 적용해줘야 하는데 이는 개발자에게 상당히 피곤한 작업입니다.    
  스프링에서는 이러한 트랜잭션 처리는 애노테이션이나 XML로 설정할 수 있도록 지원해줍니다.    
  이로 인하여 개발자가 매번 상황에 따라 코드를 작성해줘야 하는 번거로움이 줄어들게 되었습니다.    
  <small>참조: 스프링 프레임워크(Spring Framework)에 대한 간단한 소개</small>

