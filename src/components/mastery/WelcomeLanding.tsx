import { STUDENT_CONFIG, unlockAudio, playVoice } from '../../student_config';
import { Play, Lock, Unlock, BookOpen, Target, Sparkles, Map } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WelcomeLanding({ 
  audioUnlocked, 
  onStart 
}: { 
  audioUnlocked: boolean; 
  onStart: () => void;
}) {

  return (
    <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center py-20 px-8 text-white w-full border-[10px] border-indigo-900/50 relative overflow-y-auto custom-scrollbar">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* 시각적 증명 패널 (Total Verification) */}
      <div className="fixed top-6 right-6 bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-700 shadow-xl flex items-center gap-3 z-50">
        {!audioUnlocked ? (
          <>
            <Lock className="text-red-500 animate-pulse" size={20} />
            <span className="text-red-400 font-bold">음성 마법 잠김 🔇</span>
          </>
        ) : (
          <>
            <Unlock className="text-emerald-400" size={20} />
            <span className="text-emerald-400 font-bold">선생님 음성 준비완료 🔊</span>
          </>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full flex flex-col items-center z-10"
      >
        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-6 drop-shadow-lg text-center">
          {STUDENT_CONFIG.learnerName}의 숫자 마법 학교 🧙‍♂️
        </h1>
        <p className="text-2xl text-slate-300 font-bold mb-16 text-center max-w-3xl leading-relaxed">
          분수와 나눗셈이 두려운 친구들을 위한 마법 같은 놀이터에 오신 것을 환영합니다! <br/>
          공식만 무작정 외우는 수학은 이제 그만! 원리를 직접 만지고 느껴보세요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full mb-16">
          
          {/* 6하 원칙 패널 */}
          <div className="bg-slate-900/80 p-8 rounded-3xl border border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.15)] flex flex-col">
            <h2 className="text-3xl font-black text-indigo-300 mb-8 flex items-center gap-3">
              <Map className="text-indigo-400" /> 탐험가의 지도 (6하 원칙)
            </h2>
            <ul className="space-y-4 text-lg text-slate-300">
              <li className="flex items-start gap-4 bg-slate-800/50 p-4 rounded-2xl">
                <span className="bg-indigo-600 text-white font-black px-3 py-1 rounded-lg text-sm shrink-0">누가</span>
                <span>용감한 탐험가 <strong>{STUDENT_CONFIG.learnerName}</strong> 그리고 여러분이!</span>
              </li>
              <li className="flex items-start gap-4 bg-slate-800/50 p-4 rounded-2xl">
                <span className="bg-indigo-600 text-white font-black px-3 py-1 rounded-lg text-sm shrink-0">언제</span>
                <span>수학이 지루하고 분수가 헷갈리기 시작할 때</span>
              </li>
              <li className="flex items-start gap-4 bg-slate-800/50 p-4 rounded-2xl">
                <span className="bg-indigo-600 text-white font-black px-3 py-1 rounded-lg text-sm shrink-0">어디서</span>
                <span>마법이 살아 숨쉬는 이 <strong>디지털 숫자 학교</strong>에서</span>
              </li>
              <li className="flex items-start gap-4 bg-slate-800/50 p-4 rounded-2xl">
                <span className="bg-indigo-600 text-white font-black px-3 py-1 rounded-lg text-sm shrink-0">무엇을</span>
                <span className="text-amber-300 font-bold">분수, 나눗셈, 역수, 통분, 비례식</span>의 진짜 의미를
              </li>
              <li className="flex items-start gap-4 bg-slate-800/50 p-4 rounded-2xl">
                <span className="bg-indigo-600 text-white font-black px-3 py-1 rounded-lg text-sm shrink-0">어떻게</span>
                <span><strong>물구나무(역수) 마법</strong>과 인터랙티브한 시각적 스토리텔링으로 재미있게</span>
              </li>
              <li className="flex items-start gap-4 bg-slate-800/50 p-4 rounded-2xl border border-pink-500/30 relative overflow-hidden">
                <span className="bg-pink-600 text-white font-black px-3 py-1 rounded-lg text-sm shrink-0">왜</span>
                <span className="font-bold text-pink-200">단순 암기 고통에서 벗어나, "왜 그런지" 스스로 깨닫기 위해!</span>
              </li>
            </ul>
          </div>

          {/* 학습 목표 패널 */}
          <div className="bg-slate-900/80 p-8 rounded-3xl border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col">
            <h2 className="text-3xl font-black text-emerald-300 mb-8 flex items-center gap-3">
              <Target className="text-emerald-400" /> 이번 훈련의 마법 목표
            </h2>
            <div className="space-y-6 flex-grow flex flex-col justify-center">
              <div className="bg-gradient-to-r from-emerald-900/50 to-slate-800 p-6 rounded-2xl border-l-4 border-emerald-500 hover:-translate-y-1 transition-transform">
                <h3 className="text-xl font-bold text-emerald-300 mb-2">1. 중력 반전의 이해</h3>
                <p className="text-slate-300">분수의 나눗셈이 왜 곱셈으로 바뀌고 숫자가 뒤집히는지(역수) 그 원리를 눈으로 보고 설명할 수 있습니다.</p>
              </div>
              <div className="bg-gradient-to-r from-amber-900/50 to-slate-800 p-6 rounded-2xl border-l-4 border-amber-500 hover:-translate-y-1 transition-transform">
                <h3 className="text-xl font-bold text-amber-300 mb-2">2. 그릇 맞추기 마법 (통분)</h3>
                <p className="text-slate-300">분모가 다른 분수를 합칠 때, 왜 통분을 해서 "그릇의 모양"을 똑같이 만들어야 하는지 깨닫게 됩니다.</p>
              </div>
              <div className="bg-gradient-to-r from-purple-900/50 to-slate-800 p-6 rounded-2xl border-l-4 border-purple-500 hover:-translate-y-1 transition-transform">
                <h3 className="text-xl font-bold text-purple-300 mb-2">3. 실생활 적용 능력</h3>
                <p className="text-slate-300">피자 나누기, 속력과 시간 등 일상 속 문제에 역수와 비례식 개념을 자유자재로 적용할 수 있습니다.</p>
              </div>
            </div>
          </div>
        </div>

        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <button 
            onClick={onStart} 
            className="flex items-center gap-6 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 px-16 py-8 rounded-[3rem] text-4xl font-black shadow-[0_0_60px_rgba(16,185,129,0.6)] transition-all text-slate-900 border-4 border-white mb-10"
          >
            <Sparkles fill="currentColor" size={40} className="text-yellow-300" />
            ▶️ 마법 학교 교문 열기
          </button>
        </motion.div>
        <p className="text-slate-400 font-bold mb-10 text-xl border-b border-slate-700 pb-2">
          (이 버튼을 누르면 인공지능 선생님의 음성 마법이 함께 풀립니다!)
        </p>
      </motion.div>

    </div>
  );
}
