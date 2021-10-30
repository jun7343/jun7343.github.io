---
layout: post
title: Spring과 Node js의 차이
categories: [Spring]
---

### Spring과 Node js

학교에서 학습하고 이전 회사에서 사용했던 프레임워크는 Spring 이였다. Java로 프로그래밍 할 수 있는 나에겐 친숙한? 프레임워크라고 할 수 있다. 그런데 요새는 스타트업에서나 몇몇의 다른 기업들은 Node js를 사용하여 백엔드를 설계한다. 단지 전자정부프레임워크가 Spring이라고 해서 Spring 하는 곳으로 취업하면 되겠지 하면 오산일 수도 있다. Node js를 통해 백엔드 개발하는 사람을 뽑는곳 비율이 만만치 않다. Node js를 배워야할지 Spring을 배워야할지 막 웹 개발한 사람에게는 고민이 생기지 않을까 싶다. 일단 각 프레임워크의 특징과 장점을 알아보도록 하자.    


### Spring의 특징

> - POJO(Plain Old Java Object) 기반의 구성
- DI(Dependency Injection, 의존성 주입)을 통한 객체 간의 관계 구성
- AOP(Aspect Oriented Programming) 지원
- 편리한 MVC 구조
- WAS에 독립적인 개발환경    
<small>참고 - [스프링 프레임워크(Spring Framework)에 대한 간단한 소개 | Freestrokes Tistory Blog](https://freestrokes.tistory.com/79)</small>

특징에 대해 부가적인 설명을 작성하면 좋지만 참고 사이트에 더 자세히 잘 설명되어 있기에 해당 Blog를 통해 학습하도록 하자.    


### Node js 특징

> - 빠른 프로퍼티 접근(Fast Property Access)
- 동적인 기계어 코드 생성(Dynamic Machine code Generation) 
- 효율적인 가비지 콜렉션(Efficient Garbage Collection)
- 논블로킹 비동기 실행
- 싱글스레드!
- 서버도 구현 가능!   
<small>참고 - [NodeJS의 소개와 특징 | Seungwoohong Tistory Blog](https://seungwoohong.tistory.com/7)</small>


### 결론

Node js는 javascript를 이용하여 프론트엔드 개발자 진입 장벽이 낮으며, 기존 Spring보다 생산성이 뛰어날수? 있다. 싱글 스레드, 비동기 IO 처리에 기반한 빠른 속도를 가진다.    
Spring은 정형화된 패턴이 많고 다양한 레퍼런스가 많아 안정적이다. 크기와 부하의 측면에서도 경량이다.    
각 프레임워크의 더 자세한 장단점은 [Spring, Node.js 비교 | bellaah Blog](https://hees-dev.tistory.com/61) 에서 확인 할 수 있다.    
내 생각으로 스타트업에서 Node js를 주로 이용하는 것은 생산성 측면이지 않을까 싶다. 빠르게 서비스를 출시해야하는 스타트업 입장에서는 프론트 개발과 백엔드 개발을 Javscript 언어로 개발하여 빠르게 출시할 수 있다는 장점이 있는것 같다.    
아직 Spring에 대해서 많이 학습해야하지만 Node js 역시 학습해야 되는 부분인것 같다.    
이 두가지 프레임워크 말고 해외에서는 어떤 백엔드 프레임워크를 주로 사용하는지 궁금할 수 도 있다. 아래에 2020년 올해까지 주로 사용하는 백엔드 프레임워크 랭킹 영상을 첨부하도록 하겠다.    

<div class="video-container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/9z_2wmJOom4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
