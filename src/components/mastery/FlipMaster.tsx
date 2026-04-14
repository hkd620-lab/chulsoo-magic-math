import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STUDENT_CONFIG, playVoice } from '../../student_config';
import { Star, RotateCcw } from 'lucide-react';
import InlineSpeaker from './InlineSpeaker';

// ----------------------------------------
// 문제 뱅크 자동 생성 (난이도 자동 조절 알고리즘)
// ----------------------------------------
const generateQuestion = (masteryLevel: number) => {
  let num = 1, den = 1;
  if (masteryLevel === 1) {
    num = Math.floor(Math.random() * 8) + 2; 
    den = 1;
  } else if (masteryLevel === 2) {
    num = Math.floor(Math.random() * 8) + 1;
    den = Math.floor(Math.random() * 8) + 2;
    if (num === den) den += 1;
  } else {
    num = Math.floor(Math.random() * 15) + 5;
    den = Math.floor(Math.random() * 15) + 5;
    if (num === den) den += 2;
  }
  
  const isFlipped = Math.random() > 0.5;
  const original = isFlipped ? { n: den, d: num } : { n: num, d: den };
  const answer = isFlipped ? { n: num, d: den } : { n: den, d: num };
  
  const distractors = [];
  while (distractors.length < 3) {
    const fakeNum = Math.floor(Math.random() * 9) + 1;
    const fakeDen = Math.floor(Math.random() * 9) + 1;
    if ((fakeNum !== answer.n || fakeDen !== answer.d) && fakeDen !== 0) {
      distractors.push({ n: fakeNum, d: fakeDen });
    }
  }
  
  const options = [answer, ...distractors].sort(() => Math.random() - 0.5);
  return { original, answer, options };
};

