---
layout: post
title: Kernel Thread & User Thread
categories: [OS, Thread, Multi Threading, Kernel Thread, User Thread]
excerpt: Core의 Thread는 무엇인가? 를 통해 Thread를 학습하면서 Core Thread, Kernel Thread, User Thread 세가지의 Thread를 알게 되었으며 각 Thread의 위치와 역할을 어느정도 알게되었다. 다만 풀리지 않은 궁금증들이 많이 있어 이번 post에서는 학습한 내용 기록과 궁금했던 내용들을 기록해서 풀어나가는 식으로 진행해보려 한다.
---

# 서론

[Core의 Thread는 무엇인가?](/os/thread/multi%20threading/hyper%20threading/2022/01/02/core-thread/)를 통해 Thread를 학습하면서 Core Thread, Kernel Thread, User Thread 세가지의 Thread를 알게 되었으며 각 Thread의 위치와 역할을 어느정도 알게되었다. 다만 풀리지 않은 궁금증들이 많이 있어 이번 post에서는 학습한 내용 기록과 궁금했던 내용들을 기록해서 풀어나가는 식으로 진행해보려 한다.

# Kernel Thread

![all thread flow](/assets/images/os/kt-ut/all-thread-flow.png)

Hardware Thread에서 Process 까지 flow를 보여주는 이미지이다. 해당 이미지를 통해 전체적인 흐름 파악이 되었을거라 생각한다. 이전 포스트를 통해 Hardware Thread(Core Thread)를 학습했다면 이번엔 Kernel Thread를 알아보려 한다. 먼저 Kernel이 무엇인지 알아보자.

![what is kernel](/assets/images/os/kt-ut/what-is-kernel.png)

> 컴퓨터 과학에서 커널(kernel)은 컴퓨터 운영 체제의 핵심이 되는 컴퓨터 프로그램으로, 시스템의 모든 것을 완전히 통제한다. 운영 체제의 다른 부분 및 응용 프로그램 수행에 필요한 여러 가지 서비스를 제공한다. 핵심(核心)이라고도 한다.

<blockquote>
  커널은 운영 체제의 핵심 부분이므로, 커널의 역할 역시 운영 체제의 핵심 역할이라 할 수 있다.
  <ul>
    <li>
      보안
      <ul>
        <li>커널은 컴퓨터 하드웨어와 프로세스의 보안을 책임진다.</li>
      </ul>
    </li>
    <li>
      자원 관리
      <ul>
        <li>한정된 시스템 자원을 효율적으로 관리하여 프로그램의 실행을 원활하게 한다. 특히 프로세스에 처리기를 할당하는 것을 스케줄링이라 한다.</li>
      </ul>
    </li>
    <li>
      추상화
      <ul>
        <li>
          같은 종류의 부품에 대해 다양한 하드웨어를 설계할 수 있기 때문에 하드웨어에 직접 접근하는 것은 문제를 매우 복잡하게 만들 수 있다. 일반적으로 커널은 운영 체제의 복잡한 내부를 감추고 깔끔하고 일관성 있는 인터페이스를 하드웨어에 제공하기 위해 몇 가지 하드웨어 추상화(같은 종류의 장비에 대한 공통 명령어의 집합)들로 구현된다. 이 하드웨어 추상화는 프로그래머가 여러 장비에서 작동하는 프로그램을 개발하는 것을 돕는다. 하드웨어 추상화 계층(HAL)은 제조사의 장비 규격에 대한 특정한 명령어를 제공하는 소프트웨어 드라이버에 의지한다.
        </li>
      </ul>
    </li>
  </ul>
</blockquote>

자세한 내용은 [커널(컴퓨팅)](<https://ko.wikipedia.org/wiki/커널_(컴퓨팅)>)를 통해서 확인할 수 있으며 추가로 Kernel에 좀 더 깊게 이해하고 싶다면 [What is Kernel?](https://www.javatpoint.com/what-is-kernel)에서 본문을 읽으면 도움이 될 것 같다.

# User Thread

# 참조

- [Multi Thread Programming](https://lazymankook.tistory.com/32)
- [Operating System - Multi-Threading](https://www.tutorialspoint.com/operating_system/os_multi_threading.htm)
- [CPU와 스레드](https://www.codelatte.io/courses/java_programming_basic/0XT4OIX9IW9U294O)
- [Multithreading Models](https://docs.oracle.com/cd/E19620-01/805-4031/6j3qv1oej/index.html)
- [커널](<https://ko.wikipedia.org/wiki/%EC%BB%A4%EB%84%90_(%EC%BB%B4%ED%93%A8%ED%8C%85)>)
