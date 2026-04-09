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

  // Generate 4 options. Validation: No zero denominators.
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
    <div className="p-8 text-white h-full flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* -------------------- Main Flow -------------------- */}
      <motion.div 
        className="flex flex-col items-center justify-center w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-2xl font-bold mb-10 text-indigo-400">나눗셈을 역수의 곱셈으로 바꾸어 보아요!</h2>

        <div className="flex items-center text-5xl font-black gap-10 mb-16 px-12 py-10 rounded-3xl relative z-10">
          
          {/* 1. 고정 영역 (앞 분수) */}
          <div className="flex flex-col items-center justify-center gap-3">
            <span>{equation.left.numerator}</span>
            <div className="w-16 h-1.5 bg-white rounded-full"></div>
            <span>{equation.left.denominator}</span>
          </div>

          {/* 2. 기호 변환 (크로스페이드 & 스핀 동기화) */}
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

          {/* 3. 텀블링 물구나무 애니메이션 (CSS 3D Transforms) */}
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
                {/* 앞면 (Front Face): 원래 분수 */}
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-slate-800/80 p-4 border border-slate-600 shadow-xl"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span>{equation.right.numerator}</span>
                  <div className="w-16 h-1.5 bg-white rounded-full"></div>
                  <span>{equation.right.denominator}</span>
                </div>

                {/* 뒷면 (Back Face): 역수로 변환된 분수 (미리 180도 뒤집어서 배치해둠) */}
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

        {/* 선택지 영역 */}
        <AnimatePresence>
          {step === 'question' && (
            <motion.div 
              className="grid grid-cols-2 gap-6 w-full max-w-lg"
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

        {/* 성공 메시지 및 리셋 */}
        <AnimatePresence>
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="flex flex-col items-center mt-4 absolute bottom-12"
            >
              <div className="text-emerald-400 text-3xl font-black mb-6 drop-shadow-md">완벽해요! 나눗셈이 곱셈으로 변신했어요✨</div>
              <button 
                onClick={reset}
                className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-full font-bold shadow-xl shadow-indigo-600/40 transition-all text-lg"
              >
                <RotateCcw size={24} /> 다음 단계로 (Reset Test)
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* -------------------- Why First: 시각적 증명 모달 -------------------- */}
      <AnimatePresence>
        {showWhyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center z-50 p-6"
          >
            <div className="bg-slate-900 border-2 border-slate-700 p-10 rounded-[2rem] w-full max-w-3xl flex flex-col items-center relative shadow-2xl overflow-hidden">
              <button onClick={reset} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors bg-slate-800 p-2 rounded-full">
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-3 text-amber-400 mb-8 font-extrabold text-3xl drop-shadow-md">
                <Info size={36} />
                <span>왜 역수를 곱해야 할까요?</span>
              </div>

              {!modalDragComplete ? (
                <>
                  <p className="text-slate-300 mb-12 text-center font-medium text-xl leading-relaxed">
                    오답이에요! 사실 모든 나눗셈은 **'1'을 만드는 마법**에서 출발한답니다.<br/>
                    오른쪽의 <span className="text-purple-400 font-bold">보라색 역수 박스</span>를 드래그해서 원래 숫자와 융합해보세요!
                  </p>

                  <div className="flex items-center gap-12 w-full justify-center relative h-48 mb-8">
                    {/* 드래그 불가능한 기준 블록 (Target) */}
                    <div className="flex flex-col items-center justify-center p-8 bg-slate-800 rounded-2xl border-4 border-dashed border-slate-600 shadow-inner w-32 relative">
                      <span className="text-5xl font-black">{equation.right.numerator}</span>
                      <div className="w-16 h-1.5 bg-white my-3 rounded-full"></div>
                      <span className="text-5xl font-black">{equation.right.denominator}</span>
                      <div className="absolute -bottom-10 text-slate-400 font-bold text-sm">원래 숫자</div>
                    </div>

                    <div className="text-6xl font-black text-slate-500">×</div>

                    {/* 드래그 가능한 역수 블록 (Draggable) */}
                    <motion.div 
                      drag="x"
                      dragConstraints={{ left: -190, right: 0 }}
                      dragElastic={0.1}
                      onDragEnd={(e, info) => {
                        if (info.offset.x < -100) {
                          setModalDragComplete(true);
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileDrag={{ scale: 1.15, backgroundColor: '#a855f7', zIndex: 50 }}
                      className="cursor-grab active:cursor-grabbing flex flex-col items-center justify-center p-8 bg-purple-600 rounded-2xl border-2 border-purple-400 shadow-xl shadow-purple-500/40 w-32 relative z-10"
                    >
                      <span className="text-5xl font-black">{equation.right.denominator}</span>
                      <div className="w-16 h-1.5 bg-white my-3 rounded-full"></div>
                      <span className="text-5xl font-black">{equation.right.numerator}</span>
                      <div className="absolute -bottom-10 text-purple-300 font-bold text-sm">역수 (뒤집힌 수)</div>
                    </motion.div>
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                    className="text-purple-300 font-bold text-lg mt-4"
                  >
                    ← 보라색 블록을 왼쪽 박스 안으로 드래그 합체!
                  </motion.div>
                </>
              ) : (
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', bounce: 0.6, duration: 1.2 }}
                  className="flex flex-col items-center py-10"
                >
                  <div className="text-[12rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_0_50px_rgba(251,191,36,0.8)] filter">
                    1
                  </div>
                  <p className="mt-8 text-2xl text-amber-300 font-bold text-center leading-relaxed">
                    어떤 수든 역수를 곱하면 무조건 <span className="text-white text-3xl bg-amber-600/30 px-2 rounded">"1"</span>이 반환됩니다! <br/>
                    <span className="text-slate-300 text-lg mt-4 inline-block font-normal">
                      나눗셈은 역수를 곱셈으로 처리해도 동일한 결과를 낳습니다.<br/>
                      이것이 우리가 <strong>물구나무(역수)를 서고 기호($\div \rightarrow \times$)를 바꾸는 원리</strong>랍니다.
                    </span>
                  </p>
                  <button 
                    onClick={reset}
                    className="mt-10 px-10 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-full font-black text-xl shadow-2xl transition-all hover:scale-105"
                  >
                    아하! 이해했어요! (돌아가기)
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
