import React, { useState } from 'react';
import FlipMaster from './components/mastery/FlipMaster';
import BridgeBuilder from './components/mastery/BridgeBuilder';
import RatioDetective from './components/mastery/RatioDetective';
import './index.css';

function App() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: '[1단계] 뒤집기 대장 🤸‍♂️', component: <FlipMaster /> },
    { title: '[2단계] 마법 다리 만들기 🌉', component: <BridgeBuilder /> },
    { title: '[3단계] 숫자의 비밀 탐정 🔍', component: <RatioDetective /> },
  ];

  return (
    <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-8 font-sans h-full text-white w-full">
      <header className="mb-8 text-center flex-shrink-0 relative mt-6">
        <div className="absolute -top-10 inset-x-0 mx-auto text-amber-300 font-black text-2xl drop-shadow-md animate-bounce">
          🎉 철수야, 오늘도 숫자 마법을 즐겁게 시작해볼까요? 화이팅! 🚀
        </div>
        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-500 tracking-tight drop-shadow-lg mb-4">
          철수의 숫자 마법사
        </h1>
        <p className="mt-4 text-slate-300 font-bold text-3xl">"역수(물구나무 숫자)"로 마법 부려봐요! ✨</p>
      </header>

      <div className="flex gap-4 mb-10">
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentStep(idx)}
            className={`px-8 py-4 rounded-full font-bold transition-all duration-300 shadow-lg border-2 cursor-pointer text-xl ${
              currentStep === idx
                ? 'bg-indigo-600 text-white border-indigo-400 transform scale-105 shadow-[0_0_20px_rgba(99,102,241,0.5)]'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {step.title}
          </button>
        ))}
      </div>

      <main className="w-full max-w-5xl h-[65vh] transition-all bg-slate-900/50 rounded-3xl border-2 border-slate-700 overflow-hidden shadow-2xl flex relative p-2">
        <div className="w-full h-full">
            {steps[currentStep].component}
        </div>
      </main>
    </div>
  );
}

export default App;
