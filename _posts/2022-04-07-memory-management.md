---
layout: post
title: Memory Management
categories: [OS, Memory]
excerpt: 메로리에 적재되는 것은 무엇이며 어떻게 적재되고 관리되어지는지 알아본다.
---

## Logical Address & Physical Address

### Logical Address

- 프로세스마다 독립적으로 가지는 주소 공간
- 각 프로세스마다 0번지부터 시작
- CPU가 보는 주소는 Logical Address이다.

### Physical Address

- 메모리에 실제 올라가는 위치
- 보통 메모리의 낮은 주소 영역에는 운영체제가 올라가며, 높은 주소 영역에는 사용자 프로세스가 올라간다.

## 주소 바인딩

- 프로세스의 논리적 주소를 물리적 메모리 주소로 연결하는 작업을 얘기한다.
- Symbolic Address -> Logical Address -> Physical Address
  - `Logical Address -> Physical Addres` 해당 시점
- Symbolic Address는 프로그래머 입장에서 사용하는 주소로, 변수 이름과 형태의 주소를 얘기한다.
- 주소 바인딩의 방식은 프로그램이 적재되는 물리적 메모리의 주소가 결정되는 시기에 따라 세가지로 분류 할 수 있다.

### Compile time binding

- 물리적 메모리 주소(Physical Address)가 컴파일 시 알려짐
- 시작 위치 변경시 재컴파일
- 컴파일러는 절대 코드(absolute code) 생성
- 현대 시분할 컴퓨팅 환경에서 거의 사용하지 않음

### Load time bindling

- 프로그램의 실행이 시작될때 물리적 메모리 주소가 결정되는 주소 바인딩 방식
- Loader의 책임하에 물리적 메모리 주소 부여되며 프로그램이 종료될 때까지 물리적 메모리 상의 위치가 고정
  - Loader는 사용자 프로그램을 메모리에 적재하는 프로그램
- 컴파일러가 재배치가능코드(relocateable code)를 생성한 경우 가능

### Execution time binding(= Run time binding)

- 프로그램이 실행된 이후에도 그 프로그램이 위치한 물리적 메모리 상의 위치를 변경할 수 있는 바인딩 방식
- CPU가 주소를 참조 할 때마다 binding 점검(address mapping table)
  - 주소 매핑 테이블은 MMU를 사용하며 MMU는 논리적 주소를 물리적 주소로 매핑하는 하드웨어 장치
- 하드웨어적인 지원이 필요 (e.g base and limit registers, MNU)

### 주소 바인딩 방식 예시

![memory management01](/assets/images/os/memory-management/memory-management01.png)

### MNU(Memory Management-Unit)

- 논리적 주소를 물리적 주소로 매핑해주는 하드웨어 장치
- MMU를 사용한 기법을 MMU Scheme이라 하며, 사용자 프로세스가 CPU에서 수행되며 생성하는 모든 주소 값에 대해 기준 레지스터 값을 더하는 방식
  - MMU기법에서 사용자 프로그램이나 CPU는 논리적 주소를 다룰 뿐, 실제 메모리 주소는 알지도 못하며 알아야 할 필요도 없다.

### MMU 기법의 동작 과정

![memory management02](/assets/images/os/memory-management/memory-management02.png)

- CPU가 논리적 메모리 346번지에 있는 내용을 요청하면 MMU는 2개의 레지스터를 가지고 변환을 하게 된다.
- 이떄, 실제 물리적 메모리 시작 위치와 논리적 메모리 주소를 더한 값을 CPU에게 전달
  - 논리적 메모리 주소는 offset 개념으로 생각할 수도 있음.
- rolocation register가 물리적 메모리의 시작 위치를 가지고 있으며 접근할 수 있는 물리적 메모리 주소의 최솟값에 해당
- limit register는 프로그램의 크기를 나타내며 논리적 주소의 범위를 뜻한다. 이 범위를 넘어서 주소를 요청하면 안 된다.

![memory management03](/assets/images/os/memory-management/memory-management03.png)

- CPU가 요청한 논리적 주소 값을 limit register 값과 비교하여 범위를 벗어나면 trap을 발생시켜 프로세스를 강제 종료한다.
- 범위를 벗어나지 않으면 relocation register의 값을 더해서 물리적 주소로 변환
- 사용자 프로그램은 논리적 주소만을 다루기에 실질적 물리적 메모리 주소 위치를 알 필요가 없다.

## Some Terminologies - 메모리 관리와 관련된 용어

### Dynamic Loading(동적 로딩)

