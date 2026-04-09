# [자동화 워크플로우 보고서] 1시간 컷 에듀테크 앱 배포 파이프라인

**작성일**: 2026-04-09  
**작성자**: AG (Antigravity)  
**목적**: 신규 의뢰 접수 시, 코드 하드코딩 시간 0분 수렴 및 1시간 이내에 학습자 맞춤형 교육 앱(1:1 퍼스널 AI 튜터)을 자동 배포하기 위한 표준화 프로세스 확립.

---

## ⏳ T-60분: 의뢰 요구사항 접수 및 `config.json` 매핑 (Dynamic Branding)
* **입력**: 대상자 이름 정보(철수), 학년, 주요 학습 목표 과목(수학 역수, 기초 영어단어 등).
* **처리**: AI (Claude/Gemini) 프롬프트 1회 호출로 JSON 메타데이터 자동 구조화.
* **산출물**: 
```json
{
  "learnerName": "김철수",
  "appTitle": "{{learnerName}}의 숫자 마법사",
  "subject": "역수와 비례식 (수학)",
  "voiceProfile": "kr-male-30s"
}
```

## ⏳ T-45분: AI 콘텐츠 무한 파이프라인 (AI Content Pipeline)
* **입력**: 위 `config.json`의 `subject` 메타데이터 기반.
* **처리**: `npm run generate-content` CLI Node 스크립트를 통해 Claude 3.5 Sonnet API에 배치(Batch) 요청 전송. 난이도별(1~3단계), 스테이지별 연습 문제를 배열 형태의 JSON(`question-bank.json`)으로 1,000세트 자동 생성.
* **모듈 분리**: 영어 과목 시 영단어-동의어 JSON, 역사 과목 시 연도-사건 JSON 등 데이터 계층과 UI 계층을 완전 분리.

## ⏳ T-30분: 모듈식 UI 레고 조립기 (Modular UI Assembly)
* 사전에 규격화된 **"Generic Mastery System"** 공용 프레임워크에 데이터 마운팅.
  1. **FlipModule (뒤집기 컴포넌트)**: JSON에서 '쌍(Pair)' 데이터를 주입하면 자동 카드 렌더링.
  2. **TumblingModule (변환 컴포넌트)**: 조건에 따라 상호작용 애니메이션(rotateX) 동적 적용. 형상의 제한을 받지 않음.
  3. **SandboxModule (추리 컴포넌트)**: 스토리텔링 템플릿(Typewriter) 엔진이 JSON 시나리오 파싱.

## ⏳ T-15분: 멀티모달 프레임워크 초기화 (Standard Voice UI)
* 모든 뼈대 앱엔 기본적으로 음성 튜토리얼 훅스(`useAITutor`)가 내장됨.
* 브라우저 마운트 시 `config.json`에서 `learnerName`을 읽어와 "철수야, 다음 단계 파이팅!" 등의 칭찬/오답 트리거 오디오 버퍼 조각을 캐싱.
* STT(Speech-to-Text) 인터페이스를 범용 마이크 버튼(`<VoiceMic />`)으로 주입.

## ⏳ T-0분: 무인 빌드 및 즉각 배포 (Auto Deployment)
* **처리**: Vercel CLI 혹은 Firebase Hosting 파이프라인을 호출하는 터미널 스크립트 실행. 
`npm run build && deploy --target {{learnerName}}-app`
* 개발자의 타이핑 개입 없이, 철수 어머니를 위한 고유의 **공개 데모 URL**을 즉각 카카오톡이나 이메일 웹훅으로 전송 완료.

---
**✅ 결론 의견 (Total Report)**
이 **[1시간 파이프라인]**이 정착되면, 수학, 국어, 영어 등 모든 영역을 망라하는 **'1:1 퍼스널라이징 초개인화 AI 학습앱'** 시장을 폭발적으로 선점할 수 있습니다. 이미 UI 컴포넌트 뼈대는 완성되어 있어, 앞으로 데이터 자동화 로직과 `config.json` 연결자만 완성하면 됩니다.
