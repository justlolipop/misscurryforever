function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Function to get safe random position based on screen width
function getSafeRandomPosition() {
    const wishWidth = 280;
    const screenWidth = window.innerWidth;
    const margin = 20;
    const safeWidth = screenWidth - wishWidth - (margin * 2);

    if (safeWidth <= 0) return 50;

    const randomPixels = Math.random() * safeWidth + margin;
    const percentage = (randomPixels / screenWidth) * 100;

    return percentage;
}

// Global wishes array
let allWishes = [];
let wishIndex = 0;
let isPageActive = true;
let nextSpawnTimeout = null;

// Function to create a floating wish element
function createFloatingWish(wish) {
    const wishDiv = document.createElement('div');
    wishDiv.className = 'floating-wish';

    const startX = getSafeRandomPosition();
    const duration = 10 + Math.random() * 10; // 10-20 seconds
    const drift = (Math.random() - 0.5) * 20;

    wishDiv.style.left = `${startX}%`;
    wishDiv.style.setProperty('--drift', `${drift}%`);
    wishDiv.style.animation = `floatUp ${duration}s linear forwards`;

    wishDiv.innerHTML = `
        <div class="wish-name">${escapeHtml(wish.name)}</div>
        <div class="wish-message">${escapeHtml(wish.wish || 'Sending love to Curry! 💕')}</div>
        <div class="wish-date">${formatDate(wish.created_at)}</div>
    `;

    // Remove wish when animation ends
    wishDiv.addEventListener('animationend', () => {
        wishDiv.remove();
    });

    return wishDiv;
}

// Function to spawn a single wish
function spawnWish() {
    if (allWishes.length === 0 || !isPageActive) return;

    const container = document.getElementById('wishesContainer');
    if (!container) return;

    // Get next wish (loop back to start if needed)
    const wish = allWishes[wishIndex];
    wishIndex = (wishIndex + 1) % allWishes.length;

    const floatingWish = createFloatingWish(wish);
    container.appendChild(floatingWish);
}

// Function to start continuous spawning
function startContinuousFlow() {
    // Clear any existing timeout
    if (nextSpawnTimeout) {
        clearTimeout(nextSpawnTimeout);
    }

    // Spawn wishes at random intervals (4-7 seconds)
    function scheduleNext() {
        if (!isPageActive) return; // Don't schedule if page is inactive

        const delay = 4000 + Math.random() * 3000; // 4-7 seconds
        nextSpawnTimeout = setTimeout(() => {
            spawnWish();
            scheduleNext(); // Schedule the next one
        }, delay);
    }

    scheduleNext();
}

// Function to load wishes data
async function loadWishesData() {
    try {
        const response = await fetch('/api/submit');
        const data = await response.json();

        if (data.success && data.wishes && data.wishes.length > 0) {
            allWishes = data.wishes;
            console.log(`✨ Loaded ${allWishes.length} wishes`);

            // Update stats
            const stats = document.getElementById('stats');
            if (stats) {
                stats.style.display = 'block';
                stats.textContent = `✨The sunset was so breathtakingly beautiful that I almost believed u still existed.❤️`;
            }
        } else {
            console.log('No wishes found');
            const stats = document.getElementById('stats');
            if (stats) {
                stats.style.display = 'block';
                stats.textContent = '💕 No wishes yet - be the first! 💕';
            }
        }
    } catch (error) {
        console.error('Error loading wishes:', error);
    }
}

// Initial setup
async function initialize() {
    console.log('🎨 Love You Curry - Wishes Page Loaded');
    console.log(`📐 Screen Width: ${window.innerWidth}px`);

    // Load wishes data
    await loadWishesData();

    // Start continuous flow
    if (allWishes.length > 0) {
        // Spawn 3 initial wishes immediately
        for (let i = 0; i < 5; i++) {
            setTimeout(() => spawnWish(), i * 1000);
        }

        // Then start continuous flow
        setTimeout(() => startContinuousFlow(), 3000);
    }
}

// Reload wishes data every 30 seconds (without stopping the flow)
setInterval(async () => {
    console.log('🔄 Refreshing wishes data...');
    await loadWishesData();
}, 30000);

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        console.log('📐 Screen resized');
        // No need to reload, just continue with new positions
    }, 500);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('👋 Page hidden - pausing wishes');
        isPageActive = false;
        // Clear pending spawn timeout
        if (nextSpawnTimeout) {
            clearTimeout(nextSpawnTimeout);
            nextSpawnTimeout = null;
        }
    } else {
        console.log('👀 Page visible - resuming wishes');
        isPageActive = true;
        // Resume spawning
        if (allWishes.length > 0) {
            startContinuousFlow();
        }
    }
});

// Handle window blur/focus (for when user switches tabs or clicks outside)
window.addEventListener('blur', () => {
    console.log('🔇 Window lost focus - pausing wishes');
    isPageActive = false;
    if (nextSpawnTimeout) {
        clearTimeout(nextSpawnTimeout);
        nextSpawnTimeout = null;
    }
});

window.addEventListener('focus', () => {
    console.log('🔊 Window gained focus - resuming wishes');
    isPageActive = true;
    if (allWishes.length > 0) {
        startContinuousFlow();
    }
});

// Start everything when page loads
document.addEventListener('DOMContentLoaded', initialize);

console.log('💕 Curry Wishes System Ready!');






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