document.addEventListener('DOMContentLoaded', () => {
    const file_video = document.getElementById('file-video');
    const summary = document.getElementById('summary');
    const btnProcess = document.getElementById('btn-process');
    const btnDownload = document.getElementById('btn-download');

    const alertEmpty = document.getElementById('alert-empty');
    const alertBadFormat = document.getElementById('alert-bad-format');
    const alertSuccess = document.getElementById('alert-success');

    const hideAlerts = () => {
        alertEmpty.style.display = 'none';
        alertBadFormat.style.display = 'none';
        alertSuccess.style.display = 'none';
    };

    btnProcess.addEventListener('click', async () => {
        hideAlerts();

        const file = file_video.files[0];

        if (!file){
            alertEmpty.style.display = 'block';
            return;
        }

        if (file.type !== 'video/mp4') {
            alertBadFormat.style.display = 'block';
            return;
        }

        const reader = new FileReader();

        reader.onload = async (event) => {
            
            const base64 = reader.result.split(',')[1];

            try {
                // Simulate a call to the backend API
                const response = await fetch('https://localhost:5000/process-video', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ video: base64 })
                });

                if (!response.ok) {
                    // Alerta de error de servidor
                }

                const data = await response.json();
                summary.value = data.summary;
                alertSuccess.style.display = 'block';

            } catch (error) {
                console.error('Error:', error);
            }
        };
        reader.readAsDataURL(file);
    });

    btnDownload.addEventListener('click', () => {

    });
});