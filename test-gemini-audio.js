import fs from 'fs';

const API_KEY = "AIzaSyD_yP-Q5vWDNAhbQlAnnguqCs-rWlAXi0U";
const text = "역수란, 분자와 분모의 자리를 뒤집은 수를 말해요. 그래서 원래 숫자와 역수를 곱하면 항상 1이 되는 원리랍니다!";

async function generateAudio() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: text }]
        }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Aoede"
              }
            }
          }
        }
      })
    });
    
    if (!response.ok) {
        console.error("error:", response.status, await response.text());
        return;
    }
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2).substring(0, 500) + '...');
    
    // Check if parts contain inlineData with mimeType audio/mp3
    if (data.candidates && data.candidates[0].content.parts) {
        const audioPart = data.candidates[0].content.parts.find(p => p.inlineData && p.inlineData.mimeType && p.inlineData.mimeType.startsWith("audio/"));
        if (audioPart) {
            fs.writeFileSync('sample_audio.mp3', Buffer.from(audioPart.inlineData.data, 'base64'));
            console.log("Audio saved to sample_audio.mp3");
        } else {
            console.log("No audio part found!");
        }
    }
  } catch (err) {
    console.error(err);
  }
}

generateAudio();
