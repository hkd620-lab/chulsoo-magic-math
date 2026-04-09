import { useState } from 'react';
import { getParsedMessage, unlockAudio } from '../../student_config';

export default function DebugSoundTest() {
  const [testText, setTestText] = useState("안녕, {{learnerName}}야! 선생님의 또렷한 목소리가 들리니?");
  const [logs, setLogs] = useState<string[]>([]);
  const parsedMsg = getParsedMessage(testText);

  const testWebSpeechAPI = async () => {
    addLog(`[로컬] Web Speech API 음성 재생 테스트: "${parsedMsg}"`);

    // 크롬 Autoplay Policy 해결을 위한 잠금 해제
    await unlockAudio();
    addLog(`[잠금해제] 브라우저 음성 시스템 활성화 완료`);

    if (!window.speechSynthesis) {
      addLog('❌ 브라우저가 Web Speech API를 지원하지 않습니다');
      return;
    }

    // 기존 음성 취소
    window.speechSynthesis.cancel();
    addLog(`[준비] 기존 음성 재생 취소 완료`);

    // Web Speech API 음성 합성
    const utterance = new SpeechSynthesisUtterance(parsedMsg);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9;
    utterance.volume = 1;

    utterance.onstart = () => addLog('✅ 음성 재생 시작 (Web Speech API)');
    utterance.onend = () => addLog('⏹️ 음성 재생 100% 완료 (onended 이벤트 트리거)');
    utterance.onerror = (e) => addLog(`❌ Web Speech API 에러: ${e.error}`);

    addLog(`[실행] speechSynthesis.speak() 호출`);
    window.speechSynthesis.speak(utterance);
  };

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  return (
    <div className="p-8 text-white bg-slate-900 rounded-[2rem] shadow-2xl h-full flex flex-col items-center">
      <h2 className="text-4xl font-black mb-2 text-pink-400">🔧 긴급: 음성 시스템 디버그 콘솔</h2>
      <p className="text-slate-400 mb-8 font-bold">Web Speech API 안정성 테스트 & 크롬 Autoplay Policy 해결 확인</p>
      
      <div className="w-full max-w-2xl bg-slate-800 p-6 rounded-3xl mb-6 border-2 border-slate-700 shadow-xl">
        <h3 className="text-2xl font-bold mb-4 text-emerald-400">1. 철수 맞춤형 문장 변수({}) 파싱 테스트</h3>
        <textarea 
          className="w-full bg-slate-900 p-4 rounded-xl text-white mb-4 border border-slate-600 focus:border-pink-500 outline-none resize-none font-bold text-xl"
          rows={2}
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
        />
        <div className="bg-slate-950 p-4 rounded-xl text-emerald-300 mb-6 border border-emerald-900/50 shadow-inner font-bold text-xl">
          <span className="text-slate-500 mr-2">파싱 결과:</span> {parsedMsg}
        </div>
        
        <button
          onClick={testWebSpeechAPI}
          className="w-full bg-pink-600 hover:bg-pink-500 py-5 rounded-2xl font-black text-2xl shadow-[0_0_20px_rgba(219,39,119,0.4)] transition-all hover:scale-[1.02] active:scale-95"
        >
          🔊 Web Speech API 음성 재생 테스트
        </button>
      </div>

      <div className="w-full max-w-2xl bg-black p-6 rounded-3xl flex-grow overflow-y-auto border border-slate-800 font-mono text-sm shadow-inner relative">
        <h3 className="text-slate-500 font-bold mb-4 pb-2 border-b border-slate-800 sticky top-0 bg-black pt-2 z-10">
          ▶ 시스템 사운드 에러 로그 분석기 (Log Output):
        </h3>
        <div className="text-green-400/90 leading-relaxed space-y-1">
          {logs.map((log, i) => (
            <div key={i} className={log.includes('❌') ? 'text-red-400 font-bold bg-red-900/20 py-1' : ''}>
              {log}
            </div>
          ))}
          {logs.length === 0 && <div className="text-slate-600 italic">버튼을 눌러 통신을 시작하세요...</div>}
        </div>
      </div>
    </div>
  );
}
