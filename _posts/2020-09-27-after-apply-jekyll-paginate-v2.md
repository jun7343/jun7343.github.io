---
layout: post
title: Jekyll Paginate v2 적용 하기
categories: [Jekyll]
---

### Jekyll Paginate v2 란?

Jekyll Paginate 를 보완한 기능이 더 많은 paginate plugin 이다. 기존 Jekyll에서 제공하는 Jekyll paginate는 단점이 많이 보였다. permalink를 변경하면 안되고, Pagination이 적용 되는곳이 한정되어있다. 메인이랑 블로그에 Pagination을 적용하고 싶었는데 이러한 단점이 있는 기존 paginate는 안되겠다 판단하여 Jekyll 정식 페이지에서 추천하는 paginate plugin v2를 사용하려 한다.  
하지만 Jekyll Paginate v2도 단점은 있다... Github에서는 지원안한다.

<img src="/assets/images/etc/after-apply-jekyll-paginate-v2/jekyll-paginate-v2-notice.png" class="align-center" alt="Jekyll Paginate v2 notice">
<img src="/assets/images/etc/after-apply-jekyll-paginate-v2/jekyll-doc-plugin-notice.png" class="align-center" alt="Jekyll Doc Notice about plugin">    <br>

즉 해당 플러그인을 Gemfile과 \_config.yml에 설정해놔도 Local에서는 정상 적용된것을 확인할 수 있으나 막상 원격에서는 적용이 안된다. 보안상의 이유로 모든 Pages 사이트는 --safe 옵션으로 플러그인(화이트리스트 플러그인 제외)이 비활성된 상태이다. 위 설명 처럼 Github Page에 적용 시키는 방법을 이용하면 적용이 가능하다. 적용방법은 천천히 글을 통해 설명하도록 하겠다. (Gitlab에서는 Github 우회 적용방법 사용하지 않고도 바로 적용 가능하다.)

### 설치 방법

[Jekyll Doc - Kor](https://jekyllrb-ko.github.io/docs/pagination/) Jekyll 정식 문서 한국 번역 페이지다.  
[Jekyll Paginate V2 Doc](https://github.com/sverrirs/jekyll-paginate-v2) 해당 페이지로 이동하면 plugin 설치방법과 관련 문서내용을 읽을 수 있다.  
[Jekyll Paginate V2 Example](https://github.com/sverrirs/jekyll-paginate-v2/tree/master/examples) Example 페이지로 이동하면 각 상황별로 적용하는 방법을 볼 수 있으니 따라 해보자.  
Example 페이지에서 Set Configuration에서 Gemfile과 \_confilg.yml 설정하는 방법이 나오는데 여기서 유의 사항이 있다.

<img src="/assets/images/etc/after-apply-jekyll-paginate-v2/jekyll-paginate-v2-set-configuration.png" class="algin-center" alt="Jekyll Paginate V2 Set Configuration"> <br>

\_config.yml에서 "gems: - jekyll-paginate-v2" 이라 나와있다. gems는 jekyll 3.5 이전 버전의 내용이고 이후 버전은 gems가 아닌 plugins로 사용 하자. Jekyll 버전확인은 터미널에서 Jekyll --version을 통해 확인하자.  
Jekyll Paginate V2를 정상 적용시키려면 이전 Jekyll paginate를 지워야 한다. 설치되어있는지 확인하는 방법은 터미널에서 bundle list 명령어를 통해 확인하자.

<img src="/assets/images/etc/after-apply-jekyll-paginate-v2/cui-bundle-list.png" class="align-center" alt="CUI bundle command"> <br>

"bundle list \| grep jekyll-paginate" 명령어를 통해 jeykll-paginate 가 설치되어 있다면 삭제를 해주자.  
나는 삭제하는데 애먹었다. gem uninstall jeykll-paginate를 통해 지우려 하니 DependecyException 가 발생하는게 아닌가. 분명 Gempfile과 \_config.yml에서 jekyll-plugin을 지웠는데도 뜨다니 의아했다. Google을 통해 확인해보니 전부 clean 후 시도해보라는 얘기를 보고 gem untinall -aIx 명령어를 통해 전부 삭제후 bundle install을 했더니 다시 깔려있다... 아 도대체 뭔가 싶었다. 알고보니 이 문제는 간단했었다. Gemfile에서 **gem "github-pages"** 가 확인되면 주석처리해주자. 해당 명령어를 통해 화이트리스트 플러그인들이 다 깔리는 모양이다. <br>

### Pagination 적용

설치가 완료되었다면 적용해보자. 적용 방법은 [Jekyll Paginate V2 Example](https://github.com/sverrirs/jekyll-paginate-v2/tree/master/examples) 페이지에서 확인 할 수 있다. 명령어 라인을 확인해보고 잘 사용토록 하자. 적용하기 이전에 기존에 post 목록을 출력하는 Liquid명령어 부터 확인해보자. for posts in site.posts 로 되어 있다면 site.posts 대신에 pagination.posts로 바꾸어주면 잘 적용될것이다.

### Github 적용

위에 설명했다 싶이 github에서 적용하려면 다른 방식을 사용해야한다. 이전에는 모든 파일을 master branch에 push했었다면 이제는 \_site 폴더 내용만 push 해야한다.

1. "git chekcout -b source" 명령어를 통해 source branch 생성 후 push
2. github page repository setting에 들어가 default branch를 source branch로 변경
3. "git origin :master" 명령어를 통해 원격 master branch 삭제, local도 마찬가지로 "git branch -D master" 명령어를 통해 삭제
4. "git checkout source" 후 "git remote set-head origin -a" local default branch를 source로 변경
5. "git checkout -b master"로 master 브랜치 생성후 해당 브랜치에서 "git filter-branch --subdirectory-filter \_site/ -f" filter 명령어 적용 (\_site 폴더 내용 filter)
6. "git push --all" 명령어를 통해 master, source 브랜치 전부 push 하면 master 브랜치에서는 \_site 폴더 내용만 있는것을 확인 할 수 있다.

**위 과정을 하기 전에 .gitignore에서 \_site 폴더가 있을 시 지우고 push 해주자**  
github page는 결국 \_site폴더 안에 정적 페이지 파일을 통해 운영되는 것이기에 master branch에 \_site 파일만 push 해주면 된다. 위 해당 과정을 shell script로 작성하여 자동화하도록 하자.

```bash
#!/bin/bash

git checkout source
git branch -D master
git checkout -b master
git filter-branch --subdirectory-filter _site/ -f
git push --all

```

<br>

### 결론

정상 적용을 하였다. 다만 불편한점이 한두가지가 아니다. 우회 적용방법도 그렇고, 우회 적용하다보면 한두번은 사이트가 맛이 갔다. pagination 다음 페이지로 넘어가려하니 404 error가 뜨던가 아니면 애초에 블로그 자체가 404에러가 떠버린다. 그리고 정확한 이유는 모르지만, github에서 지원하는 plugin도 아니고 기본 github plugin을 주석처리해버리니 블로그 페이지에서 CDN 안먹히는 것 같다. javascript를 불러오는데 한참 걸린다. 그래서 메인 slider부분이 말썽을 일으킨다. 고생해서 적용시켜놨더니 결과가 이렇다니 너무 절망적이였다 ㅠㅠ  
나는 결국 적용시키기 이전 commit으로 되돌렸으며, pagination은 javascript를 통해 적용시킬 예정이다. 참 복잡하고 어려운 jekyll이다.
