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
- npm 또는 yarn
- Supabase 프로젝트

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

개발 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 프로젝트 구조

```
├── app/                      # Next.js App Router 페이지
│   ├── thanks-card/         # 감사 카드 관련 페이지
│   │   ├── [id]/           # 상세 페이지
│   │   └── new/            # 새 카드 작성 페이지
│   └── page.tsx            # 메인 페이지
├── components/              # React 컴포넌트
│   ├── ui/                 # UI 기본 컴포넌트
│   └── thanks-card-*.tsx   # 감사 카드 컴포넌트
├── lib/                     # 유틸리티 및 설정
│   ├── supabase/           # Supabase 클라이언트
│   └── types/              # TypeScript 타입 정의
└── scripts/                 # 데이터베이스 스크립트
```

## 데이터베이스 설정

Supabase 프로젝트에서 다음 SQL 스크립트를 실행하세요:

1. `scripts/001-create-thanks-cards-table.sql` - 테이블 생성
2. `scripts/002-create-storage-bucket.sql` - 스토리지 버킷 생성

## Vercel 배포

자세한 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.

### 빠른 배포

1. Vercel에 GitHub 저장소 연결
2. 환경 변수 설정 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
3. 배포 버튼 클릭

## 주요 기능

- 감사 카드 작성 및 공유
- 이미지 업로드
- 반응형 카드 월 (wall) 디스플레이
- 카드 상세 보기

## 참고 자료

- [Next.js 문서](https://nextjs.org/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Vercel 배포 가이드](./DEPLOYMENT.md)
