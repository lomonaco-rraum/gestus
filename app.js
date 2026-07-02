let pathPoints = [];
let isRecording = false;

const btnRecord = document.getElementById('btn-record');
const btnExport = document.getElementById('btn-export');

btnRecord.addEventListener('click', () => {
    isRecording = !isRecording;
    btnRecord.textContent = isRecording ? "Detener Rastro" : "Iniciar Rastro";
    btnExport.style.display = isRecording ? "none" : "block";
});

// Captura el movimiento del teléfono (Orientación)
window.addEventListener('deviceorientation', (event) => {
    if (!isRecording) return;
    
    pathPoints.push({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
        timestamp: Date.now()
    });
});

// Exportar datos
btnExport.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pathPoints));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "rastro_gestus.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});