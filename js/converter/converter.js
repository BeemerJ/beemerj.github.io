document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const addFilesButton = document.getElementById('addFilesButton');
    const fileListContainer = document.getElementById('fileListContainer');
    const progressContainer = document.getElementById('progressContainer');
    const logContainer = document.getElementById('logContainer');
    const resultContainer = document.getElementById('resultContainer');
    const elapsedTimeContainer = document.getElementById('elapsedTimeContainer');

    let startTime;

    addFilesButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', updateFileList);

    function updateFileList() {
        const files = fileInput.files;
        fileListContainer.innerHTML = '<h3>Selected Files:</h3>';
        const list = document.createElement('ul');
        for (let file of files) {
            const item = document.createElement('li');
            const removeIcon = document.createElement('span');
            removeIcon.textContent = '❌';
            removeIcon.className = 'remove-icon';
            removeIcon.onclick = () => removeFile(file);
            item.appendChild(removeIcon);
            item.appendChild(document.createTextNode(`${file.name} (${formatFileSize(file.size)})`));
            list.appendChild(item);
        }
        fileListContainer.appendChild(list);
    }

    function removeFile(fileToRemove) {
        const dt = new DataTransfer();
        for (let file of fileInput.files) {
            if (file !== fileToRemove) dt.items.add(file);
        }
        fileInput.files = dt.files;
        updateFileList();
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function updateLog(message) {
        const logEntry = document.createElement('p');
        logEntry.textContent = message;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    function updateElapsedTime() {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        elapsedTimeContainer.textContent = `Elapsed Time: ${elapsedSeconds} seconds`;
    }

    uploadButton.addEventListener('click', () => {
        const files = fileInput.files;
        if (files.length === 0) {
            alert('Please select at least one audio file.');
            return;
        }

        startTime = Date.now();
        const elapsedTimeInterval = setInterval(updateElapsedTime, 1000);

        const formData = new FormData();
        for (let file of files) {
            formData.append('file', file);
        }

        progressContainer.innerHTML = '<div class="loading-spinner"></div>';
        updateLog('Starting conversion...');

        const channelOption = document.querySelector('input[name="channels"]:checked').value;

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === "Files uploaded successfully") {
                    updateLog('Files uploaded successfully. Starting conversion...');
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
                clearInterval(elapsedTimeInterval);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `converted_audio_${channelOption}.zip`;
                progressContainer.innerHTML = `Conversion complete! Saved file size: ${formatFileSize(blob.size)}`;
                updateLog('Conversion completed successfully.');
                resultContainer.innerHTML = '<p>Click to download:</p>';
                a.textContent = 'Download Converted Audio';
                resultContainer.appendChild(a);
            })
            .catch(error => {
                clearInterval(elapsedTimeInterval);
                console.error('Error:', error);
                progressContainer.innerHTML = 'An error occurred during conversion.';
                updateLog(`Error: ${error.message}`);
            });
    });
});