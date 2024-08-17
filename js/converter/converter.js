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

    let allFiles = [];

    fileInput.addEventListener('change', () => {
        const newFiles = Array.from(fileInput.files);
        allFiles = [...allFiles, ...newFiles];
        updateFileList();
        fileInput.value = ''; // Reset file input
    });

    function updateFileList() {
        fileListContainer.innerHTML = '<h3>Selected Files:</h3>';
        const list = document.createElement('ul');
        allFiles.forEach((file, index) => {
            const item = document.createElement('li');
            item.textContent = `${file.name} (${formatFileSize(file.size)})`;
            item.onclick = () => removeFile(index);
            list.appendChild(item);
        });
        fileListContainer.appendChild(list);
    }

    function removeFile(index) {
        allFiles.splice(index, 1);
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