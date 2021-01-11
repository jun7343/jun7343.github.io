---
layout: post
title: "자바 Generic은 무엇이며 어떻게 사용하는가"
comments: true
tags: 
  - Java
---

### Generic 이란?

Java를 주 언어로 사용하는 개발자들은 당연히 Generic을 사용해보거나 본적은 있을 것 이다. 다만 Generic이 언제 도입 되었으며 어떻게 사용하는지, 또 Generic을 사용함으로써 얻는 이점이 무엇인지 설명하라 하면 잘 설명할 자신이 없다. 그래서 개념을 잡기 위해 Generic을 학습하도록 하겠다.   
Generic은 JDK 1.5 부터 도입 되었으며, 이전에는 반한값으로 Object를 사용했으나 Object 형식으로 사용시 원하는 타입으로 다시 캐스팅해야 하기에 이 과정에서 오류가 발생할 수 있었다. Generic을 알아보기 위해 먼저 Java Collection을 통해 알아보자.

~~~ java
List<Integer> list = new List<Integer>();
~~~    

위와 같이 list라는 List Collection 안에 Integer라는 타입이 명시 되어 있다. 즉 list라는 Collection은 Integer라는 타입을 내부적으로 쓰겠다는 것을 객체 생성시 선언해 주는 것이다.    
이렇게 Generic을 사용함으로써 Generic을 사용하는 Class는 내부적으로 여러 타입에 대한 처리를 유연하게 처리할 수 있어 코드의 재사용성이 용이해지며 유지보수가 편하다는 장점이 있다. 이외에도 강제 타입 변환(캐스팅) 을 제거해주며, 컴파일시 타입 오류를 엄격하게 체크하여 잘못된 타입이 사용되는 문제점을 제거할 수 있다.    


### Generic 사용법

~~~ java
class Box<T> {
    private T t;

    public T getT() {
        return t;
    }

    public void setT(T t) {
        this.t = t;
    }
}

class BoxUtils {
    public static <T> Box<T> boxing(T t) {
        Box<T> box = new Box<>();
        box.setType(t);

        return box;
    }
}
~~~

위와 같이 Generic 선언한 예시를 볼 수 있다. Box에서는 Class 내부에서 사용될 Generic type을 볼 수 있으며, BoxUtils는 메서드 내에서 사용될 Generic type이 있다. Box class의 Generic 예시는 이해할거라 생각된다. 다만 BoxUtils class에서 사용되는 메서드 Generic은 리턴타입 왼쪽에 <T>를 선언한다. 

**public <타입 파라미터 ...> 리턴타입 메소드명 (매개변수, ...) {...}**

이렇게 Generic method는 매개 타입과 리턴 타입으로 타입 파라미터를 갖는 메소드를 얘기한다. 즉 타입 파라미터를 구체적으로 명시하기 위해 리턴타입에 <T> 괄호를 써서 구체적으로 명시하여 사용하나 기입하지 않아도 컴파일러가 매개변수 타입을 보고 구체적인 타입을 추정하도록 할 수 있다.    

Generic을 사용하면서 타입을 명시할때 꼭 T만 있는것이 아니라 여러 타입 파라미터가 존재 한다. 자주 사용하는 타입 인자에 대해서 알아보자.    
<table class="table">
  <thead>
    <tr>
      <th>타입 인자</th>
      <th>설명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>&lt;T&gt;</td>
      <td>Type</td>
    </tr>
    <tr>
      <td>&lt;E&gt;</td>
      <td>Element</td>
    </tr>
    <tr>
      <td>&lt;K&gt;</td>
      <td>Key</td>
    </tr>
    <tr>
      <td>&lt;N&gt;</td>
      <td>Number</td>
    </tr>
    <tr>
      <td>&lt;V&gt;</td>
      <td>Value</td>
    </tr>
    <tr>
      <td>&lt;R&gt;</td>
      <td>Result</td>
    </tr>
  </tbody>
</table>
<br>
위와 같이 자주 사용되는 타입 인자를 사용하여 Generic parameter를 정의 할 수 있다. 이외에도 Generic wildcard 라는 것이 있다. wildcard란 Generic parameter가 **&lt;?&gt;** 처럼 키워드가 "?" 인것을 얘기 하며 대표적으로 세가지 형태의 사용법이 있다.    
<br>
1. &lt;?&gt; : 모든 클래스나 모든 인터페이스타입이 올 수 있다.    
2. &lt;? extend 상위 타입 &gt; : wildcard 범위를 특정 객체의 하위 클래스만 올 수 있다.    
3. &lt;? super 하위 타입 &gt; : wildcard 범위를 특정 객체의 상위 클래스만 올 수 있다.    

이렇게 Generic wildcard까지 사용방법까지 알아 봤다. 타입 인자를 두개를 줌으로서 더블 인자로 Generic을 사용할 수 도 있으며 이외에도 Generic을 잘 사용할 수 있는 방법이 많다. 하지만 여기까지 기본 개념만 이해해도 다른 Generic 사용법을 만나도 이해하는데에 있어 큰 무리가 되지 않을거라 예상 되며 Generic에 대한 포스팅은 여기까지 마치도록 하겠다.    

### 참조
- [[Java] 제네릭(Generic) 사용법 & 예제 총정리 - 코딩팩토리](https://coding-factory.tistory.com/573)
- [제네릭의 개념 - TCP School ](http://www.tcpschool.com/java/java_generic_concept)
