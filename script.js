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
                const response = await fetch('http://localhost:5000/process-video', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ Video: base64 })
                });

                if (!response.ok) {
                    console.log("error de servidor")
                }

                const data = await response.json();
                console.log("si es ", data.resumed_text);
                summary.value = data.resumed_text;
                alertSuccess.style.display = 'block';

            } catch (error) {
                console.error('Error:', error);
            }
        };
        reader.readAsDataURL(file);
    });

    btnDownload.addEventListener('click', () => {
        hideAlerts();
        
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