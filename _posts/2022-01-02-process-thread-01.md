---
layout: post
title: 프로세스의 스레드와 코어의 스레드 무슨 차이지?
categories: [OS]
excerpt:
---

# 서론

내 친구중에 기계과를 나왔지만 개발에 흥미가 생겨 개발 공부하는 친구가 있다. 친구는 학습 도중 문득 나에게 **"Thread는 물리적으로 한정적인거 아냐? 어떻게 계속 생성해서 쓸 수가 있는거야? 내가 학습한 바로는 ..."** 이러한 질문을 내게 했다.  
물론 이전에 Core의 Thread 그리고 Prcoess의 Thread 두가지 Thread가 존재하는 것은 알고 있었다. 다만, OS 학습의 깊이가 얕아 제대로 설명을 해주지 못했다. 나는 친구의 질문을 계기로 Core의 Thread와 Process의 Thread 는 어떤 차이가 어떤 역할을 하는지가 알고싶었으며, 많이 부족한 나의 OS 지식이 공부해야겠다 생각되기에 [인프런의 운영체제 공룡책 강의](https://www.inflearn.com/course/%EC%9A%B4%EC%98%81%EC%B2%B4%EC%A0%9C-%EA%B3%B5%EB%A3%A1%EC%B1%85-%EC%A0%84%EA%B3%B5%EA%B0%95%EC%9D%98/dashboard)를 듣고 다시 운영체제 지식을 쌓게 되는 계기가 되었다.

# Core의 Thread??

필자는 Core와 Thread 두가지를 동시에 얘기하는데 읽는 사람으로써는 왜 두가지를 동시에 얘기하는지 의구심을 들것같다. 아래는 필자가 얘기하는 Core의 Thread 사진이다.
아래 사진에서 말하는 Thread가 친구가 말하는 물리적으로 한정적일 수 밖에 없는 Thread를 얘기하는것 같다.

<table>
    <thead>
        <th>Ordinary Thread</th>
        <th>Intel`s Hyper Threading</th>
    </thead>
    <tbody>
        <td><img src="/assets/images/os/process-thread-01/intel_single-thread.jpeg" alt="single thread" /></td>
        <td><img src="/assets/images/os/process-thread-01/intel_hyper-thread.jpeg" alt="hyper thread" /></td>
    </tbody>
</table>

먼저 설명하기 전 인텔의 하이퍼 스레딩 소개글을 읽고 오자. [Intel - 하이퍼 스레딩이란 무엇입니까?](https://www.intel.co.kr/content/www/kr/ko/gaming/resources/hyper-threading.html)  
소개글을 보면, 물리적으로는 one core가 존재하지만 Intel의 Hyper Threading 기술을 통해 논리적으로 two core가 존재하게끔 만들어 준다고 나와있다. 즉 실제로는 물리적으로는 core가 하나뿐이지만 Intel`s Hyper Threading 기술을 통해 OS 에서 확인했을때는 두개의 코어가 인식되게끔 만들어 준다는 얘기다. 인텔의 주장에 따르면

> 인텔® 하이퍼 스레딩 기술은 코어가 이전의 다른 작업이 완료되기를 기다리는 유휴 시간을 이용하여 CPU 처리량을 개선합니다(서버 응용프로그램에서 최대 30%까지).

덧붙여 Intel은 Hyper Threading 기술을 위해 CPU에서 자주 사용되는 부분을 복제하여 CPU 크기가 5%로 증가하였지만, 다른 Hyper Threading 기술이 접목되지 않는 CPU Chip 보다는 최대 30% 빠르다고 주장한다.  
그렇다면 Hyper Threading 기술은 어떻게 실행하는지 확인해 보자.

<table>
    <thead>
        <th>Hyper Threading Example</th>
    </thead>
    <tbody>
        <td><img src="/assets/images/os/process-thread-01/hyper-threading-example.jpeg" alt="hyper threading example" /></td>
    </tbody>
</table>

# 참조

- [Intel’s Hyper-Threading Technology](https://techgenix.com/intels-hyper-threading-technology/)
- [What are Threads in Computer Processor or CPU?](https://www.geeksforgeeks.org/what-are-threads-in-computer-processor-or-cpu/)
- [하이퍼 스레딩이란 무엇입니까?](https://www.intel.co.kr/content/www/kr/ko/gaming/resources/hyper-threading.html)
- [Multi Thread Programming](https://lazymankook.tistory.com/32)