- 프로세스 전체를 메모리에 미리 다 올리는 것이 아니라 해당 루틴이 불러질 때 메모리에 Load하는 것
- Memory Utilization의 향상
- 가끔식 사용되는 많은 양의 코드의 경우 유용
  - ex) 오류 처리 루틴
- 운영체제의 특별한 지원 없이 프로그램 자체에서 구현 가능(OS는 라이브러리를 통해 지원 가능)
- Loading: 메모리로 올리는 것

좋은 프로그램은 오류 처리 루틴이 많으며 페이징 기법과 차이점이라 하면 페이징 기법은 운영체제에서 관리되지만 동적 로딩은 프로그래머가 관리 한다. 현재는 이 두가지를 섞어 사용하기도 한다.

### Overlays(오버랩)

- 메모리에 프로세스의 부분 중 실제 필요한 부분만을 올림
- 프로세스의 크기가 메모리의 크기보다 클 경우 유용
- 운영체제의 지원없이 사용자에 의해 구현
- 작은 공간의 메모리를 사용하던 초창기 시스템에서 수작없으로 프로그래머가 구현
  - `Manual Overlay`
  - 프로그래밍이 매우 복잡
- 동적 로딩과의 차이점
  - 동적 로딩: 다중 프로세스 환경에서 메모리에 더 많은 프로세스를 올려 놓고 실행하기 위한 용도
  - 오버랩: 단일 프로세스만을 메모리에 올려놓는 환경에서 메모리 용량보다 큰 프로세스를 올리기 위한 어쩔 수 없는 선택

### Swapping

![memory management04](/assets/images/os/memory-management/memory-management04.png)

- 프로세스를 일시적으로 메모리에서 backing store로 쫓아내는 것
  - backing storer(= swap area) 디스크 내에 파일 시스템과는 별도로 존재하는 많은 사용자의 프로세스 이미지를 담을 만큼 충분히 빠르고 큰 저장 공간
- 디스크에서 메모리로 올리는 작업을 Swap in 이라 하며 메모리에서 디스크로 내리는 작업을 Swap out
  - 일반적으로 중기 스케줄러(swapper)에 의해 swap out 시킬 프로세스 선정
  - prioiry-based CPU scheduling algorithm
    - priority가 낮은 프로세스를 swapped out 시킴
    - prioirty가 높은 프로세스를 메모리에 올려 놓음
  - Compile time 혹은 Load time binding에서는 원래 메모리 위치로 swap in 해야 함
  - Execution tme binding에서는 추후 빈 메모리 영역 아무 곳에나 올릴 수 있음
  - swap time은 대부분 transfer time (swap되는 양에 비례하는 시간)임

### Dynamic Linking

- Linking을 실행 시간(Execution time)까지 미루는 기법
- Static Linking
  - 라이브러리가 프로그램의 실행 파일 코드에 포함됨
  - 실행 파일의 크기가 커짐
  - 동일한 라이브러리를 각각의 프로세스가 메모리에 올리므로 메모리 낭비(eg. printf 함수의 라이브러리 코드)
- Dynamic Linking
  - 라이브러리가 실행시 연결(linking)됨
  - 라이브러리 호출 부분에 라이브러리 루틴의 위치를 찾기 위한 stub이라는 작은 코드를 둠
  - 라이브러리가 이미 메모리에 있으면 그 루틴의 주소로 가고 없으면 디스크에서 읽어옴
  - 운영체제의 도움 필요

## Allocation of Physical Memory(물리적 메모리의 할당 방식)

- 메모리는 일반적으로 두 영역으로 나뉘어 사용
  - OS 상주 영역: interrupt vector와 함께 낮은 주소 영역 사용
  - 사용자 프로세스 영역: 높은 주소 영역 사용
- 사용자 프로세스 영역 할당 방법
  - Contiguous allocation(연속 할당)
    - 각각의 프로세스가 메모리의 연속적인 공간에 적재되도록 하는 것 (2가지 방식 존재)
    - Fixed partition allocation(고정 분할 방식)
    - Variable partition allocation(가변 분할 방식)
  - Nonontiguous allocation(불연속 할당)
    - 하나의 프로세스가 메모리의 여러 영역에 분산되어 올라갈 수 있음
    - Paging
    - Segmentation
    - Paged Segmentation

### Contiguous allocation(연속 할당)

![memory management05](/assets/images/os/memory-management/memory-management05.png)

#### Fixed partition allocation(고정 분할 방식)

- 물리적 메모리를 몇 개의 영구적 분할(partition)로 나눔
- 분할의 크기가 모두 동일한 방식과 서로 다른 방식이 존재
- 분할당 하나의 프로그램 적재
- 융통성이 없음
  - 동시에 메모리에 load되는 프로그램 수가 고정됨
  - 최대 수행 가능 프로그램 크기 제한
