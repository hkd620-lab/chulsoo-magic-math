import React, { useState } from 'react';
import FlipMaster from './components/mastery/FlipMaster';
import BridgeBuilder from './components/mastery/BridgeBuilder';
import RatioDetective from './components/mastery/RatioDetective';
import './index.css';

function App() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Flip Master', component: <FlipMaster /> },
    { title: 'Bridge Builder', component: <BridgeBuilder /> },
    { title: 'Ratio Detective', component: <RatioDetective /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 font-sans h-full text-white w-full">
      <header className="mb-8 text-center flex-shrink-0">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-500 tracking-tight drop-shadow-lg">
          Flip & Match
        </h1>
        <p className="mt-2 text-slate-400 font-medium text-lg">역수와 비례식 정복 프로젝트</p>
      </header>

      <div className="flex gap-4 mb-10">
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentStep(idx)}
            className={`px-8 py-3 rounded-full font-bold transition-all duration-300 shadow-lg border cursor-pointer ${
              currentStep === idx
                ? 'bg-indigo-600 text-white border-indigo-400 transform scale-105 shadow-indigo-500/50'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {step.title}
          </button>
        ))}
      </div>

      <main className="w-full max-w-4xl h-[50vh] transition-all bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex relative">
        <div className="w-full h-full p-2">
            {steps[currentStep].component}
        </div>
      </main>
    </div>
  );
}

export default App;
