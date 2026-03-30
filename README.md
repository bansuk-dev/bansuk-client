# 감사 카드 프로젝트

Next.js와 Supabase를 사용한 감사 카드 애플리케이션입니다.

## 기술 스택

- **프레임워크**: Next.js 15.5.4 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS 4
- **UI 컴포넌트**: Radix UI
- **백엔드/데이터베이스**: Supabase
- **배포**: Vercel

## 시작하기

### 사전 준비사항

- Node.js 18.x 이상
- npm
- Docker Desktop
- Supabase CLI

권장: Supabase CLI 최신 버전 사용. 현재 저장소에서 확인된 `2.3.0`은 너무 오래되어 로컬 스택 기동이 불안정할 수 있습니다.

### 로컬 개발 환경 준비

1. 의존성 설치

```bash
npm install
```

2. 환경 변수 파일 생성

```bash
cp .env.example .env.local
```

3. 로컬 Supabase 실행

```bash
npm run supabase:start
```

4. 로컬 키 확인 후 `.env.local` 업데이트

```bash
supabase status
```

- `NEXT_PUBLIC_SUPABASE_URL`은 기본적으로 `http://127.0.0.1:54321`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`는 `supabase status` 출력값 사용

5. 마이그레이션 적용 및 초기화

```bash
npm run db:reset
```

6. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## Supabase 워크플로우

### 소스 오브 트루스

- 데이터베이스와 스토리지 변경은 `supabase/migrations`가 기준입니다.
- 운영 DB에서 직접 SQL을 실행해 상태를 맞추지 않습니다.

### 새 마이그레이션 만들기

```bash
supabase migration new add_some_change
```

생성된 파일에 SQL을 작성한 뒤 아래 순서로 검증합니다.

```bash
npm run db:reset
```

검증이 끝나면 PR을 생성하고, GitHub Actions가 빈 로컬 DB 기준으로 전체 migration 재적용을 확인합니다.

### 로컬 개발에서 자주 쓰는 명령어

```bash
# 로컬 Supabase 시작
npm run supabase:start

# 로컬 Supabase 중지
npm run supabase:stop

# 마이그레이션 전체 재적용
npm run db:reset
```

## 새 Supabase 프로젝트로 전환할 때

1. Supabase에서 새 프로젝트를 생성합니다.
2. Project Settings에서 아래 값을 확인합니다.
   - Project URL
   - anon key
   - service_role key
   - database password
3. Vercel 환경 변수에 운영 값을 설정합니다.
4. GitHub Actions secrets에 운영 반영용 값을 설정합니다.
5. `main`에 반영된 migration이 운영 프로젝트에 적용되도록 유지합니다.

필수 환경 변수:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ACCESS_TOKEN=
SUPABASE_PROJECT_ID=
SUPABASE_DB_PASSWORD=
```

## 프로젝트 구조

```text
├── app/                      # Next.js App Router 페이지
├── components/               # React 컴포넌트
├── lib/                      # 유틸리티 및 설정
├── supabase/                 # Supabase CLI 설정, migrations, seed
└── .github/workflows/        # DB 검증 및 운영 반영 자동화
```

## 주요 기능

- 감사 카드 작성 및 공유
- 이미지 업로드
- 반응형 카드 월 디스플레이
- 카드 상세 보기
- Supabase Realtime 기반 실시간 반영

## 배포

운영 배포와 DB 반영 절차는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.

## 참고 자료

- [Next.js 문서](https://nextjs.org/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Vercel 배포 가이드](./DEPLOYMENT.md)
