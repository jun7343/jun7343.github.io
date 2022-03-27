---
layout: post
title: Process Synchronization(Cuncurrency Control)
categories: [OS, Process]
excerpt: 프로세스 병행 수행시 데이터의 동기화 문제를 알아보고 해결하기 위한 여러가지 방안을 알아본다.
---

## 데이터 접근

![process synchronization18](/assets/images/os/process-synchronization/process-synchronization18.png)

컴퓨터 시스템에서 데이터 연산은 저장 공간과 실행 공간이 다음과 같은 흐름으로 동작하면서 이루어진다.

- 저장 공간에 연산할 데이터가 존재
- 저장 공간으로 부터 연산할 데이터를 실행 공간으로 이동
- 실행 공간에서 연산
- 연산 결과를 저장 공간으로 이동하여 반영

위에서 얘기하는 저장 공간은 메모리, 프로세스 주소 공간, 디스크가 있으며 실행 공간은 CPU, 프로세스, 컴퓨터 내부가 있다.

## 프로세스 동기화 문제

공유되는 데이터에 대한 동시 접근은 데이터의 불일치 문제를 야기할 수 있다. 우리는 데이터 일관성을 유지하기 위해 협력 프로세스에 순서를 정해 주는 매커니즘이 필요로 하다. 만약 데이터 일관성에 대해 고려하지 않고 프로그램을 작성하게 되면 우리는 **Race Condition** 문제를 접하게 될 것이다.

## Race Condition

Race Condition은 여러 프로세스가 공유하는 데이터 중 하나의 데이터에 동시에 접근하여 연산을 수행할 경우 프로세스들은 Race Condition(경쟁 상태)가 발생한다. 이때 우리는 데이터 일관성 문제를 고려하지 않고 작성하게 된다면 해당 데이터는 마지막에 수행한 프로세스 연산에 따라 데이터가 달라질 것이다.  
Race Condition은 운영체제에서 다음과 같은 상황에서 보통 발생할 수 있다.

- 커널 수행 중 Interrupt 발생시
- 프로세스가 System Call 요청하여 커널 모드로 수행 중 Context Switch가 일어난 경우
- 멀티 프로세서 환경에서 공유 메모리 내의 데이터 접근시

### 커널 수행 중 Interrupt 발생 시

![process synchronization19](/assets/images/os/process-synchronization/process-synchronization19.png)

우리는 정수형 변수에서 증감 연산을 할때 `count++` 또는 `count--` 이렇게 `++`, `--`을 통해 한줄 코드 작성으로 증감 연산을 수행할 수 가 있다. 하지만 커널은 해당 명령어를 수행하기 위해서는 3가지 연산을 거쳐야 한다.

- 메모리 부터 변수 읽기 (Data Load)
- CPU 연산(증감 연산)
- 메모리에 변수값 저장(Data Store)

만약 증감 연산 수행 중 CPU 연산이 수행되기 전 즉 메모리부터 변수 값이 읽고나서 Interrupt가 발생했을 때를 가정해보자. 또 우연치 않게 Interrupt handler의 명령 수행은 같은 데이터의 증감 연산 수행 내용이였고 해당 Interrupt handler는 데이터 감소, Interrupt가 발생하기 이전 커널의 수행 내용은 데이터 증가라고 해보자. interrupt handler는 변수 데이터를 감소하였기에 값이 반영되었을거라 생각하지만 결과는 1이 증가한 결과를 볼 수 있다.
처음에 커널 수행할 때 데이터를 load하였기에 해당 데이터의 초기값이 가지고 있을것이다. 그리고 연산을 수행하려 할 때 interrupt가 발생하였고 interrupt handler는 데이터 감소를 수행 완료하여 데이터에 반영하였지만 이미 초기값을 그대로 가지고 있는 커널은 초기값에서 데이터 증가를 하기에 interrupt handler의 결과값은 무시된체 초기값에서 1이 증가되었다.  
우리는 위와 같은 케이스를 방지하기 위해 증감 연산이 수행하기 위해서는 데이터를 읽고 저장할때 interrupt 발생 enable, disable를 두어 증감 연산이 완전히 수행된 후 interrupt가 발생할 수 있게 하여 데이터 일관성을 유지할 수 있다.

### 커널 내에서 실행 중인 프로세스를 선점하는 경우

![process synchronization20](/assets/images/os/process-synchronization/process-synchronization20.png)

