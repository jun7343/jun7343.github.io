---
layout: post
title: Lombok 잘 사용하는 방법
categories: [JPA, Lombok]
---

기존에 Entity class를 생성하면서 Getter Setter 등 코드를 넣게되면 class 자체 내부에서 소스코드가 길어져서 보기가 안좋게 느껴진다.   
이러한 반복적이고 단순한 코드를 annotation을 통해 자동적으로 소스코드를 넣어주는 Lombok이 있다. Lombok은 컴파일 과정에서 소스코드를 읽고 선언한 annotation에 따라 소스코드를 자동적으로 만들어준다.    
이렇게 편리한 Lombok을 사용할때도 유의할 점이 있다. 이전에는 @Getter, @Setter, @ToString, @EqualsAndHashCode 등의 Annotation이 합친 @Data으로 선언해서 사용했지만 @Data 안에 포함된 @Setter에 의한 객체 무결성 유지조건이 안되는 점이 있어 단순하게 편리하다고 사용하기 보다는 어떻게 사용해야 잘 사용하는지 고려 해야할거 같다.    
이에 대해서 Lombok을 어떻게 하면 잘 사용하는지에 대해서 잘 설명한 블로그 글이 있어 포스트를 업로드 하려 한다. 해당 블로그 글을 통해 학습하고 잘 사용해보도록 하자.    


### 링크

[실무에서 Lombok 사용법 - Yun Blog](https://cheese10yun.github.io/lombok/)