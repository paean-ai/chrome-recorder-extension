// Screen Tools - Background Service Worker
console.log("Screen Tools background service worker loaded.");

// State tracking
let isRecorderWindowActive = false;

// Listen for messages
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
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
chrome.commands.onCommand.addListener(async (command) => {
  console.log('Command received:', command);

  if (command === 'stop-recording') {
    // Send stop signal to all views (popup and recorder window)
    chrome.runtime.sendMessage({ type: 'command-stop' }).catch(() => {
      // Ignore errors if no listeners (app closed)
    });
  }

  if (command === 'take-screenshot') {
    try {
      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        console.error('No active tab found');
        return;
      }

      // Capture the visible tab
      const dataUrl = await chrome.tabs.captureVisibleTab(null, {
        format: 'png',
        quality: 100
      });

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `screenshot-${timestamp}.png`;

      // Download the screenshot
      await chrome.downloads.download({
        url: dataUrl,
        filename: filename,
        saveAs: false
      });

      console.log('Screenshot saved:', filename);
    } catch (error) {
      console.error('Screenshot error:', error);
    }
  }
});
