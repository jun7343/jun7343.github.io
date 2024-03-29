---
layout: post
title: Devflix 프로젝트 후기
categories: [Projects]
excerpt: 나의 Devflix 프로젝트 완성 후기.
---

### Devflix

<a href="https://devflix.kr" target="_blank"><img src="/assets/images/projects/devflix-postscripts/devflix-home.png" alt="devflix"></a><br>

### Devflix 개요

- 프로젝트 제목: Devflix
- 프로젝트 기간: 2021.03.15 ~ 2021.04.20
- 프로젝트 인원: 1인
- 사이트: [https://devflix.kr](https://devflix.kr)
- github: [https://github.com/jun7343/devflix](https://github.com/jun7343/devflix)
- 프로젝트 목적:
  - 다양한 개발 블로그 게시글 수집
  - 개발 관련 유튜브 영상 수집
  - 수집 된 게시글을 바틍으로 질문을 Devflix 게시판에 공유
  - Netflix의 다양한 장르의 영상을 한 곳에서 볼 수 있는 것에 착안하여 Devflix라 명칭
- 프로젝트 기술 및 환경
  - Spring Boot, Handlebar, Ubuntu, Nginx, PostgreSQL, Intellij, JPA, QueryDSL, Junit5, JavaMail, Prometheus, Grafana
    <br>

### 프로젝트 설계

<img src="/assets/images/projects/devflix-postscripts/devflix-architecture.png"><br>

### 프로젝트 후기

첫 개인 프로젝트를 끝내고 후기를 쓰기까지 참 오래 걸렸다. 이유는 뭐...게을러서....  
이전에 들은 얘기로는 코드는 처음 작성할 때는 나와 신만이 아신다 하셨다. 일주일만 지나면 신만이 아신다는 얘기가 있다. 지금 내 상황이 그렇다. 이전에 작성한 내 코드를 다시 보니 "아니 이게 무슨 코드를 이따구로 써?" 라고 생각하지만 다~ 내가 작성한거다. 첫번째로 레이어 아키텍쳐에 따른 관심사 분리가 일도 안되어있다. 컨트롤러에서 유효성 검사하고, 페이징 처리하고 ... 정말 왜 이랬는지 모르겠다.  
여튼 첫 프로젝트를 끝내면서 여러가지의 기술 개념과 코드 습관을 다시 새겨야 된다는 생각을 가지게 되었다. 그리고 처음으로 QueryDSL도 사용해보고 어줍잖은 개념으로 Docker와 Prometheus + Grafana 모니터링 시스템까지 도입해 보는 재밌는 경험이였다. 사실 정말 더 하고 싶은건 많았다. 근데 하면 할수록 드는 생각이 기술적인 깊이가 늘기보다는 그냥 같은 기술에 기능만 많아지는? 프로젝트가 되는것 같았다. 즉 수직이 아니라 수평 확정 프로젝트가 되는거 같아 이 정도 선에서 프로젝트를 멈췄다.  
JPA n + 1문제와 페이징을 위해 limit, offset을 사용할 때 발생하는 성능 이슈 그리고 메모리 leak 문제 (이 문제는 크롤링 돌리면서 발견하게 되었는데, 코드 개선을 통해 메모리 leak 문제를 개선? 하였지만 도통 잘 해결 되었는지 찜찜한 부분이다. 이건 정말 나로서 아쉽다.) 등등 여러 문제를 겪고 해결 해보았다.  
그리고 처음으로 도메인을 구매하여 실 서비스를 운영까지 해봤으니 만족하다. 다만 서버가 AWS 프리티어 이다 보니까 과부하가 좀만 발생해도 불안불안하다.  
또 프로젝트를 다 마치고 느낀점은 과도하게 프로젝트를 진행하려 하지 말자이다. 처음에는 이것도 구현하고 저것도 구현하고 다 해봐야지~ 라는 오기와 열정이 가득했지만 이삼주가 지나니까 재미는 반감되며 오기는 더 생기는 신기한 마음가짐을 갖게 된다. 즉 프로젝트 구현량이 많아져 기간이 길어질 수록 흥미도는 갈수록 반감된다. 그니까 어느한 기술을 익히기 위해 프로젝트를 진행하려고 한다면 단일 페이지에서 구현되는 모습을 보여주고 코드 품질과 기술 이해에 더 집중하는 것을 목표로 해야할 것 같다.