위 예시는 프로세스 A가 공유 메모리에 존재하는 count 변수의 값을 증가시키기 위해 System Call을 통해 커널 모드에서 작업을 진행하려 한다. 프로세스 A가 count 변수를 로드하여 증가하는 연산을 수행하기 전에 CPU 점유 할당시간이 만료되어 Context Switch가 발생하게된 경우다.  
이후 프로세스 B가 CPU를 점유하여 프로세스 A와 똑같은 변수값을 증가 시키기위해 System Call을 했고 연산 완료후 변수값 반영 후 CPU를 반환했다고 하자. 그리고 프로세스 A가 다시 CPU를 점유하여 수행하지 못한 변수 연산을 수행 하게 되면 우리는 counter 변수값이 2가 증가했을거라 예상 하지만 결과는 1만 증가했다. 이 문제는 **"커널 수행 중 Interrupt 발생 시"**와 같은 문제라 이해하면 될것 같다.  
역시 우리는 이러한 문제를 방지하기 위해 커널 모드에서 수행중일 때는 CPU 할당 시간이 만료되어도 선점하지 않고 사용자 모드로 돌아갔을 때 선점하도록 한다.

### 멀티 프로세서 공유 메모리 데이터 접근

![process synchronization21](/assets/images/os/process-synchronization/process-synchronization21.png)

여러 CPU에서 하나의 CPU가 저장 공간으로 부터 연산할 데이터를 가져 오기 전 해당 데이터에 lock을 걸어 자신을 제외한 다른 CPU가 해당 데이터에 접근하는 것을 사전에 막는다. 이후 연산이 완료되면 데이터를 저장 공간에 반영 후 해당 데이터의 lock을 해제하여 다른 CPU들이 해당 데이터에 접근 할 수 있도록 한다. 이와 같이 데이터에 lock을 거는 방법외에도 다른 방법을 통해 데이터의 일관성을 보장하는 방법이 있다.

- 커널 내부에 있는 각 공유 데이터에 접근할때 마다 해당 데이터에 lock 거는 방법
- 한 번에 하나의 CPU만 접근할 수 있도록 하는 방법
  - 커널 전처에 lock을 걸기에 비효율적.

## Critical Section(임계 영역) 문제

![process synchronization22](/assets/images/os/process-synchronization/process-synchronization22.png)

- N개의 프로세스가 공유 데이터를 동시 사용하기 위해서는 각 프로세스 code segment에는 공유 데이터에 접근하는 코드인 Critical Section(임계 영역)이 존재한다.
- 하나의 프로세스가 임계 영역에 있을 때 다른 프로세스는 임계 영역에 접근할 수 없어야 한다.

## Critical Section(임계 영역) 문제를 해결하기 위한 충족 조건

![process synchronization01](/assets/images/os/process-synchronization/process-synchronization01.png)

## Critical Section(임계 영역) 문제 해결 알고리즘

### Algorithm 1

```java
do {
    while (turn != 0)
    critical section
    turn = 1;
    remainder section
} while (1);
```

**Synchronization variable**

- 변수(turn)를 통해서 임계 영역에 들어갈 프로세스를 결정한다.
- mutual exclusion은 만족하나 progress는 만족하지 못한다.
  - 해당 알고리즘은 반드시 한번씩 교대로 임계 영역에 진입해야하기 때문이다.
  - 프로세스0은 임계 영역에 5번 접근해야하고 프로세스1은 1번만 접근해야 한다 가정했을 때 프로세스 1이 한번 임계 영역 접근하면 끝나기에 프로세스0이 임계 영역 접근하여 수행 완료후 프로세스1에게 turn을 넘겨줘도 프로세스1은 수행 완료하여 수행을 더 이상 안하기에 프로세스0은 다시 임계 영역에 접근하지 못하게 된다.(과잉 양보)

### Algorithm 2

```java
do {
    flag[i] = true;
    while(flag[j]);
    critical section
    flag[i] = false;
    remainder section
} while(1);
```

**Synchronization variable**

- flag 변수를 통해 임계 영역 접근 할 수 있는지 여부를 확인한다.
- 상대방이 임계 영역에서 나왔을 시 접근할 수 있다.
- mutual exclusion은 만족하나 progress는 만족하지 못한다.
  - 프로세스 A가 임계 영역에 접근하기 위해 flag를 true로 변환 했는데 Context Switch가 발생하게 되었고 CPU를 점유한 프로세스 B 역시 임계 영역에 접근하기 위해 flag를 true로 바꾸게 된다면 프로세스 A, B 둘다 임계 영역에 접근할 수 없는 상황이 발생한다.

