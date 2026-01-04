// Screen Recorder - Professional Recording
let recorder = null;
let chunks = [];
let activeStream = null;
let micStream = null;
let keepAliveInterval = null;

const recBtn = document.getElementById('rec');
const stopBtn = document.getElementById('stop');
const statusText = document.getElementById('statusText');
const statusDiv = document.getElementById('status');
const autoSaveToggle = document.getElementById('autoSaveToggle');

function updateUI(recording, status) {
    recBtn.disabled = recording;
    stopBtn.disabled = !recording;

    statusDiv.classList.remove('status-idle', 'status-recording', 'status-error', 'status-success');
    
    if (status.includes('Error') || status.includes('Failed')) {
        statusDiv.classList.add('status-error');
        statusText.innerHTML = status;
    } else if (status.includes('Saved') || status.includes('saved')) {
        statusDiv.classList.add('status-success');
        statusText.innerHTML = status;
    } else if (recording) {
        statusDiv.classList.add('status-recording');
        statusText.innerHTML = '<span class="recording-indicator"><span class="recording-dot"></span>' + status + '</span>';
    } else {
        statusDiv.classList.add('status-idle');
        statusText.innerHTML = status;
    }
}

// Get supported MIME type
function getSupportedMimeType() {
    const types = [
        'video/mp4;codecs=avc1.4d002a,mp4a.40.2',
        'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
        'video/mp4',
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm'
    ];

    for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) {
            console.log('Using MIME type:', type);
            return type;
        }
    }

    return 'video/webm';
}

// Cleanup
function cleanup() {
    console.log('Cleaning up...');

    if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
        keepAliveInterval = null;
    }

    if (recorder && recorder.state !== 'inactive') {
        try {
            recorder.stop();
        } catch (e) {
            console.log('Error stopping recorder:', e);
        }
    }

    if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
    }

    if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
    }

    recorder = null;
    chunks = [];
    activeStream = null;
    micStream = null;
}

// Download function
function downloadRecording(blob, mimeType) {
    const extension = mimeType.includes('mp4') ? '.mp4' : '.webm';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `recording-${timestamp}${extension}`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('Download completed:', filename);
    }, 100);
}

// Start recording
recBtn.onclick = async () => {
    console.log('=== START RECORDING ===');
    updateUI(false, 'Initializing...');

    try {
        cleanup();

        // Get desktop capture stream ID
        const streamId = await new Promise((resolve, reject) => {
            chrome.desktopCapture.chooseDesktopMedia(
                ['screen', 'window', 'tab'],
                (id) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else if (!id) {
                        reject(new Error('User cancelled'));
                    } else {
                        resolve(id);
                    }
                }
            );
        });

        // Get screen stream
        const screenConstraints = {
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: streamId,
                    maxWidth: 1920,
                    maxHeight: 1080,
                    maxFrameRate: 30
                }
            },
            audio: false
        };

        activeStream = await navigator.mediaDevices.getUserMedia(screenConstraints);
        console.log('Screen stream acquired');

        // Get microphone (optional)
        try {
            micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            console.log('Microphone acquired');
        } catch (e) {
            console.log('Microphone denied');
            micStream = null;
        }

        // Merge streams
        let finalStream;
        if (micStream && micStream.getAudioTracks().length > 0) {
            const audioCtx = new AudioContext();
            const dest = audioCtx.createMediaStreamDestination();
            const micSource = audioCtx.createMediaStreamSource(micStream);
            micSource.connect(dest);

            finalStream = new MediaStream([
                ...activeStream.getVideoTracks(),
                ...dest.stream.getAudioTracks()
            ]);
            console.log('Audio merged');
        } else {
            finalStream = activeStream;
        }

        // Create recorder
        const mimeType = getSupportedMimeType();
        chunks = [];
        recorder = new MediaRecorder(finalStream, { mimeType });

        recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                chunks.push(e.data);
                console.log('Chunk:', e.data.size, 'bytes');
            }
        };

        recorder.onstop = () => {
            console.log('=== RECORDER STOPPED ===');

            if (activeStream) activeStream.getTracks().forEach(t => t.stop());
            if (micStream) micStream.getTracks().forEach(t => t.stop());

            if (chunks.length === 0) {
                updateUI(false, 'Error: No data recorded');
                return;
            }

            const blob = new Blob(chunks, { type: mimeType });
            console.log('Blob size:', blob.size);

            if (blob.size === 0) {
                updateUI(false, 'Error: Empty recording');
                return;
            }

            // Download the recording
            downloadRecording(blob, mimeType);

            updateUI(false, 'Recording saved');
            setTimeout(() => updateUI(false, 'Ready to record'), 3000);

            // Notify background
            chrome.runtime.sendMessage({ type: 'recorder-status', isRecording: false });

            if (keepAliveInterval) {
                clearInterval(keepAliveInterval);
                keepAliveInterval = null;
            }

            // Restore window
            chrome.windows.getCurrent((window) => {
                chrome.windows.update(window.id, { state: 'normal', focused: true });
            });
        };

        recorder.onerror = (e) => {
            console.error('Recorder error:', e);
            updateUI(false, 'Error occurred');
            cleanup();
        };

        // Minimize window FIRST
        chrome.windows.getCurrent((window) => {
            chrome.windows.update(window.id, { state: 'minimized' });
            console.log('Window minimized');
        });

        // Wait then start recording
        setTimeout(() => {
            recorder.start(1000);
            console.log('Recording started');

            // Notify background
            chrome.runtime.sendMessage({ type: 'recorder-status', isRecording: true });

            keepAliveInterval = setInterval(() => {
                console.log('Keep alive');
            }, 5000);

            updateUI(true, 'Recording...');
        }, 800);

    } catch (error) {
        console.error('Error:', error);
        updateUI(false, 'Failed to start');
        cleanup();

        if (!error.message.includes('cancel')) {
            alert('Failed to start recording: ' + error.message);
        }
    }
};

// Stop recording
stopBtn.onclick = () => {
    console.log('=== STOP BUTTON CLICKED ===');
    updateUI(false, 'Stopping...');

    // Restore window first
    chrome.windows.getCurrent((window) => {
        chrome.windows.update(window.id, { state: 'normal', focused: true });
    });

    if (recorder && recorder.state !== 'inactive') {
        recorder.stop();
    } else {
        updateUI(false, 'Ready to record');
    }
};

// Initialize
console.log('Recorder loaded');
updateUI(false, 'Ready to record');

// Cleanup on close
window.addEventListener('beforeunload', cleanup);

// Listen for stop command (keyboard shortcut)
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'command-stop') {
        console.log('Received stop command');
        if (recorder && recorder.state !== 'inactive') {
            stopBtn.click();
        }
    }
});

// Smart Stop - auto-stop when window focused (only if auto-save is enabled)
window.addEventListener('focus', () => {
    if (recorder && recorder.state === 'recording') {
        // Check auto-save toggle
        const autoSaveEnabled = autoSaveToggle ? autoSaveToggle.checked : true;

        if (autoSaveEnabled) {
            console.log('Smart Stop: Window focused with auto-save enabled');
            stopBtn.click();
        } else {
            console.log('Smart Stop disabled: Auto-save is OFF, waiting for manual STOP');
            // Just restore the window, don't auto-stop
            chrome.windows.getCurrent((window) => {
                chrome.windows.update(window.id, { state: 'normal', focused: true });
            });
        }
    }
});
