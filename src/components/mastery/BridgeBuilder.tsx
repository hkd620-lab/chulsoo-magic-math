import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STUDENT_CONFIG, playVoice } from '../../student_config';
import { Sparkles, Route, Users, Pizza } from 'lucide-react';
import InlineSpeaker from './InlineSpeaker';

export default function BridgeBuilder() {
  const [phase, setPhase] = useState<'intro' | 'initial' | 'transformed' | 'united'>('intro');
  const [sparks, setSparks] = useState(false);

  useEffect(() => {
    // 진입 시 스토리텔링 시작
  }, []);

  const startMagic = () => {
    setPhase('initial');
    playVoice("좋아, 마법 교각을 설치해보자!");
  }

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
    <div className="p-8 text-center text-white rounded-[2rem] shadow-2xl min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-t from-slate-900 via-[#0a192f] to-[#112240]">
      
      {/* 별이 빛나는 밤 다리 테마 배경 (Framer Motion) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.1, 0.8, 0.1], scale: [1, 1.5, 1] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              boxShadow: '0 0 10px #fff'
            }}
          />
        ))}
        {/* Floating Islands Shadow (CSS) */}
        <div className="absolute bottom-0 left-0 w-64 h-32 bg-emerald-950/40 rounded-[100%] blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-32 bg-emerald-950/40 rounded-[100%] blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="z-10 w-full flex justify-between items-center mb-6 px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-gradient-to-tr from-cyan-400 to-blue-600 w-12 h-12 rounded-full border-2 border-white shadow-[0_0_15px_rgba(34,211,238,0.8)]">
            <Route className="text-white" size={24} />
          </div>
          <h2 className="text-3xl font-black text-cyan-300 drop-shadow-md">
            [중급] 마법 다리 건설 🌉
          </h2>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center bg-slate-800/80 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-md max-w-3xl z-10 w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-amber-300 mb-6 flex items-center gap-3">
              <Pizza className="text-amber-400" size={32} /> 스토리텔링 퀴즈: 피자 조각의 비밀
            </h3>
            
            <div className="flex gap-8 items-center bg-slate-900/50 p-6 rounded-2xl border border-slate-700 w-full mb-8">
              <div className="flex-1 text-left space-y-4">
                 <p className="text-xl text-slate-300 leading-relaxed font-medium flex items-center">
                   <InlineSpeaker message="철수야, 거대한 피자 한 판의 3/4이 남아있어!" /> 
                   <span>철수야, 거대한 피자 한 판의 <span className="text-pink-400 font-bold text-2xl">3/4</span>이 남아있어!</span>
                 </p>
                 <p className="text-xl text-slate-300 leading-relaxed font-medium flex items-center">
                   <InlineSpeaker message="이 피자를 똑같이 세명의 친구들과 나누려고 해." />
                   <span>이 피자를 똑같이 <span className="text-emerald-400 font-bold text-2xl">3명</span>의 친구들과 나누려고 해.</span>
                 </p>
                 <p className="text-lg text-slate-400 mt-2 bg-slate-800/50 p-3 rounded-xl flex items-center">
                   <InlineSpeaker message="문제입니다. 한 명이 먹을 수 있는 피자는 전체의 얼마일까?" />
                   <strong className="text-amber-300 ml-2">Q.</strong> 한 명이 먹을 수 있는 피자는 전체의 얼마일까?
                 </p>
              </div>
              <div className="w-48 h-48 relative">
                 {/* CSS로 그린 피자 일러스트 */}
                 <div className="w-full h-full rounded-full bg-orange-600 border-4 border-amber-800 flex items-center justify-center p-2 relative overflow-hidden shadow-2xl">
                    <div className="w-full h-full rounded-full bg-amber-400 relative">
                      {/* 3/4 조각 표시 */}
                      <div className="absolute inset-0 bg-slate-900/80 clip-quarter origin-center" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 0, 50% 0)' }}></div>
                      {/* 페퍼로니 데코 */}
                      <div className="absolute top-4 left-8 w-6 h-6 rounded-full bg-red-600 shadow-inner"></div>
                      <div className="absolute bottom-8 left-12 w-6 h-6 rounded-full bg-red-600 shadow-inner"></div>
                      <div className="absolute top-12 right-12 w-6 h-6 rounded-full bg-red-600 shadow-inner"></div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="flex justify-center w-full">
              <button 
                onClick={startMagic}
                className="flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-10 rounded-full text-2xl shadow-[0_0_30px_rgba(8,145,178,0.5)] transition-all hover:scale-105"
              >
                나눗셈 식(÷) 세워보기 👉
              </button>
            </div>
          </motion.div>
        )}

        {phase !== 'intro' && (
          <div className="h-[250px] flex items-center justify-center w-full relative mt-10">
            <AnimatePresence mode="wait">
              {phase === 'initial' && (
                <motion.div 
                  key="initial"
                  className="flex items-center gap-12 z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xl text-amber-300 font-bold mb-4 drop-shadow-md">남은 피자 양</span>
                    <div className="text-7xl font-black bg-slate-800/80 p-8 rounded-[2rem] border-4 border-slate-600 shadow-2xl backdrop-blur-sm">3/4</div>
                  </div>
                  <div className="text-8xl font-black text-pink-500 animate-bounce drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">÷</div>
                  <div className="flex flex-col items-center">
                    <span className="text-xl text-emerald-300 font-bold mb-4 flex items-center gap-2 drop-shadow-md"><Users size={20}/> 친구 수</span>
                    <div className="text-7xl font-black bg-slate-800/80 p-8 rounded-[2rem] border-4 border-slate-600 shadow-2xl backdrop-blur-sm">3</div>
                  </div>
                </motion.div>
              )}

              {phase === 'transformed' && (
                <motion.div 
                  key="transformed"
                  initial={{ scale: 0.5, opacity: 0, x: -50 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  className="flex items-center gap-12 z-10 relative"
                >
                  <div className="text-7xl font-black bg-slate-800/80 p-8 rounded-[2rem] border-4 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)] backdrop-blur-sm">3/4</div>
                  
                  <div className="relative">
                    <motion.div 
                       animate={{ rotate: 360, scale: [1, 1.8, 1] }} 
                       transition={{ duration: 0.6, type: "spring" }}
                       className="text-9xl font-black text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.8)]"
                    >
                      ×
                    </motion.div>
                    {sparks && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2.5, opacity: 0, rotate: 180 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 flex items-center justify-center text-pink-400 pointer-events-none"
                      >
                         <Sparkles size={150} strokeWidth={2} />
                      </motion.div>
                    )}
                  </div>

                  <motion.div 
                     initial={{ rotateX: -180, scale: 0.8 }}
                     animate={{ rotateX: 0, scale: 1.1 }}
                     transition={{ duration: 1.0, type: "spring", stiffness: 100, damping: 10 }}
                     className="text-7xl font-black bg-slate-800/80 p-8 rounded-[2.5rem] border-4 border-emerald-400 text-emerald-300 shadow-[0_0_50px_rgba(52,211,153,0.5)] backdrop-blur-sm flex flex-col items-center relative overflow-hidden"
                     style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="absolute top-2 left-2 pointer-events-auto">
                       <InlineSpeaker message="나눗셈 기호가 곱셈으로 변신하면, 뒤에 있는 숫자 3은 물구나무를 서서 3분의 1이 된답니다!" />
                    </div>
                    <div className="flex flex-col items-center mt-6">
                      <span className="text-[5rem] drop-shadow-md leading-none">1</span>
                      <div className="w-20 h-3 bg-emerald-300 my-3 rounded-full drop-shadow-md"></div>
                      <span className="text-[5rem] drop-shadow-md leading-none">3</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {phase === 'united' && (
                 <motion.div 
                   key="united"
                   initial={{ scale: 0.1, opacity: 0, rotate: -720 }}
                   animate={{ scale: 1, opacity: 1, rotate: 0 }}
                   transition={{ duration: 1.5, type: 'spring', damping: 15 }}
                   className={`w-72 h-72 rounded-full flex flex-col items-center justify-center border-[8px] border-white z-20 bg-gradient-to-br from-yellow-300 to-amber-500`}
                   style={{ boxShadow: `0 0 100px rgba(251,191,36,0.8)` }}
                 >
                   <span className="text-3xl font-bold text-amber-900 mb-2">한 명당 피자</span>
                   <div className="flex flex-col items-center text-amber-950 font-black">
                     <span className="text-[5rem] drop-shadow-md leading-none">1</span>
                     <div className="w-20 h-3 bg-amber-950 my-2 rounded-full"></div>
                     <span className="text-[5rem] drop-shadow-md leading-none">4</span>
                   </div>
                 </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>

      <div className="mt-16 flex gap-6 z-10 min-h-[100px] items-center justify-center">
        {phase === 'initial' && (
          <button 
            onClick={handleTransform}
            className="flex items-center gap-3 bg-pink-600 hover:bg-pink-500 text-white font-black py-4 px-10 rounded-full text-2xl shadow-[0_0_40px_rgba(219,39,119,0.5)] transition-transform hover:scale-110 active:scale-95 border-2 border-pink-400"
          >
            <Sparkles /> 나눗셈(÷)을 곱셈(×)으로 뒤집기 ✨
          </button>
        )}
        {phase === 'transformed' && (
          <button 
             onClick={handleUnite}
             className={`px-10 py-5 bg-gradient-to-r from-amber-400 to-orange-500 font-extrabold rounded-full text-2xl text-white transition-transform hover:scale-110 active:scale-95 border-2 border-white`}
             style={{ boxShadow: `0 0 50px rgba(251,191,36,0.6)` }}
          >
             🌉 다리(분모분자 약분) 연결하여 계산하기!
          </button>
        )}
        {phase === 'united' && (
          <button 
             onClick={() => setPhase('intro')}
             className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold rounded-full py-4 px-10 text-2xl shadow-2xl transition-all hover:scale-105 border-4 border-white"
          >
             다른 스토리텔링 마법 보기 🔄
          </button>
        )}
      </div>

      {/* 나노 바나나 파티클 물리 엔진 애니메이션 */}
      {phase === 'united' && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
           {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: 0, y: 0, opacity: 1, scale: Math.random() * 2 + 0.5 
                }}
                animate={{ 
                  x: (Math.random() - 0.5) * 1400, 
                  y: ((Math.random() - 0.5) * 1400) - 200, 
                  opacity: 0,
                  rotate: Math.random() * 1080
                }}
                transition={{ duration: 1.8 + Math.random(), ease: "easeOut" }}
                className={`absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-amber-400 shadow-lg`}
                style={{ 
                  boxShadow: `0 0 15px rgba(251,191,36,0.8)`
                }}
              />
           ))}
        </div>
      )}
    </div>
  );
}