- Internal fragmentation 발생 (external fragmentation도 발생)

#### Variable partition allocation(가변 분할 방식)

![memory management06](/assets/images/os/memory-management/memory-management06.png)

- 프로그램의 크기를 고려해서 할당
- 분할의 크기, 개수가 동적으로 변함
- 기술적 관리 기법 필요
- External fragmentation 발생

#### Dynamic Storage-Allocation Problem

가변 분할 방식에서 size n인 요청을 만족하는 가장 적절한 hole을 찾는 문제

- First-fit
  - Size가 n 이상인 것 중 최초로 찾아지는 hole에 할당
- Best-fit
  - Size가 n 이상인 가장 작은 hole을 찾아서 할당
  - Hole들의 리스트가 크기순으로 정렬되지 않은 경우 모든 hole의 리스트를 탐색해야 함
  - 많은 수의 아주 작은 hole들이 생성됨
- Worst-fit
  - 가장 큰 hole에 할당
  - 역시 모든 리스트를 탐색해야 함
  - 상대적으로 아주 큰 hole들이 생성됨

First-fit과 Best-fit이 Worst-fit보다 속도와 공간 이용률 측면에서 효과적인것으로 알려짐.

#### Compaction(압축)

- 외부 조각 문제를 해결하는 방법중 하나
- 사용 중인 메모리 영역을 한군데로 몰고 hole들을 다른 한 곳으로 몰아 큰 block을 만드는 것
- 매우 비용이 많이 드는 작업임
- 최소한의 메모리 이동으로 compaction하는 방법(매우 복잡한 문제)
- Compaction은 프로세스의 주소가 실행 시간에 동적으로 재배치 가능한 경우에만 수행될 수 있다

### Nonontiguous allocation(불연속 할당)

- Paging
  - Process의 virtual memory를 동일한 사이즈의 page 단위로 나눔
  - Virtual memory의 내용이 page 단위로 noncontiguous하게 저장됨
  - 일부는 backing storage에, 일부는 physical memory에 저장
- Basic Method
  - physical memory를 동일한 크기의 frame으로 나눔
  - logical memory를 동일 크기의 page로 나눔(frame과 같은 크기)
  - 모든 가용 frame들을 관리
  - page table을 사용하여 logical address를 physical address로 변환
  - External fregmentation 발생 안함
  - Internal fregmentation 발생 가능

#### Paging Example

![memory management07](/assets/images/os/memory-management/memory-management07.png)

- 논리적 메모리는 페이지 단위로 분할이 되고, 물리적 메모리는 프레임 단위로 분할이 되어 서로 매칭 된다. 이떄 논리적 주소를 물리적 주소로 변환하기 위해 페이지 테이블을 활용한다.

### Address Translation Architecture(주소 변환 기법)

![memory management08](/assets/images/os/memory-management/memory-management08.png)

- 페이지 기법에서는 CPU가 사용하는 논리적 주소를 페이지 번호(p)와 페이지 오프셋(d)으로 나누어 주소 변환에 사용한다.
- 페이지 번호는 각 페이지별 주소 변환 정보를 담고 있는 페이지 테이블 접근 시 인덱스로 사용되고, 해당 인덱스의 항목에는 그 페이지의 물리적 메모리 상의 주소, 즉 시작 위치가 저장된다.
- 따라서 특정 프로세스의 p번째 페이지가 위치한 물리적 메모리의 시작 위치를 알고싶다면 해당 프로세스의 페이지 테이블에서 p번째 항목을 찾아보면 된다.
- 페이지 오프셋은 하나의 페이지 내에서의 변위를 알려준다. 따라서 기준 주소 값에 변위를 더함으로써 요청된 논리적 주소에 대응하는 물리적 주소를 얻을 수 있다.
- 위 그림에서 f(물리적 주소 시작 위치) + d를 취하면 처음에 CPU가 요청한 논리적 주소에 대응하는 물리적 주소가 된다.

### Implementation of Page Table(페이지 테이블의 구현)

- Page Teble은 Paging 기법에서 주소 변환을 하기 위한 자료구조로써, 물리적 메모리인 main memory에 상주
- 현재 CPU에서 실행 중인 프로세스의 페이지 테이블에 접근하기 위해 운영체제는 2개의 레지스터를 사용한다.
  - 페이지 테이블 기준 레지스터(page-table base register)
    - 메모리 내에서 페이지 테이블의 시작 위치를 가르킴
  - 페이지 테이블 길이 레지스터(page-table length register)
    - 페이지 테이블의 크기를 보관함
