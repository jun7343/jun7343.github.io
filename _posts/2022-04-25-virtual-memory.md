---
layout: post
title: Virtual Memory
categories: [OS, Memory]
excerpt: 운영체제가 전반적으로 관리하는 Virtual Memory에 관련하여 알아본다.
---

Physical Memory의 주소변환의 경우 운영체제가 관여하지 않으나, Virtual Memory는 운영체제가 전적으로 관리한다.

## Demand Paging(요구 페이징)

- 실제로 필요할 때 Page를 메모리에 올리는 것.
  - I/O 양 감소.
  - Memory 사용량 감소
  - 빠른 응답 시간
  - 더 많은 사용자 수용
- Valid / Invalid bit의 사용
  - Invalid 의미
    - 사용되지 않는 주소 영역인 경우
    - 페이지가 물리적 메모리에 없는 경우
  - 처음에는 모든 page entity가 invalid로 초기화
  - adress translation 시에 invalid bit이 set되어 있으면
    - => `Page fault`

### Deamand Paging example

![Virtual Memory01](/assets/images/os/virtual-memory/virtual-memory01.png)

- 순서대로 `논리 주소 - 페이지 테이블 - 물리 주소 - 디스크(백킹 스토어; swap area)`
- 페이지 테이블에서 V/I 는 각 Valid/Invalid를 얘기하며, Valid는 물리 메모리에 올라와 있는 페이지를 얘기하며, Invalid는 물리 메모리에 올라와 있지 않은 페이지를 얘기한다.
  - 초기에는 Invalid로 초기화되어 있으며 물리 메모리에 페이지가 올라가 있으면 Valid로 초기화
  - A,C,F 는 물리 메모리에 올라와 있으므로 V
  - A,C,F 이외의 주소의 경우 사용하는 페이지이지만 백킹 스토어(swap area)에 내려가 있어 I
  - G,H는 사용하지 않는 페이지. 페이지 테이블에 엔트리는 생성되어 있으나 사용허지 않아 I
- CPU가 논리 주소를 부여하고 주소 변환을 하려는데 Invalid면 디스크로부터 물리 메모리에 올리는 작업을 진행한다.(디스크로부터 물리 메모리에 올리는 작업은 I/O 작업이다.)
  - 요청한 페이지가 메모리에 올라와 있지 않다면 `Page Fault`가 났다고 한다.
  - `Page Fault`가 발생하면 CPU는 운영체제에 넘어가며 운영체제는 디스크로부터 해당 메모리를 물리 메모리에 올리게 된다.

### Demand Paging의 페이지 부재 처리

![Virtual Memory02](/assets/images/os/virtual-memory/virtual-memory02.png)

- CPU가 Invalid에 접근하면 MMU가 trap을 발생한다. (page fault trap)
- CPU 제어권이 커널 모드로 전환되고, 페이지 부재 처리 루틴이 호출되며 다음과 같은 순서로 페이지 부재 처리.
  - 해당 페이지에 대한 접근이 올바른가?
    - 사용되지 않는 주소 영역에 속한 페이지에 접근하려 했거나, 해당 페이지에 대한 접근 권한 위반을 했을 경우 프로세스 종료
  - 물리적 메모리에 비어있는 프레임을 할당 받는다.
    - 비어 있는 프레임이 없을 경우 기존에 메모리에 올라와 있는 페이지 중 하나를 디스크로 쫓아 낸다.(swap out)
  - 해당 페이지를 디스크에서 물리 메모리로 읽어온다.
    - 디스크 I/O가 끝날때까지 해당 프로세스 상태는 block되며 CPU를 선점 당한다.
    - 디스크 읽기가 끝나면 페이지 테이블에서 해당 페이지를 Invalid에서 Valid로 변경한다.
    - block 상태의 프로세스를 ready queue로 이동시킨다.
  - 해당 프로세스가 CPU를 할당 받으면 실행 상태로 바뀌며 PCB에 저장해 두었던 값을 통해서 중단 되었던 명령부터 실행 재가한다.

### Demand Paging 성능

