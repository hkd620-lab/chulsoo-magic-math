import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { playVoice } from '../../student_config';

// 더미 퀴즈 데이터 생성기
const generateQuizzes = () => {
  const quizzes = [];
  // [하 - 기초 이미지/개념 문제]: 1~7번
  for (let i = 0; i < 7; i++) {
    quizzes.push({
      id: i + 1,
      level: '초급',
      question: '다음 분수의 역수(물구나무 숫자)는 무엇일까요?',
      original: { n: i + 2, d: i + 3 },
      options: [
        { n: i + 3, d: i + 2 },
        { n: i + 2, d: i + 3 },
        { n: i + 1, d: i + 2 }
      ],
      answerIndex: 0
    });
  }
  // [중 - 식 변환 과정]: 8~14번
  for (let i = 7; i < 14; i++) {
    quizzes.push({
      id: i + 1,
      level: '중급',
      question: '나눗셈(÷)을 곱셈(×)으로 바꿀 때 올바른 식은?',
      equation: `5 ÷ ${i}/3`,
      options: [
        `5 × 3/${i}`,
        `5 × ${i}/3`,
        `1/5 × 3/${i}`
      ],
      answerIndex: 0
    });
  }
  // [상 - 실생활 추리 미션]: 15~20번
  for (let i = 14; i < 20; i++) {
    quizzes.push({
      id: i + 1,
      level: '고급',
      question: '수영이가 피자 1판을 1/4조각씩 나누어 먹으려 합니다. 몇 명에서 먹을 수 있을까요?',
      equation: `1 ÷ 1/4 = ?`,
      options: [
        `4명 (1 × 4/1)`,
        `2명 (1 × 2/4)`,
        `1명 (1 × 1/4)`
      ],
      answerIndex: 0
    });
  }
  return quizzes;
};

const QUIZZES = generateQuizzes();