- 페이징 기법에서 모든 메모리 접근 연산은 총 2번씩 필요하다.
  - 주소 변환을 위해 페이지 테이블에 접근
  - 변환된 주소에서 실제 데이터에 접근
  - 이러한 오버헤드를 줄이고 메모리의 접근 속도를 향상하기 위해 **TLB(Translation Lock-aside Buffer)**라고 불리는 고속의 주소 변환용 하드웨어 캐시를 사용

#### Paging Hadware with TLB

![memory management09](/assets/images/os/memory-management/memory-management09.png)

- TLB는 가격이 비싸기에 빈번히 참조되는 페이지에 대한 주소 변환 정보만 담게 된다
- 요청된 페이지 번호가 TLB에 존재한다면 곧 바로 대응하는 물리적 메모리 프레임 번호를 얻을 수 있지만, TLB에 존재하지 않을 경우 메인 메모리에 있는 페이지 테이블로부터 프레임 번호를 알아내야 한다.
- 페이지 테이블에는 페이지 번호가 주어지면 해당 페이지에 대응하는 프레임 번호를 얻을 수 있지만, TLB에는 페이지 번호와 프레임 번호 쌍을 가지고 있으므로 특정 페이지 번호가 있는지 TLB 전체를 찾아봐야 한다.
- TLB는 Context Switch시 이전 프로세스의 주소 변환 정보를 담고 있는 내용이 전부 지워진다.

#### Associative Register(연관 레지스터)

![memory management19](/assets/images/os/memory-management/memory-management19.png)

#### Effective Access Time

![memory management20](/assets/images/os/memory-management/memory-management20.png)

## Two-Level Page Table

![memory management10](/assets/images/os/memory-management/memory-management10.png)

- 현대의 컴퓨터는 주소 공간이 매우 큰 프로그램을 지원한다. 그러기에 페이지 테이블 자체를 페이지로 구성하는 2단계 페이징 기법을 사용한다.
- 주소 변환을 위해 외부 페이지 테이블과 내부 페이지 테이블의 두 단계에 걸친 페이지 테이블을 사용한다.
- 사용하지 않는 주소 공간에 대해서는 외부 페이지 테이블 항목을 NULL로 설정하며, 여기에 대응하는 내부 페이지 테이블을 생성하지 않는다.
- 페이지 테이블을 위해 사용되는 메모리 공간을 줄이지만, 페이지 테이블의 수가 증가하므로 시간족인 손해가 뒤따른다.

### Two-Level Paging Example

![memory management11](/assets/images/os/memory-management/memory-management11.png)

- p2는 페이지 테이블 내에 엔트리를 구분해야하는데, 엔트리는 1k가 있으므로, p2는10비트가 필요하다.

### Address-Translation Scheme

![memory management12](/assets/images/os/memory-management/memory-management12.png)

## Inverted Page Table(역페이지 기법)

- Page Table이 매우 큰 경우
  - 모든 process 별로 그 logical address에 대응하는 모든 page에 대해 page table entry가 존재
  - 대응하는 page가 메모리에 있든 아니든 간에 page table에는 entry로 존재
- Inverted Page Table
  - Page frame 하나당 page table에 하나의 entry를 둔 것 (system-wide)
  - 각 page table entry는 각각의 물리적 메모리의 page frame이 담고 있는 내용 표시(process-id, process의 logical address)
  - 단점: 테이블 전체를 탐색해야 함
  - 조치: associative register 사용(expensive)

### Inverted Page Table Architecture

![memory management14](/assets/images/os/memory-management/memory-management14.png)

프로세스마다 존재하는 것이 아니라, 하나만 존재. 물리적인 메모리 프레임만큼 페이지 테이블의 엔트리가 존재한다. 페이지 테이블 설계가 물리적인 메모리에 논리적인 메모리가 매칭되어있기 때문에 페이지 테이블 전체를 찾아봐야 물리적인 메모리를 알 수 있다. 시간적인 제약이 많이 걸린다. 따라서 TLB 같은 register를 사용해서 문제를 해결할 수 있다.

## Shared Page(공유 페이지)

- Shared code
  - Re-entrant Code (=Pure Code)
  - read-only로 하여 프로세스 간에 하나의 code만 메모리에 올림(eg, text editors, compilers, window systems)
  - Shared Code는 모든 프로세스의 logical address space에서 동일한 위치에 있어야 함
- Private code and Data
  - 각 프로세스들은 독자적으로 메모리에 올림
  - Private Data는 logical address space의 아무 곳에 와도 무방