- 페이지 부재의 발생 빈도가 성능에 가장 큰 영향을 미친다.
- 유효 접근 시간(요청한 페이지를 참조하는 데 걸린 시간)
  - (1 - P) x 메모리 접근 시간 + P x M
  - 페이지 부재 발생 비율(P) -> 0 <= P <= 1
    - P = 0: 페이지 부재가 한번도 발생하지 않는 경우
    - P = 1: 모든 참조 요청에서 페이지 부재가 발생한 경우
  - M(각종 오버헤드)
    - 페이지 부재 발생 처리 오버헤드
    - 메모리에 빈 프레임이 없는 경우 swap out 오버헤드
    - 요청된 페이지의 swap in 오버헤드
    - 프로세스의 재시작 오버헤드
    - 위 오버헤드의 총합을 뜻함

## Page Replacement(페이지 교체)

![Virtual Memory03](/assets/images/os/virtual-memory/virtual-memory03.png)

페이지 부재가 발생했을 시 요청된 페이지를 메모리로부터 읽어오려 하는데 물리적 메모리에 빈 프레임이 없는 경우가 존재할 수 있다. 이 때 메모리에 올라와 있는 페이지중 하나를 메모리로부터 쫓아내어 메모리에 빈 공간을 확보하는데 이때 어떤 페이지를 교체할지 결정하는 것이 **페이지 교체**라고 한다.

### Page Replacement Aloghrithm(페이지 교체 알고리즘)

페이지 교체를 할 때 어떤 프레임에 존재하는 페이지를 쫓아낼지 결정하는 알고리즘을 페이지 교체 알고리즘이라고 한다. 페이지 교체 알고리즘의 목표를 페이지 부재율을 최소화하는 것이다.

- 알고리즘의 평가
  - 주어진 페이지 참조열에 대해 부재율을 계산
  - 페이지 참조열의 예시: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5

#### Optimal Algorithm(최적 페이지 교체)

- 물리적 메모리에 존재하는 페이지 중 가장 먼 미래에 참조될 페이지를 쫓아내는 알고리즘
- 페이지 부재를 가장 적게하는 알고리즘
- 미래의 참조를 알아야 하므로 오프라인에서만 사용 (offline algorithm 이라고도 부름)

![Virtual Memory04](/assets/images/os/virtual-memory/virtual-memory04.png)

- 초기 4회는 메모리에 내용이 비어있어 불가피하게 페이지 부재 발생
- 이후 1,2는 물리적 메모리에 1,2가 존재하기에 페이지 부재가 발생하지 않음
- 페이지 5는 물리적 메모리에 없으므로 가장 먼 미래에 참조되는 페이지 4를 디스크로 쫓아낸다.
- 위의 같은 방식 반복한다.

#### FIFO Algorithm(선입선출 알고리즘)

![Virtual Memory05](/assets/images/os/virtual-memory/virtual-memory05.png)

- 물리적 메모리에 가장 먼저 올라온 페이지를 쫓아내는 알고리즘
- 메모리를 증가함에도 불구하고 페이지 부재가 더 발생할 수 있는 불상사가 발생할 수 있다.

#### LRU(Least Recently Used) Algorithm

- 가장 오래전에 참조가 이루어진 페이지를 쫓아내는 알고리즘

![Virtual Memory06](/assets/images/os/virtual-memory/virtual-memory06.png)

- 초기 4회는 물리적 메모리가 비어있으므로 페이지 부재가 발생
- 이후 1,2는 물리적 메모리에 존재하므로 페이지 부재가 발생하지 않음
- 페이지 5는 물리적 메모리에 존재하지 않으므로 가장 오래전에 참조된 페이지 3을 쫓아낸다
- 위와 같은 방식을 반복한다

#### LFU(Least Frequently Used) Algorithm

- 페이지의 참조 횟수가 가장 적은 페이지를 교체하는 알고리즘
- 최저 참조 횟수인 페이지가 여러 개 있는 경우
  - LFU 알고리즘에서는 여러 페이지중 임의로 선정
  - 성능 향상을 위해 가장 오래전에 참조된 페이지를 교체하게 구현할 수도 있다
- 장점
  - LRU처럼 직전 참조 시점만 보는것이 아니라, 장기적인 시간 규모를 보기에 페이지 인기도를 좀 더 정확히 반영할 수 있다
- 단점
  - 참조 시점의 최근성을 반영하지 못함
  - LRU 알고리즘보다 구현 복잡

#### LRU & LFU Example

