import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, X, Info } from 'lucide-react';

interface Fraction {
  numerator: number;
  denominator: number;
}

export default function BridgeBuilder() {
  const [equation] = useState<{ left: Fraction; right: Fraction }>({
    left: { numerator: 3, denominator: 5 },
    right: { numerator: 4, denominator: 7 },
  });

  const [step, setStep] = useState<'question' | 'animating' | 'success'>('question');
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [modalDragComplete, setModalDragComplete] = useState(false);

  const options = [
    { id: 1, op: '×', frac: { numerator: 7, denominator: 4 }, isCorrect: true },
    { id: 2, op: '×', frac: { numerator: 4, denominator: 7 }, isCorrect: false },
    { id: 3, op: '÷', frac: { numerator: 7, denominator: 4 }, isCorrect: false },
    { id: 4, op: '+', frac: { numerator: 4, denominator: 7 }, isCorrect: false },
  ];

  const handleOptionSelect = (isCorrect: boolean) => {
    if (isCorrect) {
      setStep('animating');
      setTimeout(() => setStep('success'), 2000);
    } else {
      setShowWhyModal(true);
      setModalDragComplete(false);
    }
  };

  const reset = () => {
    setStep('question');
    setShowWhyModal(false);
  };

  return (
    <div className="p-8 text-white h-full flex flex-col items-center justify-center relative overflow-hidden bg-slate-900 rounded-[2rem]">
      <motion.div 
        className="flex flex-col items-center justify-center w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-4xl font-black mb-4 text-indigo-400 drop-shadow-md">
          나눗셈 마법! 기호를 바꾸고 숫자는 다이빙! 💦
        </h2>
        <p className="text-xl text-slate-300 font-bold mb-10 max-w-2xl text-center leading-relaxed">
          나눗셈을 곱셈으로 바꾸는 비밀 마법이에요! <br/>
          숫자가 <span className="text-indigo-300 text-2xl font-black bg-indigo-950/50 px-2 rounded">물구나무(거꾸로 숫자)</span>를 서면 정답 마법이 이루어져요 🌉
        </p>

        <div className="flex items-center text-5xl font-black gap-10 mb-16 px-12 py-10 rounded-3xl relative z-10 bg-slate-800/20 border border-slate-700/50 shadow-inner">
          <div className="flex flex-col items-center justify-center gap-3">
            <span>{equation.left.numerator}</span>
            <div className="w-16 h-1.5 bg-white rounded-full"></div>
            <span>{equation.left.denominator}</span>
          </div>

          <div className="w-16 h-16 flex items-center justify-center text-7xl relative mx-4">
            <AnimatePresence mode="wait">
              {step === 'question' ? (
                <motion.div
                  key="divide"
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  className="absolute drop-shadow-md text-slate-200"
                >
                  ÷
                </motion.div>
              ) : (
                <motion.div
                  key="multiply"
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.8)]"
                >
                  ×
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            className="relative w-20 h-40 flex items-center justify-center"
            style={{ perspective: 1200 }}
          >
            <motion.div
              className="w-full h-full flex flex-col items-center justify-center relative"
              initial={{ rotateX: 0 }}
              animate={{ rotateX: step !== 'question' ? 180 : 0 }}
              transition={{ duration: 0.6, ease: "easeInOut", delay: 0.3 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-slate-800/80 p-4 border border-slate-600 shadow-xl"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span>{equation.right.numerator}</span>
                  <div className="w-16 h-1.5 bg-white rounded-full"></div>
                  <span>{equation.right.denominator}</span>
                </div>
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-indigo-300 rounded-2xl bg-indigo-950/80 p-4 border border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
                >
                  <span>{equation.right.denominator}</span>
                  <div className="w-16 h-1.5 bg-indigo-400 rounded-full"></div>
                  <span>{equation.right.numerator}</span>
                </div>
            </motion.div>
          </motion.div>
        </div>

        <AnimatePresence>
          {step === 'question' && (
            <motion.div 
              className="grid grid-cols-2 gap-6 w-full max-w-xl"
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleOptionSelect(opt.isCorrect)}
                  className="flex items-center justify-center gap-6 p-6 bg-slate-800 hover:bg-slate-700 rounded-2xl border-2 border-slate-600 hover:border-slate-400 transition-all cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1"
                >
                  <span className="text-4xl font-extrabold text-slate-300">{opt.op}</span>
                  <div className="flex flex-col items-center text-3xl font-bold">
                    <span>{opt.frac.numerator}</span>
                    <div className="w-10 h-1 bg-white my-1.5 rounded-full"></div>
                    <span>{opt.frac.denominator}</span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="flex flex-col items-center mt-4 absolute bottom-12"
            >
              <div className="text-emerald-400 text-3xl font-black mb-6 drop-shadow-md">짜잔! 나눗셈이 마법처럼 곱셈으로 변신했어요✨</div>
              <button 
                onClick={reset}
                className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-full font-bold shadow-xl shadow-indigo-600/40 transition-all text-xl"
              >
                <RotateCcw size={28} /> 신난다! 한 번 더 해볼까?
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showWhyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center z-50 p-6"
          >
            <div className="bg-slate-900 border-2 border-slate-700 p-10 rounded-[2rem] w-full max-w-4xl flex flex-col items-center relative shadow-2xl overflow-hidden">
              <button onClick={reset} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors bg-slate-800 p-2 rounded-full">
                <X size={28} />
              </button>
              
              <div className="flex items-center gap-3 text-amber-400 mb-8 font-extrabold text-4xl drop-shadow-md">
                <Info size={40} />
                <span>왜 '물구나무 숫자(거꾸로 숫자)'를 곱해야 할까요?</span>
              </div>

              {!modalDragComplete ? (
                <>
                  <p className="text-slate-200 mb-12 text-center font-bold text-2xl leading-relaxed">
                    앗, 틀렸어요! 사실 나눗셈은 **<span className="text-amber-300">'1'을 만드는 마법</span>**에서 출발한답니다.<br/>
                    오른쪽의 <span className="text-purple-400">보라색 마법 상자</span>를 끌어당겨 원래의 숫자와 융합해보세요!
                  </p>

                  <div className="flex items-center gap-12 w-full justify-center relative h-56 mb-8">
                    <div className="flex flex-col items-center justify-center p-10 bg-slate-800 rounded-3xl border-4 border-dashed border-slate-600 shadow-inner w-40 relative">
                      <span className="text-6xl font-black">{equation.right.numerator}</span>
                      <div className="w-20 h-2 bg-white my-3 rounded-full"></div>
                      <span className="text-6xl font-black">{equation.right.denominator}</span>
                      <div className="absolute -bottom-10 text-slate-400 font-bold text-lg">원래 숫자</div>
                    </div>

                    <div className="text-7xl font-black text-slate-500">×</div>

                    <motion.div 
                      drag="x"
                      dragConstraints={{ left: -190, right: 0 }}
                      dragElastic={0.1}
                      onDragEnd={(e, info) => {
                        if (info.offset.x < -100) setModalDragComplete(true);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileDrag={{ scale: 1.15, backgroundColor: '#a855f7', zIndex: 50 }}
                      className="cursor-grab active:cursor-grabbing flex flex-col items-center justify-center p-10 bg-purple-600 rounded-3xl border-2 border-purple-400 shadow-2xl shadow-purple-500/50 w-40 relative z-10"
                    >
                      <span className="text-6xl font-black">{equation.right.denominator}</span>
                      <div className="w-20 h-2 bg-white my-3 rounded-full"></div>
                      <span className="text-6xl font-black">{equation.right.numerator}</span>
                      <div className="absolute -bottom-10 text-purple-300 font-bold text-lg min-w-max">거꾸로 숫자 (역수)</div>
                    </motion.div>
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse" }}
                    className="text-purple-300 font-extrabold text-2xl mt-6 bg-purple-900/40 px-6 py-2 rounded-full border border-purple-500/30"
                  >
                    🚀 상자를 꾹 누른 채로 왼쪽 상자 안으로 쏙~ 밀어넣어봐!
                  </motion.div>
                </>
              ) : (
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', bounce: 0.6, duration: 1.2 }}
                  className="flex flex-col items-center py-10"
                >
                  <div className="text-[14rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_0_80px_rgba(251,191,36,1)] filter">
                    1
                  </div>
                  <p className="mt-8 text-3xl text-amber-300 font-bold text-center leading-relaxed">
                    거꾸로 숫자끼리 만나면 무조건 <span className="text-white text-4xl bg-amber-600/50 px-4 rounded-2xl mx-1 border border-amber-400/50">"1"</span>로 변신해요! ✨<br/>
                    <span className="text-slate-200 text-2xl mt-6 inline-block font-medium bg-slate-800/80 p-6 rounded-2xl border border-slate-600">
                      그래서 어떤 수든 거꾸로 숫자를 곱하면 나누기와 똑같은 정답이 나온답니다.<br/>
                      이것이 우리가 숫자를 물구나무 세우는 진짜 이유예요!😎
                    </span>
                  </p>
                  <button 
                    onClick={reset}
                    className="mt-12 px-12 py-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 rounded-full font-black text-3xl shadow-2xl transition-all hover:scale-105 hover:-translate-y-1 ring-4 ring-amber-500/50"
                  >
                    아하! 이제 완벽하게 이해했어요!
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