export default function MetacognitionQuest() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [rewardLevel, setRewardLevel] = useState(1);

  const currentQuiz = QUIZZES[currentIndex];
  

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(idx);
    const correct = idx === currentQuiz.answerIndex;
    setIsCorrect(correct);
    if (correct) {
       setScore(s => s + 10);
       playVoice("정답입니다! 대단해요!");
    } else {
       playVoice("앗, 실수! 다시 한 번 찬찬히 생각해볼까요?");
    }
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    
    // 5문제 단위 마법 보상 팝업 체크
    if (isCorrect && nextIndex % 5 === 0 && nextIndex <= 20) {
      setRewardLevel(nextIndex / 5);
      setShowReward(true);
      playVoice(`우와! 벌써 ${nextIndex}문제를 돌파했어요! 엄청난 마법력이 솟아나요!`);
      return;
    }

    proceedNext();
  };

  const proceedNext = () => {
    setShowReward(false);
    setSelectedOption(null);
    setIsCorrect(null);
    if (currentIndex < 19) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="w-full h-full bg-slate-900 overflow-y-auto text-slate-100 p-6 rounded-[2rem] relative custom-scrollbar flex flex-col">
      
      <header className="mb-8 text-center shrink-0 mt-4">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-md">
          도전! 마법 퀴즈 🔮
        </h2>
        <p className="text-lg text-slate-400 mt-2">초급부터 고급까지 총 20개의 퀘스트를 달성하라!</p>
      </header>

      {/* 진행도 프로그레스바 */}
      <div className="w-full max-w-4xl mx-auto mb-8 shrink-0">
        <div className="flex justify-between text-sm font-bold text-slate-400 mb-2">
          <span>진행도: {currentIndex + 1} / 20</span>
          <span className="text-amber-400">마력 점수: {score}</span>
        </div>
        <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / 20) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {currentIndex < 20 ? (
        <div className="flex-grow flex flex-col items-center justify-center p-4">
           {/* 문제 카드 */}
           <motion.div 
             key={currentIndex}
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-slate-800 border-2 border-purple-500/30 p-8 md:p-12 rounded-[3.5rem] w-full max-w-4xl shadow-[0_0_40px_rgba(168,85,247,0.15)] flex flex-col"
           >
             <div className="flex items-center gap-3 mb-6">
                <span className={`px-4 py-2 rounded-full font-black text-sm ${currentQuiz.level === '초급' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : currentQuiz.level === '중급' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                  {currentQuiz.level} 난이도
                </span>
                <span className="text-slate-400 font-bold">Quest {currentQuiz.id}</span>
             </div>
             
             <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed">
               {currentQuiz.question}
             </h3>

             {/* UI: 식이나 분수 렌더링 */}
             <div className="bg-slate-900/80 p-8 rounded-3xl flex justify-center items-center mb-10 h-32 border border-slate-700/50 shadow-inner">
               {currentQuiz.original ? (
                 <div className="flex flex-col items-center text-4xl font-black text-amber-300 drop-shadow-md">
                   <span>{currentQuiz.original.n}</span>
                   <div className="w-12 h-1.5 bg-amber-300 my-2 rounded-full"></div>
                   <span>{currentQuiz.original.d}</span>
                 </div>
               ) : (
                 <div className="text-4xl md:text-5xl font-black text-emerald-300 tracking-wider">
                   {currentQuiz.equation}
                 </div>
               )}
             </div>

             {/* 보기 영역 */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
               {currentQuiz.options.map((opt, idx) => (
                 <button
                   key={idx}
                   disabled={selectedOption !== null}
                   onClick={() => handleSelect(idx)}
                   className={`p-6 rounded-2xl text-xl font-bold transition-all border-2 flex flex-col items-center justify-center min-h-[100px] ${
                     selectedOption === null 
                       ? 'bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-purple-400 text-slate-200'
                       : selectedOption === idx 
                          ? (idx === currentQuiz.answerIndex ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-red-600/20 border-red-500 text-red-400')
                          : (idx === currentQuiz.answerIndex ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : 'bg-slate-800/50 border-slate-700 text-slate-500')
                   }`}
                 >
                   {typeof opt === 'string' ? (
                     <span>{opt}</span>
                   ) : (
                     <div className="flex flex-col items-center">
                       <span>{opt.n}</span>
                       <div className="w-8 h-1 bg-current my-1 rounded-full"></div>
                       <span>{opt.d}</span>
                     </div>
                   )}
                 </button>
               ))}
             </div>

             {/* 결과 및 다음 버튼 */}
             <AnimatePresence>
               {selectedOption !== null && (
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="flex justify-between items-center bg-slate-900 border border-slate-700 p-6 rounded-2xl"
                 >
                   <div className="flex items-center gap-4">
                     {isCorrect ? (
                       <><CheckCircle2 className="text-emerald-500" size={40} /><span className="text-2xl font-black text-emerald-400">정답! 훌륭해요!</span></>
                     ) : (
                       <><XCircle className="text-red-500" size={40} /><span className="text-2xl font-black text-red-400">아쉬워요, 다시 해봐요!</span></>
                     )}
                   </div>
                   <button 
                     onClick={handleNext}
                     className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-8 py-4 rounded-full font-black text-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
                   >
                     {currentIndex === 19 ? '결과 보기' : '다음 문제'} <ChevronRight />
                   </button>
                 </motion.div>
               )}
             </AnimatePresence>
           </motion.div>
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center p-4 z-10 w-full h-full">
           <div className="bg-slate-800/80 p-16 rounded-[4rem] border-4 border-amber-500 shadow-[0_0_100px_rgba(251,191,36,0.3)] text-center w-full max-w-4xl backdrop-blur-md">
             <Trophy size={100} className="text-amber-400 mx-auto mb-8 animate-bounce" />
             <h2 className="text-6xl font-black text-white mb-6">마법 퀴즈 완수! 🎉</h2>
             <p className="text-3xl text-slate-300 mb-10">최종 마력 점수: <span className="text-amber-400 font-black text-5xl">{score}</span>점</p>
             <button 
               onClick={() => { setCurrentIndex(0); setScore(0); setSelectedOption(null); setIsCorrect(null); }}
               className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-900 font-extrabold rounded-full text-2xl shadow-xl transition-transform hover:scale-110"
             >
               새로운 마법 퀴즈 다시하기 🔄
             </button>
           </div>
        </div>
      )}

      {/* 4. 마법 보상 팝업 시스템 (매 5문제마다) */}
      <AnimatePresence>
        {showReward && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-gradient-to-tr from-purple-800 to-indigo-900 p-12 rounded-[4rem] text-center max-w-2xl border-8 border-yellow-400 shadow-[0_0_100px_rgba(251,191,36,0.6)] relative overflow-hidden"
            >
              {/* 반짝이 효과 */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,255,255,0.3)_350deg,transparent_360deg)] pointer-events-none"></motion.div>
              
              <Crown size={120} className="text-yellow-400 mx-auto mb-6 relative z-10" />
              <h2 className="text-5xl font-black text-white mb-6 relative z-10 drop-shadow-lg">
                마법력 Lv.{rewardLevel} 달성! 🌟
              </h2>
              <p className="text-2xl text-indigo-200 mb-10 relative z-10 font-bold">
                어려운 관문을 돌파했습니다! <br/>당신의 두뇌 마법력이 한층 강해졌어요!
              </p>
              <button 
                onClick={proceedNext}
                className="relative z-10 px-10 py-5 bg-yellow-400 hover:bg-yellow-300 text-amber-900 font-black rounded-full text-2xl shadow-2xl transition-transform hover:scale-110 active:scale-95"
              >
                계속해서 다음 퀴즈 도전! 🚀
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