export default function FlipMaster() {
  const [masteryLevel, setMasteryLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(generateQuestion(1));
  const [timeLeft, setTimeLeft] = useState(10.0);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [animatingState, setAnimatingState] = useState<'idle' | 'flipping' | 'merging'>('idle');
  const [selectedAns, setSelectedAns] = useState<{n: number, d: number} | null>(null);
  const [manualFlip, setManualFlip] = useState(false);
  
  // Ref for reaction time calculation
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 타이머 틱
  useEffect(() => {
    if (isGameOver || animatingState !== 'idle') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          setIsGameOver(true);
          playVoice(`앗! 시간이 다 됐어요. ${STUDENT_CONFIG.learnerName}, 다시 도전해볼까요?`);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameOver, animatingState]);

  const handleAnswer = (selected: {n: number, d: number}) => {
    if (isGameOver || animatingState !== 'idle') return;
    
    const reactionTime = (Date.now() - startTimeRef.current) / 1000;
    const isCorrect = selected.n === question.answer.n && selected.d === question.answer.d;

    if (isCorrect) {
      setSelectedAns(selected);
      setAnimatingState('flipping');
      
      // 애니메이션 시퀀스 타이밍 제어
      setTimeout(() => {
        setAnimatingState('merging');
        playVoice("두 숫자가 합쳐져서 완벽한 1이 되었어요!");
      }, 1000);

      setTimeout(() => {
        setScore(s => s + 10 * masteryLevel);
        setCombo(c => c + 1);
        
        // [점진적 과부하 로직] 1초 미만 반응 시 무조건 레벨 증가
        if (reactionTime < 1.0) {
          setMasteryLevel(lvl => Math.min(lvl + 1, 3));
        }

        setQuestion(generateQuestion(masteryLevel));
        setTimeLeft(prev => Math.min(prev + 3.0, 10.0)); // 보너스
        setAnimatingState('idle');
        setSelectedAns(null);
        setManualFlip(false);
        startTimeRef.current = Date.now();
      }, 2500);

    } else {
      playVoice(STUDENT_CONFIG.greetings.encourage);
      setCombo(0);
      setTimeLeft(prev => prev - 2.0); // 페널티
    }
  };

  const resetGame = () => {
    setMasteryLevel(1);
    setScore(0);
    setCombo(0);
    setTimeLeft(10.0);
    setQuestion(generateQuestion(1));
    setIsGameOver(false);
    setManualFlip(false);
    setAnimatingState('idle');
    startTimeRef.current = Date.now();
    playVoice(`좋아요 ${STUDENT_CONFIG.learnerName}! 마법 연습을 씩씩하게 다시 시작해봐요!`);
  };

  // 'Gravity-Flip Island' 테마 배경 렌더러
  return (
    <div className="p-8 text-center text-white rounded-[2rem] shadow-2xl h-full flex flex-col items-center relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950">
      
      {/* 중력 반전 테마 데코레이션 (배경) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 60, ease: "linear" }} className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40"></motion.div>
        <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 60, ease: "linear" }} className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40"></motion.div>
        <div className="absolute top-10 right-10 rotate-180 opacity-50"><RotateCcw size={100} className="text-white" /></div>
      </div>

      {/* ----------------- 대시보드 인디케이터 ----------------- */}
      <div className="w-full flex justify-between items-center mb-6 z-10">
        <div className="flex gap-4 items-center">
          {/* 등급별 뱃지 아이콘 */}
          <div className="flex items-center justify-center bg-gradient-to-br from-yellow-300 to-amber-600 w-12 h-12 rounded-full border-2 border-white shadow-[0_0_15px_rgba(251,191,36,0.8)]">
            <Star className="text-white fill-white" size={24} />
          </div>
          <div className="bg-indigo-950/80 px-6 py-3 rounded-2xl text-amber-400 font-bold text-xl border border-indigo-500/50 backdrop-blur-sm">
            레벨: {masteryLevel}
          </div>
          <div className="bg-indigo-950/80 px-6 py-3 rounded-2xl text-emerald-400 font-bold text-xl border border-indigo-500/50 backdrop-blur-sm">
            점수: {score}
          </div>
        </div>
        <div className="bg-indigo-950/80 border border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)] px-6 py-3 rounded-2xl text-pink-400 font-black text-xl backdrop-blur-sm">
           ⏱️ {timeLeft.toFixed(1)}초
        </div>
      </div>

      <h2 className="text-4xl font-black mb-4 text-emerald-300 drop-shadow-md z-10 flex items-center gap-3">
        <span className="text-4xl">🤸‍♂️</span> [초급] 뒤집기 마스터 (Gravity-Flip)
        <InlineSpeaker message="1단계, 뒤집기 대장입니다! 물구나무 숫자를 1초 안에 빨리 찾아보세요!" />
      </h2>
      <p className="text-xl text-indigo-200 font-bold max-w-3xl leading-relaxed mb-6 z-10 bg-indigo-950/60 p-4 rounded-xl flex items-center justify-center gap-3">
        <InlineSpeaker message="숫자를 터치하면 중력 반전 마법이 시작됩니다! 물구나무 숫자(역수)를 찾아 하나로 합쳐보세요!" />
        <span>숫자를 터치하면 중력 반전 마법이 시작됩니다! 물구나무 숫자(역수)를 찾아 하나로 합쳐보세요!</span>
      </p>

      {!isGameOver ? (
        <div className="flex w-full h-full flex-col items-center justify-center z-10 relative">
          
          <AnimatePresence>
            {animatingState !== 'idle' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-indigo-950/90 z-20 flex items-center justify-center backdrop-blur-sm rounded-3xl"
              >
                {animatingState === 'flipping' && (
                  <div className="flex gap-20 items-center">
                    {/* 오리지널 분수 */}
                    <motion.div className="flex flex-col items-center text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.8)]">
                      <span className="text-7xl font-black">{question.original.n}</span>
                      <div className="w-24 h-3 bg-emerald-400 my-4 rounded-full"></div>
                      <span className="text-7xl font-black">{question.original.d}</span>
                    </motion.div>
                    
                    <span className="text-6xl text-white font-black">×</span>

                    {/* 정답 분수 뒤집기 액션 */}
                    <motion.div 
                      initial={{ rotateX: 0, scale: 1 }}
                      animate={{ rotateX: 180, scale: 1.2 }}
                      transition={{ duration: 0.8, type: "spring" }}
                      className="flex flex-col items-center text-pink-400 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]"
                    >
                      <span className="text-7xl font-black">{selectedAns?.n}</span>
                      <div className="w-24 h-3 bg-pink-400 my-4 rounded-full"></div>
                      <span className="text-7xl font-black">{selectedAns?.d}</span>
                    </motion.div>
                  </div>
                )}
                
                {animatingState === 'merging' && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1.2, 1], opacity: 1, rotate: [0, 360] }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.6 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <div className="relative flex items-center justify-center w-64 h-64 bg-gradient-to-tr from-amber-300 to-yellow-500 rounded-full shadow-[0_0_80px_rgba(251,191,36,0.8)] border-4 border-white">
                      <Star className="absolute opacity-50 w-full h-full text-white animate-spin-slow" />
                      <span className="text-9xl font-black text-white drop-shadow-2xl z-10">1</span>
                    </div>
                    <motion.p 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-8 text-3xl font-black text-amber-300 drop-shadow-md"
                    >
                      역수의 결합 = 완벽한 '1'! ✨
                    </motion.p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 구원 투수 스피커 (강조) */}
          <button 
            onClick={() => {
              if (question.original.d === 1) {
                playVoice(`철수야, 숫자 ${question.original.n}은 사실 1분의 ${question.original.n}과 똑같아! 이걸 뒤집으면 어떻게 될까?`);
              } else {
                playVoice(`철수야, 아래에 있는 ${question.original.d}를 위로, 위에 있는 ${question.original.n}을 아래로 휙! 뒤집어봐!`);
              }
            }}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 px-8 rounded-full mb-6 border-2 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-transform hover:scale-110 active:scale-95 animate-bounce"
          >
            🔊 선생님 힌트 듣기!
          </button>

          {/* 타겟 분수 카드 (직접 터치해서 뒤집어볼 수 있는 물리 카드) */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ rotateX: manualFlip ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            onClick={() => setManualFlip(!manualFlip)}
            className={`flex flex-col items-center justify-center p-8 rounded-[2rem] border-4 mb-10 min-w-[200px] shadow-[0_0_50px_rgba(255,255,255,0.1)] backdrop-blur-md cursor-pointer group transition-all duration-300 ${manualFlip ? 'bg-pink-900/80 border-pink-400 shadow-[0_0_30px_rgba(236,72,153,0.6)]' : 'bg-indigo-900/80 border-dashed border-indigo-400 hover:bg-indigo-800'}`}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div style={{ transform: manualFlip ? "rotateX(180deg)" : "none" }}>
               <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-sm font-bold text-amber-300 bg-amber-900/80 px-4 py-1 rounded-full whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-md">
                 👇 {manualFlip ? '본래 숫자로 돌아오기!' : '카드를 터치해서 뒤집어봐!'}
               </div>

               {manualFlip ? (
                 <div className="flex flex-col items-center drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]">
                   <span className="text-[5rem] leading-none font-black text-white">{question.answer.n}</span>
                   <div className="w-24 h-3 bg-pink-400 my-4 rounded-full"></div>
                   <span className="text-[5rem] leading-none font-black text-white">{question.answer.d}</span>
                 </div>
               ) : question.original.d === 1 ? (
                 <span className="text-[6rem] leading-none font-black text-white px-6 drop-shadow-lg">{question.original.n}</span>
               ) : (
                 <div className="flex flex-col items-center drop-shadow-lg">
                   <span className="text-[5rem] leading-none font-black text-white">{question.original.n}</span>
                   <div className="w-24 h-3 bg-indigo-300 my-4 rounded-full"></div>
                   <span className="text-[5rem] leading-none font-black text-white">{question.original.d}</span>
                 </div>
               )}
            </div>
          </motion.div>

          {/* 4지 선다 버튼 영역 */}
          <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
            {question.options.map((opt, idx) => (
              <motion.button 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                key={idx}
                onClick={() => handleAnswer(opt)}
                className="flex flex-col items-center justify-center p-6 bg-indigo-900/60 hover:bg-emerald-600/60 rounded-3xl border-2 border-indigo-600/50 hover:border-emerald-400 transition-colors cursor-pointer shadow-xl backdrop-blur-sm group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {opt.d === 1 ? (
                  <span className="text-6xl font-extrabold text-indigo-100 group-hover:text-white transition-colors">{opt.n}</span>
                ) : (
                  <>
                    <span className="text-5xl font-extrabold text-indigo-100 group-hover:text-white transition-colors">{opt.n}</span>
                    <div className="w-14 h-1.5 bg-indigo-300 group-hover:bg-white my-2.5 rounded-full transition-colors"></div>
                    <span className="text-5xl font-extrabold text-indigo-100 group-hover:text-white transition-colors">{opt.d}</span>
                  </>
                )}
              </motion.button>
            ))}
          </div>

          {/* 콤보 이펙트 */}
          {combo > 1 && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.8, y: 10 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               className="absolute bottom-6 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-500 animate-pulse drop-shadow-md"
             >
               🔥 {combo} 콤보 폭발! 시간이 늘어나요! 🔥
             </motion.div>
          )}

        </div>
      ) : (
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center justify-center flex-grow w-full z-10"
        >
          <div className="text-[6rem] leading-none font-black mb-6 text-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]">시간 초과! ⏱️</div>
          <div className="text-3xl text-indigo-200 mb-10 font-bold">최종 점수: <span className="text-emerald-400 text-5xl">{score}</span>점</div>
          <button 
            onClick={resetGame}
            className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-900 font-extrabold rounded-full text-2xl shadow-2xl transition-transform hover:scale-110 border-4 border-emerald-200"
          >
            다시 중력 반전 마법 도전하기!
          </button>
        </motion.div>
      )}

    </div>
  );
}
