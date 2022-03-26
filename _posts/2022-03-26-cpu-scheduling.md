---
layout: post
title: CPU Scheduling
categories: [OS, CPU, Scheduling]
excerpt: CPU Scheduling 이해와 알고리즘 종류 그리고 Scheduling 성능 척도등을 알아본다.
---

## CPU & I/O Burst in Program Excution

![cpu scheduling01](/assets//images/os/cpu-scheduling/cpu-scheduling01.png)

모든 프로그램들은 실행을 하면서 위와 같은 일련의 path가 존재한다. 프로그램 path는 CPU를 사용하는 일과 I/O 요청에 대한 응답을 기다리는 일을 반복한다.

### CPU Burst

CPU Burst는 사용자 프로그램이 CPU 점유 상태에서 명령어를 빠르게 수행하는 단계를 얘기한다. 해당 단계에서 사용자 포로그램은 CPU에서 일어나는 명령(ex:Add)이나 메모리(ex:Store, Load)에 접근하는 일반 명령을 사용할 수 있다.

### I/O Burst

I/O Burst는 커널에 의해 입출력 작업을 진행하는 비교적 느린 단계이다. 해당 단계에서는 프로그램의 명령으로 직접 수행하는 것이 아닌 운영체제의 도움을 받아 작업을 대신 수행하는 단계이다.

![cpu scheduling02](/assets//images/os/cpu-scheduling/cpu-scheduling02.png)

### CPU bound process

I/O 개입이 적고 CPU 작업 수행이 주를 있는 프로세스 즉 연산 과정 위주의 프로세스를 얘기한다. I/O 개입이 적다보니 CPU burst가 길게 나타나는 것을 볼 수 있다.

### I/O bound process

I/O 요청이 빈번하게 발생하여 CPU burst가 짧게 일어나는 프로세스를 얘기한다. 보통 사용자로부터 interaction을 계속 받아가며 수행하는 대화형 프로세스이다.

## CPU Scheduler & Dispatcher

![cpu scheduling04](/assets//images/os/cpu-scheduling/cpu-scheduling04.png)

### CPU Scheduler

CPU Scheduler는 Ready 상태의 프로세스중에서 CPU 제어권을 넘겨줄 프로세스를 결정하는 운영체제의 코드를 얘기한다. CPU Scheduler 필요한 경우는 4가지 이다.

- Running -> Blocked(ex: I/O 요청하는 System Call 발생시)
- Running -> Ready(ex: Timer 하드웨어에 의해 설정된 시간이 만료되어 인터럽트 발생시)
- Blocked -> Ready(ex: I/O 수행을 완료하여 Ready 상태로 변경시)
- Terminated(ex: 프로세스가 일을 다 마치고 종료되어 CPU를 Ready 상태의 프로세스에게 넘겨줄때)

위 네가지 스케줄링 중 첫번째 네번째 스케줄링의 경우 **"CPU 제어권을 강제로 빼았지 않고 자진 반납"**하는 nonpreemtive(비선점)방식이며, 나머지 두번째와 세번째 스케줄링의 경우 **"CPU 제어권을 강제로 뺏는"** preemtive(선점) 방식이다.

### Dispatcher

CPU 제어권을 CPU Scheduler에 의해 선택된 프로세스에게 넘기며 이 과정을 Context Switch(문맥 교환)이라 하며, Dispatcher가 넘겨주는 역할을 수행한다.

## Scheduling Criteria(스케줄링 성능 척도)

![cpu scheduling05](/assets//images/os/cpu-scheduling/cpu-scheduling05.png)

Scheduling Criteria에서의 성능 척도는 크게 두가지로 나타낼 수 있는데 시스템 기준의 성능 척도와 프로세스 기준의 성능 척도로 나타낼 수 있다.

### 시스템 기준에서의 성능 척도

- CPU utilization
  - 전체 시간중 CPU가 놀지 않고 수행한 시간 비율
- Throughput
  - 주어진 시간 동안 Ready queue에서 대기하고 있는 프로세스 중 몇개를 끝 마쳤는지의 양.
  - 즉 CPU 점유 하기위해 대기하고 있는 프로세스 중 몇개 만큼 CPU을 사용하고 CPU burst를 끝마치고 Ready queue에서 떠났는지 측정.
  - 더 많은 프로세스가 CPU 작업을 끝마치기 위해서는 CPU burst가 짧은 프로세스에게 CPU 먼저 할당하는 것이 유리하다.

### 프로세스 기준에서의 성능 척도

- Turnaround time (소요 시간, 반환 시간)
  - 프로세스가 CPU를 요청한 시점부터 원하는 만큼 CPU를 다 쓰고 CPU burst가 다 끝날때까지 걸린 시간.
  - (Ready Queue에서 대기한 시간) + (실제로 CPU 사용한 시간)
- Waiting time
  - CPU burst 기간 중 프로세스가 Ready queue에서 CPU를 얻기 위해 대기한 시간의 합.
  - 시분할 시스템의 경우 한번의 CPU burst에서도 Ready queue에서 대기한 시간이 여러번 발생할 수 있으며, 이때 대기 시간은 CPU burst가 끝날때까지 Ready queue에서 대기한 시간의 합을 얘기한다.
- Response time
  - Ready queue에서 처음으로 CPU를 얻기까지 걸린 시간.
  - Response time은 대화형 시스템에서 적합한 성능 척도로서 사용자 입장에서 중요한 성능 척도라 할 수 있다.

## Scheduling Alorithms

### FCFS(Forst-Come Forst-Served)

![cpu scheduling07](/assets//images/os/cpu-scheduling/cpu-scheduling07.png)

- 먼저 도착한 순서대로 처리하는 방식(nonpreemtive)
- 만약 수행 시간이 긴 프로세스가 먼저 도착하게 된다면 도착 시간이 늦은 프로세스 중 수행 시간 짧은 프로세스는 앞서 도착한 프로세스가 수행이 다 끝날때까지 기다려야 하므로 효율적이지 않음. 이러한 케이스를 convoy effect라 부른다.

### SJF(Shortest Job First)

SJF는 CPU burst가 가장 짧은 프로세스에게 CPU를 할당하는 알고리즘이다. 평균 시간을 짧게 하는 최적 알고리즘이며 두가지 방식이 존재한다.

#### Preemtive

![cpu scheduling08](/assets//images/os/cpu-scheduling/cpu-scheduling08.png)

- SRTF(Shortest Remaining Time First)
- CPU를 점유하더라도 CPU burst가 더 짧은 프로세스가 들어오면 CPU를 빼앗김

#### Nonpreemtive

![cpu scheduling06](/assets//images/os/cpu-scheduling/cpu-scheduling06.png)

- 먼저 CPU를 점유하고 있으면 CPU burst가 짧은 프로세스가 들어와도 CPU를 빼앗기지 않으며 CPU burst를 완전히 수행한다.

SJF 알고리즘은 두가지 문제점이 존재한다.

- Starvation(기아): CPU burst가 짧은 프로세스로 인해 CPU burst가 긴 프로세스는 영원히 CPU를 점유 할 수 없는 현상.
- CPU burst 시간을 미리 알 수 없으며 과거 CPU 사용 시간을 통해 추정만 가능하다.

### Priority Scheduling

Priority Scheduling(우선순위 스케줄링)은 우선 순위가 가장 높은 프로세스에게 CPU를 할당하는 알고리즘이다. 일반적으로 우선 순위(priority number)가 낮은 값이 높은 우선 순위를 갖는다. 우선순위 스케줄링도 두가지 방식이 존재한다.

- preemtive
  - CPU를 점유하더라도 우선 순위가 더 높은 프로세스가 들어오면 CPU를 뺏긴다.
- nonpreemtive
  - CPU를 점유하게 되면 우선 순위가 더 높은 프로세스가 들어와도 CPU를 뺏기지 않으며 CPU burst를 끝까지 수행 완료한다.

SJF 알고리즘도 일종의 우선 순위 알고리즘이라 볼 수 있다.(우선 순위 = 예상되는 다음 CPU burst 시간) 우선 순위 알고리즘도 SJF와 마찬가지로 우선 순위가 낮은 프로세스는 영원히 CPU를 점유할 수 없는 Starvation(기아 현상) 문제점이 생길 수 있다.  
이러한 문제점 해결을 위해 우선 순위가 낮은 프로세스는 시간이 지날 수록 우선 순위를 단계적으로 높여 줌으로서 CPU를 점유할 수 있게 할 수 있다. 이러한 해결 방식을 Aging(노화)라고 한다.

### Round Robin

![cpu scheduling09](/assets//images/os/cpu-scheduling/cpu-scheduling09.png)

Round Robin은 각 프로세스 마다 Time Quantum을 가지게 되어 CPU를 점유하게 되며 설정된 time quantum이 만료 되면 해당 프로세스는 Ready Queue에서 대기하게 된다. Round Robin의 Time Quantum을 통해 짧은 응답 시간을 보장할 수 있다.  
CPU를 조금씩 줬다 빼았기를 반복하기에 최초로 CPU를 얻기 까지의 응답 시간이 짧다. Time Quantum의 시간은 짧거나 길수록 각각 성능이 다르다.

- Time Quantum이 길 경우
  - FCFS 알고리즘에 가까워 진다.
- Time Quantum이 짧을 경우
  - 빈번하게 CPU를 점유하는 프로세스가 변경되기에 Context Switch 오버 헤드가 크다.

Round Robin은 SJF에 비해 Turnaround time은 길지만(CPU burst가 짧은 프로세스도 time quantum에 의해 부분 수행이 된다면 길어질 수 밖에 없기 때문), CPU를 얻기 위한 응답 시간을 짧은걸 알 수 있다. 또한 다양한 시간이 소요되는 Job들이 여러개이면 효율적이지만 동일한 시간이 소요되는 프로세스들이 여러개라면 비효율적이다.

## Multi-Level Queue

![cpu scheduling12](/assets//images/os/cpu-scheduling/cpu-scheduling12.png)

Multi-Level Queue는 Ready Queue를 우선 순위에 따라 여러 개로 분할한다.

- foreground(전위 큐)
  - 전위 큐에는 빠른 응답이 필요로 하는 대화형 작업이 들어간다.
  - 전위 큐는 주로 Round Robin 알고리즘을 사용한다.
- background(후위 큐)
  - 후위 큐에는 주로 계산 작입이 위주인 작업이 들어간다.
  - 후위 큐는 주로 FCFS 알고리즘을 사용한다.

Multi-Level Queue에도 Scheduling이 필요로 하다.

- Fixed Priority Scheduling(고정 우선순위 방식)
  - 전위 큐에서 대기하는 프로세스들에게 우선적으로 CPU가 할당되며, 전위 큐가 비었을때만 후위 큐에 대기하는 프로세스들에게 CPU가 할당된다.
  - Starvation 가능성이 존재한다.
- Time slice(타임 슬라이스 방식)
  - 각 큐에 CPU time을 적절한 비율로 할당한다.(ex: 전위 큐 80%, 후위 큐 20%)

## Multi-Level Feedback Queue

![cpu scheduling14](/assets//images/os/cpu-scheduling/cpu-scheduling14.png)

Multi-Level Feeadback Queue는 프로세스가 여러개로 분할된 Ready Queue내에서 다른 Queue로 이동이 가능하다. Multi-Level Feedback Queue를 통해 Aging(노화)기법을 구현할 수 있다.(우선순위 낮은 큐에서 프로세스가 오래 기다렸다면 우선순위가 높은 queue로 승격 시키는 방식이다.)  
Multi-Level Feedback Queue를 정의하는 요소는 다음과 같다.

- 큐의 수
- 각 큐의 스케줄링 알고리즘
- 프로세스를 상위 큐로 승격 시키는 기준
- 프로세스를 하위 큐로 강등 시키는 기준
- 프로세스가 도착했을 때 어떤 Queue로 진입시킬지 정하는 기준.
  - 보통 처음 들어오는 프로세스는 우선 순위가 가장 높은 큐에 time quantum을 짧게하여 배치.
  - 만약 프로세스가 주어진 시간 내에 작업을 완료하지 못하였다면, time quantum을 더 할당하고 우선 순위가 한 단계 낮은 queue로 강등 시킨다.
  - 이 과정을 반복하면 최하위 queue에 배치되며 FCFS 알고리즘이 사용된다.

## Real-time Scheduling

정해진 시간내에 반드시 수행되야 하는 프로세스가 있을때, 즉 deadline이 존재하는 프로세스일때 사용하는 알고리즘이다.

- 경성 실시간 시스템(hard real-time system)
  - 정해진 시간 내에 반드시 수행 완료 될 수 있도록 스케줄링해야 한다.
- 연성 실시간 시스템(soft real-time system)
  - 일반 프로세스보다 높은 우선순위를 갖게한다.
  - deadline을 완전히 보장하지 못한다.

## Multi Processor Scheduling

CPU가 여러 개인 시스템에서 사용하는 알고리즘이며 프로세스들을 Ready Queue에 한 줄로 세워 CPU들이 알아서 다음 프로세스를 꺼내어 간다.  
일부 CPU에 작업이 몰리는 것을 방지하기 위해 로드 밸런싱 매커니즘을 사용한다.

- 대칭형 다중 처리
  - 각 CPU가 알아서 스케줄링을 결정
- 비대칭형 다중 처리
  - 하나의 CPU가 다른 CPU 스케줄링을 및 데이터 접근을 책임지며 나머지 CPU는 그에 따라 움직이는 방식이다.

## Thread Scheduling

- Local Scheduling
  - user Level의 Thread로써 해당 Thread의 존재는 운영체제가 알 수가 없다.
  - 운영체제가 알 수가 없기에 User Level Thread의 경우 프로세스가 어느 Thread에게 CPU를 줄 지 결정한다.
- Global Scheduling
  - Kernel Level Thread는 일반 프로세스처럼 커널의 단기 스케줄러가 어떤 Thread를 Schedule할지 결정한다.

## 참조

- [운영체제 - 반효경 교수님](http://www.kocw.net/home/search/kemView.do?kemId=1046323)
- [[운영체제/Operating System] CPU 스케줄링](https://sangminlog.tistory.com/entry/cpu-scheduling)
- [CPU Scheduling 1](https://steady-coding.tistory.com/530)
