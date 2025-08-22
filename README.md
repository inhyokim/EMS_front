# EMS Frontend

Next.js 14 기반 에너지 관리 시스템 프론트엔드

## 📋 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Fetch API
- **Package Manager**: npm

## 🏗️ 프로젝트 구조

```
frontend/
├── app/                             # Next.js App Router
│   ├── layout.tsx                   # 루트 레이아웃
│   ├── page.tsx                     # 대시보드 페이지
│   ├── devices/
│   │   └── page.tsx                 # 장치 목록 페이지
│   └── globals.css                  # 글로벌 스타일
├── components/                      # 재사용 컴포넌트
│   ├── Header.tsx                   # 헤더 컴포넌트
│   ├── Footer.tsx                   # 푸터 컴포넌트
│   └── DeviceTable.tsx              # 장치 테이블 컴포넌트
├── lib/                             # 유틸리티 및 설정
│   ├── types.ts                     # TypeScript 타입 정의
│   └── apiClient.ts                 # API 클라이언트
├── public/                          # 정적 파일
├── .env.local                       # 환경 변수
├── package.json                     # 의존성 관리
├── tailwind.config.ts               # Tailwind 설정
├── tsconfig.json                    # TypeScript 설정
├── next.config.mjs                  # Next.js 설정
├── postcss.config.mjs               # PostCSS 설정
├── .eslintrc.json                   # ESLint 설정
├── .gitignore                       # Git 무시 파일
└── README.md                        # 프로젝트 문서
```

## 🚀 시작하기

### 1. 사전 요구사항

- Node.js 18+
- npm 9+

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일 생성:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 4. 개발 서버 실행

```bash
npm run dev
```

### 5. 접속 정보

- **Frontend**: http://localhost:3000
- **Dashboard**: http://localhost:3000/
- **Devices**: http://localhost:3000/devices

## 📱 페이지 구성

### Dashboard (/)
- 에너지 사용량 통계 카드
- 최근 활동 타임라인
- 빠른 액션 버튼
- 시스템 상태 모니터링

### Devices (/devices)
- 장치 목록 테이블
- 실시간 상태 표시
- 장치별 통계 정보
- 필터링 및 검색 기능

## 🧩 컴포넌트 가이드

### Header
- Sticky 상단 헤더
- 네비게이션 메뉴
- 로고 및 브랜딩
- 시스템 상태 표시

### Footer
- 저작권 정보
- 링크 메뉴
- 미니멀 디자인

### DeviceTable
- 클라이언트 사이드 렌더링
- API 데이터 페칭
- 로딩 및 에러 상태 처리
- 반응형 테이블 디자인

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: Blue (#0ea5e9)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)
- **Gray Scale**: 50-900

### 타이포그래피
- **Font Family**: -apple-system, SF Pro Display
- **Sizes**: text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl

### 간격 시스템
- **Spacing**: 0.25rem 단위 (4px)
- **Container**: max-width 1280px
- **Padding**: px-4 (모바일), px-6 (태블릿), px-8 (데스크톱)

### 컴포넌트 클래스
```css
/* 버튼 */
.btn-primary, .btn-secondary, .btn-danger

/* 카드 */
.card, .card-hover

/* 입력 필드 */
.input, .input-error

/* 배지 */
.badge-success, .badge-warning, .badge-error, .badge-info

/* 테이블 */
.table (th, td 스타일 포함)
```

## 📡 API 통신

### API Client (`lib/apiClient.ts`)
- 타입 안전한 HTTP 클라이언트
- 에러 처리 및 응답 변환
- 환경별 베이스 URL 설정

### 주요 API 메서드
```typescript
// Device API
apiClient.devices.getAll()
apiClient.devices.getById(id)
apiClient.devices.create(device)

// Energy Reading API  
apiClient.readings.getByDateRange(params)
apiClient.readings.create(reading)
```

### 타입 정의 (`lib/types.ts`)
- `Device`: 장치 정보
- `EnergyReading`: 에너지 사용량
- `ApiResponse<T>`: 공통 API 응답 형식

## 🛠️ 개발 도구

### 빌드 및 배포
```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버
npm run start

# 타입 체크
npm run type-check

# 린트 검사
npm run lint
```

### 코드 품질
- **ESLint**: 코드 스타일 및 오류 검사
- **TypeScript**: 정적 타입 검사
- **Prettier**: 코드 포맷팅 (설정 가능)

## 📱 반응형 디자인

### 브레이크포인트
- **sm**: 640px+ (모바일)
- **md**: 768px+ (태블릿)
- **lg**: 1024px+ (데스크톱)
- **xl**: 1280px+ (대형 데스크톱)

### 모바일 우선 설계
- 모든 컴포넌트는 모바일부터 설계
- 터치 친화적인 인터페이스
- 가독성 중심의 타이포그래피

## 🔧 커스터마이징

### Tailwind 확장
`tailwind.config.ts`에서 커스텀 스타일 추가:
- 컬러 팔레트 확장
- 폰트 family 설정
- 커스텀 애니메이션
- 그림자 및 여백 시스템

### 컴포넌트 추가
1. `components/` 폴더에 새 컴포넌트 생성
2. TypeScript 타입 정의
3. Tailwind 클래스 활용
4. 재사용 가능한 구조로 설계

## 🚀 성능 최적화

### Next.js 기능 활용
- **App Router**: 최신 라우팅 시스템
- **Server Components**: 서버 사이드 렌더링
- **Image Optimization**: 자동 이미지 최적화
- **Bundle Optimization**: 자동 코드 분할

### 클라이언트 최적화
- 컴포넌트 지연 로딩
- API 응답 캐싱
- 이미지 최적화
- 불필요한 리렌더링 방지

## 🔒 보안

- 환경 변수를 통한 설정 관리
- CSRF 보호 (Next.js 기본 제공)
- XSS 방지 (React 기본 제공)
- 클라이언트 사이드 입력 검증