### Algorithm 3

```java
do {
    flag[i]= true;
    turm = j;
    while(flag[j] && turn == j);
    critical section
    flag[i] = false;
    remainder section
} while(1);
```

**Combined synchronization variables of algorithm 1 and algorithm 2**

- 어느 프로세스도 임계 영역에 들어가있지 않고 들어갈 준비도 하지 않는 다면 내가 임계 영역에 들어간다.
- Mutual Exclusion, Progress, Bounded Waiting 세가지 조건을 만족한다.
- 임계 영역 접근을 위해 while 문을 통해 대기해야 하는 busy wait이 발생한다.(Algorithm 1, Arlgorithm 2 마찬가지)
  - while 문을 수행하기 위해 CPU를 할당 받아 비효율적으로 CPU 할당 시간을 낭비하는 일이 초래한다.

## 동기화 하드웨어(Synchronization Hardware)

![process synchronization02](/assets/images/os/process-synchronization/process-synchronization02.png)

임계 영역 문제가 발생하는 근본적인 원인은 데이터 읽기, 쓰기가 하나의 명령어로 수행할 수 없기에 발생하는 문제이다. 따라서 데이터 읽기, 쓰기를 하나의 명령어(Atomic)로 수행할 수 있다면 임계 영역 문제를 간단히 해결할 수 있다.

## Semaphore

![process synchronization03](/assets/images/os/process-synchronization/process-synchronization03.png)

- Integer variable S를 사용함.
- atomic 연산에 의해서만 접근 가능
- P(S): 공유 데이터를 획득하는 과정(lock)으로 S가 양수여야 한다.
- V(S): 공유 데이터를 사용하고 반납하는 과정(unlock)

## Semaphore busy waiting 문제

![process synchronization04](/assets/images/os/process-synchronization/process-synchronization04.png)

위에 임계 영역 문제를 해결하기 위한 세가지 알고리즘에서 공통적으로 나타나는 busy waiting 문제가 있었다. busy waiting은 임계 영역에 접근하기 위해 while문을 통해 대기해야 하기에 이를 수행하기 위해서 불필요한 CPU 할당 시간을 줘여하는 비효율적인 문제가 발생한다. 이를 해결하기 위해 block & wake-up 기법이 존재한다.

- P(S): 세마포어 변수 S를 1 줄이고 그 변수값이 음수이면 Wait Queue로 보낸 후 Block 상태로 만든다. (음수이면 임계 영역에 접근할 수 있는 프로세스가 다 찼기 때문)
- V(S): 세마포어 변수 S를 1 늘리고 그 변수값이 0보다 작거나 같으면 Wait Queue에서 대기하는 프로세스가 있다는 얘기이므로 Wait Queue에서 프로세스를 꺼내어 Ready Queue로 이동시킨다.

## Busy Waiting vs Black/Wakeup

![process synchronization05](/assets/images/os/process-synchronization/process-synchronization05.png)

## Semaphore 종류

- Counting Semaphore
  - 도메인이 0 이상인 임의의 값
  - 여러 개의 공유 자원을 mutual exclusion
  - 주로 resource counting에 사용됨
- Binary Semaphore
  - 0 또는 1값만 가질 수 있음
  - 한 개의 공유 자원을 mutual exclusion
  - mutex와 유사

## Deadlock & Starvation

![process synchronization06](/assets/images/os/process-synchronization/process-synchronization06.png)

### Deadlock

P<small>0</small> 프로세스가 CPU를 점유하여 P(S) 연산을 수행 후 S 자원을 얻었고 이후 Context Switch가 발생하여 P<small>1</small>에게 CPU가 넘어가 P<small>1</small>은 P(Q) 연산을 수행하여 Q 자원을 얻었다. 이후 다시 Context Switch가 발생하여 다시 P<small>0</small> CPU 제어권이 넘어가 P<small>0</small> 프로세스는 다음 수행할 P(Q)를 수행을 통해 Q 자원을 얻으려 하지만 Q 자원은 P<small>1</small>이 점유하고 있기에 연산을 수행할 수 없고 P<small>1</small> 프로세스 역시 P(S) 연산을 통해 S 자원을 얻으려 하지만 S 자원은 P<small>0</small>이 갖고있기에 점유할 수 없다.  
이렇게 서로 자원은 내놓지 않은체 서로의 자원을 요청하게 된다면 Deadlock 발생하게 된다. 우리는 Deadlock을 해결하기 위해 자원 획득 순서를 주어 해결할 수 있다. S를 획득해야만 Q를 획득 할 수 있게 순서를 정해준다면 프로세스 P<small>0</small>가 S를 획득 했을때 프로세스 P<small>1</small>가 Q를 획득할 일이 없게 된다.