![Virtual Memory07](/assets/images/os/virtual-memory/virtual-memory07.png)

#### LRU & LFU 구현

![Virtual Memory08](/assets/images/os/virtual-memory/virtual-memory08.png)
![Virtual Memory09](/assets/images/os/virtual-memory/virtual-memory09.png)

- LRU는 정렬된 LinkedList 방식으로 페이지를 교체할때 가장 위에 있는 LRU 페이지를 교체하면 되고, 특정 페이지가 참조되었을때는 List의 맨 아래로 보내면 되기에 구현이 간단하며 시간 복잡도도 O(1)이다.
- LFU는 페이지를 교체할 때는 가장 위에 있는 LFU 페이지를 교체하면 되지만, 특정 페이지가 참조되었을 때는 자기 자신보다 아래에 있는 노드와 참조 횟수를 모두 비교해야 하므로 일반적인 List 사용시 시간 복잡도는 O(n)이 된다. 그래서 인접 노드간의 참조 횟수를 빠르게 비교하기 위하여 Heap 자료 구조를 사용하며, 시간 복잡도는 O(log N)이 된다.

## 다양한 캐싱 환경

- 캐싱 기법
  - 한정된 빠른 공간(=캐시)에 요청된 데이터를 저장해 두었다가 후속 요청시 캐시로부터 직접 서비스하는 방식
  - paging system 외에도 cache memory, buffer caching, Web caching 다양한 분야에서 사용
- 캐시 운영의 시간 제약
  - 교체 알고리즘에서 삭제할 항목을 결정하는 일에 지나치게 많은 시간이 소요되는 경우 실제 시스템에서 사용될 수 없음
  - Buffer Caching이나 Web Caching의 경우
    - O(1)에서 O(log N) 정도까지 허용
  - Paging System인 경우
    - page fault의 경우에만 OS가 관여
    - 페이지가 이미 메모리에 존재하는 경우 참조 시각 등의 정보를 OS가 알 수 없음
    - O(1)인 LRU의 list 조작조차 불가능

## 페이징 시스템에서 LRU, LFU가 가능한가?

![Virtual Memory10](/assets/images/os/virtual-memory/virtual-memory10.png)

- 프로세스 A가 CPU를 잡고 실행 중인 상태이다. 따라서 프로세스 A의 논리적 메모리에서 매 순간 명령어를 읽어와서 수행한다.
- 이때 논리적 주소를 페이지 테이블을 통해서 물리적 주소로 변환하여 물리적 메모리에 있는 내용을 CPU로 읽어와야 한다.
  - 만약 주소 변환을 했는데 해당하는 페이지가 이미 물리적 메모리에 올라와 있다면 물리적 메모리를 그대로 읽으면 된다.
  - 이러한 주소 변환 과정은 하드웨어가 담당하며, OS가 관여하지 않는다.
- 만약 변환하려는 논리적 메모리 주소가 Invalid일 경우 Page Fault가 발생하여 디스크 접근을 필요로 한다. 이떄 I/O를 수행해야 하므로 trap이 발생하여 CPU 제어권이 프로세스 A에서 운영체제로 넘어간다.
- OS가 디스크의 페이지 부재가 발생한 페이지를 물리적 메모리에 올리며, 그 과정에서 물리적 메모리에 빈 프레임이 존재하지 않는다면 물리적 메모리안에 페이지 중 하나를 쫓아내야 한다.
- 위 일련의 과정을 진행하면서 LRU & LFU 알고리즘을 적용할 수 있을까?
  - 프로세스가 요청한 페이지가 이미 물리 메모리에 올라와 있다면 CPU 제어권을 OS에 넘어가지 않는다.
  - 페이지 부재가 발생해야 CPU 제어권이 OS로 넘어가므로 디스크에서 메모리로 페이지가 넘어오는 시간을 파악할 수 있다.
  - 결론은 페이지 부재가 발생해야지 페이지에 접근하는 정보를 알 수 있으므로 LRU, LFU 알고리즘은 페이징 시스템에 사용할 수 없다.(버퍼 캐싱, 웹 캐싱은 가능)

## Clock Algorithm(시계 알고리즘)

### 개념 및 특징

