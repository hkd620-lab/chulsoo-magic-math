export const STUDENT_CONFIG = {
  learnerName: '철수',
  subject: '역수와 비례식',
  voiceSettings: {
    gender: 'female', // 'male' or 'female'
    pitch: 1.2, // 여성스럽고 생기있는 톤
    rate: 1.1,  // 약간 빠르고 경쾌한 속도
    tone: '친절한 해요체',
  },
  theme: {
    primaryColor: 'amber',
    secondaryColor: 'orange',
  },
  greetings: {
    welcome: '🎉 {{learnerName}}야, 오늘도 {{subject}} 마법을 즐겁게 시작해볼까요? 화이팅! 🚀',
    intro: '안녕, {{learnerName}}야! 나는 너의 숫자 마법사 선생님이야. 오늘은 숫자를 물구나무 세우는 신기한 마법을 배워볼 거야. 준비됐니?',
    success: '우와! {{learnerName}} 최고예요! 완벽해요!',
    encourage: '괜찮아요, {{learnerName}}! 다시 한번 천천히 해볼까요?',
  },
  stepInstructions: [
    "1단계 뒤집기 대장입니다! 물구나무 숫자를 1초 안에 빨리 찾아보세요!",
    "2단계 마법 다리 만들기입니다. 나눗셈을 곱셈으로 바꾸면 숫자가 스르륵 서커스처럼 뒤집혀요!",
    "3단계 숫자의 비밀 탐정입니다. 숨겨진 비례식을 저울을 이용해 추리해봐요!"
  ]
};

export const getParsedMessage = (msgTemplate: string) => {
  return msgTemplate
    .replace(/{{learnerName}}/g, STUDENT_CONFIG.learnerName)
    .replace(/{{subject}}/g, STUDENT_CONFIG.subject);
};

// 범용 음성 재생 모듈 (서버 스트리밍 TTS 우선, 실패 시 Web Speech Fallback)
export const playVoice = (message: string, onStart?: () => void, onEnd?: () => void) => {
  const text = getParsedMessage(message);

  try {
    // 1. 구글 서버 사이드 비공식 TTS 엔드포인트를 이용한 안정적인 스트리밍 방식
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ko-KR&client=tw-ob&q=${encodeURIComponent(text)}`;
    const audio = new Audio(url);
    
    audio.onplay = () => {
      console.log("[Server TTS] Play stream:", text);
      if(onStart) onStart();
    };
    
    audio.onended = () => {
      console.log("[Server TTS] End stream");
      if(onEnd) onEnd();
    };

    audio.onerror = (e) => {
      console.error("[Server TTS] Error:", e);
      playVoiceFallback(text, onStart, onEnd);
    };

    audio.play().catch(e => {
        console.error("[Server TTS] Blocked:", e);
        playVoiceFallback(text, onStart, onEnd);
    });
  } catch(e) {
    playVoiceFallback(text, onStart, onEnd);
  }
};

// 2. 기존 브라우저 Web Speech API 
const playVoiceFallback = (text: string, onStart?: () => void, onEnd?: () => void) => {
  console.warn("[WebSpeech API Fallback] Triggered");
  if (!window.speechSynthesis) {
     if(onStart) onStart();
     setTimeout(() => { if(onEnd) onEnd(); }, 2000);
     return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = STUDENT_CONFIG.voiceSettings.rate;
  utterance.pitch = STUDENT_CONFIG.voiceSettings.pitch;
  
  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};
