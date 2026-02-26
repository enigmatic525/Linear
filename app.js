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
                    <h2 class="delayed-fade">An introduction to weightlifting, made simple.</h2>
                </div>
            `
        },
        {
            id: 'slide-2',
            html: `
                <div class="slide slide-2">
                    <h1>First, what equipment do you have access to?</h1>
                    <div class="options-container" style="margin-top: 2rem;">
                        <button class="option-btn" data-value="simple">
                            <span class="title">Simple setup</span>
                            <span class="desc">Bench, dumbbells, and a pull-up bar.</span>
                        </button>
                        <button class="option-btn" data-value="full">
                            <span class="title">Full gym</span>
                            <span class="desc">Free weights, machines, and cables.</span>
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
                        <h1 class="centered-header">Perfect. Time to begin.</h1>
                        <div class="action-text" id="action-text-container"></div>
                    </div>
                </div>
            `,
            onEnter: (element) => {
                setTimeout(() => {
                    element.classList.add('step-2');
                    const textContainer = element.querySelector('#action-text-container');
                    if (selectedEquipment === 'simple') {
                        textContainer.innerText = "Prepare for your bench press.";
                    } else {
                        textContainer.innerText = "Prepare for your first exercise.";
                    }
                    setTimeout(() => {
                        nextSlide();
                    }, 2500); // Auto-advance to slide 4
                }, 1500); // 1.0s transition + 0.5s wait
            }
        },
        {
            id: 'slide-4',
            html: `
                <div class="slide slide-4">
                    <h2 style="opacity: 1; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem;">Exercise 1</h2>
                    <h1 id="exercise-title" style="margin-bottom: 0.5rem;">Bench Press</h1>
                    <h2 style="opacity: 1; margin-bottom: 3rem; color: var(--text-sub);">3 sets of 8-10 reps</h2>
                    <div class="options-container" style="opacity: 1; margin-top: 0; align-items: center;">
                        <button class="option-btn start-workout-btn" style="text-align: center; width: 100%; justify-content: center; padding: 1.5rem;">
                            <span class="title" style="margin: 0;">Begin Workout</span>
                        </button>
                    </div>
                </div>
            `,
            onEnter: (element) => {
                const title = element.querySelector('#exercise-title');
                if (selectedEquipment === 'simple') {
                    title.innerText = "Dumbbell Bench Press";
                } else {
                    title.innerText = "Barbell Bench Press";
                }
            },
            setup: (element) => {
                const btn = element.querySelector('.start-workout-btn');
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    btn.innerHTML = '<span class="title" style="margin: 0; color: #888;">Workout Started</span>';
                    btn.style.borderColor = "rgba(255,255,255,0.05)";
                    btn.style.cursor = "default";
                });
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
