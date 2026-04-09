# METV 프로젝트 — Claude Code 참고 파일 (claude.md)

> ⚠️ **이 파일은 Claude Code(cc)가 반드시 읽고 따라야 하는 프로젝트 규칙서입니다.**
> 코드 작성 전에 이 파일을 먼저 확인하세요.

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | METV (Must-have English for Travel Vocabulary) |
| 대상 사용자 | **시니어** (큰 글씨, 단순한 UI, 한국어 위주) |
| 핵심 목적 | 공항·호텔·식당 등 실전 여행 상황의 영어 단어·문장 학습 |
| 개발 방향 | 왕초보 개발자가 이해할 수 있도록 **단계별, 쉬운 코드** 우선 |

---

## 2. 기술 스택

| 레이어 | 기술 |
|--------|------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| UI 컴포넌트 | Radix UI + Shadcn/ui |
| Backend API | Next.js API Routes (서버리스) |
| AI/음성 | Google Cloud TTS (en-US-Journey-F), Google STT, Gemini AI |
| 배포 | Firebase App Hosting |

---

## 3. 프로젝트 구조

```
metv/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # 메인 UI (학습/퀴즈 탭)
│   │   └── api/
│   │       ├── tts/route.ts          # TTS API 엔드포인트
│   │       └── stt/route.ts          # STT API 엔드포인트
│   ├── components/
│   │   ├── TTSButton.tsx             # 발음 재생 + 캐싱
│   │   ├── VoiceRecorder.tsx         # 마이크 녹음 + AI 피드백
│   │   ├── ScrambleQuiz.tsx          # 퀴즈 게임 로직
│   │   └── InteractiveSentence.tsx   # 클릭 가능한 예문
│   └── lib/
│       ├── travel-data.ts            # 30개 단어 데이터
│       └── dictionary.ts             # 150+ 단어 사전
├── .env.local                        # ⚠️ API 키 보관 (절대 커밋 금지!)
├── .gitignore                        # .env.local 반드시 포함 확인
├── claude.md                         # 이 파일
└── package.json
```

---

## 4. 핵심 기능 정리

| 번호 | 기능명 | 설명 |
|------|--------|------|
| 1 | 단어 학습장 | 3개 섹션 × 10단어 = 총 30개 단어, 섹션 순차 잠금 해제 |
| 2 | TTS 발음 재생 | Google Cloud TTS + 브라우저 오디오 캐싱 |
| 3 | 예문 인터랙션 | 문장 내 단어 클릭 → 한국어 뜻 툴팁 표시 |
| 4 | 문장 조립 퀴즈 | 단어 셔플 후 순서 맞추기 + 정답 시 컨페티 애니메이션 |
| 5 | 음성 녹음 + AI 피드백 | 마이크 녹음 → Gemini가 발음 분석 → 한국어로 피드백 |

---

## 5. 환경변수 / API 키 안내

### 설정 방법

프로젝트 루트에 `.env.local` 파일을 만들고 아래 키를 입력하세요.

```bash
# Google Cloud TTS / STT 용
GOOGLE_CLOUD_API_KEY=여기에_구글_클라우드_키_입력

# Gemini AI 발음 피드백 용
GEMINI_API_KEY=여기에_제미나이_키_입력
```

### API 키 발급 위치

| 키 이름 | 발급 위치 |
|---------|-----------|
| `GOOGLE_CLOUD_API_KEY` | https://console.cloud.google.com → API 및 서비스 → 사용자 인증 정보 |
| `GEMINI_API_KEY` | https://aistudio.google.com/app/apikey |

### ⚠️ 보안 주의사항 (반드시 지킬 것!)

- `.env.local` 파일은 **절대 GitHub에 올리지 마세요!**
- `.gitignore` 파일에 `.env.local`이 있는지 반드시 확인하세요.
- 코드 안에 API 키를 직접 쓰지 마세요. (예: `const key = "AIza..."` ← 절대 금지)
- API 키가 실수로 노출됐다면 즉시 해당 콘솔에서 **키 삭제 후 재발급**하세요.

---

## 6. 코딩 규칙 / 스타일 가이드

### 기본 원칙

