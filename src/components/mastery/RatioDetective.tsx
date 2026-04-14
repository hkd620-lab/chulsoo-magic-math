import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playVoice } from '../../student_config';
import { Search, Trophy, CheckCircle2, XCircle } from 'lucide-react';
import InlineSpeaker from './InlineSpeaker';

// 20개의 실생활 추리 미션 데이터 (속력/시간, 환율 달러/원, 피자/레시피 등)
const DETECTIVE_MISSIONS = [
  { subject: '속력', type: 'speed', q: '거리가 일정할 때, 자동차 속력을 2배 올렸어. 걸리는 시간은 어떻게 될까?', ans: '1/2 배', options: ['1/2 배', '2 배', '4 배'], exp: '속력과 시간은 완전 반대! 역수 관계야.' },
  { subject: '요리', type: 'recipe', q: '물 1리터에 라면스프 2봉지가 완벽 비율이야. 물 1/2 리터만 넣었다면 스프는 몇 봉지일까?', ans: '1 봉지', options: ['1 봉지', '2 봉지', '1/2 봉지'], exp: '물 양이 반으로 줄었으니 기준(비율)에 따라 스프도 반이어야 해!' },
  { subject: '환율', type: 'money', q: '1달러가 1,300원이야. 그럼 1원은 몇 달러와 같을까?', ans: '1/1300 달러', options: ['1/130 달러', '1/1300 달러', '1300 달러'], exp: '달러에서 원으로 갈 때 1300을 곱했다면, 반대로는 물구나무(1/1300)지!' },
  { subject: '속력', type: 'speed', q: '자전거를 타고 학교에 가. 평소보다 1/3 속력으로 천천히 갔다면 시간은?', ans: '3 배', options: ['1/3 배', '3 배', '9 배'], exp: '속력이 줄어들면 시간은 역수만큼(3) 팍팍 늘어나지!' },
  { subject: '요리', type: 'recipe', q: '수제비 밀가루 3컵당 물 1컵. 밀가루를 9컵 넣으려면 물은 몇 컵?', ans: '3 컵', options: ['1 컵', '3 컵', '9 컵'], exp: '비율이 3:1 이야! 밀가루가 3배 늘어나면 물도 똑같이 3배!' },
  { subject: '환율', type: 'money', q: '1유로가 1,500원이야. 1/1500 유로는 얼마?', ans: '1 원', options: ['10 원', '1 원', '0.1 원'], exp: '1500원의 역수는 1/1500이지! 그래서 1원이야.' },
  { subject: '속력', type: 'speed', q: '거북이가 토끼 속력의 1/4이야. 거리가 같을 때 걸린 시간은?', ans: '4 배', options: ['4 배', '1/4 배', '2 배'], exp: '느린 만큼 시간은 역수인 4배 더 오래 걸려.' },
  { subject: '요리', type: 'recipe', q: '피자 도우 1판에 치즈 200g. 도우 1/4 판만 만든다면 치즈는?', ans: '50g', options: ['100g', '50g', '200g'], exp: '크기가 1/4이 되었으니, 치즈도 200g의 1/4인 50g!' },
  { subject: '환율', type: 'money', q: '1엔이 10원이면, 1원은 몇 엔?', ans: '1/10 엔', options: ['10 엔', '1/10 엔', '100 엔'], exp: '10에서 1로 갈 때는 물구나무 숫자 1/10을 곱해주는 거야!' },
  { subject: '속력', type: 'speed', q: '기차가 버스보다 속력이 3배 빨라. 목적지까지 걸린 시간은 버스의?', ans: '1/3 배', options: ['3 배', '1/3 배', '1/9 배'], exp: '속력과 시간은 정반대 역수 마법!' },
  // 11~20 번은 패턴 반복으로 연습량 보장
  { subject: '요리', type: 'recipe', q: '레몬에이드 시럽 1컵에 물 4컵. 시럽 1/2컵에는 물을 얼만큼?', ans: '2 컵', options: ['2 컵', '4 컵', '8 컵'], exp: '시럽이 반으로 줄었으니 물도 반으로 줄어 2컵이야.' },
  { subject: '환율', type: 'money', q: '1위안이 200원. 1원은 몇 위안?', ans: '1/200 위안', options: ['200 위안', '1/200 위안', '1/20 위안'], exp: '200원과 1원 사이엔 물구나무 1/200이 딱이지!' },
  { subject: '속력', type: 'speed', q: '비행기의 속력이 자동차의 10배야. 걸리는 시간은?', ans: '1/10 배', options: ['10 배', '1/10 배', '1 배'], exp: '빠르면 빠를 수록 시간은 분수로 줄어들어!' },
  { subject: '요리', type: 'recipe', q: '소금 2스푼당 설탕 5스푼(2:5). 설탕을 1스푼만 넣었다면 소금은?', ans: '2/5 스푼', options: ['5/2 스푼', '2/5 스푼', '1 스푼'], exp: '설탕 5에서 1로 갈 때 1/5 역수를 곱했듯 소금도 곱해보자.' },
  { subject: '환율', type: 'money', q: '1파운드가 1,700원이라면, 1원이 되기 위한 파운드는?', ans: '1/1700 파운드', options: ['1700 파운드', '1/1700 파운드', '1/170 파운드'], exp: '이건 이제 쉽지? 곱해서 1이 되는 역수를 찾는 마법!' },
  { subject: '속력', type: 'speed', q: '우주선 속력이 로켓의 1/2이야. 시간은?', ans: '2 배', options: ['1/2 배', '2 배', '4 배'], exp: '속력이 반토막 났으니, 시간은 2배로 길어져.' },
  { subject: '요리', type: 'recipe', q: '밥 4그릇에 카레 1봉. 밥 1그릇 분량의 카레는?', ans: '1/4 봉', options: ['1/4 봉', '4 봉', '1/2 봉'], exp: '그릇 수가 1/4이 되었으니 카레도 1/4 !' },
  { subject: '환율', type: 'money', q: '1호주달러가 900원. 1원은?', ans: '1/900 호주달러', options: ['1/90 호주달러', '900 호주달러', '1/900 호주달러'], exp: '결국 모든 환율의 반대는 역수라는 엄청난 비밀!' },
  { subject: '속력', type: 'speed', q: '달팽이가 개미보다 1/5 느리게 걸어가. 달팽이의 시간은?', ans: '5 배', options: ['1/5 배', '5 배', '10 배'], exp: '느리니까 역수(5)만큼 팍팍팍 곱하는 거야!' },
  { subject: '혼합', type: 'money', q: '최종 관문! 물건 가격이 2배 오르면, 동일한 돈으로 살 수 있는 개수는?', ans: '1/2 배', options: ['2 배', '1/2 배', '변함없음'], exp: '가격과 구매 개수도 결국 역수 관계! 철수 천재!' }
];