- LRU 근사 알고리즘이다.
- Second chance algorithm, NUR(Not Used Recently), NRU (Not Recently Used) 등으로 불린다.
- 참조 비트를 사용하여 교체 대상 페이지를 선정한다.(circular list)
  - 참조 비트를 수정하는 작업은 OS가 아닌 하드웨어가 수행한다.
  - 참조 비트가 0인것을 찾을 때 까지 포인터를 하나씩 앞으로 이동한다.

### 개선

- 참조 비트와 수정 비트를 함께 사용한다.
- 참조 비트가 1이면 참조된 페이지이며, 수정 비트가 1이면 최근에 변경된 페이지를 뜻한다.

### 동작 과정

![Virtual Memory11](/assets/images/os/virtual-memory/virtual-memory11.png)

- 각 사각형은 물리적 메모리에 있는 페이지 프레임을 뜻함.
- 페이지에 대해 어떤 페이지가 참조되어 CPU가 그 페이지를 사용하게 되면, 그 페이지에 참조 비트가 1로 세팅 된다.(하드웨어가 수행)
- OS는 포인터를 이동하면서 페이지의 참조 비트가 이미 1이면, 페이지를 쫓아내지 않고 참조 비트를 0으로 세팅한 후 다음 페이지의 참조 비트를 검사한다.
- OS는 다시 포인터를 이동하다가 참조 비트가 0인 페이지를 찾으면, 해당 페이지를 쫓아낸다.
  - 참조 비트는 해당 페이지가 참조될 때 하드웨어가 1로 자동으로 세팅되므로 시계 바늘이 한 바퀴 돌아오는 동안에 다시 참조되지 않은 경우 해당 페이지는 교체된다.
- 개선 클럭 알고리즘은 참조 비트 외에 수정 비트를 사용한다.
  - 수정 비트는 어떤 페이지가 쫓겨날 때, 이 페이지의 수정 비트가 0이면 backing store에서 물리적 메모리로 올라온 이후로 수정이 되지 않은 페이지이므로 바로 메모리에서 지워도 된다.
  - 하지만 수정 비트가 1이면 물리적 메모리로 올라온 이후로 상태의 수정이 일어난 페이지이므로 쫓겨나기 전에 backing store에 수정한 내용을 반영하고 메모리에서 지워야 한다.
  - 그래서 수정 비트가 1이면 디스크로 쫓겨나는 페이지의 수정된 내용을 반영하는 오버헤드가 발생하므로, 해당 페이지를 쫓아내지 않고 수정 비트를 0으로 바꾼다.

### 페이지 프레임의 할당

- 각 프로세스에 얼마 만큼의 페이지 프레임을 할당할 것인가?
- 페이지 프레임 할당의 필요성
  - CPU에서 일반적으로 명령을 실행할 때는 여러 페이지를 동시에 참조하게 된다.
    - 프로세스의 주소 공간 중 코드, 데이터, 스택 등 각기 다른 영역을 참조하기 때문.
  - Loop를 구성하는 페이지들은 한꺼번에 프로세스에 할당되는 것이 유리하다.
    - 최소한의 페이지 할당이 없으면 매 반복문마다 페이지 부재가 발생한다.
- 페이지 프레임 할당 알고리즘
  - 균등 할당(Equal Allocation): 모든 프로세스에게 페이지 프레임을 균일하게 할당.
  - 비례 할당(Proportional Allocation): 프로세스의 크기에 따라 페이지 프레임을 비례하여 할당
  - 우선순위 할당(Priority Allocation): 프로세스의 우선순위에 따라 페이지 프레임을 할당
    - 당장 CPU에서 실행될 프로세스와 그렇지 않은 프로세스를 구분

## Global vs Local Replacement(전역 교체 vs 지역 교체)

### Global Replacement

- Replace 시 다른 process에 할당된 frame을 빼앗아 올 수 있다
- Process별 할당량을 조절하는 또 다른 방법임
- FIFO, LRU, LFU 등의 알고리즘을 global replacement로 사용할 수 있다.
- Working set, PFF 알고리즘을 global replacement로 사용할 수 있다.

### Local Replacement

- 자신에게 할당된 frame 내에서만 replacement 한다.
- FIFO, LRU, LFU 등의 알고리즘을 Local replacement로 사용할 수 있다.

## Thrashing

