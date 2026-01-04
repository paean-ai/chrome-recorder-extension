// Screen Tools - Popup Script
console.log('Screen Tools popup loaded');

const screenshotBtn = document.getElementById('screenshotBtn');
const recordBtn = document.getElementById('recordBtn');
const statusToast = document.getElementById('statusToast');

// Show status toast
function showToast(message, type = 'default') {
    statusToast.textContent = message;
    statusToast.className = 'status-toast show ' + type;
    
    setTimeout(() => {
        statusToast.className = 'status-toast';
    }, 2500);
}

// Screenshot functionality
if (screenshotBtn) {
    screenshotBtn.onclick = async () => {
        try {
            // Get the current tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab) {
                showToast('No active tab found', 'error');
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
            
            showToast('Screenshot saved!', 'success');
            
            // Close popup after short delay
            setTimeout(() => window.close(), 800);
            
        } catch (error) {
            console.error('Screenshot error:', error);
            showToast('Failed to capture', 'error');
        }
    };
}

// Recording functionality - opens recorder window
if (recordBtn) {
    recordBtn.onclick = () => {
        chrome.windows.create({
            url: 'recorder.html',
            type: 'popup',
            width: 400,
            height: 480,
            focused: true
        });
        // Close popup after opening recorder
        window.close();
    };
}

// Listen for keyboard shortcut for screenshot
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'command-screenshot') {
        screenshotBtn?.click();
    }
});
