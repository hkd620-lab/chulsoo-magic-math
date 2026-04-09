import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { STUDENT_CONFIG, playVoice } from '../../student_config';

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
  
  // Ref for reaction time calculation
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 타이머 틱
  useEffect(() => {
    if (isGameOver) return;
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
  }, [isGameOver]);

  const handleAnswer = (selected: {n: number, d: number}) => {
    if (isGameOver) return;
    
    const reactionTime = (Date.now() - startTimeRef.current) / 1000;
    const isCorrect = selected.n === question.answer.n && selected.d === question.answer.d;

    if (isCorrect) {
      playVoice(STUDENT_CONFIG.greetings.success);
      setScore(s => s + 10 * masteryLevel);
      setCombo(c => c + 1);
      
      // [점진적 과부하 로직] 1초 미만 반응 시 무조건 레벨 증가
      if (reactionTime < 1.0) {
        setMasteryLevel(lvl => Math.min(lvl + 1, 3));
      }

      setQuestion(generateQuestion(masteryLevel));
      setTimeLeft(prev => Math.min(prev + 3.0, 10.0)); // 보너스
      startTimeRef.current = Date.now();
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
    startTimeRef.current = Date.now();
    playVoice(`좋아요 ${STUDENT_CONFIG.learnerName}! 마법 연습을 씩씩하게 다시 시작해봐요!`);
  };

  return (
    <div className="p-8 text-center text-white bg-slate-900 rounded-[2rem] shadow-2xl h-full flex flex-col items-center relative overflow-hidden">
      
      {/* ----------------- 대시보드 인디케이터 ----------------- */}
      <div className="w-full flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="bg-slate-800 px-6 py-3 rounded-2xl text-amber-400 font-bold text-xl border border-slate-700">
            레벨: {masteryLevel}
          </div>
          <div className="bg-slate-800 px-6 py-3 rounded-2xl text-emerald-400 font-bold text-xl border border-slate-700">
            점수: {score}
          </div>
        </div>
        <div className="bg-transparent border border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)] px-6 py-3 rounded-2xl text-pink-400 font-black text-xl">
           ⏱️ {timeLeft.toFixed(1)}초
        </div>
      </div>

      <h2 className="text-4xl font-black mb-4 text-emerald-400 drop-shadow-md">[1단계] 스피드 뒤집기 대장 🤸‍♂️</h2>
      <p className="text-xl text-slate-300 font-bold max-w-3xl leading-relaxed mb-6">
        1초 만에 <span className="text-emerald-300 bg-emerald-950/50 px-2 rounded">"물구나무 숫자(역수)"</span>를 찾으면 레벨이 빨리 올라가요!
      </p>

      {!isGameOver ? (
        <div className="flex w-full h-full flex-col items-center justify-center">
          
          {/* 타겟 문제 */}
          <div className="flex flex-col items-center justify-center p-8 bg-slate-800/80 rounded-[2rem] border-4 border-dashed border-emerald-500/50 mb-10 min-w-[200px] shadow-inner">
             {question.original.d === 1 ? (
               <span className="text-[6rem] leading-none font-black">{question.original.n}</span>
             ) : (
               <>
                 <span className="text-[5rem] leading-none font-black">{question.original.n}</span>
                 <div className="w-20 h-2.5 bg-white my-3 rounded-full"></div>
                 <span className="text-[5rem] leading-none font-black">{question.original.d}</span>
               </>
             )}
          </div>

          {/* 4지 선다 버튼 영역 */}
          <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
            {question.options.map((opt, idx) => (
              <button 
                key={idx}
                onClick={() => handleAnswer(opt)}
                className="flex flex-col items-center justify-center p-6 bg-slate-800 hover:bg-emerald-600/40 rounded-3xl border-2 border-slate-600 hover:border-emerald-400 transition-all cursor-pointer shadow-lg active:scale-95 hover:-translate-y-1"
              >
                {opt.d === 1 ? (
                  <span className="text-6xl font-extrabold">{opt.n}</span>
                ) : (
                  <>
                    <span className="text-5xl font-extrabold">{opt.n}</span>
                    <div className="w-14 h-1.5 bg-white my-2.5 rounded-full"></div>
                    <span className="text-5xl font-extrabold">{opt.d}</span>
                  </>
                )}
              </button>
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
          className="flex flex-col items-center justify-center flex-grow w-full"
        >
          <div className="text-[6rem] leading-none font-black mb-6 text-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]">시간 초과! ⏱️</div>
          <div className="text-3xl text-slate-300 mb-10 font-bold">최종 점수: <span className="text-emerald-400 text-5xl">{score}</span>점</div>
          <button 
            onClick={resetGame}
            className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold rounded-full text-2xl shadow-2xl transition-transform hover:scale-110"
          >
            다시 마법 도전하기!
          </button>
        </motion.div>
      )}

    </div>
  );
}
