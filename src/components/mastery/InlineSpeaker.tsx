import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { playVoice } from '../../student_config';

interface InlineSpeakerProps {
  message: string;
}

export default function InlineSpeaker({ message }: InlineSpeakerProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 엘리먼트의 클릭 이벤트 방지
    if (isSpeaking) return;
    
    playVoice(
      message,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  return (
    <button
      onClick={handlePlay}
      className={`inline-flex items-center justify-center p-2 mx-2 rounded-full transition-all border-2 shrink-0 shadow-md transform hover:scale-110 active:scale-95 ${
        isSpeaking 
          ? 'bg-pink-100 border-pink-400 text-pink-500 animate-pulse ring-4 ring-pink-500/30' 
          : 'bg-indigo-900 border-indigo-400 text-amber-300 hover:bg-indigo-800'
      }`}
      aria-label="선생님 설명 듣기"
      title="설명 듣기"
    >
      <Volume2 size={24} strokeWidth={isSpeaking ? 3 : 2.5} />
    </button>
  );
}
