
export default function RatioDetective() {
  return (
    <div className="p-8 text-center text-white bg-slate-900 rounded-[2rem] shadow-2xl h-full flex flex-col items-center justify-center">
      <h2 className="text-5xl font-black mb-6 text-purple-400 drop-shadow-md">[3단계] 숫자의 비밀 탐정 🔍</h2>
      <p className="text-2xl text-slate-300 font-bold max-w-2xl leading-relaxed">
        피자를 나누고 돈을 환전하는 일상의 비밀을 풀어봐! <br/>
        <span className="text-purple-300 bg-purple-950/50 px-2 rounded">역수(물구나무 숫자)</span>를 알면 너도 천재 탐정!
      </p>
      {/* TODO: 스토리텔링 UI 및 저울 애니메이션 구현 */}
    </div>
  );
}
