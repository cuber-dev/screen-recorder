        let mediaRecorder;
        let recordedChunks = [];
        let startButton = document.getElementById('startButton');
        let stopButton = document.getElementById('stopButton');
        let fileNameInput = document.getElementById('fileName');
        let fileExtensionInput = document.getElementById('fileExtension');

        startButton.addEventListener('click', startRecording);
        stopButton.addEventListener('click', stopRecording);

        function startRecording() {
            recordedChunks = [];
            const displayMediaOptions = {
                video: {
                    cursor: 'always'
                },
                audio: false
            };

            navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
                .then((stream) => {
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.ondataavailable = handleDataAvailable;
                    mediaRecorder.start();
                    startButton.disabled = true;
                    stopButton.disabled = false;
                })
                .catch((error) => {
                    console.error('Error accessing screen capture:', error);
                });
        }

        function handleDataAvailable(event) {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        }

        function stopRecording() {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
                mediaRecorder.onstop = handleStopRecording;
                startButton.disabled = false;
                stopButton.disabled = true;
            }
        }

        function handleStopRecording() {
            const fileName = fileNameInput.value || 'screen_recording';
            const extension = fileExtensionInput.value || 'mp4';
            const blob = new Blob(recordedChunks, { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName + '.' + extension;
            a.click();
            URL.revokeObjectURL(url);
        }