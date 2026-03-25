const audio = document.getElementById('audioElement');
const btn = document.getElementById('playButton');
const flames = document.querySelectorAll('.flame');
let audioCtx, analyser, dataArray;

btn.addEventListener('click', () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 32;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  }
  if (audio.paused) { audio.play(); btn.innerText = "⏸ PAUSAR"; render(); } 
  else { audio.pause(); btn.innerText = "▶ REPRODUCIR"; }
});

function render() {
  if (audio.paused) return;
  requestAnimationFrame(render);
  analyser.getByteFrequencyData(dataArray);
  flames.forEach((flame, i) => {
    let val = dataArray[i % 8] / 150;
    flame.style.transform = `scaleY(${0.3 + val})`;
  });
}
