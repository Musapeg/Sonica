document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audioElement');
    const btn = document.getElementById('playButton');
    const flames = document.querySelectorAll('.flame');
    
    let audioCtx, analyser, dataArray, source;

    btn.addEventListener('click', () => {
        // 1. Inicializar el contexto de audio
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioCtx.createAnalyser();
            
            // CONEXIÓN CRÍTICA:
            source = audioCtx.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioCtx.destination);
            
            analyser.fftSize = 64; 
            dataArray = new Uint8Array(analyser.frequencyBinCount);
        }

        // 2. Intentar reproducir
        if (audio.paused) {
            // Forzar el reinicio del contexto si estaba suspendido (común en Chrome)
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            audio.play().then(() => {
                btn.innerText = "⏸ PAUSAR";
                render();
            }).catch(err => {
                console.error("Error al reproducir:", err);
                alert("Error: Asegúrate de que musica.mp3 esté en la carpeta principal de GitHub.");
            });
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
            let index = Math.floor(i * (dataArray.length / flames.length));
            let val = dataArray[index] / 150; 
            // Aplicamos la escala (el 0.3 es el tamaño mínimo de la llama)
            flame.style.transform = `scaleY(${0.3 + val})`;
        });
    }
});