export default function RatioDetective() {
  const [isPlayingId, setIsPlayingId] = useState<number | null>(null);
  const [step, setStep] = useState(0); 
  const [missionIdx, setMissionIdx] = useState(0);
  const [, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  
  const mission = DETECTIVE_MISSIONS[missionIdx];

  const handleStart = () => {
    setStep(1);
    playIntroVoice();
  };

  const playIntroVoice = () => {
    playVoice(
      '현실 세계의 마법! 속력, 요리, 환율에 숨겨진 역수 퀴즈 20개를 모두 풀어 탐정 뱃지를 얻자!',
      () => setIsPlayingId(999),
      () => setIsPlayingId(null)
    );
  };

  const playMissionVoice = () => {
    playVoice(
      mission.q,
      () => setIsPlayingId(missionIdx),
      () => setIsPlayingId(null)
    );
  };

  const handleAnswer = (opt: string) => {
    if (opt === mission.ans) {
      setFeedback('correct');
      setScore(s => s + 5);
      playVoice('정답! ' + mission.exp, undefined, () => {
        if (missionIdx < 19) {
          setMissionIdx(missionIdx + 1);
          setFeedback('idle');
        } else {
          setStep(2);
        }
      });
    } else {
      setFeedback('wrong');
      playVoice('아냐, 다시 한번 생각해봐! 단서: ' + mission.exp, undefined, () => setFeedback('idle'));
    }
  };

  const getIcon = (type: string) => {
    if (type === 'speed') return "🏎️";
    if (type === 'recipe') return "🍳";
    return "💵";
  }

  return (
    <div className="p-8 text-center text-white rounded-[2rem] shadow-2xl min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#1a1c29] via-[#2a1b3d] to-[#120f18] border border-purple-500/30">
      
      {/* 배경 생략 처리 - 간소화 */}
      
      <div className="z-10 w-full flex justify-between items-center mb-10 px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-gradient-to-tr from-purple-500 to-pink-600 w-12 h-12 rounded-full border-2 border-white shadow-[0_0_15px_rgba(168,85,247,0.8)]">
            <Search className="text-white" size={24} />
          </div>
          <h2 className="text-3xl font-black text-purple-300 drop-shadow-md">
            [고급] 비밀 탐정 사무소 🔍
          </h2>
        </div>
        {step === 1 && (
           <div className="bg-indigo-950 px-6 py-2 rounded-full font-bold text-emerald-400">사건 {missionIdx + 1} / 20</div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center z-10 w-full max-w-2xl">
            <img src="/images/exchange.png" className="w-full h-48 object-cover rounded-3xl mb-8 opacity-70 border border-slate-600" />
            <p className="text-2xl text-slate-300 font-bold leading-relaxed mb-6 bg-slate-900/60 p-6 rounded-2xl border border-purple-500/30 flex items-center justify-center gap-3">
              <InlineSpeaker message="탐정님, 실생활에 숨겨진 역수와 비례의 규칙을 찾아 20개의 미션을 완수해주세요!" />
              탐정님, 실생활에 숨겨진 역수(비례) 규칙을 찾아 20개의 사건을 해결해주세요!
            </p>
            <button onClick={handleStart} className="px-10 py-5 rounded-full text-2xl font-black bg-pink-500 hover:bg-pink-400 shadow-lg transition-transform hover:scale-105">
              사건 조사 시작! 🚀
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key={missionIdx} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full max-w-3xl z-10 flex flex-col items-center">
            
            <div className="bg-slate-800 p-8 rounded-[3rem] w-full border-2 border-slate-600 shadow-xl mb-8 relative">
              <div className="absolute top-0 right-10 -translate-y-1/2 text-6xl drop-shadow-lg">{getIcon(mission.type)}</div>
              <h3 className="text-3xl font-black text-white leading-relaxed flex items-center gap-4">
                 <button onClick={playMissionVoice} className={`p-4 rounded-full ${isPlayingId === missionIdx ? 'bg-pink-500 animate-pulse' : 'bg-slate-700'}`}>
                   🔊
                 </button>
                 {mission.q}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
               {mission.options.map((opt, i) => (
                 <button 
                   key={i} 
                   onClick={() => handleAnswer(opt)}
                   className={`p-6 rounded-2xl text-2xl font-black transition-all border-b-4 shadow-lg ${feedback === 'idle' ? 'bg-slate-700 hover:bg-emerald-500 border-slate-900' : (opt === mission.ans && feedback === 'correct' ? 'bg-emerald-500 border-emerald-800' : 'bg-slate-800 opacity-50')}`}
                 >
                   {opt}
                 </button>
               ))}
            </div>

            {feedback === 'correct' && (
               <motion.div initial={{ scale:0 }} animate={{ scale:1 }} className="mt-8 text-2xl text-emerald-400 font-bold bg-emerald-900 p-4 rounded-xl flex items-center gap-2"><CheckCircle2/> 정답입니다!</motion.div>
            )}
            {feedback === 'wrong' && (
               <motion.div initial={{ scale:0 }} animate={{ scale:1 }} className="mt-8 text-2xl text-red-400 font-bold bg-red-900 p-4 rounded-xl flex items-center gap-2"><XCircle/> 아냐 다시 생각해봐! 힌트: 스피커를 다시 들어보자!</motion.div>
            )}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="z-10 bg-slate-800 p-12 rounded-[3xl] text-center border-4 border-amber-400 shadow-[0_0_50px_rgba(251,191,36,0.6)]">
             <Trophy size={100} className="text-amber-400 mx-auto mb-6" />
             <h2 className="text-5xl font-black text-white mb-4">탐정 완료! 🔍</h2>
             <p className="text-2xl text-amber-200 font-bold">20개의 최고 난이도 사건을 모두 해결하셨습니다!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
