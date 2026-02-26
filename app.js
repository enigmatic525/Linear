document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');
    const borderContainer = document.getElementById('border-container');
    const swipeIndicator = document.getElementById('swipe-indicator');
    let currentSlideIndex = 0;
    let selectedEquipment = null;
    let isTransitioning = false;

    const slides = [
        {
            id: 'slide-1',
            html: `
                <div class="slide slide-1 active">
                    <h1>Welcome to Linear</h1>
                    <h2 class="delayed-fade">An introduction to weightlifting, made simple</h2>
                </div>
            `
        },
        {
            id: 'slide-2',
            html: `
                <div class="slide slide-2">
                    <h1>First, lets get to know your equipment.</h1>
                    <h2>What do you have access to?</h2>
                    <h2 class="sub-select" style="font-size: 1rem; margin-top: 2rem; margin-bottom: 0.5rem; opacity: 0;">Select one:</h2>
                    <div class="options-container">
                        <button class="option-btn" data-value="simple">
                            <span class="title">Simple setup</span>
                            <span class="desc">Bench + Dumbells + Pull up bar</span>
                        </button>
                        <button class="option-btn" data-value="full">
                            <span class="title">Full gym</span>
                            <span class="desc">Free weights, machines, and cables</span>
                        </button>
                    </div>
                </div>
            `,
            setup: (element) => {
                const buttons = element.querySelectorAll('.option-btn');
                buttons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        selectedEquipment = btn.getAttribute('data-value');
                        nextSlide();
                    });
                });
            }
        },
        {
            id: 'slide-3',
            html: `
                <div class="slide slide-3">
                    <div class="centered-content">
                        <h1 class="centered-header">Perfect, lets get started.</h1>
                        <div class="action-text" id="action-text-container"></div>
                    </div>
                </div>
            `,
            onEnter: (element) => {
                setTimeout(() => {
                    element.classList.add('step-2');
                    const textContainer = element.querySelector('#action-text-container');
                    if (selectedEquipment === 'simple') {
                        textContainer.innerText = "Let's set up your bench";
                    } else {
                        textContainer.innerText = "Let's set up your first exercise";
                    }
                }, 1500); // 1.0s transition + 0.5s wait
            }
        }
    ];

    function init() {
        appContainer.innerHTML = slides.map(s => s.html).join('');
        const slideElements = document.querySelectorAll('.slide');
        slides.forEach((slideData, index) => {
            if (slideData.setup) {
                slideData.setup(slideElements[index]);
            }
        });
        setupSwipe();
    }

    function goToSlide(index) {
        if (isTransitioning || index < 0 || index >= slides.length) return;
        isTransitioning = true;

        const slideElements = document.querySelectorAll('.slide');
        const currentSlide = slideElements[currentSlideIndex];
        const nextSlideEl = slideElements[index];

        currentSlide.classList.remove('active');
        currentSlide.classList.add('exit-up');

        nextSlideEl.classList.add('active');

        if (slides[index].onEnter) {
            slides[index].onEnter(nextSlideEl);
        }

        currentSlideIndex = index;

        if (index > 0) {
            swipeIndicator.classList.add('hidden');
            if (borderContainer) borderContainer.classList.add('hidden');
        } else {
            swipeIndicator.classList.remove('hidden');
            if (borderContainer) borderContainer.classList.remove('hidden');
        }

        setTimeout(() => {
            isTransitioning = false;
        }, 1000);
    }

    function nextSlide() {
        if (currentSlideIndex < slides.length - 1) {
            goToSlide(currentSlideIndex + 1);
        }
    }

    let touchStartY = 0;
    let touchEndY = 0;

    function setupSwipe() {
        document.addEventListener('touchstart', e => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', e => {
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });

        document.addEventListener('wheel', e => {
            if (e.deltaY > 50 && currentSlideIndex === 0) {
                nextSlide();
            }
        }, { passive: true });

        document.addEventListener('keydown', e => {
            if ((e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === ' ') && currentSlideIndex === 0) {
                e.preventDefault();
                nextSlide();
            }
        });

        // Allowed click on entire document to proceed on slide 1 (for ease of testing)
        document.addEventListener('click', (e) => {
            if (currentSlideIndex === 0) {
                nextSlide();
            }
        });
    }

    function handleSwipe() {
        if (touchStartY - touchEndY > 50 && currentSlideIndex === 0) {
            nextSlide();
        }
    }

    init();
});
