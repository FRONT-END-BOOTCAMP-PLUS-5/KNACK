# KNACK 소개

이커머스 하나 잘만들어보면 모든 웹사이트를 다 만들수 있을거 같아서 시작한 KREAM을 클론 코딩하고
이미지를 이용한 AI 검색을 추가로 붙인 프로젝트

## 배포 주소

[KNACK 보러가기](https://knack.co.kr)

## 개발기간

1차 완료 시점 : 25.07.29 (화) ~ 25.08.27 (수)

## 맡은 역할

- 장도영 ([github: young0162](https://github.com/young0162))
  - 전체적인 코드 컨벤션 및 셋팅 (git action, PR template)
  - Prisma 를 이용한 테이블 관리
  - 메인 (루트 페이지 /)
  - 상품 상세 (/products/id)
  - 장바구니 (/cart)
  - 관심 상품 (/saved)
  - 마이페이지 주소록, 프로필 (/my/address, /my/profile, /my/profile-edit)
  - 제미나이 AI를 이용한 이미지 상품 검색 (/ai-search)
  - 서버 셋팅 및 배포
  - 테이블 설계 주도
- 박소연([github: sott120](https://github.com/sott120))
  - 상품 리스트 (/search)
  - 햄버거 버튼 카테고리, 브랜드 모달
  - 상품 필터 모달
  - 리스트 페이지 무한 스크롤
  - 바텀 시트
  - 로고, favicon, metadata
- 손우헌([github: sonwoohon](https://github.com/sonwoohon))
  - [이메일, 카카오톡, 구글] 로그인, 회원가입 및 탈퇴 (next-auth를 사용)
  - 레이아웃, 헤더(페이지별 헤더), 바텀 네비게이션
  - 리뷰 관련 기능 (작성, 리스트, 상세페이지 리뷰 보기 /my/review)
  - 포인트 얻기 위한 이벤트 (/event)
- 윤다영([github: lemontaffy ](https://github.com/lemontaffy))
  - S3, CDN 이미지 연결 및 셋팅
  - 토스 페이먼츠 테스트 결제 연동
  - 결제 페이지 (/payments/checkout, payments/success, payments/failure)
  - 결제 내역, 상세 (/my/buying, /my/buying/id)
  - 주소 관련 API
- 공통 개발 사항
  - 테이블 구조 설계
