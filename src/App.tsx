import { useState, useEffect } from 'react';
import WelcomeLanding from './components/mastery/WelcomeLanding';
import ConceptLibrary from './components/mastery/ConceptLibrary';
import FlipMaster from './components/mastery/FlipMaster';
import BridgeBuilder from './components/mastery/BridgeBuilder';
import RatioDetective from './components/mastery/RatioDetective';
import MetacognitionQuest from './components/mastery/MetacognitionQuest';
import DebugSoundTest from './components/mastery/DebugSoundTest';
import { STUDENT_CONFIG, getParsedMessage, playVoice, unlockAudio } from './student_config';
import { Volume2 } from 'lucide-react';
import './index.css';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // 크롬 Autoplay Policy 해결: 첫 클릭 시 자동으로 음성 잠금 해제
  useEffect(() => {
    const handleFirstClick = async () => {
      if (!audioUnlocked) {
        await unlockAudio();
        setAudioUnlocked(true);
        console.log("🔓 사용자 첫 클릭으로 음성 잠금 해제 완료");
      }
    };

    // 문서 전체에 한 번만 실행되는 클릭 이벤트 리스너 등록
    document.addEventListener('click', handleFirstClick, { once: true });

    // 컴포넌트 언마운트 시 이벤트 리스너 정리
    return () => {
      document.removeEventListener('click', handleFirstClick);
    };
  }, [audioUnlocked]);

  // Dynamic config integration (Lego Block System - TS)
  const parsedGreeting = getParsedMessage(STUDENT_CONFIG.greetings.welcome);
  const parsedTitle = `${STUDENT_CONFIG.learnerName}의 숫자 마법사`;

  const handleStart = async () => {
    // 1. 강제 오디오 잠금 해제 (The One-Click Unlock)
    await unlockAudio();
    setAudioUnlocked(true);
    
    // 약간의 딜레이로 안정적인 버퍼 확보 후 입장
    setTimeout(() => {
        setIsStarted(true);
        // (금지됨) 자동 음성 재생 로직 완전히 제거됨 (On-Demand 방식으로만 작동하도록 설정)
    }, 800);
  };

  const handleStepChange = (index: number) => {
    setCurrentStep(index);
    // (금지됨) 자동 음성 재생 제거. 원할 때 스피커 아이콘만 누르도록 유도.
  };

  const steps = [
    { short: '개념의 방', title: '[기초] 개념의 방 📚', component: <ConceptLibrary /> },
    { short: '1단계', title: '[1단계] 뒤집기 대장 🤸‍♂️', component: <FlipMaster /> },
    { short: '2단계', title: '[2단계] 마법 다리 🌉', component: <BridgeBuilder /> },
    { short: '3단계', title: '[3단계] 비밀 탐정 🔍', component: <RatioDetective /> },
    { short: '마법 퀴즈', title: '[복습] 도전! 마법 퀴즈 🔮', component: <MetacognitionQuest /> },
    { short: '시스템', title: '[디버그] 시스템 🔧', component: <DebugSoundTest /> },
  ];

  // 스피커 아이콘 클릭 이벤트 핸들러 (수동 재생)
  const handlePlayInstructions = () => {
    playVoice(
      STUDENT_CONFIG.stepInstructions[currentStep],
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  if (!isStarted) {
    return <WelcomeLanding audioUnlocked={audioUnlocked} onStart={handleStart} />;
  }

  return (
    <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-between p-4 md:p-8 font-sans text-white w-full h-[100dvh] overflow-hidden">
      
      {/* 
        [수정됨] 상단(Body) 영역: 메인 콘텐츠 출력
        기존에 위쪽을 차지하던 메뉴들을 모두 하단으로 내리고, 상단은 헤더와 콘텐츠가 꽉 채우도록 구성합니다.
      */}
      <div className="flex flex-col w-full max-w-6xl flex-grow overflow-hidden gap-4">
        <header className="relative w-full flex flex-col items-center justify-center z-10 shrink-0 mt-2 mb-2">
          {/* 서브 문구 (선생님 캐릭터 & 스피커 아이콘 포함, 클릭 시 수동 재생) */}
          <div 
            onClick={handlePlayInstructions}
            className="flex items-center justify-center gap-3 bg-slate-800/80 hover:bg-slate-700/90 px-6 py-3 rounded-full cursor-pointer transition-colors border border-slate-600 shadow-md group"
          >
            <span className="text-3xl">👩‍🏫</span>
            <Volume2 
              className={`${isSpeaking ? "text-pink-400 animate-pulse scale-125" : "text-amber-400 group-hover:scale-110 transition-transform"}`} 
              size={28} 
              strokeWidth={3}
            />
            <span className="text-amber-200 font-bold text-sm md:text-lg pl-1">
              {parsedGreeting} (👆 선생님 힌트 듣기)
            </span>
          </div>
          
          {/* 메인 타이틀 */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 tracking-tight drop-shadow-lg text-center leading-tight py-2">
            {parsedTitle}
          </h1>
        </header>

        {/* 메인 콘텐츠 영역 (화면 전체를 시원하게 채움) */}
        <div className="flex-grow w-full bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-2 md:p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800 overflow-hidden relative z-0 flex flex-col">
          {steps[currentStep].component}
        </div>
      </div>

      {/* 
        [수정됨] 하단 네비게이션 영역 (Bottom Navigation)
        터치하기 편한 하단 배치, 깔끔한 2열/3열/6열 그리드 정렬
      */}
      <div className="w-full max-w-6xl mt-4 shrink-0 z-10">
        <nav className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => handleStepChange(index)}
              className={`flex items-center justify-center px-4 py-4 rounded-2xl font-black text-sm md:text-base transition-all shadow-lg border-2 ${
                currentStep === index
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] -translate-y-1'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white active:scale-95'
              }`}
            >
              {/* 모바일 화면에서는 짧은 타이틀, 데스크톱에서는 긴 타이틀 */}
              <span className="md:hidden">{step.short}</span>
              <span className="hidden md:block">{step.title}</span>
            </button>
          ))}
        </nav>
      </div>

    </div>
  );
}

export default App;