- 프로세스의 원활한 수행에 필요한 최소한 페이지 프레임 수를 할당 받지 못하면 페이지 부재율이 크게 상승하여 CPU 이용률이 떨어지는데, 이를 Thrashing이라 한다.
- low throughput
- Thrashing 발생 시나리오
  - OS는 CPU 이용률이 낮을 경우 메모리에 올라와 있는 프로세스의 수가 적다고 판단하여 메모리에 올라가는 프로세스를 늘린다.(CPU 이용률이 낮으면 MPD를 높인다)
    - Ready Queue에 프로세스가 단 하나라도 있으면 CPU는 그 프로세스를 실행하므로 쉬지 않고 일하게 되는데, CPU 이용률이 낮다는 것은 Ready Queue가 비어있다는 것을 뜻한다.
    - 메모리에 동시에 올라가 있는 프로세스의 수를 다중 프로그래밍의 정도(MPD)라고 부른다.
  - MPD가 과도하게 높아지면 각 프로세스에게 할당되는 메모리의 양이 지나치게 감소한다.
  - 각 프로세스는 그들이 원활하게 수행되기 위해 필요한 최소한의 페이지 프레임도 할당 받지 못하므로 페이지 부재율이 급격히 증가한다.
  - 페이지 부재가 발생하면 I/O 작업을 수반하므로 다른 프로세스에게 CPU가 넘어간다.
  - 다른 프로세스 역시 페이지 부재가 발생하고 있어서 또 다른 프로세스에게 CPU가 넘어간다.
  - 결국 Ready Queue에 있는 모든 프로세스에게 CPU가 한 차례씩 할당 되었는데도 모든 프로세스가 다 페이지 부재를 발생하여 CPU의 이용률이 급격하게 떨어진다.
  - OS는 위 현상이 메모리에 MPD가 낮다고 판단하여 MPD를 높이려고 한다.
  - 위 악순환이 계속 반복되는 상황을 스레싱이라 부른다.

### Thrasing Diagram

![Virtual Memory12](/assets/images/os/virtual-memory/virtual-memory12.png)

## Working-Set Alogirithm

### Working-Set Model

- 참조의 지역성
  - 프로세스는 특정 시간동안 일정 장소만을 집중적으로 참조한다.
  - 집중적으로 참조되는 해당 페이지의 집합을 지역셋(locality set)이라고 한다.
- 워킹셋 모델
  - 지역성에 기반하여 프로세스가 일정 시간 동안 원활하게 수행되기 위해 한꺼번에 메모리에 올라와 있어야 하는 페이지의 집합을 워킹셋이라고 정의한다.
  - 워킹셋 모델에서는 프로세스의 워킹셋 전체가 메모리에 올라와 있어야 수행되고, 그렇지 않을 경우 모든 페이지 프레임을 반납 한 후 swap out한다. 해당 프로세스는 suspend 상태가 된다.
    - 만약 워킹셋이 5개인데 페이지 프레임을 공간에 3개 밖에 없다면, 해당 프로세스는 모든 페이지 프레임을 반납하고 디스크로 쫓겨 난다.
  - MPD를 조절하여 Thrasing을 방지한다.

### Working-Set Algorithm

![Virtual Memory13](/assets/images/os/virtual-memory/virtual-memory13.png)

## PFF(Page-Fault Requency) Algorithm

- 페이지 부재 빈도 알고리즘은 프로세스의 페이지 부재율을 주기적으로 조사하고 이 값에 근거해서 각 프로세스에 할당할 메모리 양을 동적으로 조절한다.
- 페이지 부재율의 상한값과 하한값을 둔다.
  - 페이지 부재율의 상한값을 넘으면 페이지 프레임을 더 할당한다.
  - 페이지 부재율의 하한값보다 낮으면 할당 페이지 프레임 수를 줄인다.
- 빈 페이지 프레임이 없으면 일부 프로세스를 swap out 한다.

![Virtual Memory14](/assets/images/os/virtual-memory/virtual-memory14.png)

## Page Size의 결정

- Page Size를 감소시키면
  - 페이지 수 증가
  - 페이지 테이블 크기 증가
  - Internal fragmentation 감소
  - Disk transfet의 효율성 감소
    - Seek/rotation의 효율성 감소
  - 필요한 정보만 메모리에 올라와 메모리 이용이 효율적
    - Locality의 활용 측면에서는 좋지 않음
