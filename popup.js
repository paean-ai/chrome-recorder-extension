// Simple popup - just opens the recorder window
console.log('Popup loaded');

const openWindowBtn = document.getElementById('openWindow');

if (openWindowBtn) {
    openWindowBtn.onclick = () => {
        chrome.windows.create({
            url: 'recorder.html',
            type: 'popup',
            width: 380,
            height: 520,
            focused: true
        });
        // Close popup after opening recorder
        window.close();
    };
}
