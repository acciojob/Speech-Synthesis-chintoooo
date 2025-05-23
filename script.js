const textInput = document.getElementById("text-input");
const voiceSelect = document.getElementById("voice-select");
const rateInput = document.getElementById("rate");
const pitchInput = document.getElementById("pitch");
const rateValue = document.getElementById("rate-value");
const pitchValue = document.getElementById("pitch-value");
const speakBtn = document.getElementById("speak");
const stopBtn = document.getElementById("stop");

const synth = window.speechSynthesis;
let voices = [];
let utterance;

function populateVoices() {
  voices = synth.getVoices();
  voiceSelect.innerHTML = "";

  if (voices.length === 0) {
    const option = document.createElement("option");
    option.textContent = "No voices available";
    voiceSelect.appendChild(option);
    voiceSelect.disabled = true;
    return;
  }

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    if (voice.default) option.textContent += " — DEFAULT";
    voiceSelect.appendChild(option);
  });

  voiceSelect.disabled = false;
}

function speakText() {
  const text = textInput.value.trim();
  if (!text || voices.length === 0) return;

  if (synth.speaking) synth.cancel();

  utterance = new SpeechSynthesisUtterance(text);
  const selectedVoice = voices[voiceSelect.value];
  utterance.voice = selectedVoice;
  utterance.rate = parseFloat(rateInput.value);
  utterance.pitch = parseFloat(pitchInput.value);
  synth.speak(utterance);
}

function stopSpeech() {
  if (synth.speaking || synth.pending) {
    synth.cancel();
  }
}

voiceSelect.addEventListener("change", () => {
  if (synth.speaking) {
    stopSpeech();
    speakText();
  }
});

rateInput.addEventListener("input", () => {
  rateValue.textContent = rateInput.value;
  if (synth.speaking) {
    stopSpeech();
    speakText();
  }
});

pitchInput.addEventListener("input", () => {
  pitchValue.textContent = pitchInput.value;
  if (synth.speaking) {
    stopSpeech();
    speakText();
  }
});

speakBtn.addEventListener("click", speakText);
stopBtn.addEventListener("click", stopSpeech);

if (typeof speechSynthesis !== "undefined") {
  populateVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
  }
}
