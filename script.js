/**
 * Val 3: Love Letter App
 * Modular, production-ready implementation.
 */

document.addEventListener('DOMContentLoaded', () => {
    LoveLetterApp.init();

    // Preload the main internal image
    const img = new Image();
    img.src = 'assets/image.jpg';
});

const LoveLetterApp = {
    isOpen: false,

    // Fun constants
    rejectionPhrases: [
        "No", "Are you sure?", "Really sure?", "Think again! 🥺",
        "Last chance!", "Surely not?", "You might regret this!",
        "Give it another thought!", "Are you absolutely certain?",
        "This could be a mistake!", "Have a heart!", "Don't be so cold!",
        "Change of heart?", "Wouldn't you reconsider?",
        "Is that your final answer?", "You're breaking my heart ;(",
        "Plsss? 🥺", "I'll be very sad...", "I'll be very very sad...",
        "I'll be very very very sad...", "Ok fine, I'll stop asking...",
        "Just kidding, say YES! ❤️"
    ],

    elements: {},

    init() {
        this.cacheDOM();
        this.initAudio();
        this.initEnvelope();
        this.initButtons();
    },

    cacheDOM() {
        this.elements = {
            wrapper: document.getElementById('envelope-container'),
            envelope: document.getElementById('envelope'),
            noBtn: document.getElementById('no-btn'),
            yesBtn: document.getElementById('yes-btn'),
            celebration: document.getElementById('celebration'),
            bgMusic: document.getElementById('bg-music')
        };
    },

    initAudio() {
        const { bgMusic } = this.elements;
        if (!bgMusic) return;

        // Try auto-play
        bgMusic.play().catch(() => console.log("Audio blocked interact needed"));

        // Fallback interaction listener
        const playMusic = () => {
            bgMusic.play().then(() => {
                document.removeEventListener('click', playMusic);
                document.removeEventListener('touchstart', playMusic);
            }).catch(() => { });
        };

        document.addEventListener('click', playMusic);
        document.addEventListener('touchstart', playMusic);
    },

    initEnvelope() {
        const { wrapper } = this.elements;

        const openEnvelope = (e) => {
            // Don't close or re-trigger if clicking buttons inside
            if (e.target.closest('.btn')) return;

            if (!this.isOpen) {
                wrapper.classList.add('open');
                this.isOpen = true;
            }
        };

        wrapper.addEventListener('click', openEnvelope);
    },

    initButtons() {
        this.noClickCount = 0;
        const { noBtn, yesBtn } = this.elements;

        // Yes Button
        yesBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleSuccess();
        });

        // No Button
        noBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleRejection();
        });
    },

    handleRejection() {
        const { noBtn, yesBtn } = this.elements;

        this.noClickCount++;

        // 1. Still iterating through phrases
        if (this.noClickCount < this.rejectionPhrases.length - 1) {
            noBtn.innerText = this.rejectionPhrases[this.noClickCount];

            // Shake animation
            noBtn.style.animation = 'none';
            void noBtn.offsetWidth; // Trigger reflow
            noBtn.style.animation = 'shake 0.5s';

            // Grow Yes button
            const yesScale = 1 + (this.noClickCount * 0.1);
            yesBtn.style.transform = `scale(${yesScale})`;

        } else {
            // 2. Final state -> Transforms into Yes
            this.convertNoToYes();
        }
    },

    convertNoToYes() {
        const { noBtn, yesBtn } = this.elements;
        const newYesBtn = noBtn.cloneNode(true);
        noBtn.parentNode.replaceChild(newYesBtn, noBtn);

        // Apply Yes styling
        newYesBtn.innerText = "YES! (I give up) 😍";
        newYesBtn.style.backgroundColor = getComputedStyle(yesBtn).backgroundColor;
        newYesBtn.style.color = "white";
        newYesBtn.style.animation = 'none';

        // Add success listener
        newYesBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleSuccess();
        });
    },

    handleSuccess() {
        const { celebration } = this.elements;
        celebration.classList.remove('hidden');

        // Force reflow for fade interaction if needed, or rely on CSS class
        setTimeout(() => celebration.classList.add('visible'), 10);

        this.startHeartRain();
    },

    startHeartRain() {
        const createHeart = () => {
            // Limit active hearts to prevent performance issues
            if (document.querySelectorAll('.heart-rain-item').length > 50) return;

            const heart = document.createElement('div');
            heart.classList.add('heart-rain-item');
            heart.innerText = '❤️';
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.top = '-50px';
            heart.style.fontSize = Math.random() * 20 + 20 + 'px';
            heart.style.zIndex = '1000';
            // Random fall duration between 3s and 6s
            const duration = Math.random() * 3 + 3;
            heart.style.animation = `fall ${duration}s linear forwards`;

            document.body.appendChild(heart);

            // Cleanup matches animation duration
            setTimeout(() => heart.remove(), duration * 1000);
        };

        // Create hearts interval
        setInterval(createHeart, 200);
    },

    /*
    injectStyles() {
        // Removed: Styles are now in style.css for better performance and separation of concerns
    }
    */
};
