import React from 'react';

export default function FlipMaster() {
  return (
    <div className="p-8 text-center text-white bg-slate-900 rounded-[2rem] shadow-2xl h-full flex flex-col items-center justify-center">
      <h2 className="text-5xl font-black mb-6 text-emerald-400 drop-shadow-md">[1단계] 뒤집기 대장 🤸‍♂️</h2>
      <p className="text-2xl text-slate-300 font-bold max-w-2xl leading-relaxed">
        숫자를 훌라당 뒤집어 <span className="text-emerald-300 bg-emerald-950/50 px-2 rounded">"역수(물구나무 숫자)"</span>를 찾아봐! <br/>
        1초 만에 찾으면 너도 이제 뒤집기 대장!
      </p>
      {/* TODO: 점진적 과부하 알고리즘 연동 및 UI 구현 */}
    </div>
  );
}
