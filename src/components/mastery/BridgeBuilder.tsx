import React from 'react';

export default function BridgeBuilder() {
  return (
    <div className="p-8 text-center text-white bg-slate-900 rounded-xl shadow-2xl h-full flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-4 text-indigo-400">[중급] Bridge Builder</h2>
      <p className="text-gray-300">나눗셈이 곱셈으로 변하며 숫자가 물리적으로 뒤집히는 물구나무 애니메이션 컴포넌트 뼈대입니다.</p>
      {/* TODO: Framer Motion 및 'Why First' 모달 연동 */}
    </div>
  );
}
