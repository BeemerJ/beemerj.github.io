document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');
    const progressContainer = document.getElementById('progressContainer');
    const resultContainer = document.getElementById('resultContainer');
    const fileListContainer = document.createElement('div');
    document.body.insertBefore(fileListContainer, progressContainer);

    fileInput.addEventListener('change', updateFileList);

    function updateFileList() {
        const files = fileInput.files;
        fileListContainer.innerHTML = '<h3>Selected Files:</h3>';
        const list = document.createElement('ul');
        for (let file of files) {
            const item = document.createElement('li');
            item.textContent = file.name;
            list.appendChild(item);
        }
        fileListContainer.appendChild(list);
    }

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

        const channelOption = document.querySelector('input[name="channels"]:checked').value;

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === "Files uploaded successfully") {
                    return fetch('/convert', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ channels: channelOption })
                    });
                }
            })
            .then(response => response.blob())
            .then(blob => {
                const channelOption = document.querySelector('input[name="channels"]:checked').value;
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `converted_audio_${channelOption}.zip`;
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