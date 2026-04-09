import { useState } from 'react';
import FlipMaster from './components/mastery/FlipMaster';
import BridgeBuilder from './components/mastery/BridgeBuilder';
import RatioDetective from './components/mastery/RatioDetective';
import { STUDENT_CONFIG, getParsedMessage, playVoice } from './student_config';
import { Volume2, Play } from 'lucide-react';
import './index.css';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Dynamic config integration (Lego Block System - TS)
  const parsedGreeting = getParsedMessage(STUDENT_CONFIG.greetings.welcome);
  const parsedTitle = `${STUDENT_CONFIG.learnerName}의 숫자 마법사`;

  const handleStart = () => {
    setIsStarted(true);
    // 첫 만남 자동 재생 로직 (사용자 상호작용 후)
    playVoice(
      STUDENT_CONFIG.greetings.intro,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleStepChange = (index: number) => {
    setCurrentStep(index);
    // 탭 이동 시 해당 탭 목표 자동 설명
    playVoice(
      STUDENT_CONFIG.stepInstructions[index],
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const steps = [
    { title: '[1단계] 뒤집기 대장 🤸‍♂️', component: <FlipMaster /> },
    { title: '[2단계] 마법 다리 만들기 🌉', component: <BridgeBuilder /> },
    { title: '[3단계] 숫자의 비밀 탐정 🔍', component: <RatioDetective /> },
  ];

  // 인트로 화면 (브라우저 자동 재생 정책 준수용)
  if (!isStarted) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-8 text-white w-full border-[10px] border-emerald-900/50">
         <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-12 drop-shadow-lg">
           {parsedTitle}
         </h1>
         <div className="text-2xl text-slate-300 font-bold mb-10 flex flex-col items-center gap-4">
           선생님이 철수를 기다리고 있어요! 준비됐나요?
         </div>
         <button 
           onClick={handleStart} 
           className="flex items-center gap-4 bg-emerald-500 hover:bg-emerald-400 px-12 py-6 rounded-full text-4xl font-black shadow-[0_0_50px_rgba(16,185,129,0.8)] hover:scale-105 transition-all text-slate-900 animate-pulse"
         >
           <Play fill="currentColor" size={48} />
           마법 세계로 입장하기!
         </button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-8 font-sans h-full text-white w-full">
      <header className="mb-8 text-center flex-shrink-0 relative mt-8">
        
        {/* 스피커 아이콘이 포함된 다이나믹 환영 현수막 */}
        <div className="absolute -top-12 inset-x-0 mx-auto text-amber-300 font-extrabold text-2xl drop-shadow-md flex items-center justify-center gap-3">
          <Volume2 
            className={isSpeaking ? "text-pink-400 animate-pulse scale-125" : "text-amber-300/50"} 
            size={32} 
            strokeWidth={3}
            onClick={() => playVoice(
              STUDENT_CONFIG.greetings.welcome,
              () => setIsSpeaking(true),
              () => setIsSpeaking(false)
            )}
            style={{ cursor: 'pointer' }}
          />
          {parsedGreeting}
        </div>
        
        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 tracking-tight drop-shadow-lg mb-4">
          {parsedTitle}
        </h1>
        <p className="mt-4 text-slate-300 font-bold text-3xl flex items-center justify-center gap-3">
          선생님과 함께 물구나무 숫자로 마법 부려봐요! ✨
        </p>
      </header>

      <div className="flex gap-4 mb-10">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => handleStepChange(index)}
            className={`px-8 py-4 rounded-2xl font-bold text-xl transition-all shadow-lg border-2 ${
              currentStep === index
                ? 'bg-emerald-600 text-white border-emerald-400 scale-105'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {step.title}
          </button>
        ))}
      </div>

      <div className="flex-grow w-full max-w-5xl bg-slate-900 rounded-[3rem] p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800 overflow-hidden relative">
        {steps[currentStep].component}
      </div>
    </div>
  );
}

export default App;
