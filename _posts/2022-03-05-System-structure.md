---
layout: post
title: 컴퓨터 시스템은 어떻게 동작할까??
categories: [OS, Program, System Structure]
excerpt: 컴퓨터 시스템 동작 구조를 보며 각 하드웨어의 역할을 알아본다.
---

# System Structure

![System Structure](/assets/images/os/system-structure/system-structure.png)

## CPU

CPU는 Memory에 올라와있는 프로그램의 연산을 처리하는 역할을 합니다. CPU에 존재하는 Register 종류 중 하나인 [PC](https://ko.wikipedia.org/wiki/%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8_%EC%B9%B4%EC%9A%B4%ED%84%B0)를 통해 PC가 가르키는 다음 명령어 주소를 통해 프로그램의 명령어를 처리하며, 명령어를 처리하기 이전 CPU는 [Interrupt](https://ko.wikipedia.org/wiki/%EC%9D%B8%ED%84%B0%EB%9F%BD%ED%8A%B8)가 들어왔는지 Interrupt line을 체크합니다. 만약 Interrupt가 들어왔다면, CPU는 운영체제에게 제어가 넘어가며 운영체제는 Interrupt 처리를 수행하게 됩니다.
Interrupt line별로 인터럽트 백터와 인터럽트 처리 루틴이 존재하게 되는데 인터럽트 백터의 경우 Interrupt line의 번호와 Interrupt를 처리해야할 주소를 쌍으로 가지고 있습니다.
인터럽트 처리 루틴 또는 인터럽트 핸들러는 CPU가 커널 함수를 통해 수행할 루틴을 얘기합니다.
인터럽트 종류에는 크게 두가지가 있는데, 하드웨어 인터럽트와 Trap이 존재합니다. 하드웨어 인터럽트는 말 그대로 하드웨어서 건 Interrupt를 얘기하며 Trap의 경우 소프트웨어에서 의도적으로 건 Interruopt를 얘기합니다. 대표적으로 Exception과 System Call이 존재합니다.

## Mode Bit

mode bit이란 CPU의 제어권이 어디에 있는가를 명시한 bit라 할 수 있습니다. 0과 1로 표시하며 CPU의 제어권을 넘겨주기 전에 mode bit을 변경하여 넘겨 주게 됩니다.
mode bit이 0일때는 커널 모드이며 운영체제가 CPU 제어권을 가지고 있습니다. 이때 운영체제는 메모리와 I/O Device 전체의 명령어를 수행할 수 있는 권한이 생깁니다.
1일때는 사용자 모드이며 사용자 프로그램이 CPU 제어권을 가지고 있는 상태입니다. 사용자 프로그램이 CPU 제어권을 가지고 있는 만큼 보안상 이슈가 있기에 제한된 명령어만 수행할 수 있습니다. 그래서 사용자 프로그램이 CPU 제어권을 가지고 있는상태에서 I/O가 발생할때 사용자 프로그램이 직접 I/O Device에 접근하여 명령어를 수행하는것이 아닌 운영체제에 CPU 제어권을 넘겨 운영체제가 수행하여 프로그램에 카피하는 수행과정을 거치게 됩니다.
그렇기에 사용자 프로그램은 명령어에 interrupt line 의도적으로 기입합니다. 이것을 System Call이라 하며 의도적으로 발생한 interrupt을 통해 CPU 제어권을 운영체제에게 넘겨주게 됩니다.

## Device Controller, Local Buffer

I/O Device에도 각각 Controller가 존재하며 Device Controller는 I/O Device의 제어를 하며 Device읨 명령어를 수행하게 됩니다. CPU의 처리 속도와 I/O Device 처리 속도는 매우 크게 차이나기에 사용자 프로그램을 통해 I/O 요청이 들어오게 된다면 CPU는 해당 요청을 Device Controller에게 전달하고 CPU는 다음 명령어 처리를 수행하고 Device Controller가 전달 받은 명령을 수행하게 됩니다.
Local buffer는 I/O Device의 임시 데이터 저장소 역할을 하며 요청에 의해 쌓인 Local Buffer 데이터를 CPU에 Intterupt를 걸어 요청 수행을 완료했다고 알린 후 데이터를 Memory에 copy하게 됩니다.

## Timer

Timer 하드웨어는 사용자가 프로그램이 무한 루프 코드를 통해 CPU 제어권을 계속 가지게 된다면 다른 사용자 프로그램이나 운영체제는 CPU 제어권을 뺏어올 방법이 없게 됩니다. 이러한 경우를 방지하기 위해 운영체제는 사용자 프로그램에게 CPU 제어권을 넘길때 Timer를 세팅하여 사용자 프로그램에게 CPU 제어권을 넘기게 되며 일정 Time 지나게 되면 CPU는 intterupt가 걸리며 CPU 제어권을 운영체제에 넘기게 됩니다.

## DMA(Direct Memory Access) Controller

DMA Controller는 CPU의 일을 돕기 위해 존재하는 Controller 입니다. I/O Device가 메인 메모리의 데이터에 접근하기 위해 CPU에게 Interrupt를 걸어 데이터를 옮겨달라고 요청하게 됩니다. 이러한 요청이 빈번하게 발생하는 I/O Device의해 CPU는 제 역할을 수행할 수 없으며 비효율적인 상태가 됩니다. 이떄 DMA Controller가 CPU의 데이터 옮기는 역할을 대신 수행하게 되며 블록 단위로 I/O Device의 정보를 읽어드려 메인 메모리에 copy후 CPU에 interrupt를 걸어 데이터를 다 옮겼다고 알려주게 됩니다. 이때 CPU와 DMA Controller가 동시에 메인 메모리 데이터에 접근하게 되어 데이터 일관성이 깨질 수 있는 상황이 발생할 수 있는데 이때 이러한 흐름 제어 역할을 하는것이 Memory Controller의 역할입니다.

## 참조

- [운영체제 - 반효경 교수님](http://www.kocw.net/home/search/kemView.do?kemId=1046323)
- [[반효경 운영체제] System Structure & Program Execution 1 - 제이온](https://steady-coding.tistory.com/511)
