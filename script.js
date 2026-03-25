document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audioElement');
    const btn = document.getElementById('playButton');
    const flames = document.querySelectorAll('.flame');
    
    let audioCtx, analyser, dataArray, source;

    btn.addEventListener('click', async () => {
        try {
            // 1. Iniciar motor de audio
            if (!audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                audioCtx = new AudioContext();
                analyser = audioCtx.createAnalyser();
                
                source = audioCtx.createMediaElementSource(audio);
                source.connect(analyser);
                analyser.connect(audioCtx.destination);
                
                analyser.fftSize = 64; 
                dataArray = new Uint8Array(analyser.frequencyBinCount);
            }

            // 2. Despertar audio si el navegador lo bloqueó
            if (audioCtx.state === 'suspended') {
                await audioCtx.resume();
            }

            // 3. Reproducir o Pausar
            if (audio.paused) {
                await audio.play();
                btn.innerText = "⏸ PAUSAR";
                render();
            } else {
                audio.pause();
                btn.innerText = "▶ REPRODUCIR";
            }
        } catch (error) {
            console.error("Error crítico de audio:", error);
            alert("No se pudo reproducir. Asegúrate de que tu archivo se llame exactamente 'musica.mp3' en GitHub.");
        }
    });

    function render() {
        if (audio.paused) return;
        requestAnimationFrame(render);
        
        analyser.getByteFrequencyData(dataArray);

        flames.forEach((flame, i) => {
            let index = Math.floor(i * (dataArray.length / flames.length));
            let val = dataArray[index] / 150; 
            flame.style.transform = `scaleY(${0.3 + val})`;
        });
    }
});

