export const STUDENT_CONFIG = {
  learnerName: '철수',
  subject: '역수와 비례식',
  voiceSettings: {
    // ------------------------------------------
    // 💎 [기존 Neural2 -> 변경] Gemini 1.5 기반 프리미엄 보이스 설정
    // ------------------------------------------
    apiKey: import.meta.env.VITE_GOOGLE_TTS_API_KEY || '', // .env 파일에 키 입력
    voiceId: 'ko-KR-Chirp3-HD-Aoede', // Gemini 1.5 기반 스마트 멘토 음성 (Aoede)
    pitch: '+3st', // 칭찬할 때 기쁨이 가득 담기는 +3st 하이톤 적용
    rate: '1.05',  // 초등학생이 알아듣기 좋은 또렷하고 차분한 속도
    tone: '프리미엄 스마트해요체',
  },
  theme: {
    primaryColor: 'amber',
    secondaryColor: 'orange',
    bananaClass: 'bg-amber-400 text-slate-900', 
    bananaGlow: 'rgba(251,191,36,0.8)', 
  },
  greetings: {
    welcome: '🎉 {{learnerName}}야, 오늘도 {{subject}} 마법을 즐겁게 시작해볼까요? 화이팅! 🚀',
    intro: '안녕, {{learnerName}}야! 나는 너의 숫자 마법사 선생님이야. 오늘은 숫자를 물구나무 세우는 신기한 마법을 배워볼 거야. 준비됐니?',
    success: '우와! {{learnerName}}야, 최고예요! 완벽해요!',
    encourage: '괜찮아요, {{learnerName}}야! 다시 한번 천천히 해볼까요?',
    transform: '훌라당! 스파크와 함께 나눗셈이 곱셈으로 바뀌고, 숫자가 다이내믹하게 물구나무를 섰어!',
    nanBananaUnite: '우와! {{learnerName}}야! 수많은 나노바나나가 하나의 거대한 마법의 다리 1로 증명되었어!',
  },
  stepInstructions: [
    "마법의 기초를 다지는 개념의 방입니다. 분수, 역수, 통분의 완벽한 비밀을 배워보세요!",
    "1단계 뒤집기 대장입니다! 물구나무 숫자를 1초 안에 빨리 찾아보세요!",
    "2단계 마법 다리 만들기입니다. 나눗셈을 곱셈으로 바꾸면 숫자가 스르륵 서커스처럼 뒤집혀요!",
    "3단계 숫자의 비밀 탐정입니다. 숨겨진 비례식을 저울을 이용해 추리해봐요!",
    "마지막 도전! 마법 퀴즈 시간입니다! 지금까지 배운 마법들을 뽐내보세요!",
    "디버그 사운드 시스템을 확인합니다."
  ]
};

// 일반 텍스트 파싱
export const getParsedMessage = (msgTemplate: string) => {
  // 🛡️ 방어 코드: undefined/null 체크
  if (!msgTemplate || typeof msgTemplate !== 'string') {
    console.warn("⚠️ [getParsedMessage] 잘못된 입력값:", msgTemplate);
    return "안녕하세요, 철수야!";
  }

  return msgTemplate
    .replace(/{{learnerName}}/g, STUDENT_CONFIG.learnerName)
    .replace(/{{subject}}/g, STUDENT_CONFIG.subject);
};

// SSML (음성 마크업 언어) 파싱: 자연스러운 호흡(Prosody & Break) 포함
export const getParsedSSML = (msgTemplate: string) => {
  // 🛡️ 방어 코드: undefined/null 체크
  if (!msgTemplate || typeof msgTemplate !== 'string') {
    console.warn("⚠️ [getParsedSSML] 잘못된 입력값:", msgTemplate);
    return `<speak><prosody rate="${STUDENT_CONFIG.voiceSettings.rate}" pitch="${STUDENT_CONFIG.voiceSettings.pitch}">안녕하세요</prosody></speak>`;
  }

  // 실제 선생님의 호흡: "철수야!" 부르고 400ms(0.4초) 동안 아이와 눈을 맞추며 자연스럽게 쉬어가기
  const nameWithBreak = `${STUDENT_CONFIG.learnerName}야! <break time="400ms"/>`;
  let ssmlStr = msgTemplate
    .replace(/{{learnerName}}야!/g, nameWithBreak)
    .replace(/{{learnerName}}야,/g, nameWithBreak)
    .replace(/{{learnerName}}/g, STUDENT_CONFIG.learnerName)
    .replace(/{{subject}}/g, STUDENT_CONFIG.subject);

  // 속도와 피치를 감정에 맞게 최적화하는 SSML Prosody Tag 랩핑
  return `<speak><prosody rate="${STUDENT_CONFIG.voiceSettings.rate}" pitch="${STUDENT_CONFIG.voiceSettings.pitch}">${ssmlStr}</prosody></speak>`;
};

// ==========================================
// 🛠 [크롬 호환성 엔진] Web Audio API BufferSource + Speech API
// ==========================================
export let globalAudioCtx: AudioContext | null = null;

export let currentAudioInstance: AudioBufferSourceNode | HTMLAudioElement | null = null;

