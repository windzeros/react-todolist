# TodoList 프로젝트 PRD

## 1. 프로젝트 개요
TodoList 앱은 사용자가 할 일을 추가, 수정, 삭제하고, 이를 구글 캘린더와 연동하여 일정 관리가 가능한 앱입니다. 사용자는 개인화된 환경에서 할 일을 관리할 수 있으며, 로그인 기능은 추후 Supabase를 통해 구현됩니다. 본 앱은 직관적이고 단순한 UI를 제공하여 사용자가 쉽게 할 일을 관리할 수 있도록 도와줍니다.

## 2. 유저 플로우
### 2.1 회원가입 / 로그인 (MVP 이후 구현)
- Supabase Auth를 통한 구글 로그인
- 이메일 회원가입 및 로그인
- 소셜 로그인 (구글)

### 2.2 Todolist 생성 및 관리
- 할 일 추가, 수정, 삭제 기능
- 날짜 설정
- 우선순위 설정
- 완료 상태 관리

### 2.3 구글 캘린더 연동
- 구글 OAuth 인증
- 캘린더 이벤트 자동 동기화
- 할 일 일정 표시

## 3. 핵심 기능
### 3.1 Todolist CRUD
- 할 일 생성
- 할 일 조회
- 할 일 수정
- 할 일 삭제
- 날짜 및 우선순위 설정

### 3.2 구글 캘린더 연동
- 구글 캘린더 API 연동
- 할 일 자동 동기화
- 일정 표시 및 관리

### 3.3 우선순위 및 필터링
- 우선순위 레벨 설정 (High, Medium, Low)
- 날짜별 필터링
- 우선순위별 필터링
- 완료 상태별 필터링

## 4. 기술 스택
### 4.1 Frontend
- Next.js 13+ (App Router)
- ShadCN UI
- TailwindCSS
- TypeScript

### 4.2 Backend
- Supabase
  - Authentication
  - Database
  - Realtime

### 4.3 Integration
- Google Calendar API
- Google OAuth 2.0

## 5. MVP 이후 개선사항
### 5.1 인증
- Supabase Auth 구현
- 소셜 로그인 확대

### 5.2 협업 기능
- 팀 생성 및 관리
- 할 일 공유
- 실시간 협업

### 5.3 알림
- Push Notification
- 이메일 알림
- 일정 리마인더

### 5.4 UI/UX
- 반응형 디자인 개선
- 다크모드 지원
- 애니메이션 효과

### 5.5 분석
- 할 일 완료율 통계
- 진행 상태 대시보드
- 생산성 분석 리포트

## 6. 작업 체크리스트

### 6.1 초기 설정
- [x] 프로젝트 초기화 (Next.js + TypeScript)
- [x] TailwindCSS 설정
- [x] ShadCN UI 설정
- [x] 기본 프로젝트 구조 설정

### 6.2 Todolist CRUD 구현
- [x] 데이터 모델 설계
- [x] Todo 생성 기능
- [x] Todo 조회 기능
- [x] Todo 수정 기능
- [x] Todo 삭제 기능
- [x] 날짜 설정 기능
- [x] 우선순위 설정 기능

### 6.3 UI 구현
- [x] 레이아웃 구현
- [x] Todo 입력 폼 구현
- [x] Todo 리스트 뷰 구현
- [x] 필터링 UI 구현
- [x] 반응형 디자인 적용

### 6.4 구글 캘린더 연동
- [ ] Google OAuth 설정
- [ ] Google Calendar API 연동
- [ ] 캘린더 이벤트 동기화 구현

### 6.5 배포 및 테스트
- [ ] 단위 테스트 작성
- [ ] E2E 테스트 작성
- [ ] 배포 환경 설정
- [ ] 첫 배포 진행
