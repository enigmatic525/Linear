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
                    <h2 style="opacity: 1; margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem;" id="exercise-label">Exercise 1</h2>
                    
                    <!-- Visual Walkthrough Container -->
                    <div class="walkthrough-visual" style="width: 220px; height: 160px; position: relative; margin: 0 auto 2rem; border-bottom: 2px solid var(--text-sub);">
                        <!-- Step 1: Rack and Bar -->
                        <div id="vis-rack-left" style="position: absolute; bottom: 0; left: 30px; width: 8px; height: 110px; background-color: #444; opacity: 0; transition: all 1s ease;"></div>
                        <div id="vis-rack-right" style="position: absolute; bottom: 0; right: 30px; width: 8px; height: 110px; background-color: #444; opacity: 0; transition: all 1s ease;"></div>
                        <div id="vis-bar" style="position: absolute; bottom: 105px; left: 10px; right: 10px; height: 6px; background-color: var(--text-color); opacity: 0; transition: all 1s ease; border-radius: 3px;"></div>
                        <div id="vis-plate-left" style="position: absolute; bottom: 95px; left: 15px; width: 8px; height: 26px; background-color: #888; opacity: 0; transition: all 1s ease; border-radius: 2px;"></div>
                        <div id="vis-plate-right" style="position: absolute; bottom: 95px; right: 15px; width: 8px; height: 26px; background-color: #888; opacity: 0; transition: all 1s ease; border-radius: 2px;"></div>

                        <!-- Step 1: Bench (always there) -->
                        <div id="vis-bench" style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 100px; height: 35px; background-color: #222; border: 1px solid #444; border-bottom: none; border-radius: 6px 6px 0 0; opacity: 1; transition: all 1s ease;"></div>
                        
                        <!-- Step 2: Position (Body) -->
                        <div id="vis-body" style="position: absolute; bottom: 35px; left: 50%; transform: translateX(-50%); width: 90px; height: 12px; background-color: #666; border-radius: 6px; opacity: 0; transition: all 1s ease;"></div>
                        <div id="vis-head" style="position: absolute; bottom: 35px; left: 55%; transform: translateX(-50%); width: 24px; height: 24px; background-color: var(--text-color); border-radius: 50%; opacity: 0; transition: all 1s ease;"></div>
                        <!-- Legs -->
                        <div id="vis-legs" style="position: absolute; bottom: 0; left: 20px; width: 12px; height: 40px; background-color: #666; transform-origin: top; transform: rotate(20deg); opacity: 0; transition: all 1s ease; border-radius: 6px;"></div>

                        <!-- Step 3: Grip (Arms) -->
                        <div id="vis-arm-left" style="position: absolute; bottom: 45px; left: 80px; width: 6px; height: 62px; background-color: #aaa; transform-origin: bottom center; transform: rotate(-15deg); opacity: 0; transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1); border-radius: 3px;"></div>
                        <div id="vis-arm-right" style="position: absolute; bottom: 45px; right: 80px; width: 6px; height: 62px; background-color: #aaa; transform-origin: bottom center; transform: rotate(15deg); opacity: 0; transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1); border-radius: 3px;"></div>
                    </div>

                    <h1 id="wt-title" style="margin-bottom: 1rem; font-size: 1.5rem; transition: opacity 0.3s ease;">The Setup</h1>
                    <p id="wt-desc" style="color: var(--text-sub); font-size: 1rem; line-height: 1.5; max-width: 300px; margin: 0 auto 2rem; height: 60px; transition: opacity 0.3s ease;">Prepare the bench and adjust the hooks so the bar is at wrist-height when you extend your arms.</p>
                    
                    <div class="options-container" style="opacity: 1; margin-top: 0; align-items: center;">
                        <button class="option-btn next-step-btn" style="text-align: center; width: 100%; justify-content: center; padding: 1.2rem;">
                            <span class="title" style="margin: 0;">Next Step</span>
                        </button>
                    </div>
                </div>
            `,
            onEnter: (element) => {
                if (selectedEquipment === 'simple') {
                    element.querySelector('#exercise-label').innerText = "Dumbbell Bench Press - Walkthrough";
                } else {
                    element.querySelector('#exercise-label').innerText = "Barbell Bench Press - Walkthrough";
                }
            },
            setup: (element) => {
                const btn = element.querySelector('.next-step-btn');
                const title = element.querySelector('#wt-title');
                const desc = element.querySelector('#wt-desc');

                // Visuals
                const rackL = element.querySelector('#vis-rack-left');
                const rackR = element.querySelector('#vis-rack-right');
                const bar = element.querySelector('#vis-bar');
                const plateL = element.querySelector('#vis-plate-left');
                const plateR = element.querySelector('#vis-plate-right');

                const body = element.querySelector('#vis-body');
                const head = element.querySelector('#vis-head');
                const legs = element.querySelector('#vis-legs');

                const armL = element.querySelector('#vis-arm-left');
                const armR = element.querySelector('#vis-arm-right');

                let step = 1;

                // Step 1 animations automatically on setup
                setTimeout(() => {
                    rackL.style.opacity = '1';
                    rackR.style.opacity = '1';
                    bar.style.opacity = '1';
                    if (selectedEquipment === 'full') {
                        plateL.style.opacity = '1';
                        plateR.style.opacity = '1';
                    } else {
                        // Fake dumbbell look
                        rackL.style.opacity = '0';
                        rackR.style.opacity = '0';
                        bar.style.bottom = '40px';
                        bar.style.opacity = '0'; // hide bar till hands exist
                    }
                }, 500);

                const updateText = (newTitle, newDesc) => {
                    title.style.opacity = '0';
                    desc.style.opacity = '0';
                    setTimeout(() => {
                        title.innerText = newTitle;
                        desc.innerText = newDesc;
                        title.style.opacity = '1';
                        desc.style.opacity = '1';
                    }, 300);
                };

                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    step++;

                    if (step === 2) {
                        updateText("Positioning", "Lie back on the bench. Ensure your eyes are directly beneath the bar and plant your feet flat on the ground.");

                        body.style.opacity = '1';
                        head.style.opacity = '1';
                        legs.style.opacity = '1';

                    } else if (step === 3) {
                        updateText("The Grip", "Reach up and grab the bar securely, slightly wider than shoulder-width. Keep your wrists straight.");

                        armL.style.opacity = '1';
                        armR.style.opacity = '1';

                        if (selectedEquipment === 'simple') {
                            bar.style.opacity = '1';
                            plateL.style.opacity = '1';
                            plateR.style.opacity = '1';
                            plateL.style.bottom = '35px';
                            plateR.style.bottom = '35px';
                        }

                    } else if (step === 4) {
                        updateText("The Lift", selectedEquipment === 'full'
                            ? "Unrack the bar and hold it steady. Slowly lower to your mid-chest, then press back up."
                            : "Press the dumbbells up until arms are fully extended, then lower them slowly.");

                        // Action animation
                        if (selectedEquipment === 'full') {
                            bar.style.transform = 'translateY(-10px)';
                            plateL.style.transform = 'translateY(-10px)';
                            plateR.style.transform = 'translateY(-10px)';
                            armL.style.height = '72px';
                            armR.style.height = '72px';

                            setTimeout(() => {
                                // Lower to chest
                                bar.style.transform = 'translateY(55px)';
                                plateL.style.transform = 'translateY(55px)';
                                plateR.style.transform = 'translateY(55px)';
                                armL.style.height = '25px';
                                armR.style.height = '25px';
                                armL.style.transform = 'rotate(-40deg)';
                                armR.style.transform = 'rotate(40deg)';
                            }, 1200);
                        } else {
                            // Dumbbell lift
                            bar.style.transform = 'translateY(-40px)';
                            plateL.style.transform = 'translateY(-40px)';
                            plateR.style.transform = 'translateY(-40px)';
                            armL.style.height = '60px';
                            armR.style.height = '60px';
                        }

                        btn.innerHTML = '<span class="title" style="margin: 0;">Complete Section</span>';

                    } else if (step > 4) {
                        btn.innerHTML = '<span class="title" style="margin: 0; color: #888;">Walkthrough Finished</span>';
                        btn.style.borderColor = "rgba(255,255,255,0.05)";
                        btn.style.cursor = "default";
                    }
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
