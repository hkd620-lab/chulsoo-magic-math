import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STUDENT_CONFIG, playVoice } from '../../student_config';
import { Sparkles } from 'lucide-react';

export default function BridgeBuilder() {
  const [phase, setPhase] = useState<'initial' | 'transformed' | 'united'>('initial');
  const [sparks, setSparks] = useState(false);

  useEffect(() => {
    // 진입 시 컴포넌트 자동 음성 안내 (App.tsx 핸들링 외 컴포넌트 마운트 의존성 체크용)
  }, []);

  const handleTransform = () => {
    setPhase('transformed');
    setSparks(true);
    playVoice(STUDENT_CONFIG.greetings.transform);
    setTimeout(() => setSparks(false), 1000);
  };

  const handleUnite = () => {
    setPhase('united');
    playVoice(STUDENT_CONFIG.greetings.nanBananaUnite);
  };

  return (
    <div className="p-8 text-center text-white bg-slate-900 rounded-[2rem] shadow-2xl min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden">
      
      <h2 className="text-4xl font-black mb-12 text-emerald-400 drop-shadow-md z-10">
        [2단계] 마법 다리 만들기 🌉 & NaN-Bridge
      </h2>

      <div className="h-[200px] flex items-center justify-center w-full relative">
        <AnimatePresence mode="wait">
          {phase === 'initial' && (
            <motion.div 
              key="initial"
              className="flex items-center gap-12 z-10"
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <div className="text-7xl font-black bg-slate-800 p-10 rounded-[2.5rem] border-4 border-slate-600 shadow-inner">3/4</div>
              <div className="text-8xl font-black text-pink-500 animate-bounce">÷</div>
              <div className="text-7xl font-black bg-slate-800 p-10 rounded-[2.5rem] border-4 border-slate-600 shadow-inner">3/4</div>
            </motion.div>
          )}

          {phase === 'transformed' && (
            <motion.div 
              key="transformed"
              initial={{ scale: 0.5, opacity: 0, x: -50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              className="flex items-center gap-12 z-10 relative"
            >
              <div className="text-7xl font-black bg-slate-800 p-10 rounded-[2.5rem] border-4 border-emerald-900">3/4</div>
              
              <div className="relative">
                <motion.div 
                   animate={{ rotate: 360, scale: [1, 1.8, 1] }} 
                   transition={{ duration: 0.6, type: "spring" }}
                   className="text-9xl font-black text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]"
                >
                  ×
                </motion.div>
                {/* 훌라당 스파크 효과 */}
                {sparks && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2.5, opacity: 0, rotate: 180 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center text-pink-500 pointer-events-none"
                  >
                     <Sparkles size={120} strokeWidth={1.5} />
                  </motion.div>
                )}
              </div>

              <motion.div 
                 initial={{ rotateX: 0 }}
                 animate={{ rotateX: 180, scale: 1.1 }}
                 transition={{ duration: 0.8, type: "spring", stiffness: 120, damping: 10 }}
                 className="text-7xl font-black bg-slate-800 p-10 rounded-[2.5rem] border-4 border-emerald-400 text-emerald-300 shadow-[0_0_40px_rgba(52,211,153,0.3)]"
                 style={{ transformStyle: "preserve-3d" }}
              >
                {/* 물리 엔진처럼 위아래가 실시간으로 뒤집히는 거울 문자 효과 */}
                <div style={{ transform: "rotateX(180deg)" }}>4/3</div>
              </motion.div>
            </motion.div>
          )}

          {phase === 'united' && (
             <motion.div 
               key="united"
               initial={{ scale: 0.1, opacity: 0, rotate: -720 }}
               animate={{ scale: 1, opacity: 1, rotate: 0 }}
               transition={{ duration: 1.5, type: 'spring', damping: 15 }}
               className={`w-72 h-72 rounded-full flex items-center justify-center border-[12px] border-white z-20 ${STUDENT_CONFIG.theme.bananaClass}`}
               style={{ boxShadow: `0 0 100px ${STUDENT_CONFIG.theme.bananaGlow}` }}
             >
               <span className="text-[12rem] leading-none font-black drop-shadow-2xl">1</span>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-20 flex gap-6 z-10">
        {phase === 'initial' && (
          <button 
            onClick={handleTransform}
            className="flex items-center gap-3 bg-pink-600 hover:bg-pink-500 text-white font-black py-5 px-10 rounded-full text-3xl shadow-[0_0_30px_rgba(219,39,119,0.5)] transition-transform hover:scale-110 active:scale-95 border-2 border-pink-400"
          >
            <Sparkles /> 훌라당! 물구나무 세우기 ✨
          </button>
        )}
        {phase === 'transformed' && (
          <button 
             onClick={handleUnite}
             className={`px-10 py-5 ${STUDENT_CONFIG.theme.bananaClass} font-extrabold rounded-full text-3xl transition-transform hover:scale-110 active:scale-95 border-2 border-white`}
             style={{ boxShadow: `0 0 40px ${STUDENT_CONFIG.theme.bananaGlow}` }}
          >
             🍌 나노바나나 합체 기원! (NaN-Bridge)
          </button>
        )}
        {phase === 'united' && (
          <button 
             onClick={() => setPhase('initial')}
             className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold rounded-full py-5 px-10 text-3xl shadow-xl transition-all hover:scale-105 border-2 border-emerald-300"
          >
             마법 처음부터 다시 즐기기 🔄
          </button>
        )}
      </div>

      {/* 나노 바나나 파티클 물리 엔진 애니메이션 (NaN-Bridge 폭발 시) */}
      {phase === 'united' && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
           {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: 0, y: 0, opacity: 1, scale: Math.random() * 2 + 0.5 
                }}
                animate={{ 
                  x: (Math.random() - 0.5) * 1200, 
                  y: ((Math.random() - 0.5) * 1200) - 200, 
                  opacity: 0,
                  rotate: Math.random() * 1080
                }}
                transition={{ duration: 1.8 + Math.random(), ease: "easeOut" }}
                className={`absolute top-1/2 left-1/2 w-6 h-16 rounded-[100%] shadow-lg ${STUDENT_CONFIG.theme.bananaClass.split(' ')[0]}`}
                style={{ 
                  clipPath: 'polygon(50% 0%, 100% 20%, 80% 100%, 20% 100%, 0% 20%)',
                  boxShadow: `0 0 10px ${STUDENT_CONFIG.theme.bananaGlow}`
                }}
              />
           ))}
        </div>
      )}
    </div>
  );
}
