---
layout: post
title: 싱글턴(Singleton)
categories: [Design Pattern]
---

GoF의 생성 패턴에 하나인 싱글턴 패턴에 대해서 알아본다.

---

# 목적

단일 인스턴스를 생성하여 인스턴스를 공유함에 목적이 있는 싱글턴 패턴은 데이터가 공유 되어야 하는 설정 객체나, 빈번히 객체가 생성되어 
메모리 사용이 많을 경우 싱글턴 패턴 사용을 고려하여 사용한다.    
물론 싱글턴 패턴을 사용함으로써 얻는 이점도 있지만, 잘못 사용할 경우 악영향을 끼칠 우려가 있다. 예를 들어, 싱글턴 패턴이 너무 많은 
데이터를 공유하거나, 많은 일을 함으로써 대표적인 객체지향 원칙인 `Open Closed Principle"에 위배 되는 상황이 발생할 수 있다.
> 개방-폐쇄 원칙(OCP, Open-Closed Principle)은 '소프트웨어 개체(클래스, 모듈, 함수 등등)는 확장에 대해 열려 있어야 하고, 수정에 대해서는 닫혀 있어야 한다'는 프로그래밍 원칙이다.    
그리고 멀티 스레드 환경에서 접근하는 데이터에 대해서 동시성 문제에 대해 고려 역시 해야한다.    

### 싱글턴 이점 3가지
- 메모리 절약
- 데이터 공유
- 단일 인스턴스 보장

싱글턴 패턴을 생성하는 방법 대표적인 5가지에 대해서 알아보도록 한다.

---

# 생성 방법

- **Eager Initialization**    
이른 생성 방법으로써 애플리케이션이 로드될 때 초기화 하여 사용하는 방법이다. 로드 되는 시점에 미리 초기화를 함으로써 멀티 스레드 환경에서 발생할 수 있는 인스턴스 중복 생성을 방지할 수 있다는 장점이 있다. 하지만 애플리케이션이 로드되는 시점에 초기화하는 만큼 해당 인스턴스이 무겁거나, 잘 사용하지 않는 인스턴스임에 불구하고도 초기화 함으로써 메모리 낭비라는 비효율적인 결과를 초래할 수 있다.    
~~~ java
public class EagerInitialization {

    private static final EagerInitialization eagerSingleton = new EagerInitialization();

    private EagerInitialization() {}

    /*
        pros - 미리 객체를 초기화하여 Multi-Thread 환경에서 안전하게 사용 가능.
        cons - 동시성 문제는 발생하지 않으나, 만약 해당 객체를 잘 사용하지도 않은데 미리 선언하게 되면 메모리를 점유하기에 비효율적 일수도 있음.
     */
    public static EagerInitialization getInstance() {
        return eagerSingleton;
    }
}
~~~
> [Source Code](https://github.com/jun7343/java-drill/blob/main/src/main/java/io/drill/java/design_pattern/creational/singleton/EagerInitialization.java)    

<br>

- **Lazy Initialization**    
이른 생성의 반대인 게으른 즉 늦은 초기화 방법이다. 해당 초기화를 통해 필요하는 시점에 객체를 생성함으로써 메모리를 효율적으로 사용할 수 있다. 다만 멀티 스레드 환경에서 발생할 수 있는 중복 인스턴스 생성을 고려해야 한다.
~~~java
public class LazyInitialization {

    private static LazyInitialization lazyInitialization;

    private LazyInitialization() {}

    /*
        pros - getInstance 첫 호출 될 때 객체 초기화 되어 객체 반환.
        cons - Multi-Thread 환경에서 동시성 문제 발생할 수 있음.
     */
    public static LazyInitialization getInstance() {
        if (lazyInitialization == null) {
            lazyInitialization = new LazyInitialization();
        }

        return lazyInitialization;
    }
}
~~~
> [Source Code](https://github.com/jun7343/java-drill/blob/main/src/main/java/io/drill/java/design_pattern/creational/singleton/LazyInitialization.java)    

<br>

- **Thread-Safe Lazy Initialization**    
Lazy Initialization의 단점을 보안하기 위해 동기화 블럭(syncronizaed)를 통해 Thread-Safe한 상황을 만들 수 있다. 다만 메서드에 동기화 블럭을 선언함으로써 객체 생성 메서드를 호출시 매번 스레드를 lock, unlock 하기에 성능이 악화되는 단점이 있다.
~~~java
public class ThreadSafeLazyInitialization {

    private static ThreadSafeLazyInitialization threadSafeLazyInitialization;

    private ThreadSafeLazyInitialization() {}

    /*
        pros - 객체를 Thread-Safe 하게 초기화.
        cons - getInstance를 호출 할때마다 스레드 lock, unlock을 처리하기에 내부적으로 많은 비용이 발생하여 성능저하가 따름.
     */
    public static synchronized ThreadSafeLazyInitialization getInstance() {
        if (threadSafeLazyInitialization == null) {
            threadSafeLazyInitialization = new ThreadSafeLazyInitialization();
        }

        return threadSafeLazyInitialization;
    }
}
~~~
> [Source Code](https://github.com/jun7343/java-drill/blob/main/src/main/java/io/drill/java/design_pattern/creational/singleton/ThreadSafeLazyInitialization.java)    

<br>

- **Thread Safe Double Check Locking Initialization**    
메서드에 동기화 블럭을 사용함으로써 발생할 수 있는 성능 악화 부분을 개선할 수 있는 생성 방법이다. 첫번째 if문에서 초기화 여부를 확인하고, 초기화가 안되어있을시 동기화 블럭안에서 객체를 초기화한다. 이때 초기화하기 전에 한번더 if 체크 함으로써, 중복 생성을 방지한다. 초기화된 이후에는 첫번째 if문을 통해 초기화 여부를 패스하기에 동기화 블럭까지 가지 않아 성능에 악영향을 끼칠 우려는 없다.
~~~java
public class ThreadSafeDoubleCheckedLockingLazyInitialization {

    private static volatile ThreadSafeDoubleCheckedLockingLazyInitialization threadSafeDoubleCheckLazyInitialization;

    private ThreadSafeDoubleCheckedLockingLazyInitialization() {}

    /*
        pros - Thread Safe 객체 초기화 가능하며, if double checked 함으로써 getInstance 호출 할 때마다 스레드 lock, unlock에 따른 성능 저하 없음.
        cons - 다소 복잡해(?) 보일 수는 있지만 고려사항 아님.
     */
    public static ThreadSafeDoubleCheckedLockingLazyInitialization getInstance() {
        if (threadSafeDoubleCheckLazyInitialization == null) {
            synchronized (ThreadSafeDoubleCheckedLockingLazyInitialization.class) {
                if (threadSafeDoubleCheckLazyInitialization == null) {
                    threadSafeDoubleCheckLazyInitialization = new ThreadSafeDoubleCheckedLockingLazyInitialization();
                }
            }
        }

        return threadSafeDoubleCheckLazyInitialization;
    }
}
~~~
> [Source Code](https://github.com/jun7343/java-drill/blob/main/src/main/java/io/drill/java/design_pattern/creational/singleton/ThreadSafeDoubleCheckedLockingLazyInitialization.java)    

필드 변수를 확인해 보면 "volatile" 키워드가 궁금하다면 [Java volatile이란?](https://nesoy.github.io/articles/2018-06/Java-volatile)에서 확인할 수 있다.

<br>

- **Initialization On Demand Holder Idiom**    
객체가 생성될 때 Class Loader에 의해 로딩 되어 JVM 메모리에 적재되는 매커니즘을 이용한 생성 방법이다. 이 역시 Thread-Safe 하다.
~~~java
public class InitializationOnDemandHolderIdiom {

    private InitializationOnDemandHolderIdiom() {}

    private static class SingletonHolder {
        public static final InitializationOnDemandHolderIdiom initializationOnDemandHolderIdiom = new InitializationOnDemandHolderIdiom();
    }

    /*
        pros - JVM Class Loader 매커니즘과 Class Load 되는 시점을 이용한 방법으로써 Lazy Initialization 할 수 있으며, Thread-Safe 하다.
        cons - ?
     */
    public static InitializationOnDemandHolderIdiom getInstance() {
        return SingletonHolder.initializationOnDemandHolderIdiom;
    }
}
~~~
> [Source Code](https://github.com/jun7343/java-drill/blob/main/src/main/java/io/drill/java/design_pattern/creational/singleton/InitializationOnDemandHolderIdiom.java)    

<br>

---
# 결론

이렇게 싱글턴 사용 이유와 생성방법을 확인했다. 싱글턴 패턴을 상황과 관리를 잘해야만 이점을 얻고 아닐때는 안티 패턴이 될 수 있기에 섣불리 선택할 수 있는 패턴은 아니라고 생각 된다. Spring을 사용해본 사람은 [IOC](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html)를 알것이다. IOC는 제어의 역전으로 Spring Framework에서 객체 생성과 의존성을 이어주는 역할을 한다.
여기서 IOC가 싱글턴 패턴 방식을 사용한다.    
좀 더 자세한 내용을 알고 싶다면 백기선님의 유튜브 영상을 통해 학습할 수 있으니 확인해 보자.    

<iframe width="560" height="315" src="https://www.youtube.com/embed/OwOEGhAo3pI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>   
<iframe width="560" height="315" src="https://www.youtube.com/embed/bHRETd1rFfc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>    
<iframe width="560" height="315" src="https://www.youtube.com/embed/bAYGNP-FevQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>