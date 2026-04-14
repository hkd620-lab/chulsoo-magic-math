import { useState } from 'react';
// Force Vite HMR rebuild
import { motion } from 'framer-motion';
import { BookOpen, Layers, RotateCcw, Pizza, Lock, Crown } from 'lucide-react';
import InlineSpeaker from './InlineSpeaker';
import { playVoice } from '../../student_config';

// 재사용 가능한 미니 퀴즈 시스템 컴포넌트
function ConceptQuiz({ 
  type, 
  onPass 
}: { 
  type: 'fraction' | 'reciprocal' | 'denominator', 
  onPass: () => void 
}) {
  const [qIndex, setQIndex] = useState(0);
  const [showReward, setShowReward] = useState(false);

  // 1. 분수 퀴즈 (3문제: 피자 맞추기)
  const fractionQs = [
    { pizza: '1/4', n: 1, d: 4, options: ['1/4', '4/1', '1/3'], ans: 0 },
    { pizza: '2/5', n: 2, d: 5, options: ['5/2', '2/5', '1/5'], ans: 1 },
    { pizza: '3/6', n: 3, d: 6, options: ['1/6', '6/3', '3/6'], ans: 2 }
  ];

  // 2. 역수 퀴즈 (3문제: 뒤집기 액션)
  const reciprocalQs = [
    { target: { n: 2, d: 3 }, ans: { n: 3, d: 2 }, options: [{ n: 3, d: 2 }, { n: 2, d: 1 }] },
    { target: { n: 4, d: 5 }, ans: { n: 5, d: 4 }, options: [{ n: 1, d: 4 }, { n: 5, d: 4 }] },
    { target: { n: 1, d: 7 }, ans: { n: 7, d: 1 }, options: [{ n: 7, d: 1 }, { n: 1, d: 5 }] }
  ];

  // 3. 통분 퀴즈 (3문제: 분모 맞추기)
  const denominatorQs = [
    { target: '1/2 과 1/3을 더하려면 그릇의 크기(분모)를 뭘로 맞춰야 할까?', options: ['5', '6', '12'], ans: 1 },
    { target: '1/4 과 1/5 가 있어. 공통 분모는?', options: ['20', '9', '15'], ans: 0 },
    { target: '통분은 무엇을 똑같이 맞추는 마법인가요?', options: ['분자 (위쪽 개수)', '분모 (아래쪽 모양 크기)', '아무거나'], ans: 1 }
  ];

  const handleAnswerFraction = (idx: number) => {
    if (idx === fractionQs[qIndex].ans) {
      playVoice('정답이야! 훌륭해!');
      if (qIndex === 2) {
        triggerPass();
      } else {
        setQIndex(prev => prev + 1);
      }
    } else {
      playVoice('앗, 분모와 분자의 차이를 다시 한번 위에서 들어볼까?');
    }
  };

  const handleAnswerReciprocal = (opt: {n: number, d: number}, ans: {n: number, d: number}) => {
    if (opt.n === ans.n && opt.d === ans.d) {
      playVoice('정답이야! 숫자가 물구나무를 섰어!');
      if (qIndex === 2) {
        triggerPass();
      } else {
        setQIndex(prev => prev + 1);
      }
    } else {
      playVoice('위아래가 완전히 바뀐 역수 마법을 찾아보자!');
    }
  };

  const handleAnswerDenominator = (idx: number) => {
    if (idx === denominatorQs[qIndex].ans) {
      playVoice('좋았어! 통분의 달인이네!');
      if (qIndex === 2) {
        triggerPass();
      } else {
        setQIndex(prev => prev + 1);
      }
    } else {
      playVoice('그릇의 모양을 똑같이 맞춰야 더할 수 있어! 최소공배수를 생각해보자.');
    }
  };

  const triggerPass = () => {
    setShowReward(true);
    playVoice('와! 마법을 마스터했어! 관문을 통과합니다!');
    setTimeout(() => {
      setShowReward(false);
      onPass();
    }, 3000);
  };

  if (showReward) {
    return (
       <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 rounded-3xl text-center shadow-[0_0_40px_rgba(16,185,129,0.5)] my-6">
         <Crown size={80} className="text-yellow-300 mx-auto animate-bounce mb-4" />
         <h3 className="text-4xl font-black text-white">마법 마스터! 관문 오픈! 🌟</h3>
       </motion.div>
    );
  }

  return (
    <div className="bg-indigo-900/50 p-6 rounded-3xl border-2 border-indigo-500/50 my-6 flex flex-col items-center max-w-2xl mx-auto shadow-inner w-full">
      <div className="text-amber-300 font-bold mb-4 bg-indigo-950 px-4 py-1 rounded-full border border-indigo-700">미니 퀴즈 {qIndex + 1}/3</div>
      
      {type === 'fraction' && (
        <div className="flex flex-col items-center w-full">
           <div className="text-2xl font-black mb-6 text-indigo-100 bg-slate-800 p-4 rounded-xl text-center w-full">다음 피자가 나타내는 분수는? <span className="text-emerald-400">({fractionQs[qIndex].n}개의 조각이 칠해짐, 전체 {fractionQs[qIndex].d}조각)</span></div>
           <div className="flex gap-4">
             {fractionQs[qIndex].options.map((opt, i) => (
               <button key={i} onClick={() => handleAnswerFraction(i)} className="text-4xl font-black bg-indigo-600 hover:bg-emerald-500 text-white w-24 h-24 rounded-2xl transition-transform hover:scale-105 active:scale-95 shadow-md border-b-4 border-indigo-800">
                 {opt}
               </button>
             ))}
           </div>
        </div>
      )}

      {type === 'reciprocal' && (
        <div className="flex flex-col items-center w-full">
           <div className="text-2xl font-black mb-6 text-indigo-100 bg-slate-800 p-4 rounded-xl text-center w-full">아래 분수의 역수를 눌러 뒤집어보자!</div>
           <div className="flex items-center gap-10">
             <div className="flex flex-col items-center text-amber-300 font-black text-5xl opacity-50 bg-slate-800 p-4 rounded-2xl">
               <span>{reciprocalQs[qIndex].target.n}</span>
               <div className="w-12 h-1.5 bg-amber-300 my-2 rounded-full"></div>
               <span>{reciprocalQs[qIndex].target.d}</span>
             </div>
             <span className="text-4xl">👉</span>
             <div className="flex gap-4">
               {reciprocalQs[qIndex].options.map((opt, i) => (
                 <motion.button 
                   whileTap={{ rotateX: 180 }}
                   key={i} 
                   onClick={() => handleAnswerReciprocal(opt, reciprocalQs[qIndex].ans)} 
                   className="flex flex-col items-center text-4xl font-black bg-indigo-600 hover:bg-emerald-500 text-white w-24 h-32 rounded-2xl justify-center transition-colors shadow-md border-b-4 border-indigo-800"
                   style={{ transformStyle: "preserve-3d" }}
                 >
                   <span>{opt.n}</span>
                   <div className="w-10 h-1 bg-white my-1 rounded-full"></div>
                   <span>{opt.d}</span>
                 </motion.button>
               ))}
             </div>
           </div>
        </div>
      )}

      {type === 'denominator' && (
        <div className="flex flex-col items-center w-full">
           <div className="text-xl md:text-2xl font-black mb-6 text-indigo-100 bg-slate-800 p-4 rounded-xl text-center w-full">{denominatorQs[qIndex].target}</div>
           <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
             {denominatorQs[qIndex].options.map((opt, i) => (
               <button key={i} onClick={() => handleAnswerDenominator(i)} className="text-xl md:text-2xl font-black bg-emerald-600 hover:bg-teal-500 text-white px-6 py-4 rounded-2xl transition-transform hover:scale-105 active:scale-95 shadow-md border-b-4 border-emerald-800 flex-1">
                 {opt}
               </button>
             ))}
           </div>
        </div>
      )}
    </div>
  );
}


