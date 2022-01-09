---
layout: post
title: Core의 Thread는 무엇인가?
categories: [OS, Thread, Multi Threading, Hyper Threading]
excerpt: 내 친구중에 기계과를 나왔지만 개발에 흥미가 생겨 개발 공부하는 친구가 있다. 친구는 학습 도중 문득 나에게 "Thread는 물리적으로 한정적인거 아냐? 어떻게 계속 생성해서 쓸 수가 있는거야? 내가 학습한 바로는 ..." 이러한 질문을 내게 했다.
---

# 서론

내 친구중에 기계과를 나왔지만 개발에 흥미가 생겨 개발 공부하는 친구가 있다. 친구는 학습 도중 문득 나에게 **"Thread는 물리적으로 한정적인거 아냐? 어떻게 계속 생성해서 쓸 수가 있는거야? 내가 학습한 바로는 ..."** 이러한 질문을 내게 했다.  
물론 이전에 Core의 Thread 그리고 Prcoess의 Thread 두가지 Thread가 존재하는 것은 알고 있었다. 다만, OS 학습의 깊이가 얕아 제대로 설명을 해주지 못했다. 나는 친구의 질문을 계기로 Core의 Thread와 Process의 Thread 는 어떤 차이가 어떤 역할을 하는지가 알고싶었으며, 많이 부족한 나의 OS 지식이 공부해야겠다 생각되기에 인터넷 강의를 통해 학습하였다.

