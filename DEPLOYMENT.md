# 배포 및 운영 반영 가이드

## 개요

이 프로젝트는 앱 배포와 DB 반영을 분리합니다.

- **앱 배포**: Vercel
- **DB 반영**: GitHub Actions + Supabase CLI

운영 데이터베이스 변경은 반드시 `supabase/migrations`를 통해서만 반영합니다.

로컬 개발과 CI 모두 최신 Supabase CLI 사용을 권장합니다. 오래된 CLI는 최신 이미지와 조합될 때 `supabase start` 또는 `supabase db reset`이 비정상적으로 오래 걸릴 수 있습니다.

## 1. 새 Supabase 프로젝트 준비

1. Supabase에서 새 프로젝트를 생성합니다.
2. 아래 값을 안전한 곳에 보관합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_PROJECT_ID
SUPABASE_DB_PASSWORD
```

3. Supabase Personal Access Token을 생성합니다.

```bash
SUPABASE_ACCESS_TOKEN
```

## 2. Vercel 환경 변수 설정

Vercel Project Settings > Environment Variables에 아래 값을 등록합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

현재 앱은 public storage URL을 사용하므로, 운영 프로젝트에서도 `photos` 버킷은 public 정책을 유지해야 합니다.

## 3. GitHub Actions Secrets 설정

GitHub 저장소 Settings > Secrets and variables > Actions에 아래 secrets를 추가합니다.

```bash
SUPABASE_ACCESS_TOKEN=your_supabase_access_token
SUPABASE_PROJECT_ID=your_supabase_project_id
SUPABASE_DB_PASSWORD=your_database_password
```

이 값이 모두 있을 때만 `main` 브랜치 push 시 운영 migration 반영 job이 실행됩니다.

## 4. 운영 반영 흐름

### PR 단계

PR에서 `supabase/**` 변경이 있으면 아래 검증이 실행됩니다.

1. `supabase start`
2. `supabase db reset`
3. 전체 migration이 빈 로컬 DB에서 재적용 가능한지 확인

### main 반영 단계

`main`에 merge되고 필요한 secrets가 설정되어 있으면 아래 순서로 운영 반영이 실행됩니다.

1. Supabase CLI 인증
2. 대상 프로젝트 link
3. `supabase db push --include-all`

운영 DB 반영 실패 시 앱 배포와 분리되어 영향 범위를 줄일 수 있습니다.

## 5. 변경 작업 표준 절차

### 새로운 DB 변경 만들기

```bash
supabase migration new your_change_name
```

### 로컬 검증

```bash
npm run supabase:start
npm run db:reset
```

### 앱 동작 확인

- 카드 목록 조회
- 카드 단건 조회
- 카드 생성
- 이미지 업로드
- 업로드 이미지 렌더링
- Realtime insert 반영

## 6. 초기 운영 셋업 체크리스트

- 새 Supabase 프로젝트 생성 완료
- Vercel 환경 변수 등록 완료
- GitHub Actions secrets 등록 완료
- `main` 기준 migration 반영 완료
- `thanks_cards` 테이블 생성 확인
- `photos` 버킷 및 정책 생성 확인

## 7. 트러블슈팅

### 로컬 Supabase가 실행되지 않을 때

- Docker Desktop이 실행 중인지 확인합니다.
- `supabase --version`으로 CLI 설치를 확인합니다.

### `db reset`이 실패할 때

- migration SQL 문법 오류를 먼저 확인합니다.
- 새 migration 추가 후 이전 migration을 수정하지 않았는지 확인합니다.

### 운영 반영 job이 실행되지 않을 때

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_ID`
- `SUPABASE_DB_PASSWORD`

위 3개 secrets가 모두 등록되어 있는지 확인합니다.

## 참고 링크

- [Vercel 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Supabase 문서](https://supabase.com/docs)
