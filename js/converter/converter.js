Dropzone.options.fileDropzone = {
    paramName: "file",
    maxFilesize: 8, // MB
    autoProcessQueue: false,
    acceptedFiles: ".mp3,.wav,.flac,.ogg",
    init: function () {
        var myDropzone = this;
        document.getElementById("convert-button").addEventListener("click", function () {
            myDropzone.processQueue();
        });

        this.on("queuecomplete", function () {
            const channel = document.getElementById("channels").value;
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
                    a.download = 'converted_audio.zip';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
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