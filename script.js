document.addEventListener('DOMContentLoaded', () => {
    const file_video = document.getElementById('file-video');
    const summary = document.getElementById('summary');
    const btnProcess = document.getElementById('btn-process');
    const btnDownload = document.getElementById('btn-download');

    const alertEmpty = document.getElementById('alert-empty');
    const alertBadFormat = document.getElementById('alert-bad-format');
    const alertSuccess = document.getElementById('alert-success');
    const alertBadServer = document.getElementById('alert-bad-server');

    const fileName = document.getElementById('file-p');

    const hideAlerts = () => {
        alertEmpty.style.display = 'none';
        alertBadFormat.style.display = 'none';
        alertSuccess.style.display = 'none';
        alertBadServer.style.display = 'none';
    };

    hideAlerts();

    const enableBtnProcess = () => {
        btnProcess.disabled = false;
        btnProcess.textContent = 'Procesar Video';
    };

    file_video.addEventListener('change', async() => {
        const file = file_video.files[0];
        if (file) {
            fileName.textContent = `Video cargado: ${file.name}`;
        } else {
            fileName.textContent = 'Haz clic para subir, o arrastra el video aquí';
        }
    });

    btnProcess.addEventListener('click', async () => {

        hideAlerts();
        btnProcess.disabled = true;
        btnProcess.textContent = 'Procesando...';

        const file = file_video.files[0];

        if (!file) {
            enableBtnProcess();
            alertEmpty.style.display = 'block';
            return;
        }

        if (file.type !== 'video/mp4') {
            enableBtnProcess();
            alertBadFormat.style.display = 'block';
            return;
        }

        const reader = new FileReader();

        reader.onload = async () => {
            const base64 = reader.result.split(',')[1];
            try {
                const response = await fetch('http://localhost:5000/process-video', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ Video: base64 })
                });

                if (!response.ok) {
                    alertBadServer.style.display = 'block';
                }

                const data = await response.json();
                summary.value = data.resumed_text;
                alertSuccess.style.display = 'block';

                btnDownload.disabled = false;
                enableBtnProcess();
            } catch (error) {
                alertBadServer.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);
    });

    btnDownload.addEventListener('click', () => {

        hideAlerts();

        if (!summary.value) {
            alertEmpty.style.display = 'block';
            btnDownload.disabled = true;
            return; 
        }

        const summaryText = summary.value;
        const blob = new Blob([summaryText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'video_resumen.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});