document.addEventListener('DOMContentLoaded', function () {
    console.log('Converter script loaded');

    Dropzone.options.fileDropzone = {
        paramName: "file",
        maxFilesize: 8,
        autoProcessQueue: false,
        acceptedFiles: ".mp3,.wav,.flac,.ogg",
        init: function () {
            var myDropzone = this;
            document.getElementById('convert-button').addEventListener('click', function (e) {
                e.preventDefault();
                console.log('Convert button clicked');
                myDropzone.processQueue();
            });

            this.on("queuecomplete", function () {
                console.log('Queue complete, starting conversion');
                const channel = document.querySelector('input[name="channels"]:checked').value;
                fetch('/convert', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ channels: channel })
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => { throw err; });
                    }
                    return response.blob();
                })
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = 'converted_audio.zip';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('Error during conversion:', error);
                    alert('An error occurred during conversion: ' + error.message);
                });
            });

            this.on("uploadprogress", function (file, progress) {
                const progressBar = document.getElementById("progress-bar");
                progressBar.style.width = progress + "%";
                progressBar.setAttribute("aria-valuenow", progress);
                progressBar.innerText = Math.round(progress) + "%";
            });
        }
    };
});