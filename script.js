const audio = document.getElementById("audioElement");
const button = document.getElementById("playButton");

let analyser, dataArray;

button.addEventListener("click", async () => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const src = ctx.createMediaElementSource(audio);

  analyser = ctx.createAnalyser();
  analyser.fftSize = 128;

  const bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  src.connect(analyser);
  analyser.connect(ctx.destination);

  audio.play();
});

const flames = document.querySelectorAll(".flame");

function animateFlames() {
  requestAnimationFrame(animateFlames);

  if (!analyser) return;

  analyser.getByteFrequencyData(dataArray);

  flames.forEach((flame, i) => {
    const value = dataArray[i % dataArray.length];

    const scale = value / 255;

    flame.style.transform = `scaleY(${1 + scale * 3})`;

    // CAMBIO DE COLOR (simulación de sales)
    if (value < 85) {
      flame.setAttribute("fill", "#00bbff"); // azul (cobre)
    } else if (value < 170) {
      flame.setAttribute("fill", "#ffb400"); // naranja (sodio)
    } else {
      flame.setAttribute("fill", "#b000ff"); // violeta (potasio)
    }
  });
}

animateFlames();