- [인프런의 운영체제 공룡책 강의](https://www.inflearn.com/course/%EC%9A%B4%EC%98%81%EC%B2%B4%EC%A0%9C-%EA%B3%B5%EB%A3%A1%EC%B1%85-%EC%A0%84%EA%B3%B5%EA%B0%95%EC%9D%98/dashboard)
- [운영체제 - 이화여자대학교 반효경 교수님](http://www.kocw.net/home/search/kemView.do?kemId=1046323)

이번 포스트에서는 Core의 Thread를 설명할 예정이다.

# Core의 Thread??

아래는 필자가 얘기하는 Core의 Thread 사진이다. 아마도 친구가 말하는 Thread가 Core의 Thread인거 같다.

<table>
    <tr>
        <th>Non Hyper Threading</th>
        <th>Intel`s Hyper Threading</th>
    </tr>
    <tr>
        <td><img src="/assets/images/os/process-thread-01/intel_single-thread.jpeg" alt="single thread" /></td>
        <td><img src="/assets/images/os/process-thread-01/intel_hyper-thread.jpeg" alt="hyper thread" /></td>
    </tr>
    <tr>
        <th colspan="2">Hyper Thread and Non Hyper Thread</th>
    </tr>
    <tr>
        <td colspan="2"><img src="/assets/images/os/process-thread-01/hyper-thread and non hyper-thread.gif" alt="hyper thread and non hyper thread" /></td>
    </tr>
</table>

먼저 설명하기 전 인텔의 하이퍼 스레딩 소개글을 읽고 오자. [하이퍼 스레딩이란 무엇입니까?](https://www.intel.co.kr/content/www/kr/ko/gaming/resources/hyper-threading.html)  
소개글을 보면, 물리적으로는 one core가 존재하지만 Intel의 Hyper Threading 기술을 통해 논리적으로 two core가 존재하게끔 만들어 준다고 나와있다. 실제로는 물리적으로는 core가 하나뿐이지만 Intel`s Hyper Threading 기술을 통해 OS는 두개의 코어로 인식이 된다는 얘기다.  
이때 눈치챌 수 있는것으로 Hyper Threading은 물리적으로 Multi Thread가 존재하는게 아니였으며 기존 물리적 Single Thread에서 추가 되는 가상의 Thread 기술이라는걸 알 수 있다. 잠시 AMD 얘기를 해보자면 AMD도 Multi Thread라 소개하며 내놓은 Bulldozer 라는 제품이 있다. "어? 뭐지? Multi Threading이 어떻게 가능하지? Hyper Thread는 Intel 고유의 기술아냐?" 라고 나는 생각했었다. 알고보니 AMD Bulldozer의 Multi Thread는 CMT(Clustering Multi Threading)이며 Intel은 SMT(Simultaneous Multi Threading)이다.  
이 둘의 차이가 무엇인지 알아보자.

<table>
    <thead>
        <th>CMT And SMT</th>
    </thead>
    <tbody>
        <td><img src="/assets/images/os/process-thread-01/bulldozer-and-intel.jpeg" alt="bulldozer and intel" /></td>
    </tbody>
</table>

위 이미지를 보면 AMD Bulldorzer의 Multi Threading이야 말로 물리적으로 Core을 나눠 Thread가 한개 더 존재하는 것이다. AMD Bulldozer를 소개하는 [Why is the hyper threading absent in AMD processors?](https://www.quora.com/Why-is-the-hyper-threading-absent-in-AMD-processors)의 내용중

> Now CPUs housed more execution units, fetched more instructions per clock, and executed more per cycle, thanks to the complex control circuits. And just when things got too predictable AMD came up with CMT in Bulldozer family. Instead of two threads being fed into one execution cluster, this architecture had two separate clusters of integer ALUs for the two threads in each core. This means lesser execution resources per thread and overall less complexity of control circuit(s). While this DID save in chip complexity and costs, it also reduced the maximum performance for single threaded applications.

> AMD가 불도저 제품군의 CMT를 고안해 냈습니다. 두 개의 스레드가 하나의 실행 클러스터에 공급되는 대신, 이 아키텍처는 각 코어의 두 개의 스레드에 대해 두 개의 정수 ALU 클러스터를 가집니다. 이는 스레드 당 실행 자원이 줄어들고 제어 회로의 복잡성이 전반적으로 감소함을 의미합니다. 이를 통해 칩 복잡성과 비용이 절감되었지만 단일 스레드 애플리케이션의 최대 성능도 감소했습니다.

이라고 설명되어 있다. 즉 AMD Bulldozer는 칩 복잡성과 비용은 절감했지만 단일 스레드 애플리케이션의 최대 성능이 낮아지면서 몇몇 애플리케이션에서는 퍼포먼스를 제대로 낼 수가 없었으며 AMD의 1코어 2스레드 광고를 보고 Intel의 Hyper Thread와 같은 성능을 낼 수 있을거라 생각했던 고객들은 AMD에 뒤통수를 맞았다?라는 얘기가 있었다. 이에 관련하여 자세한 내용을 보고싶다면 [AMD 불도저 마이크로아키텍처](https://namu.wiki/w/AMD%20%EB%B6%88%EB%8F%84%EC%A0%80%20%EB%A7%88%EC%9D%B4%ED%81%AC%EB%A1%9C%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98)를 읽어보자.

다시 Intel의 Hyper Threading 얘기로 돌아가 Intel이 주장하는 Hyper Threading를 보자면,

> 인텔® 하이퍼 스레딩 기술은 코어가 이전의 다른 작업이 완료되기를 기다리는 유휴 시간을 이용하여 CPU 처리량을 개선합니다(서버 응용프로그램에서 최대 30%까지).

이라 주장하며 이에 덧붙여 Intel은 Hyper Threading 기술을 위해 CPU에서 자주 사용되는 부분 즉 레지스터(called architectural states)를 복제하게되어 CPU 크기가 기존 CPU 크기보다 5% 증가하였다고 한다.  
하지만 Intel이 주장하는 30%의 성능 효율은 Intel Socket의 수마다 상이할 수 있다. Single Socket일때 최대 30% 효율 상승이며, Dual Socket일 경우 최대 15%까지 효율을 올릴 수 있다. 그 이상의 Socket의 경우 Test를 걸쳐 효율성을 알아봐야 한다.

30% 효율 상승은 어떻게 가능할 수 있었던걸까?? 먼저 Clock Cycle을 알아야한다. Clock Cycle이란 CPU가 명령어를 실행하기 위해 데이터를 가져오고 명령어를 해석하고 실행하는 세 단계를 말하며 명령어를 실행하는 주기라 해서 "명령 주기"리고도 한다. 보통 CPU 성능을 보면 3.2GHz 등을 볼 수 있는데 3.2GHz면 1초당 32억번의 Cycle이 실행된다 생각하면 된다.  
이러한 명령어 사이클이 돌때 Thread는 유휴 상태에 빠질때가 있는데(보통 데이터를 memory로 부터 가져올때) 이때 Hyper Threading 기술을 통해 논리적으로 생성된 Thread가 유휴 상태에 빠진 코어의 CPU 리소스를 넘겨 받아 명령어를 수행함으로써 효율을 높일 수가 있다.

<table>
    <thead>
        <th>Intel`s Hyper Threading Idle Example</th>
    </thead>
    <tbody>
        <td><img src="/assets/images/os/process-thread-01/hyper-threading-idle.gif" alt="hyper threading idle example" /></td>
    </tbody>
</table>

위의 이미지를 보면 빠른 이해가 될거라 생각된다. 유휴 상태에 빠진 Unit에 두번째 Thread가 명령어를 수행함으로써 같은 시간내에 수행할 수 있는 명령어 수를 높여 효율을 상승시킬 수 있었다.

Hyper Threading를 사용하면 무조건 좋겠네? 이건 또 아니다. Hyper Threading를 사용함으로써 유휴 상태에 빠진 코어의 CPU 리소스를 받을 수 있게 대기해야함으로 전력 소모가 지속적으로 많이 일어나기도 한다. 애플리케이션들이 Hyper Threading 사용하지 않는데 해당 옵션을 켜놓기만 한다면 전력 낭비일 것이다.  
그렇다면 언제 Hyper Threading을 쓰는게 적절치 않을까?라는 생각이 들면 아래 예제와 같은 Test를 해보고 결과를 따져 해당 옵션을 끄거나 키는것을 추천한다. Yes가 많을 수록 Hyper Threading을 효율적으로 사용하지 못한다 보면 될 것 같다.

- the server has more than two sockets
- the server has a large number of physical cores
- the application is single-threaded or does not handle multiple threads efficiently
- the application is already designed to maximize the use of the execution units in each core
- the application has a very high rate of memory I/O.

## 결론

Hyper Threading에 대해서 이해하는데 정말 오래걸렸다. 헷갈리는 개념들이 많고 설명을 각기 다르게 하고 잘못된 설명을 덧붙여 하는 글들도 많기 때문이다. 물론 내 글도 잘못된 정보가 있을 수 있다. 이와 같이 모든 blog post들은 자기가 학습한 내용을 바탕으로 각자 이해한 내용을 기입하기에 어떤 내용은 사실을 적시하겠지만 어떤거는 또 이상하게 각색하여 사실 또는 주제에 동떨어지는 내용도 있을수 있다. 그래서 항상 blog post는 참고용으로 읽고 정확한 내용을 이해하고 싶으면 정식 문서나 전공 서적을 읽어야하는것 같다.  
내용이 길지만 아직까지는 Hyper Thread에 대해서만 설명했으며 친구가 말했던 Process의 Thread 역시 제대로 학습하여 기록하려 한다. 하지만 Process의 Thread를 학습하기 전에 Process를 학습하여 기록해서 공유할 예정이다.

# 참조

- [Intel’s Hyper-Threading Technology](https://techgenix.com/intels-hyper-threading-technology/)
- [What are Threads in Computer Processor or CPU?](https://www.geeksforgeeks.org/what-are-threads-in-computer-processor-or-cpu/)
- [하이퍼 스레딩이란 무엇입니까?](https://www.intel.co.kr/content/www/kr/ko/gaming/resources/hyper-threading.html)
- [Multi Thread Programming](https://lazymankook.tistory.com/32)
- [Operating System - Multi-Threading](https://www.tutorialspoint.com/operating_system/os_multi_threading.htm)
- [Anatomy of a CPU](https://www.techspot.com/article/2000-anatomy-cpu/)
- [Will Hyper-Threading Improve Processing Performance?](https://medium.com/@ITsolutions/will-hyper-threading-improve-processing-performance-15cba11add74)
- [Why is the hyper threading absent in AMD processors?](https://www.quora.com/Why-is-the-hyper-threading-absent-in-AMD-processors)
