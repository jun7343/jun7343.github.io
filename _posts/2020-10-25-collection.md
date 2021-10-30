---
layout: post
title: "Collection 종류와 이해"
categories: [Data Structure]
---

### Collection 이란? - Java Collection Framework (JCF)

데이터를 저장하는 기본적인 자료구조들을 한 곳에 모아 관리하고 편하게 사용하기 위해서 제공하는 것을 의미한다.    
즉 여러 원소를 담을 수 있는 자료구조이다.    

### Collection Interface 종류

<img src="/assets/images/data-structure/collection/java-collection.png" class="align-center" alt="Java Collection Framework">    
<img src="/assets/images/data-structure/collection/java-collections-list.png" class="align-center" alt="Java Collection Framework List">    


**여기서 Map의 경우 Collection 인터페이스를 상속 받지 않지만 Collection으로 분류한다.**    

- **Set**
  - **HashSet:** 순서가 필요없는 데이터를 HashTable에 저장하며, Set중 가장 높은 성능을 보인다. List와 달리 중복을 허용 하지 않아 결론적으로 순서 상관없이 데이터 유무 판단하는 것에 중점을 둔다.
  - **TreeSet:** 저장된 데이터 값에 따라 정렬되며, Red-black tree타입으로 저장되며 HashSet보다는 성능이 느리다.
  - **LinkedHashSet:** 기존 Set과 같이 중복된 데이터를 허용하지 않으며, 다만 입력된 데이터 순서대로 관리하기에 HashSet과 달리 데이터 순서를 보장한다.

- **List**
  - **ArrayList:** 저장 용량을 초과한 객체들이 들어오면 자동으로 저장용량이 늘어나며 단방향 포인터 구조로 자료에 대한 순차적인 접근 속도가 빠름.
  - **LinkedList:** 인접 참조를 링크해서 체인처럼 사용하며 삽입, 삭제가 빈번하게 일어날때 적합. 스택, 큐, 양방향 큐 등을 만들기 위해 사용됨.
  - **Vector:** ArrayList의 구버전이며 모든 메서드가 동기화 되어있어 멀티 쓰레딩 구조에 적합하다. 하지만 잘 사용하지 않는다.

- **Queue**
  - **ArrayDeque:** Dynamic Array를 이용한 Deque로서 ArrayList처럼 저장 용량이 늘어날 수 있는 구조이다.
  - **PriorityQueue:** BIFO(Best In First Out) 구조를 가지고 있으며, 더 작은 작업에 높은 우선순위를 가진다.

- **Map**
  - **HashMap:** Map 인터페이스를 구현하기 위해 해쉬테이블을 사용한 클래스이다. 중복과 순서가 허용되지 않으며 Null값이 올 수 있다.
  - **HashTable:** HashMap보다는 느리지만 동기화가 지원되며 Null이 허용되지 않다.
  - **TreeMap:** 이진검색트리 형태로 키와 값으로 이루어진 데이터를 저장. 정렬 된 순서로 키값과 값을 저장하므로 빠른 검색이 가능하나 순서대로 저장해야하기에 저장하는데에 있어 시간이 다소 걸림.    <br><br>


  ### 참조
  - [Hudson Park](https://medium.com/@logishudson0218/java-collection-framework-896a6496b14a)
  - [공대인들이 직접쓰는 컴퓨터공부방](https://hackersstudy.tistory.com/26)
  - [TCP School](http://tcpschool.com/java/java_collectionFramework_concept)


