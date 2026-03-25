document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audioElement');
    const btn = document.getElementById('playButton');
    const flames = document.querySelectorAll('.flame');
    
    let audioCtx, analyser, dataArray;

    btn.addEventListener('click', () => {
        // Crear el contexto de audio solo tras el clic del usuario (Regla de Chrome)
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioCtx.createAnalyser();
            const source = audioCtx.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioCtx.destination);
            
            // Sensibilidad de las llamas
            analyser.fftSize = 64; 
            dataArray = new Uint8Array(analyser.frequencyBinCount);
        }

        if (audio.paused) {
            audio.play().then(() => {
                btn.innerText = "⏸ PAUSAR";
                render();
            }).catch(err => console.log("Error al reproducir audio:", err));
        } else {
            audio.pause();
            btn.innerText = "▶ REPRODUCIR";
        }
    });

    function render() {
        if (audio.paused) return;
        requestAnimationFrame(render);
        
        analyser.getByteFrequencyData(dataArray);

        flames.forEach((flame, i) => {
            // Calculamos el movimiento basado en la frecuencia de la música
            let index = Math.floor(i * (dataArray.length / flames.length));
            let val = dataArray[index] / 160; 
            
            // CORRECCIÓN CLAVE: Sin barras invertidas ni símbolos extraños
            flame.style.transform = `scaleY(${0.3 + val})`;
        });
    }
});
