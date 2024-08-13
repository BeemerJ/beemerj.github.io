document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');
    const progressContainer = document.getElementById('progressContainer');
    const resultContainer = document.getElementById('resultContainer');

    uploadButton.addEventListener('click', () => {
        const files = fileInput.files;
        if (files.length === 0) {
            alert('Please select at least one audio file.');
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('file', files[i]);
        }

        progressContainer.innerHTML = 'Converting...';

        fetch('/convert', {
            method: 'POST',
            body: formData
        })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'converted_audio.zip';
            progressContainer.innerHTML = 'Conversion complete!';
            resultContainer.innerHTML = '<p>Click to download:</p>';
            resultContainer.appendChild(a);
            a.click();
        })
        .catch(error => {
            console.error('Error:', error);
            progressContainer.innerHTML = 'An error occurred during conversion.';
        });
    });
});