- **한국어 주석 필수**: 모든 주석은 한국어로 작성합니다.
- **단순하게**: 왕초보도 이해할 수 있는 코드를 최우선으로 합니다.
- **설명 먼저**: 코드 작성 전에 무엇을 할지 한국어로 먼저 설명해 주세요.

### 주석 작성 규칙

```typescript
// ✅ 좋은 예 — 한국어 주석 + 무엇을 하는지 명확히 설명
// 단어 목록을 화면에 보여주는 함수
function showWordList(words: string[]) {
  return words.map((word) => <p key={word}>{word}</p>)
}

// ❌ 나쁜 예 — 영어 주석 + 설명 없음
// render list
const r = (w: string[]) => w.map((x) => <p key={x}>{x}</p>)
```

### 파일 네이밍 규칙

| 종류 | 규칙 | 예시 |
|------|------|------|
| React 컴포넌트 | PascalCase.tsx | `TTSButton.tsx` |
| 유틸 / 데이터 파일 | kebab-case.ts | `travel-data.ts` |
| API 라우트 | 폴더명/route.ts | `tts/route.ts` |

### UI 원칙 (시니어 배려)

| 항목 | 규칙 |
|------|------|
| 글자 크기 | 최소 `text-lg` (18px) 이상 |
| 버튼 높이 | 최소 `h-12` (48px) 이상 — 손가락으로 누르기 쉽게 |
| 색상 대비 | 배경과 글자 색상은 충분한 대비 유지 |
| 언어 | 모든 UI 문구는 **한국어** 로 표시 |
| 안내 메시지 | 오류/성공 메시지도 반드시 한국어 |

### TypeScript 규칙

```typescript
// ✅ 타입을 명확하게 지정하기
interface Word {
  english: string;       // 영어 단어
  korean: string;        // 한국어 뜻
  example: string;       // 예문
  pronunciation: string; // 발음 가이드
}

// ❌ any 타입 사용 금지
function doSomething(data: any) { ... } // 사용하지 마세요
```

---

## 7. 디버깅 / 트러블슈팅 가이드

### 디버깅 순서 (이 순서대로 확인하세요!)

```
1단계: 터미널에 빨간 오류 메시지가 있는지 확인
   ↓
2단계: 브라우저 개발자 도구 (F12) → Console 탭 확인
   ↓
3단계: .env.local 파일에 API 키가 올바르게 있는지 확인
   ↓
4단계: npm install 한 번 더 실행해 보기
   ↓
5단계: 오류 메시지 전체를 Claude Code에게 붙여넣기
```

### API 관련 오류

| 오류 메시지 | 원인 | 해결 방법 |
|-------------|------|-----------|
| `API key not valid` | API 키가 잘못되거나 없음 | `.env.local` 파일의 키 값 확인 |
| `403 Forbidden` | API 권한이 없음 | Google Cloud Console에서 해당 API 활성화 여부 확인 |
| `429 Too Many Requests` | API 호출 한도 초과 | 잠시 기다리거나 API 할당량 확인 |
| `500 Internal Server Error` | 서버 코드 오류 | 터미널의 오류 로그 확인 |

### 개발 환경 오류

| 오류 메시지 | 원인 | 해결 방법 |
|-------------|------|-----------|
| `Module not found` | 패키지 미설치 | `npm install` 실행 |
| `Port 3000 already in use` | 다른 서버가 이미 실행 중 | `npx kill-port 3000` 실행 후 재시작 |
| `Cannot read properties of undefined` | 데이터가 없는데 접근 시도 | 옵셔널 체이닝(`?.`) 사용 |
| TypeScript 빨간 줄 | 타입 오류 | 오류 위에 마우스 올려 메시지 확인 |

### 기능별 오류

| 기능 | 증상 | 해결 방법 |
|------|------|-----------|
| TTS | 소리가 안 남 | 사용자가 버튼을 직접 클릭해야 재생 가능 (브라우저 정책) |
| STT | 마이크가 안 잡힘 | 브라우저에서 마이크 권한 허용했는지 확인 |
| 퀴즈 | 컨페티가 안 나옴 | `canvas-confetti` 패키지 설치 여부 확인 |

