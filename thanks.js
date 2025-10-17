// Auto-play music script (no button needed)
const bgMusic = document.getElementById('bgMusic');

// Set volume (optional, 0.7 = 70%)
bgMusic.volume = 0.7;

// Try to play music on page load
window.addEventListener('load', () => {
    bgMusic.play()
        .then(() => {
            console.log('🎵 Music started playing!');
        })
        .catch(() => {
            console.log('⚠️ Autoplay blocked - will play on first click');
        });
});

// Play music on first user interaction (click anywhere on page)
document.addEventListener('click', function playOnFirstClick() {
    bgMusic.play()
        .then(() => {
            console.log('🎵 Music playing after click!');
        })
        .catch(() => { });
}, { once: true });

// Optional: Also try on touch (for mobile)
document.addEventListener('touchstart', function playOnFirstTouch() {
    bgMusic.play();
}, { once: true });