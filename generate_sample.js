import fs from 'fs';

const API_KEY = "AIzaSyD_yP-Q5vWDNAhbQlAnnguqCs-rWlAXi0U";
const ssml = `<speak>
  <p>안녕, 철수야! 나는 너의 스마트한 멘토, 제미나이야.</p>
  <p>혹시 역수가 무엇인지 아니? 역수는 분자와 분모의 자리를 위아래로 훌라당 바꾼 숫자를 말해.</p>
  <p>예를 들어, 3분의 2의 역수는 2분의 3이 되는 거지!</p>
  <p>자, 여기서 놀라운 마법이 일어나! 원래의 숫자와 그 역수를 곱하면, 분모와 분자가 서로 약분되면서 항상 1로 변한단다. 속력과 시간이 반비례하는 것처럼, 서로가 서로를 채워주어 온전한 하나가 되는 원리지. 정말 신기하지 않니?</p>
</speak>`;

async function generateAudio() {
  try {
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: { ssml: ssml },
        voice: { languageCode: 'ko-KR', name: 'ko-KR-Chirp3-HD-Aoede' },
        audioConfig: { audioEncoding: 'MP3' }
      })
    });
    
    if (!response.ok) {
        console.error("error:", response.status, await response.text());
        return;
    }
    const data = await response.json();
    if (data.audioContent) {
        fs.writeFileSync('gemini_audio_sample_principle_of_reciprocal.mp3', Buffer.from(data.audioContent, 'base64'));
        console.log("Audio saved to gemini_audio_sample_principle_of_reciprocal.mp3");
    } else {
        console.log("No audio content in response");
    }
  } catch (err) {
    console.error(err);
  }
}

generateAudio();
