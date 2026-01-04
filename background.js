// Simple background worker - just handles downloads
console.log("Background service worker loaded.");

// State tracking
let isRecorderWindowActive = false;

// Listen for messages
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // console.log('Background received:', msg.type);

  if (msg.type === 'download-recording') {
    console.log('Downloading file, size:', msg.size, 'bytes');

    // Convert base64 to blob and download
    fetch(msg.data)
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const filename = msg.filename;

        return chrome.downloads.download({
          url: url,
          filename: filename,
          saveAs: false
        });
      })
      .then(downloadId => {
        console.log('Download started:', downloadId);
        sendResponse({ ok: true, downloadId });
      })
      .catch(err => {
        console.error('Error downloading:', err);
        sendResponse({ ok: false, error: err.message });
      });

    return true;
  }

  // Track recording state
  if (msg.type === 'recorder-status') {
    isRecorderWindowActive = msg.isRecording;
    console.log('Recorder status updated:', isRecorderWindowActive);
  }

  // Answer query from popup
  if (msg.type === 'get-recording-status') {
    sendResponse({ isRecording: isRecorderWindowActive });
  }

  return false;
});

// Listen for keyboard commands
chrome.commands.onCommand.addListener((command) => {
  console.log('Command received:', command);

  if (command === 'stop-recording') {
    // Send stop signal to all views (popup and recorder window)
    chrome.runtime.sendMessage({ type: 'command-stop' }).catch(() => {
      // Ignore errors if no listeners (app closed)
    });
  }
});