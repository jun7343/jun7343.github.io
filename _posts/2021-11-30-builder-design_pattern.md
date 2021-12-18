---
layout: post
title: 빌더 패턴(Builder Pattern)
categories: [Design Pattern]
excerpt: GoF의 생성 패턴중 하나인 빌더 패턴에 대해서 알아본다.
---

GoF의 생성 패턴중 하나인 빌더 패턴에 대해서 알아본다.

---

# 목적

객체를 생성하여 생성자를 통해 필드 데이터를 주입 시켜 객체 내의 필드를 초기화 시키려는 상황이 존재할 수 있다. 예를 들어 MovieTicket이라는 객체를 생성할 때는 영화이름과 예매 번호 등이 반드시 초기화 되어야 한다면 해당 필드를 new 생성자를 통해 주입 받으면 간단히 해결할 수 있다.  
이러한 경우에는 두개의 필드만 받으면 되니 별 문제가 없다 다만 필드가 상당히 많으면 어떨지 생각해 보자. 반드시 초기화 되어야 할 필드들이 많다면 생성자를 생성할때도 parameter가 길어져 가독성이 안 좋아지며, new 생성자를 통해 argument를 주입 받으려 할때도 해당 객체 생성자의 parameter를 정의한 순서대로 기입해야 하며 기입할 데이터가 없어도 null 값을 넣어야 한다.  
얼마나 끔찍한가. 내가 기입한 argument가 순서가 맞게 기입되었는지 매번 확인해야하고 많아진 parameter에 따라 보기 흉한 생성자를 보았을 때는 갑갑하다 생각할 수 있다. 그래서 이러한 불편한 점을 덜어줄 수 있는 것이 Builder Pattern 이다. 단지 이 이유에서 Builder Pattern을 사용하지는 않다.

> 빌더 패턴이란 복합 객체의 생성 과정과 표현 방법을 분리하여 동일한 생성 절차에서 서로 다른 표현 결과를 만들 수 있게 하는 패턴이다.  
> 출처: [빌더패턴 - 위키백과](https://ko.wikipedia.org/wiki/%EB%B9%8C%EB%8D%94_%ED%8C%A8%ED%84%B4)

---

### 빌더 패턴 이점 2가지

- Builder Class의 메서드 체이닝 방식으로 유연한 객체 생성
- Builder Class의 메서드 체이닝 방식으로 가독성 상승

---

# 생성 방법

```java
public class ExampleDomain {
    private final Integer integerA;
    private final Integer integerB;
    private final String stringC;
    private final String stringD;
    private final Integer integerE;
    private final Double doubleF;

    public ExampleDomain(Integer integerA, Integer integerB, String stringC, String stringD, Integer integerE, Double doubleF) {
        this.integerA = integerA;
        this.integerB = integerB;
        this.stringC = stringC;
        this.stringD = stringD;
        this.integerE = integerE;
        this.doubleF = doubleF;
    }

    /*
        Method Chaining을 위해 builder method를 생성하여 Builder 객체를 리턴한다.
     */
    public static ExampleDomainBuilder builder() {
        return new ExampleDomainBuilder();
    }

    public static class ExampleDomainBuilder {
        private Integer integerA;
        private Integer integerB;
        private String stringC;
        private String stringD;
        private Integer integerE;
        private Double doubleF;

        public ExampleDomainBuilder integerA(Integer integerA) {
            this.integerA = integerA;
            return this;
        }

        public ExampleDomainBuilder integerB(Integer integerB) {
            this.integerB = integerB;
            return this;
        }

        public ExampleDomainBuilder stringC(String stringC) {
            this.stringC = stringC;
            return this;
        }

        public ExampleDomainBuilder stringD(String stringD) {
            this.stringD = stringD;
            return this;
        }

        public ExampleDomainBuilder integerE(Integer integerE) {
            this.integerE = integerE;
            return this;
        }

        public ExampleDomainBuilder doubleF(Double doubleF) {
            this.doubleF = doubleF;
            return this;
        }

        public ExampleDomain build() {
            return new ExampleDomain(integerA, integerB, stringC, stringD, integerE, doubleF);
        }
    }

    public Integer getIntegerA() {
        return integerA;
    }

    public Integer getIntegerB() {
        return integerB;
    }

    public String getStringC() {
        return stringC;
    }

    public String getStringD() {
        return stringD;
    }

    public Integer getIntegerE() {
        return integerE;
    }

    public Double getDoubleF() {
        return doubleF;
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        /*
            Builder Pattern을 통한 객체 생성 방법
        */
        ExampleDomain domain = ExampleDomain.builder()
                                    .integerA(10)
                                    .integerB(20)
                                    .stringC("Test")
                                    .DoubleF(2.2)
                                    .build();
    }
}
```

### 소스코드

- [Design Pattern - Builder](https://github.com/jun7343/java-drill/tree/main/src/main/java/io/drill/java/design_pattern/creational/builder)

위와 같이 Builder CLass를 직접 작성하여 Builder Pattern을 사용할 수 있다. 매번 필요한 Domain Object를 위해 Builder Class를 생성하는 것도 큰 노동이다. 이러한 반복 작업을 줄여주기 위해 Lombok을 사용하여 Builder Pattern을 사용할 수 있다.

- [Builder - Lombok](https://projectlombok.org/features/Builder)

롬복의 Builder 어노테이션을 통해 단 한줄로 Builder Class를 생성 할 수 있는 큰 장점이 있기에 Lombok을 애용하는 편이다.

---

# 결론

위와 같은 방법으로 빌더 패턴을 사용하여 객체를 유연하게 생성할 수 있다. Builder Pattern을 사용하려는 객체 내부에 Builder Class를 만들어 똑같은 필드를 작성 후 메서드 체이닝 방식으로 Data를 주입 받아 마지막에 build 메서드를 통해 원래의 객체를 return 함으로써 사용할 수 있다. 메서드 체이닝이 무엇인지 알고 싶다면 [Method Chaining In Java with Examples](https://www.geeksforgeeks.org/method-chaining-in-java-with-examples/) 에서 확인해보고 코드를 확인할 수 있다.  
물론 빌더 패턴을 사용할 떄 반드시 주입 받고자 하는 Parameter가 존재할 것이다. 이 역시 보안할 수 있는 방법이 있다. [Required Builder Pattern](https://github.com/jun7343/java-drill/blob/main/src/main/java/io/drill/java/design_pattern/creational/builder/RequiredExampleDomain.java)  
나는 개인적으로 객체의 불변성을 선호하기에 Setter를 사용하지 않고 Builder Pattern을 이용해 객체 생성과 초기화를 함께 한다. 이렇게 된다면 코드를 읽는 사람에게서 객체 내부의 데이터가 불변하다는 보장을 줄 수 있는 장점이 있다.

---

# 빌더 패턴 학습 영상

<iframe width="560" height="315" src="https://www.youtube.com/embed/SWbW5ZzeARU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>    
<iframe width="560" height="315" src="https://www.youtube.com/embed/lJES5TQTTWE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
