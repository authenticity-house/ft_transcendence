<div align="center">
   <img width="400" alt="logo" src="https://github.com/authenticity-house/ft_transcendence/blob/main/FE/public/image/logo.svg">
   <h1>🏓 온라인 PONG 게임 서비스</h1>
<p>
  하나의 화면에서 하나의 키보드로 즐길 수 있는 로컬모드, <br> 여러 PC로 진행 가능한 온라인 모드를 통해 PONG 게임을 즐길 수 있어요! <br>
</p>

<br>

<p>
  <a href="https://lowly-crepe-78b.notion.site/c0ef8603079942ef9ce8dd9991bc1a7b?pvs=4">개발일지</a>
  &nbsp; | &nbsp; 
  <a href="https://lowly-crepe-78b.notion.site/c5f34b0c42814439895971d70eacadd2?pvs=4">웹소켓 통신 규약</a>
  &nbsp; | &nbsp; 
  <a href="https://lowly-crepe-78b.notion.site/a87400c0bb26410da5707e56be23d1a5?pvs=4">백로그</a>
  &nbsp; | &nbsp; 
  <a href="https://lowly-crepe-78b.notion.site/ffa74b8d04554b14aef09ea95baa2cc6?pvs=4">데일리 스크럼</a>
</p>
</div>

<br>

## ⚒️  기술 스택 

| 분류 | 기술 |
| ---- | ---- |
| 프론트엔드 | ![JavaScript][js-url] ![Bootstrap][bootstrap-url] ![Three.js][threejs-url] |
| 백엔드 / 게임 | ![Python][python-url] ![Django][django-url] ![PostgreSQL][postgres-url] |
| 배포 | ![Docker][docker-url] ![Nginx][nginx-url] |
| 협업 도구 | ![GitHub][github-url] ![Discord][discord-url] ![Notion][notion-url] |
| 디자인 | ![Figma][figma-url] |

<br>

## 주요 기능
- 기본 로그인, 42 계정 로그인 및 게스트 모드 제공
- 하나의 키보드로 게임을 즐길 수 있는 로컬 모드, 여러 PC로 진행 가능한 온라인 모드 제공
- 온라인 모드 진행 시 대기실 조회, 생성 및 참가 가능
- 게임 플레이 경험을 향상시키는 파워업, 게임 매개변수 조정과 같은 커스텀 설정 가능
- 사용자 대시보드를 통해 내 정보, 친구 검색 및 추가, 통계 확인 가능

<br>


## 👥  팀원 소개 및 역할 분담
|<img src="https://github.com/dbwhdtjr0457.png" width=100>|<img src="https://github.com/irenee-14.png" width="100">|<img src="https://github.com/JeongRon.png" width=100>|<img src="https://github.com/wonyangs.png" width=100>|<img src="https://github.com/mingxoxo.png" width="100">|
|:--:|:--:|:--:|:--:|:--:|
|👾|🧸|🦊|🐱|🐶|
|[joyoo 유종석](https://github.com/dbwhdtjr0457)|[jihylim 임지현](https://github.com/irenee-14)|[jeongrol 이정론](https://github.com/JeongRon)|[wonyang 양원석](https://github.com/wonyangs)|[jeongmin 이정민](https://github.com/mingxoxo)|
|FE / GAME|FE / BE|FE|BE / GAME|BE / GAME|

### 프론트엔드(FE)

| | 역할       | 프론트엔드                   | 백엔드                        | 게임                     |
|----|------------|--------------------------|-----------------------------|-------------------------|
| 👾 | 종석       | <li>사용자 대시보드 모달 UI 및 API 연결 <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(통계 탭 제외, Bootstrap 활용)</li> <li>3D 게임 그래픽 및 애니메이션 구현 <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Three.js 활용)</li> <li>로컬 게임 웹소켓 연결 및 통신</li> <li>게임 계산 로직, 파워업</li> | - | <li>게임 계산 로직</li><li>파워업</li> |
| 🧸 | 지현       | <li>피그마 디자인</li> <li>회원가입/로그인 관련 UI 및 API 연결</li><li>게임 설정 UI 및 API 연결</li> <li>온라인 대기실 웹소켓 연결 및 통신</li> <li>로컬/온라인 게임 웹소켓 연결 및 통신</li> <li>웹소켓 관리 리팩토링</li> | <li>42 OAuth 로그인</li> <li>유저 정보 변경 API 구현</li> | - |
| 🦊 | 정론       | <li>피그마 디자인</li> <li>히스토리 및 로그인 관리</li> <li>그래프 통계 구현 <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(득점추이, 득점위치, 레이팅변화율, 공격성향) </li> <li>UI 및 데이터 반영</li> <ul> <li>플레이/매치 모드</li> <li>1대1 / 토너먼트 매치 경기결과 및 요약</li> <li>토너먼트 대진표 </li> <li>온라인 메인화면 및 대기실 </li> <li>사용자 대시보드 통계 탭 </li> </ul> | - | - |

### 백엔드(BE)

| | 역할       | 배포          |백엔드                        | 게임                     | 
|----|------------|--------------|-----------------------------|-------------------------|
| 🐱 | 원석       | <li>Docker 세팅</li> <li>Nginx 설정</li> | <li>회원가입 시 이메일 인증</li> <li>로그인/로그아웃 API 구현</li> <li>대기실 웹소켓 통신 및 API 구현</li> <li>대기실 웹소켓 규약 정의</li> | <li>웹소켓 통신</li> <li>온라인 1vs1, 토너먼트 설계</li> <li>온라인 웹소켓 규약 정의</li> <li>파워업</li> |
| 🐶 | 정민       | <li>백엔드 라우팅 규칙 작성</li> <li>HTTPS/WSS 적용</li> | <li> DB 설계</li> <li>회원가입, 로그인/로그아웃 API 구현</li> <li> 친구 관련, 게임 기록 및 통계 API 구현</li> <li>레이팅 적용</li> | <li>로컬 1vs1, 토너먼트 설계</li> <li>로컬 웹소켓 규약 정의</li> <li>통계 데이터 수집</li> |

<!-- tech stack logo links -->

[js-url]: https://img.shields.io/badge/JavaScript-%23323330?style=flat-square&logo=JavaScript&logoColor=%23F7DF1E
[bootstrap-url]: https://img.shields.io/badge/Bootstrap-7952B3?style=flat-square&logo=Bootstrap&logoColor=white
[threejs-url]: https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=Three.js&logoColor=white
[python-url]: https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=Python&logoColor=white
[django-url]: https://img.shields.io/badge/Django-092E20?style=flat-square&logo=Django&logoColor=white
[postgres-url]: https://img.shields.io/badge/PostgreSQL-%23316192.svg?style=flat-square&logo=PostgreSQL&logoColor=white
[docker-url]: https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=Docker&logoColor=white
[nginx-url]: https://img.shields.io/badge/Nginx-014532?style=flat-square&logo=Nginx&logoColor=009639&
[github-url]: https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=GitHub&logoColor=white
[discord-url]: https://img.shields.io/badge/Discord-5865F2?style=flat-square&logo=Discord&logoColor=white
[notion-url]: https://img.shields.io/badge/Notion-000000?style=flat-square&logo=Notion
[figma-url]: https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=Figma&logoColor=ffffff