---

## 8. 커밋 메시지 작성 규칙

> Claude Code는 커밋 메시지를 **팩트 기반으로 자세하게** 작성해야 합니다.
> 무엇을, 왜, 어떻게 변경했는지 명확히 기록하세요.

### 커밋 메시지 형식

```
[타입] 제목 — 무엇을 했는지 한 줄 요약

변경 내용:
- 파일명: 구체적으로 무엇을 추가/수정/삭제했는지
- 파일명: 왜 이 변경이 필요했는지 이유 포함
- 영향 범위: 이 커밋으로 달라지는 동작 설명

관련 이슈: #이슈번호 (있을 경우)
```

### 타입 종류

| 타입 | 의미 | 예시 |
|------|------|------|
| `[기능추가]` | 새 기능을 만들었을 때 | `[기능추가] 단어 즐겨찾기 저장 기능` |
| `[버그수정]` | 오류를 고쳤을 때 | `[버그수정] TTS 버튼 클릭 시 소리 안 나는 오류 수정` |
| `[디자인]` | UI/스타일 변경 | `[디자인] 시니어 배려 글자 크기 18px로 확대` |
| `[리팩토링]` | 코드 정리 (기능 변화 없음) | `[리팩토링] TTSButton 컴포넌트 주석 한국어로 정리` |
| `[데이터]` | 단어/문장 데이터 수정 | `[데이터] 식당 섹션 예문 10개 추가` |
| `[환경설정]` | 설정 파일 변경 | `[환경설정] Firebase 배포 설정 업데이트` |
| `[문서]` | README, claude.md 등 수정 | `[문서] claude.md 트러블슈팅 항목 추가` |

### ✅ 좋은 커밋 메시지 예시

```
[기능추가] 섹션 순차 잠금 해제 조건 구현

변경 내용:
- travel-data.ts: 섹션별 isLocked 상태 필드 추가
- page.tsx: 섹션 1의 단어 10개를 모두 학습하면 섹션 2 자동 잠금 해제되도록 로직 구현
- TTSButton.tsx: 잠긴 섹션에서는 발음 재생 버튼 비활성화 처리
- 이유: 사용자가 순서대로 학습하도록 유도하기 위함
```

```
[버그수정] 퀴즈 정답 후 컨페티 애니메이션이 재생되지 않는 오류 수정

변경 내용:
- ScrambleQuiz.tsx: useEffect 의존성 배열 누락으로 발생한 문제 수정
- 정답 상태(isCorrect)가 true로 바뀔 때만 confetti 함수 실행되도록 조건 추가
- 영향 범위: 퀴즈 정답 시 컨페티 애니메이션이 정상 재생됨
```

### ❌ 나쁜 커밋 메시지 예시

```
수정함      ← 무엇을 수정했는지 알 수 없음
fixed       ← 영어 + 내용 없음
업데이트    ← 너무 모호함
```

---

## 9. 자주 쓰는 명령어 모음

```bash
# 개발 서버 시작
npm run dev

# 배포용 빌드 (오류 없는지 먼저 확인)
npm run build

# 코드 오류 검사
npm run lint

# 패키지 설치 (새 라이브러리 추가 시)
npm install 패키지이름

# 개발 서버 포트 강제 종료 후 재시작
npx kill-port 3000 && npm run dev
```

---

## 10. Claude Code에게 요청하는 작업 방식

1. **한 번에 하나씩**: 기능을 한꺼번에 만들지 말고, 작은 단위로 나눠서 만들어 주세요.
2. **설명 먼저**: 코드 작성 전에 "무엇을 어떻게 할 것인지" 한국어로 먼저 설명해 주세요.
3. **확인 후 진행**: 확실하지 않은 부분은 코드 작성 전에 먼저 물어봐 주세요.
4. **오류 발생 시**: 오류 메시지를 그대로 붙여넣으면 원인과 해결 방법을 알려주세요.
5. **커밋 메시지**: 작업 완료 후 반드시 위 8번의 규칙대로 자세하게 작성해 주세요.

---

*최종 업데이트: 2025년 — 프로젝트가 변경될 때마다 이 파일도 함께 수정해 주세요.*
