# Vercel 배포 가이드

## 사전 준비사항

1. Vercel 계정 생성 (https://vercel.com)
2. Supabase 프로젝트 설정 완료

## 배포 단계

### 1. Vercel CLI 설치 (선택사항)

```bash
npm i -g vercel
```

### 2. Vercel에 프로젝트 연결

#### 방법 1: Vercel 웹사이트 사용

1. Vercel 대시보드 접속 (https://vercel.com/dashboard)
2. "New Project" 버튼 클릭
3. GitHub/GitLab/Bitbucket 저장소 연결
4. 프로젝트 저장소 선택
5. 프레임워크 프리셋이 자동으로 "Next.js"로 감지되는지 확인

#### 방법 2: Vercel CLI 사용

```bash
vercel
```

### 3. 환경 변수 설정

Vercel 프로젝트 설정에서 다음 환경 변수를 추가해야 합니다:

#### Vercel 대시보드에서 설정:

1. Project Settings > Environment Variables로 이동
2. 다음 변수들을 추가:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### CLI로 설정:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 4. 빌드 및 배포 설정

프로젝트 설정에서 다음을 확인:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (자동 설정됨)
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### 5. 배포

#### 자동 배포 (권장)

- main/master 브랜치에 푸시하면 자동으로 프로덕션 배포
- 다른 브랜치에 푸시하면 프리뷰 배포 생성

#### 수동 배포

```bash
vercel --prod
```

## 배포 후 확인사항

1. **Supabase Storage 정책 확인**

   - Storage 버킷의 공개 정책이 올바르게 설정되어 있는지 확인
   - RLS (Row Level Security) 정책이 올바르게 적용되어 있는지 확인

2. **이미지 로딩 확인**

   - Supabase Storage의 이미지가 올바르게 표시되는지 확인
   - next.config.ts의 remotePatterns 설정이 올바른지 확인

3. **도메인 설정 (선택사항)**
   - Project Settings > Domains에서 커스텀 도메인 추가 가능

## 주요 설정 파일

- `vercel.json`: Vercel 배포 설정
- `.vercelignore`: 배포 시 제외할 파일
- `.env.example`: 환경 변수 예시 파일
- `next.config.ts`: Next.js 설정 (이미지 도메인 등)

## 트러블슈팅

### 빌드 실패

1. 로컬에서 `npm run build` 실행하여 빌드 오류 확인
2. TypeScript 오류가 있는지 확인
3. 모든 환경 변수가 설정되어 있는지 확인

### 환경 변수 미적용

1. Vercel 대시보드에서 환경 변수 다시 확인
2. 배포를 다시 트리거 (Redeploy)

### 이미지 로딩 실패

1. Supabase Storage URL이 올바른지 확인
2. next.config.ts의 remotePatterns 설정 확인
3. Supabase Storage 버킷이 public으로 설정되어 있는지 확인

## 유용한 명령어

```bash
# 프로덕션 배포
vercel --prod

# 프리뷰 배포
vercel

# 환경 변수 목록 보기
vercel env ls

# 배포 로그 확인
vercel logs [deployment-url]

# 프로젝트 정보
vercel inspect
```

## 참고 링크

- [Vercel 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Supabase 문서](https://supabase.com/docs)
