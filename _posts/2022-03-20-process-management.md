---
layout: post
title: Process Management
categories: [OS, Process]
excerpt: 프로세스 생성 및 관리 방법과 프로세스 종류 및 프로세스간 통신 방법을 알아본다.
---

## Process

![process management01](/assets/images/os/process-management/process-management01.png)

프로세스는 부모 프로세스가 자식 프로세스를 생성하며, 자식은 또 자식 프로세스를 생성할 수 있다. 즉 처음 부모 프로세스를 루트로 트리 구조가 형성된다.
기본적으로 프로세스는 실행을 위해 자원(CPU, Memory)가 필요한데, 이 자원을 부모 자원을 자식이 같이 공유하는 방법과 자원을 얻기위해 부모와 자식이 경쟁하는 방식이 존재하게 된다. 대표적으로

- 부모와 자식이 모든 자원을 공유하는 모델
- 일부를 공유하는 모델
- 전혀 공유하지 않는 모델

세가지가 존재하며, 부모 프로세스와 자식 프로세스의 수행 모델은

- 부모와 자식이 공존하며 수행되는 모델
- 자식이 종료(terminate)될 때까지 부모가 기다리는(wait) 모델

이때 부모와 자식이 공존하며 수행되는 모델은 공존하며 수행되는 만큼 부모와 자식간 CPU 자원을 얻기위해 경쟁하는 관계가 된다. 즉 Context Switch가 빈번하게 발생할 수 있다.

## Process System Call

![process management04](/assets/images/os/process-management/process-management04.png)

- fork()
  - 자식 프로세스를 생성하는 명령어.
- exec()
  - 독자적인 프로그램을 수행할 수 있는 명령어.
- wait()
  - 자식 프로세스 명령 수행이 완료될때까지 부모 프로세스는 봉쇄(wait)상태에 머무르는 명령어.
- exit()
  - 프로세스가 자발적으로 종료되는 명령어.

### fork()

![process management05](/assets/images/os/process-management/process-management05.png)

fork() 명령어가 수행될때 자식 프로세스가 생성되어 fork() 이후의 명령어를 수행하게 된다.  
어떻게 자식 프로세스는 fork()이후의 명령어를 수행하는가? 궁금할 수 있다. 어떤 사람은 fork()를 하게 되면 코드 처음부터 수행하게 되어 자식 프로세스가 무한히 생성되는거 아닌가요? 라고하는 사람도 있었다고 한다.  
자식 프로세스는 전혀 코드 처음부터 명령어를 수행하지 않으며, 이유로는 자식 프로세스를 생성할때 부모 프로세스를 복제하기 때문이다. 부모 프로세스를 복제하게 되면 부모 프로세스의 주소 공간, PCB, 레지스터 상태, 커널 스택등 모든 문맥을 복사하기에 부모 프로세스의 문맥중 PC가 fork() 이후의 명령어를 가르키기에 이를 복제한 자식프로세스는 fork() 이후의 명령어를 실행하게 된다.  
또 fork()를 통해 식별 가능한 pid(process id)를 얻을 수 있다. pid를 통해 부모 프로세스, 자식 프로세스를 구분할 수 있으며 만약 pid가 없다면 자식 프로세스가 "내가 부모 프로세스야!"라는 불상사가 생길 수 있기에 pid를 통해 구분을 지어 수행할 수 있는 코드를 달리 할 수 있다. 부모의 pid는 양수이며 자식의 pid는 0이다.

### exec()

![process management02](/assets/images/os/process-management/process-management10.png)

exec()는 호출되는 순간 기존 프로세스 주소에 호출한 프로그램 주소를 덮어씌어 호출한 프로그램을 처음부터 수행할 수 있게끔 하는 명령어다. 위 그림과 같이 부모 프로세스가 자식 프로세스 생성 후 자식 프로세스가 exec() 호출하게 된다면, 자식 프로세스는 부모 프로세스와 달리 독자적인 프로그램을 수행할 수 있게 된다.
무조건 자식 프로세스를 생성해야만 exec()를 호출할 수 있는건 아니다. 부모 프로세스가 명령어 수행중 exec()를 호출 할 수 있으며, 만약 호출하게 된다면 exec() 호출 코드 이후의 기존 코드는 수행하지 않는다.

### wait()

![process management02](/assets/images/os/process-management/process-management11.png)

wait()은 부모 프로세스가 자식 프로세스가 종료되기를 기다리고 봉쇄(wait)상태로 변경할때 사용한다. 즉 부모 프로세스가 자식 프로세스를 fork()를 통해 생성하고 wait() 호출하게 된다면 부모 프로세스는 자식 프로세스가 종료될때까지 기다리며 자식 프로세스가 종료된다면 부모 프로세스는 준비 상태로 변경한다.

### exit()

![process management02](/assets/images/os/process-management/process-management12.png)

- exit()는 프로세스를 자발적으로 종료할때 사용하는 명령어다.
- 마지막 statement를 수행 후 exit() 시스템 콜을 수행한다.
- 굳이 명시적으로 exit()를 기입하지 않아도 main 함수가 리턴되는 위치에 컴파일러가 기입해 준다.

### abort()

![process management03](/assets/images/os/process-management/process-management03.png)

위에 설명한 Process System Call에서 나오지 않았던 명령어로써 프로세스가 비자발적으로 종료될때 사용되는 명령어다. 프로세스가 비자발적으로 종료되는 상황을 간략하게 보자면

- 자식 프로세스가 할당받은 자원을 낭비하거나 한계치를 넘어설때.
- 자식에게 할당한 task가 더 이상 필요하지 않을때.
- 부모가 종료할때. (부모 프로세스가 종료되면 부모 프로세스를 종료시키기전 자식 프로세스를 먼저 종료시킨다.)
- 사용자가 프로세스를 kill, break 명령어를 기입한 경우.

## 프로세스간 협력

![process management07](/assets/images/os/process-management/process-management07.png)

- 독립적 프로세스(Independent Process)
  - 프로세스는 각자 주소를 가지고 수행되므로 하나의 프로세스는 다른 프로세스 수행에 영향을 미치지 못한다.
- 협력 프로세스(Cooperating Process)
  - 프로세스 협력 메커니즘을 통해 하나의 프로세스가 다른 프로세스 수행에 영향을 미칠 수 있다.
- 프로세스 간 협력 메커니즘(IPC: Interprocess Communication)
  - IPC는 프로세스들 간 통신과 동기화를 이루기 위한 메커니즘이다.
  - 프로세스 간 메세지 전달 방식은 메세지 전달(커널을 통한 전달) 방식과 공유 메모리(일부 메모리 공간을 공유)방식이 있다.

## 메세지 전달 방식(Message Passing)

![process management08](/assets/images/os/process-management/process-management08.png)

- 프로세스 간에 공유 데이터를 일체 사용하지 않고 메세지를 주고 받으며 통신하는 방식이다.
- 메세지 통신을 하는 시스템은 커널에 의해 send와 receive 연산을 제공 받는다.

![process management09](/assets/images/os/process-management/process-management09.png)