### Starvation

프로세스가 자원을 얻지 못하고 무한히 기다리는 현상.

## Bounded Buffer Problem(Producer-Consumer Problem)

![process synchronization07](/assets/images/os/process-synchronization/process-synchronization07.png)

- 공유 데이터
  - buffer 자체 및 buffer 조작 변수
- Producer(생산자)
  - Empty buffer가 있는지 확인한다.(없으면 기다림)
  - 공유 데이터에 lock을 건다.
  - Empty buffer에 데이터를 입력하고 buffer를 조작한다.
  - lock을 푼다.
  - Full buffer가 하나 증가한다.
- Consumer(소비자)

  - Full buffer가 있는지 확인한다.(없으면 기다림)
  - 공유 데이터에 lock을 건다.
  - Full buffer에 데이터를 꺼내고 buffer를 조작한다.
  - lock을 푼다.
  - Empty buffer가 하나 증가한다.

### Producer-Consumer example code

![process synchronization08](/assets/images/os/process-synchronization/process-synchronization08.png)

- Producer
  - P 연산을 통해 Empty buffer가 있는지 확인한다.
  - Empty buffer가 존재하면 mutex를 0으로 만들고 임계 영역에 진입한다.
  - buffer에 데이터를 입력한다.
  - V 연산을 통해 mutex 값을 1로 만든다.
  - V 연산을 통해 Full buffer를 1 증가하고 임계 영역에서 나온다.
- Consumer
  - P 연산을 통해 Full buffer가 있는지 확인한다.
  - Full buffer가 존재하면 mutex를 0으로 만들고 임계 영역에 진입한다.
  - buffer에서 데이터를 가져온다.
  - V 연산을 통해 mutex값을 1로 만든다.
  - V 연산을 통해 Empty buffer를 1 증가하고 임계 영역에서 나온다.

### 발생 가능한 동기화 문제

- 공유 버퍼이기에 여러 생성자가 동시에 한 버퍼에 데이터를 쓰거나 수정할 수 있다.
- 소비자 역시 여러 소비자가 동시에 한 버퍼 데이터를 읽을 수 있다.

### 동기화 변수

- Binary Semaphore(공유 데이터 mutual exclusion)
- Counting Semaphore(남은 Full/Empty 버퍼 수 표기)

## Readers-Writers Problem(독자-저자 문제)

![process synchronization09](/assets/images/os/process-synchronization/process-synchronization09.png)

### Readers-Writers Problem Example Code

![process synchronization10](/assets/images/os/process-synchronization/process-synchronization10.png)

**세마포어 설계**

- mutual exclusion을 보장해야 하므로 각각의 세마포어 값은 1로 지정.
- 다수의 Reader들이 readCount에 접근시 데이터 불일치 문제가 발생할 수 있기에 mutex 정의.
- db는 Reader, Writer가 공통 데이터베이스에서 mutual exclusion 보장을 위해 1로 지정.

**Reader Process**

- P 연산을 통해 readCount 변수 mutual exclusion
- 만약 Read하는 프로세스가 없고, Read하는 프로세스가 오직 나 하나라면 공통 데이터베이스에 lock을 건다.(Read는 공통 데이터베이스에 lock 걸려있어도 Reader Process 여럿이 동시 접근 가능.)
- V 연산을 통해 임계 영역에서 나온다.
- DB를 원하는 만큼 읽는다.
- P 연산을 통해 readCount 변수 mutual exclusion
- 마지막으로 Read하는 프로세스가 나 하나라면 공통 데이터베이스 lock 해제
- V 연산을 통해 임계 염역에서 나온다.

**Writer Process**

- P 연산을 통해 공통 데이터베이스에 lock 걸렸는지 확인.
- 만약 lock 걸려 있지 않다면 공통 데이터베이스에 lock을 걸고 임계 영역에 진입.
- 쓰기 작업이 완료되면 V 연산을 통해 공통 데이터베이스 lock 해제하고 임계 영역에서 나온다.

