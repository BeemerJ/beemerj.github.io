var filesInProgress = 0;

Dropzone.options.fileDropzone = {
    paramName: "file",
    maxFilesize: 64, // MB
    autoProcessQueue: false,
    acceptedFiles: ".mp3,.wav,.flac,.ogg",
    init: function () {
        var myDropzone = this;
        var downloadButton = document.getElementById("convert-button");

        downloadButton.addEventListener("click", function () {
            myDropzone.processQueue();
        });

        this.on("addedfile", function (file) {
            filesInProgress++;
            downloadButton.disabled = false;
        });

        this.on("processing", function () {
            downloadButton.disabled = true;
        });

        this.on("success", function (file) {
            filesInProgress--;
            if (filesInProgress === 0) {
                downloadButton.disabled = false;
            }
        });

        this.on("queuecomplete", function () {
            if (filesInProgress === 0) {
                const channel = document.querySelector('input[name="channels"]:checked').value;
                fetch('/convert', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ channels: channel })
                })
                    .then(response => response.blob())
                    .then(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = `${channel}_output.zip`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                    });
            }
        });

        this.on("uploadprogress", function (file, progress) {
            const progressBar = document.getElementById("progress-bar");
            progressBar.style.width = progress + "%";
            progressBar.setAttribute("aria-valuenow", progress);
            progressBar.innerText = Math.round(progress) + "%";
        });
    }
};

function checkDownloadButtonState() {
    var downloadButton = document.getElementById("convert-button");
    if (filesInProgress === 0) {
        downloadButton.disabled = false;
    } else {
        downloadButton.disabled = true;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    var downloadButton = document.getElementById("convert-button");
    downloadButton.disabled = true;
});