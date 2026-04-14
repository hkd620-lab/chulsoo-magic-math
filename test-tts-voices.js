import fs from 'fs';

const API_KEY = "AIzaSyD_yP-Q5vWDNAhbQlAnnguqCs-rWlAXi0U";

async function getVoices() {
  try {
    const response = await fetch(`https://texttospeech.googleapis.com/v1/voices?key=${API_KEY}`);
    const data = await response.json();
    const koVoices = data.voices.filter(v => v.languageCodes.includes('ko-KR'));
    console.log(koVoices.map(v => v.name));
  } catch (err) {
    console.error(err);
  }
}

getVoices();
