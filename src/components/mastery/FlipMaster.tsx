import React from 'react';

export default function FlipMaster() {
  return (
    <div className="p-8 text-center text-white bg-slate-900 rounded-xl shadow-2xl h-full flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-4 text-emerald-400">[초급] Flip Master</h2>
      <p className="text-gray-300">역수의 형태를 직관적이고 빠르게 인지하는 스피드 퀴즈 컴포넌트 뼈대입니다.</p>
      {/* TODO: 점진적 과부하 알고리즘 연동 및 UI 구현 */}
    </div>
  );
}
