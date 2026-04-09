export const STUDENT_CONFIG = {
  learnerName: '철수',
  subject: '역수와 비례식',
  voiceSettings: {
    gender: 'female', // 'male' or 'female'
    pitch: 1.2, // 여성스럽고 생기있는 톤
    rate: 1.1,  // 약간 빠르고 경쾌한 속도
    tone: '친절한 해요체',
  },
  theme: {
    primaryColor: 'amber',
    secondaryColor: 'orange',
  },
  greetings: {
    welcome: '🎉 {{learnerName}}야, 오늘도 {{subject}} 마법을 즐겁게 시작해볼까요? 화이팅! 🚀',
    success: '우와! {{learnerName}} 최고예요! 완벽해요!',
    encourage: '괜찮아요, {{learnerName}}! 다시 한번 천천히 해볼까요?',
  }
};

export const getParsedMessage = (msgTemplate: string) => {
  return msgTemplate
    .replace(/{{learnerName}}/g, STUDENT_CONFIG.learnerName)
    .replace(/{{subject}}/g, STUDENT_CONFIG.subject);
};