export default function ConceptLibrary() {
  const [levelUnlock, setLevelUnlock] = useState(1);

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-900 text-slate-100 p-4 md:p-8 rounded-[2rem] custom-scrollbar relative border border-slate-700 shadow-inner block">
      
      <header className="mb-12 text-center relative z-10 w-full flex flex-col items-center">
        <div className="flex items-center justify-center bg-blue-600/20 w-20 h-20 rounded-full mb-4">
          <BookOpen className="text-blue-400" size={40} />
        </div>
        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 mb-6 drop-shadow-lg flex items-center justify-center">
          기초 마법서 📚
        </h2>
        <div className="text-base md:text-xl text-slate-300 font-bold max-w-2xl flex items-center justify-center px-4">
          <InlineSpeaker message="게임을 시작하기 전, 이곳에서 가장 기본이 되는 분수, 역수, 통분의 의미를 정복하세요! 각 단계를 통과해야 다음 챕터가 열립니다." />
          <span>각 챕터 끝의 미니 퀴즈를 모두 맞춰야 다음 챕터의 잠금이 해제됩니다!</span>
        </div>
      </header>

      <div className="flex flex-col gap-16 w-full max-w-5xl mx-auto pb-10">
        
        {/* ==================================================== */}
        {/* 1. 분수란 무엇인가 (Level 1) */}
        {/* ==================================================== */}
        <div className="bg-slate-800 p-6 md:p-10 rounded-3xl border-2 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.1)] flex flex-col items-center w-full">
          {/* 동기 부여 실생활 스토리텔링 */}
          <div className="w-full bg-slate-900 rounded-3xl overflow-hidden mb-8 border border-slate-700 shadow-md">
            <div className="h-64 md:h-80 w-full relative">
              <img src="/images/pizza.png" alt="피자 파티" className="object-cover w-full h-full opacity-60 mix-blend-lighten" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-6">
                 <h4 className="text-2xl md:text-3xl font-black text-amber-400 drop-shadow-md mb-2 flex items-center gap-2"><Pizza/> [나눔의 마법] 피자 파티</h4>
                 <p className="text-sm md:text-lg text-slate-100 font-bold bg-slate-900/80 p-3 md:p-4 rounded-xl border border-slate-600 flex items-center gap-3">
                   <InlineSpeaker message="철수야, 우리가 피자를 똑같이 나눠 먹지 못하면 누군가는 슬퍼지겠지? 그래서 분수 마법이 필요한 거야!" />
                   <span className="leading-relaxed whitespace-pre-wrap">"철수야, 우리가 피자를 똑같이 나눠 먹지 못하면 누군가는 슬퍼지겠지?\n그래서 분수 마법이 필요한 거야!"</span>
                 </p>
              </div>
            </div>
          </div>

          <h3 className="text-3xl font-black text-blue-300 mb-8 flex items-center justify-center gap-3 w-full text-center">
            <Pizza className="text-blue-400" /> 1. 분수(Fraction)는 '나눔의 미학'
            <InlineSpeaker message="분수는 단순히 위아래 숫자를 적은 게 아니에요. 전체를 똑같이 나눈 것 중의 일부를 뜻합니다." />
          </h3>
          <div className="flex flex-col lg:flex-row gap-10 items-center justify-center w-full mb-8">
            <div className="flex-1 space-y-4 text-lg text-slate-300 text-center lg:text-left">
              <p className="flex items-center gap-2 flex-wrap justify-center lg:justify-start">
                <span>분수는 전체를 똑같이 나눈 것 중의 일부를 뜻합니다.</span>
              </p>
              <ul className="mt-4 space-y-4 text-indigo-200 bg-slate-900/50 p-6 rounded-xl border border-slate-700/50 text-left">
                <li className="flex items-start">
                  <InlineSpeaker message="분모란, 전체 피자를 몇 조각으로 똑같이 나누었는지를 말해요. 아래에 있는 숫자 4가 바로 분모랍니다." />
                  <div>
                    <strong className="text-blue-300">분모 (아래 숫자 4):</strong> 전체 피자를 <span className="text-white">몇 조각</span>으로 똑같이 나누었는가?
                  </div>
                </li>
                <li className="flex items-start mt-4">
                  <InlineSpeaker message="분자란, 그 중에서 내가 선택한 피자가 몇 조각인지를 말해요. 위에 있는 숫자 3이 바로 분자랍니다." />
                  <div>
                    <strong className="text-cyan-300">분자 (위 숫자 3):</strong> 그 중에서 내가 선택한 피자는 <span className="text-white">몇 조각</span>인가?
                  </div>
                </li>
              </ul>
            </div>
            <div className="shrink-0 w-48 h-48 bg-slate-700/50 rounded-full flex items-center justify-center relative overflow-hidden border-4 border-slate-600 shadow-xl mx-auto">
               <div className="w-full h-full bg-blue-500" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0, 50% 0)' }}></div>
               <div className="absolute font-black text-5xl text-white drop-shadow-2xl">3/4</div>
            </div>
          </div>
          
          {levelUnlock === 1 ? (
            <ConceptQuiz type="fraction" onPass={() => setLevelUnlock(2)} />
          ) : (
             <div className="text-emerald-400 font-bold bg-emerald-900/50 px-6 py-2 rounded-full mt-4">✅ 미니 퀴즈 통과 완료!</div>
          )}
        </div>

        {/* ==================================================== */}
        {/* 2. 역수란 무엇인가 (Level 2) */}
        {/* ==================================================== */}
        <div className={`transition-all duration-1000 ${levelUnlock >= 2 ? 'opacity-100 translate-y-0' : 'opacity-50 grayscale pointer-events-none'}`}>
          <div className="bg-slate-800 p-6 md:p-10 rounded-3xl border-2 border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.1)] relative">
            {levelUnlock < 2 && (
              <div className="absolute inset-0 z-20 flex flex-col bg-slate-950/80 items-center justify-center rounded-3xl backdrop-blur-sm">
                <Lock size={60} className="text-slate-400 mb-4" />
                <span className="text-slate-300 font-bold text-xl">이전 관문을 통과하세요!</span>
              </div>
            )}
            
            {/* 동기 부여 실생활 스토리텔링 */}
            <div className="w-full bg-slate-900 rounded-3xl overflow-hidden mb-8 border border-slate-700 shadow-md mt-6">
              <div className="h-64 md:h-80 w-full relative">
                <img src="/images/car.png" alt="자동차 경주" className="object-cover w-full h-full opacity-60 mix-blend-lighten" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-6">
                   <h4 className="text-2xl md:text-3xl font-black text-amber-400 drop-shadow-md mb-2">[반전의 마법] 스피드와 시간</h4>
                   <p className="text-sm md:text-lg text-slate-100 font-bold bg-slate-900/80 p-3 md:p-4 rounded-xl border border-slate-600 flex items-center gap-3">
                     <InlineSpeaker message="자동차 경주를 해볼까? 거리가 같을 때 속력이 2배 빨라지면 걸리는 시간은 2분의 1로 뚝 떨어져! 역수의 원리지!" />
                     <span className="leading-relaxed">거리가 같을 때 속력이 <span className="text-amber-400 text-2xl mx-1">2배</span> 빨라지면 시간은 <span className="text-emerald-400 text-2xl mx-1">1/2</span>로 줄어든다! <br className="hidden md:block"/>(속력 × 시간 = 1)</span>
                   </p>
                </div>
              </div>
            </div>

            <h3 className="text-3xl font-black text-pink-300 mb-6 flex items-center gap-3">
              <RotateCcw className="text-pink-400" /> 2. 역수(Reciprocal), 물구나무 서는 숫자
              <InlineSpeaker message="역수는 분모와 분자가 서로 자리를 바꾼 숫자입니다. 곱하면 마법처럼 1이 되죠!" />
            </h3>
            <div className="flex flex-col lg:flex-row gap-8 items-center mb-8">
              <div className="flex-1 space-y-6 text-lg text-slate-300">
                <p className="flex items-center">
                  역수는 분모와 분자가 <strong>서로 자리를 바꾼(위아래가 뒤집힌) 수</strong>입니다.
                </p>
                <div className="bg-slate-900/50 p-6 rounded-xl text-center font-black text-3xl flex items-center justify-center gap-4 text-white">
                  <span className="flex flex-col items-center"><span>3</span><div className="w-8 h-1 bg-white my-1"></div><span>4</span></span>
                  <span className="text-pink-400 mx-2">×</span>
                  <span className="flex flex-col items-center text-pink-300"><span>4</span><div className="w-8 h-1 bg-pink-300 my-1"></div><span>3</span></span>
                  <span className="text-emerald-400 mx-2">=</span>
                  <span className="text-emerald-300 text-5xl">1</span>
                </div>
                <p className="flex items-center bg-slate-900 border border-slate-700 p-4 rounded-xl text-slate-300">
                  <InlineSpeaker message="나눗셈을 할 때는 곱하기로 바꾸고, 뒤의 숫자를 역수로 뒤집어주면 계산이 훨씬 쉬워져요!" />
                  <span className="text-base md:text-lg">나눗셈(÷)을 할 때는 곱하기(×)로 바꾸고 뒤의 숫자를 <b>역수</b>로 뒤집어주면 계산이 훨씬 쉬워져요!</span>
                </p>
              </div>
            </div>

            {levelUnlock === 2 ? (
              <ConceptQuiz type="reciprocal" onPass={() => setLevelUnlock(3)} />
            ) : levelUnlock > 2 ? (
               <div className="text-emerald-400 text-center font-bold bg-emerald-900/50 px-6 py-2 rounded-full mt-4">✅ 뒤집기 퀴즈 통과 완료!</div>
            ) : null}
          </div>
        </div>

        {/* ==================================================== */}
        {/* 3. 통분이란 무엇인가 (Level 3) */}
        {/* ==================================================== */}
        <div className={`transition-all duration-1000 ${levelUnlock >= 3 ? 'opacity-100 translate-y-0' : 'opacity-50 grayscale pointer-events-none'}`}>
          <div className="bg-slate-800 p-6 md:p-10 rounded-3xl border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)] relative">
            {levelUnlock < 3 && (
              <div className="absolute inset-0 z-20 flex flex-col bg-slate-950/80 items-center justify-center rounded-3xl backdrop-blur-sm">
                <Lock size={60} className="text-slate-400 mb-4" />
                <span className="text-slate-300 font-bold text-xl">역수 관문을 통과하세요!</span>
              </div>
            )}

            {/* 동기 부여 실생활 스토리텔링 */}
            <div className="w-full bg-slate-900 rounded-3xl overflow-hidden mb-8 border border-slate-700 shadow-md mt-6">
              <div className="h-64 md:h-80 w-full relative">
                <img src="/images/exchange.png" alt="환율 교환" className="object-cover w-full h-full opacity-60 mix-blend-lighten" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-6">
                   <h4 className="text-2xl md:text-3xl font-black text-amber-400 drop-shadow-md mb-2">[교환의 마법] 환율</h4>
                   <p className="text-sm md:text-lg text-slate-100 font-bold bg-slate-900/80 p-3 md:p-4 rounded-xl border border-slate-600 flex items-center gap-3">
                     <InlineSpeaker message="해외 직구를 할 때 1달러가 1,300원이면, 1원은 1300분의 1달러가 돼! 달러와 원화를 바로 섞으면 안되니 공통 기준으로 묶어줘야해!" />
                     <span className="leading-relaxed">해외 직구를 할 때 1달러가 1,300원이면, <span className="text-amber-400 text-xl font-black">1원</span>은 <span className="text-emerald-400 text-xl font-black mx-1">1 / 1,300달러</span>!<br className="hidden md:block"/>기준 모양이 다르면 바로 더할 수 없어 공통 분모가 필요해!</span>
                   </p>
                </div>
              </div>
            </div>

            <h3 className="text-3xl font-black text-emerald-300 mb-6 flex items-center gap-3">
              <Layers className="text-emerald-400" /> 3. 통분(Common Denominator), 그릇 맞추기
              <InlineSpeaker message="통분이란 모양, 즉 분모를 똑같이 만들어주는 과정입니다." />
            </h3>
            <div className="flex flex-col lg:flex-row gap-8 items-center mb-8">
              <div className="flex-1 space-y-6 text-lg text-slate-300">
                <p>
                  덧셈이나 뺄셈을 하려면 <strong>기준(그릇의 크기)이 같아야</strong> 합칠 수 있어요.
                </p>
                <div className="flex items-start">
                  <InlineSpeaker message="1/2과 1/3을 더하려면 어떻게 할까요? 서로 분모 모양이 달라서 그냥 더할 수 없으니, 최소공배수인 6이라는 똑같은 분모로 모양을 맞춰줍니다." />
                  <div className="pl-2">
                    <p>
                      1/2과 1/3을 더하려면 어떻게 할까요? 분모가 달라서 그냥 더할 수 없습니다. <br/> 
                      그래서 <strong className="text-emerald-300">분모를 똑같이 만들어주는 과정</strong>이 통분입니다.
                    </p>
                  </div>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-xl font-bold flex flex-col md:flex-row items-center justify-center gap-6 text-white border border-slate-700">
                   <span className="text-slate-400 line-through decoration-red-500 decoration-4 text-xl">1/2 + 1/3 = 2/5 (X)</span>
                   <span className="text-emerald-400 text-3xl rotate-90 md:rotate-0">👉</span>
                   <span className="text-emerald-300 text-2xl bg-emerald-900/50 px-4 py-2 rounded-lg">3/6 + 2/6 = 5/6 (O)</span>
                </div>
                <p className="flex justify-center items-center text-amber-300 bg-slate-900 p-4 rounded-xl border border-amber-500/30 font-bold shadow-lg">
                  <InlineSpeaker message="모양을 똑같이 맞추면, 개수만 더하면 된다! 이게 통분의 핵심이에요!" />
                  "모양(분모)을 맞추면, 개수(분자)만 더하면 된다!"
                </p>
              </div>
            </div>

            {levelUnlock === 3 ? (
              <ConceptQuiz type="denominator" onPass={() => setLevelUnlock(4)} />
            ) : levelUnlock > 3 ? (
               <div className="text-emerald-400 text-center font-bold bg-emerald-900/50 px-6 py-2 rounded-full mt-4">✅ 기초 마법서 완독 및 마스터 완료! 🎓</div>
            ) : null}
          </div>
        </div>

      </div>
    </div>
  );
}