- Trend
  - Larger page size(최근에는 페이지 사이즈를 크게 가져감)

## 가상 메모리 관련 기타 정보

### 가상메모리를 사용하는 이유

- 메모리에 확장성을 부여한다.
  - 물리 메모리는 한정적이지만, 가상 메모리는 큰 공간으로 구성이 가능
  - 가상 메모리를 사용하면 실제 메인 메모리 장치가 아닌, 디스크를 부가적인 메모리 공간으로 활용할 수 있다.
- 모든 프로그램에 동일한 메모리 공간을 제공해 줄 수 있다.
  - 개발자 입장에서 물리적 메모리가 아닌 OS가 제공하는 메모리 공간만 신경 쓰면 된다.
  - 운영 체제가 동작하는 환경에서는 여러 가지 프로그램이 동시에 실행되므로 메모리 공간에 대한 관리가 필요하다.
- 메모리 할당과 관리에 효율적이다.
  - 물리적으로 연속되지 않은 메모리라도 가상으로 연속적인 메모리 공간으로 사용이 가능하다.
- 메모리 보호 기능을 제공한다.
  - 보안이나 안정석 측면에서 매우 중요한 기능이다.
  - 각각의 프로세스는 별도의 메모리 공간을 점유하며, 다른 프로세스의 메모리 공간을 참조 할 수 없다.

### 가상 메모리의 중요성

- 가상 메모리는 메모리 사용량이 늘어남에 따라, 디스크의 일부를 마치 확장된 RAM처럼 사용할 수 있게 해준 기술이다.
- 커널은 실제 메모리에 올라와 있는 메모리 블록 중 당장 쓰이지 않는 것을 디스크에 저장하는데, 이를 통해 사용 가능한 메모리의 영역을 훨씬 늘릴 수 있게 된다. 디스크에 저장되어 있던 메모리 블록은 다시 필요하면 실제 메모리로 올려지며, 대신 다른 블록이 디스크로 내려가게 된다.
- 이러한 과정은 사용자에게 전혀 보이지 않고, 프로그램에게도 그저 많은 양의 메모리가 있는것처럼 보일 뿐이어서 점유하고 있던 메모리가 디스크에 있는지 실제 메모리에 있는지 전혀 신경 쓸 필요가 없게 된다.
- 그러나, 하드 디스크를 읽고 쓰는 시간은 RAM보다 훨씬 느리기 떄문에 프로그램의 실행은 그만큼 느려진다.
- 이때 가상 메모리로 쓰이는 하드 디스크의 영역을 swap area(백킹 스토어)라고 부른다.
- 메모리 스와핑은 두 가지 측면에서 중요하다.
  - 시스템에서 특정 애플리케이션이나 프로세스가 현재 가용한 물리 메모리보다 많은 양의 메모리를 요청할 수 있다. 이때 커널은 적은 빈도로 사용되는 메모리 페이지를 swap out해서 가용 메모리 공간을 확보한 뒤 이를 해당 프로세스에게 할당해 줌으로써 프로세스 실행이 가능하게 한다.
  - 애플리케이션이 실행되기 시작할 때 초기화를 위해서만 필요하고 이후에는 사용되지 않는 메모리 페이지들은 시스템에 의해 swap out된다. 이로 인해 가용 가능한 메모리 공간은 다른 애플리케이션이나 디스크 캐시 용도로 활용된다.

## 참조

- [운영체제 - 반효경 교수님](http://www.kocw.net/home/search/kemView.do?kemId=1046323)
- [Virtual Memory 1](https://steady-coding.tistory.com/571)
- [Virtual Memory 2](https://steady-coding.tistory.com/572)
- [Virtual Memory(1)](https://velog.io/@yuhyerin/kocw-%EC%9A%B4%EC%98%81%EC%B2%B4%EC%A0%9C-%EB%B0%98%ED%9A%A8%EA%B2%BD-9.-Virtual-Memory1)
- [Virtual Memory(2)](https://velog.io/@yuhyerin/kocw-%EC%9A%B4%EC%98%81%EC%B2%B4%EC%A0%9C-%EB%B0%98%ED%9A%A8%EA%B2%BD-9.-Virtual-Memory2)