### Shared Page Example

![memory management15](/assets/images/os/memory-management/memory-management15.png)

프로그램의 코드 부분은 공유할 수 있다. share 가능한 부분은 각각을 올리지 않고 하나만 올려도 된다.

## Memory Protection(메모리 보호)

- 페이지 테이블의 각 항목에는 주소 변환 정보외에 메모리 보호를 위한 보호 비트와 유효-무효 비트가 존재한다.
- 보호 비트는 각 페이지에 대해 읽기-쓰기/읽기 전용 등의 접근 권한을 설정하는 데 사용된다
- 유효-무효 비트는 해당 페이지의 내용이 유효한지에 대한 내용을 담고 있다.
  - 유효-무효 비트가 '유효': 해당 메모리 프레임에 해당 페이지가 존재. 따라서 접근 허용
  - 유효-무효 비트가 '무효': 해당 페이지가 물리적 메모리에 올라와 있지 않고, backing store에 존재하여 해당 메모리 프레임에 접근 불가

### Valid (v) / Invalid (i) Bit in a Page Table

![memory management13](/assets/images/os/memory-management/memory-management13.png)

## Segmentation(세그먼테이션)

- 프로그램은 의미 단위인 여러개의 세그먼테이션으로 구성될 수 있다.
  - 작게는 프로그램을 구성하는 하나 하나를 세그먼트로 정의
  - 크게는 프로그램 전체를 하나의 세그먼트로 정의 가능
  - 일반적으로 code, data, stack 부분이 하나씩의 세그먼트로 정의됨
- 세그먼트는 다음과 같은 논리적인 유닛이라 할 수 있다.
  - main()
  - function
  - global variables
  - stack
  - symbol table
  - arrays
  - ...

### Segmentation Architecture

- Logical Address는 다음의 두가지로 구성
  - segment-number, offset
- Segment Table
  - each table entry has:
    - base: **starting physical address** of the segment
    - limit: **length** of the segment
- Segment-table base register (STBR)
  - 물리적 메모리에서의 segment table의 위치
- Segment-table length register (STLR)
  - 프로그램이 사용하는 segment의 수
  - segment number `s` is legal if `s` < STLR
- Protection
  - 각 세그먼트 별로 protection bit가 있음
  - Each entry:
    - Valid bit = 0 => illegal segment
    - Read/Write/Execution 권한 bit
- Sharing
  - shared segment
  - same segment number
  - segment는 의미 단위이기 때문에 공유(sharing)와 보안(protection)에 있어 paging보다 훨씬 효과적이다.
- Allocation
  - first fit / best fit
  - external fragmentation 발생
  - segment의 길이가 동일하지 않으므로 가변분할 방식에서와 동일한 문제점들이 발생

### Segmentation Hardware

![memory management16](/assets/images/os/memory-management/memory-management16.png)

segmentation에서는 의미 단위로 잘랐기 때문에 길이가 다 다르다. 그래서 limit을 가지고 있다.

### Example of Segmentation

![memory management17](/assets/images/os/memory-management/memory-management17.png)

세그멘테이션은 페이징 기법보다 페이지 테이블 크기가 작기 때문에 메모리 낭비가 덜하다.

### Segmentation with paging

![memory management18](/assets/images/os/memory-management/memory-management18.png)

세그멘테이션과 페이징 기법을 혼합하는 방법이다. 세그먼트를 페이지로 구성하는 기법이다. 의미단위로는 segment 테이블에서 나누고, 세그먼트당 주소변환은 나중에 물리적인 주소로 바꾼다. 세그먼트당 페이지 테이블이 존재한다.

이 챕터에서 운영체제가 하는 일은 없었다. 다 하드웨어가 하는 역할이었다. cpu가 메모리에 접근하는데는 운영체제의 도움이 필요없다.

## 참조

- [운영체제 - 반효경 교수님](http://www.kocw.net/home/search/kemView.do?kemId=1046323)
- [Memory Management 1](https://steady-coding.tistory.com/549)
- [Memory Management 2 & 3 & 4](https://steady-coding.tistory.com/561)
- [운영체제 반효경 교수님 2014년 - 8. Memory Management](https://velog.io/@injoon2019/%EC%9A%B4%EC%98%81%EC%B2%B4%EC%A0%9C-%EC%9A%B4%EC%98%81%EC%B2%B4%EC%A0%9C-%EB%B0%98%ED%9A%A8%EA%B2%BD-%EA%B5%90%EC%88%98%EB%8B%98-2014%EB%85%84-8.-Memory-Management)