Writer Process가 쓰기 작업을 하려면 Read 작업을 진행하는 Reader Process가 없어야 한다. 하지만 만약 Reader Process가 무한히 Read를 하게 된다면 Writer Process는 임계 영역에 진입 못하고 Starvation에 빠질 수 있다.

## Dining-Philosophers Problem(식사하는 철학자 문제)

![process synchronization11](/assets/images/os/process-synchronization/process-synchronization11.png)

철학자 다섯명이서 원형 식탁에 둘러 앉아 생각에 빠지다가 배고플때는 밥을 먹는다. 그들의 양쪽에는 젓가락이 한 짝씩 놓여있으며 밥을 먹기 위해서는 다음과 같은 과정을 따른다.

1. 왼쪽 젓가락을 집어드려 한다. 만약 다른 철학자가 해당 젓가락을 사용하고 있다면 그가 다 사용할때까지 생각하며 기다린다.
2. 왼쪽 젓가락을 집었으면 오른쪽 젓가락을 집으려 한다. 똑같이 해당 젓가락을 다른 철학자가 사용하고 있다면 생각하며 기다린다.
3. 두 젓가락을 모두 들었다면 일정 시간동안 식사를 한다.
4. 식사를 마쳤으면 오른쪽 젓가락을 내려놓고 왼쪽 젓가락을 내려 놓는다.
5. 다시 생각하다가 배고프면 1번으로 돌아간다.

해당 문제에서는 모든 철학자가 배고파서 왼쪽 젓가락을 집고 오른쪽 젓가락을 집으려 할때 집을 수 없으므로 무한히 생각학게 되는 Deadlock이 발생하게 된다. 이를 해결하기 위해서는 다음과 같은 방안이 있다.

- 4명의 철학자만 앉을 수 있게 한다.
- 젓가락을 두 개 동시에 집을 수 있을때만 집을 수 있게 한다.
- 비대칭
  - 짝수(홀수) 철학자는 왼쪽(오른쪽) 젓가락부터 집도록 방향을 지정한다.

## Monitor

### Semaphore 문제점

![process synchronization13](/assets/images/os/process-synchronization/process-synchronization13.png)

### Monitor

![process synchronization14](/assets/images/os/process-synchronization/process-synchronization14.png)

모니터는 프로그래밍 언어 차원에서 동기화 문제를 해결할 수 있는 고수준의 동기화 도구라고 할 수 있다. 모니터는 프로세스가 공유 데이터에 접근하기 위해 모니터 내부의 프로시저를 통해서만 공유 데이터에 접근할 수 있도록 설계한다.  
예를 들어 공유 데이터 존재시 아무나 접근할 수 있는것이 아니라 모니터내의 프로시저를 정의하고 프로시저를 통해서만 공유 데이터에 접근할 수 있도록 제어한다. 특히 모니터내의 프로시저는 동시에 여러개가 실행하지 않는 권한을 준다. 즉 모니터내에서는 한번에 하나의 프로세스만이 접근할 수 있다는 얘기로서 프로그래머 입장에서는 임의적으로 lock을 걸지 않아도 되는 장점이 있다.  
모니터 안에 active 한 프로세스가 없을 경우 외부 entry queue에서 기다리고 있는 프로세스가 접근하여 코드를 실행할 수 있다.

### Condition Variable

![process synchronization15](/assets/images/os/process-synchronization/process-synchronization15.png)

세마포어에서 자원의 개수를 세는 로직이 필요하듯이 모니터에서도 자원 개수를 세는 로직이 필요로 하다. 다만 세마포어와 달리 lock을 프로그래머가 걸 필요없다는 점에서 세마포어와 모니터는 큰 차이점이 있다.  
모니터는 조건 변수를 사용하고, 해당 변수는 wait, signal을 연산에 의해서만 접근 할 수 있도록 제한한다. 이 때 조건 변수는 값을 카운트 하거나 프로세스를 잠들게 하거나 줄을 서게하는 역할을 수행한다.

#### Condtion Variable Example Code

![process synchronization16](/assets/images/os/process-synchronization/process-synchronization16.png)

## 참조

- [운영체제 - 반효경 교수님](http://www.kocw.net/home/search/kemView.do?kemId=1046323)
- [Process Synchronization 1](https://steady-coding.tistory.com/537)
- [Process Synchronization 2](https://steady-coding.tistory.com/538)
- [Process Synchronization 3 & 4](https://steady-coding.tistory.com/541)