export const stopCurrentAudio = () => {
    if (currentAudioInstance) {
        if ('stop' in currentAudioInstance) {
            try { (currentAudioInstance as AudioBufferSourceNode).stop(); } catch(e) {}
        } else if ('pause' in currentAudioInstance) {
            try { 
                const audio = currentAudioInstance as HTMLAudioElement;
                audio.pause(); 
                audio.currentTime = 0; 
            } catch(e) {}
        }
        currentAudioInstance = null;
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
};

// 크롬 Autoplay Policy 해결을 위한 음성 잠금 상태 변수
let audioUnlocked = false;

// 크롬 Autoplay Policy 해결을 위한 음성 잠금 해제 함수
export const unlockAudio = async () => {
    // 1. Web Audio API 잠금 해제
    if (!globalAudioCtx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
            globalAudioCtx = new AudioContext();
        }
    }
    // 명시적으로 오디오 잠금 해제 (Resume)
    if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
        await globalAudioCtx.resume();
        console.log("🔓 [AudioContext] Force Resumed & Unlocked!");
    }

    // 2. Web Speech API 잠금 해제 (빈 utterance로 크롬 잠금 해제)
    if (!audioUnlocked && window.speechSynthesis) {
        try {
            const utterance = new SpeechSynthesisUtterance('');
            utterance.volume = 0; // 무음으로 재생
            window.speechSynthesis.speak(utterance);
            audioUnlocked = true;
            console.log("🔓 [SpeechSynthesis] Audio unlocked for Chrome autoplay policy");
        } catch (e) {
            console.warn("Speech synthesis unlock failed:", e);
        }
    }
};

const playBufferSource = async (base64Audio: string, onStart?: () => void, onEnd?: () => void) => {
    if (!globalAudioCtx) await unlockAudio();
    if (!globalAudioCtx) return false;

    try {
        const binaryString = window.atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
        
        const buffer = await globalAudioCtx.decodeAudioData(bytes.buffer);
        stopCurrentAudio(); // 하울링 방지: 이전 재생 즉각 중단
        const source = globalAudioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(globalAudioCtx.destination);
        source.onended = () => { if(onEnd) onEnd(); };
        
        currentAudioInstance = source; // 인스턴스 등록
        if (onStart) onStart();
        source.start(0);
        return true;
    } catch(e) {
        console.error("❌ Web Audio API decode error:", e);
        return false;
    }
};

// Web Speech API 직접 호출 도우미 함수
const playWithWebSpeech = (text: string, onStart?: () => void, onEnd?: () => void) => {
  console.log("📱 [Web Speech API] 직접 음성 재생 시작");
  playVoiceFallback(text, onStart, onEnd);
};

// 범용 음성 재생 모듈 (Google Cloud Neural2 프리미엄 엔진 최우선)
export const playVoice = async (message: string, onStart?: () => void, onEnd?: () => void) => {
  // 🛡️ 방어 코드: 입력값 검증
  if (!message || typeof message !== 'string') {
    console.warn("⚠️ [playVoice] 잘못된 메시지:", message);
    message = "안녕하세요, {{learnerName}}야!"; // 기본 메시지로 대체
  }

  const ssml = getParsedSSML(message);
  const text = getParsedMessage(message);

  // 1. 최고급 프리미엄 Neural2 엔진 호출 (API apiKey가 존재하는 경우에만)
  if (STUDENT_CONFIG.voiceSettings.apiKey) {
    try {
      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${STUDENT_CONFIG.voiceSettings.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { ssml },
          voice: { languageCode: 'ko-KR', name: STUDENT_CONFIG.voiceSettings.voiceId },
          audioConfig: { audioEncoding: 'MP3' }
        })
      });

      if (!response.ok) {
        // 403 등 에러 시 바로 Web Speech API로 전환
        console.log('Google TTS 실패(' + response.status + ') → Web Speech API로 전환');
        playWithWebSpeech(text, onStart, onEnd);
        return;
      }

      // 성공 시 기존 코드 유지
      const data = await response.json();
      if (data.audioContent) {
        console.log("💎 [Premium Voice] Attempting Web Audio API BufferSource playback");
        const played = await playBufferSource(data.audioContent, onStart, onEnd);
        if (played) return; // 성공 시 여기서 종료
      }

    } catch (error) {
      console.log('Google TTS 에러 → Web Speech API로 전환');
      playWithWebSpeech(text, onStart, onEnd);
      return;
    }
  }

  // 2. 프리미엄 API 키 누락 시, Web Speech API 직접 폴백
  console.log("📱 [Fallback Mode] Premium TTS key not found, using reliable Web Speech API");
  playWithWebSpeech(text, onStart, onEnd);
};

// 3. 오프라인 브라우저 Web Speech API 로컬 폴백 (가장 마지막 안전장치)
const playVoiceFallback = async (text: string, onStart?: () => void, onEnd?: () => void) => {
  // 크롬 Autoplay Policy 해결을 위해 맨 첫 줄에 잠금 해제
  await unlockAudio();

  console.warn("🔈 [WebSpeech API Fallback] Triggered");
  if (!window.speechSynthesis) {
     if(onStart) onStart();
     setTimeout(() => { if(onEnd) onEnd(); }, 2000);
     return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = 0.9; // 크롬 호환성을 위한 고정 속도
  utterance.volume = 1; // 최대 볼륨으로 설정

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;

  stopCurrentAudio(); // 기존 음성 취소 로직을 하울링 방지 로직으로 대체
  window.speechSynthesis.speak(utterance);
};
