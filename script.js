document.addEventListener('DOMContentLoaded', () => {

    // --- PREMIUM PRELOADER SCREEN TIMELINE ---
    const preloader = document.getElementById('intro-preloader');
    const preloaderWords = document.querySelectorAll('.preloader-word');

    if (preloader && preloaderWords.length > 0) {
        let currentWordIndex = 0;

        function showNextPreloaderWord() {
            if (currentWordIndex > 0) {
                preloaderWords[currentWordIndex - 1].classList.remove('active');
                preloaderWords[currentWordIndex - 1].classList.add('exit');
            }

            if (currentWordIndex < preloaderWords.length) {
                preloaderWords[currentWordIndex].classList.add('active');
                currentWordIndex++;
                let delay = 350;
                if (currentWordIndex === preloaderWords.length) {
                    delay = 800; // Hold 'WITH MOHAK' on screen for longer
                } else if (currentWordIndex >= preloaderWords.length - 2) {
                    delay = 550;
                }
                setTimeout(showNextPreloaderWord, delay);
            } else {
                exitPreloader();
            }
        }

        function exitPreloader() {
            const bgSlide = document.getElementById('preloader-bg-slide');

            // Slide up the main preloader screen
            preloader.classList.add('loaded');

            // Stagger the colored slide background right behind it
            if (bgSlide) {
                setTimeout(() => {
                    bgSlide.classList.add('loaded');
                }, 80);
            }

            document.body.classList.remove('preloader-active');

            // Trigger homepage reveal staggered elements
            setTimeout(() => {
                document.body.classList.add('reveal-active');
            }, 300);

            // Remove preloader elements from DOM after transition completes
            setTimeout(() => {
                preloader.remove();
                if (bgSlide) bgSlide.remove();
            }, 1500);
        }

        setTimeout(showNextPreloaderWord, 200);
    } else {
        document.body.classList.remove('preloader-active');
        document.body.classList.add('reveal-active');
    }


    // --- 1. THEME SWITCHER LOGIC ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('theme-sun');
    const moonIcon = document.getElementById('theme-moon');

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set initial theme
    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
        setTheme('light');
    } else {
        setTheme('dark');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    });

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        if (theme === 'light') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    // --- 2. MOBILE MENU TOGGLE ---
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('navigation-menu');

    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && e.target !== mobileMenuBtn) {
            navLinks.classList.remove('active');
        }
    });

    // Close menu when clicking a link
    const menuItems = navLinks.querySelectorAll('a');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });


    // --- 3. ACTIVE NAV LINK ON SCROLL ---
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        menuItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    });





    // --- 6. INTERACTIVE CONTACT FORM SUBMISSION ---
    const contactForm = document.getElementById('contact-web-form');
    const successMessage = document.getElementById('form-success-message');
    const submitBtn = document.getElementById('form-submit-btn');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Disable button & change text to loading state
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `Sending... <span class="loader-dot"></span>`;

        // Add styling for loader dot in Javascript simply or via CSS

        // Simulate network API request
        setTimeout(() => {
            // Hide Form, Show Success Message with smooth transition
            contactForm.style.display = 'none';
            successMessage.style.display = 'block';

            // Optional: reset form fields
            contactForm.reset();
        }, 1500);
    });

    // --- 7. SCROLLED HEADER EFFECT ---
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 8. SCROLL PARALLAX SYSTEM FOR NORMAL SCROLLING ---
    const sectionsToAnimate = document.querySelectorAll('.section-container');
    let scrollTicking = false;

    function updateScrollParallax() {
        const viewportHeight = window.innerHeight;
        const viewportCenter = viewportHeight / 2;

        sectionsToAnimate.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;

            // Normalize distance to a range of -1 to 1
            // viewportHeight * 0.95 defines the active range of the parallax transition
            const diff = (viewportCenter - sectionCenter) / (viewportHeight * 0.95);
            const ratio = Math.max(-1, Math.min(1, diff));

            section.style.setProperty('--scroll-ratio', ratio.toFixed(4));
        });

        scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(updateScrollParallax);
            scrollTicking = true;
        }
    });

    window.addEventListener('resize', updateScrollParallax);
    updateScrollParallax(); // Initial run on DOM ready

    // --- 9. CURSOR GLOW INTERACTION WITH INERTIA ---
    const orb1 = document.getElementById('orb-1');
    const orb2 = document.getElementById('orb-2');
    let mouseX = 0, mouseY = 0;
    let xp1 = 0, yp1 = 0;
    let xp2 = 0, yp2 = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateOrbs() {
        xp1 += (mouseX - xp1) * 0.05;
        yp1 += (mouseY - yp1) * 0.05;

        xp2 += (mouseX - xp2) * 0.03;
        yp2 += (mouseY - yp2) * 0.03;

        if (orb1) orb1.style.transform = `translate(${xp1 * 0.1}px, ${yp1 * 0.1}px)`;
        if (orb2) orb2.style.transform = `translate(${xp2 * -0.08}px, ${yp2 * -0.08}px)`;

        requestAnimationFrame(animateOrbs);
    }
    animateOrbs();

    // --- 10. TYPING ANIMATION ---
    const typeTextSpan = document.getElementById('type-text');
    const words = ["Experiences", "Web Applications", "UI/UX Designs", "SaaS Platforms"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typeTextSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typeTextSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 1500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    if (typeTextSpan) {
        setTimeout(type, 1000);
    }



    // --- 12. DYNAMIC ROTATING INTRO QUALITIES (HORIZONTAL SLIDE CAROUSEL) ---
    const rotatingTextSpan = document.getElementById('intro-rotating-text');
    if (rotatingTextSpan) {
        const qualities = [
            "a full-stack developer.",
            "a UI/UX designer.",
            "a problem solver.",
            "a creative freelancer."
        ];
        let qualityIndex = 0;

        function cycleQualities() {
            // Slide current text out to the left
            rotatingTextSpan.classList.add('slide-out');

            setTimeout(() => {
                // Switch text content
                qualityIndex = (qualityIndex + 1) % qualities.length;
                rotatingTextSpan.textContent = qualities[qualityIndex];

                // Instantly teleport text to the right side without transition
                rotatingTextSpan.classList.remove('slide-out');
                rotatingTextSpan.classList.add('slide-in-prepare');

                // Force layout reflow
                rotatingTextSpan.offsetHeight;

                // Slide back into view from right to center (leftwards)
                rotatingTextSpan.classList.remove('slide-in-prepare');
            }, 200); // matches the 0.2s CSS transition duration
        }

        // Cycle qualities every 2.2 seconds
        setInterval(cycleQualities, 2200);
    }

    // --- 13. CUSTOM CURSOR TRACKING ---
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('custom-cursor-follower');

    if (cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX + 'px';
            const y = e.clientY + 'px';
            cursor.style.left = x;
            cursor.style.top = y;
            follower.style.left = x;
            follower.style.top = y;
        });

        const hoverItems = document.querySelectorAll('a, button, .filter-btn, .theme-toggle-btn, .social-link, .glass-card, .star-select');
        hoverItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                follower.classList.add('hover');
            });
            item.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                follower.classList.remove('hover');
            });
        });
    }

    // --- 14. VERCEL-LIKE CARD GLOW MOUSE TRACKING ---
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- 15. MAGNETIC BUTTONS EFFECT ---
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .theme-toggle-btn, .social-link');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    // --- 16. SMOOTH SCROLL WITH CUSTOM EASING ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            const startPosition = window.scrollY;
            const header = document.getElementById('site-header');
            const headerHeight = header ? header.offsetHeight : 80;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
            const distance = targetPosition - startPosition;
            if (Math.abs(distance) < 5) return; // Ignore very small scrolls

            // Calculate dynamic duration (minimum 700ms, maximum 1300ms)
            const duration = Math.min(Math.max(Math.abs(distance) * 0.45, 700), 1300);

            let startTime = null;
            document.body.classList.add('is-scrolling');

            // Easing function: easeInOutQuart
            function easeInOutQuart(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return (c / 2) * t * t * t * t + b;
                t -= 2;
                return (-c / 2) * (t * t * t * t - 2) + b;
            }

            function scrollAnimation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const scrollY = easeInOutQuart(timeElapsed, startPosition, distance, duration);

                window.scrollTo(0, scrollY);

                if (timeElapsed < duration) {
                    requestAnimationFrame(scrollAnimation);
                } else {
                    window.scrollTo(0, targetPosition);
                    document.body.classList.remove('is-scrolling');
                }
            }

            requestAnimationFrame(scrollAnimation);
        });
    });

    // --- 17. CLIENT REVIEW SUBMISSION LOGIC ---
    const toggleReviewFormBtn = document.getElementById('toggle-review-form-btn');
    const reviewSubmitCard = document.getElementById('review-submit-card');
    const clientReviewForm = document.getElementById('client-review-form');
    const starSelector = document.getElementById('star-selector');
    const reviewFormRatingInput = document.getElementById('review-form-rating');

    if (toggleReviewFormBtn && reviewSubmitCard) {
        toggleReviewFormBtn.addEventListener('click', () => {
            // Use getComputedStyle for robust display state detection (handles inline & stylesheet display rules)
            const isHidden = window.getComputedStyle(reviewSubmitCard).display === 'none';
            if (isHidden) {
                reviewSubmitCard.style.display = 'block';
                toggleReviewFormBtn.textContent = 'Cancel';
                toggleReviewFormBtn.classList.remove('btn-secondary');
                toggleReviewFormBtn.classList.add('btn-primary');
                // Scroll smoothly to form
                setTimeout(() => {
                    const headerHeight = document.getElementById('site-header')?.offsetHeight || 80;
                    const yOffset = reviewSubmitCard.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                    window.scrollTo({ top: yOffset, behavior: 'smooth' });
                }, 100);
            } else {
                reviewSubmitCard.style.display = 'none';
                toggleReviewFormBtn.textContent = 'Leave a Review';
                toggleReviewFormBtn.classList.remove('btn-primary');
                toggleReviewFormBtn.classList.add('btn-secondary');
            }
        });
    }

    if (starSelector && reviewFormRatingInput) {
        const starSelects = starSelector.querySelectorAll('.star-select');
        starSelects.forEach(star => {
            star.addEventListener('click', () => {
                const val = parseInt(star.getAttribute('data-value'));
                reviewFormRatingInput.value = val;

                // Highlight stars
                starSelects.forEach(s => {
                    const sVal = parseInt(s.getAttribute('data-value'));
                    if (sVal <= val) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
    }

    if (clientReviewForm) {
        clientReviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('review-form-name').value.trim();
            const role = document.getElementById('review-form-role').value.trim();
            const rating = reviewFormRatingInput ? parseInt(reviewFormRatingInput.value) : 5;
            const feedbackText = document.getElementById('review-form-text').value.trim();

            if (!name || !role || !feedbackText) return;

            // Generate stars HTML
            let starsHtml = '';
            for (let i = 0; i < rating; i++) {
                starsHtml += '<span class="star">&#9733;</span>';
            }

            // Create new review card
            const newCard = document.createElement('div');
            newCard.className = 'glass-card review-card';
            newCard.style.opacity = '0';
            newCard.style.transform = 'translateY(15px)';

            // Safe HTML escaping
            const escapeHTML = str => str.replace(/[&<>'"]/g,
                tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
            );

            newCard.innerHTML = `
                <div class="review-stars">${starsHtml}</div>
                <p class="review-text">${escapeHTML(feedbackText)}</p>
                <div class="review-client">
                    <div class="review-details">
                        <h4 class="review-name">${escapeHTML(name)}</h4>
                        <p class="review-role">${escapeHTML(role)}</p>
                    </div>
                </div>
            `;

            // Prepend new review card to reviews grid
            const reviewsGrid = document.querySelector('.reviews-grid');
            if (reviewsGrid) {
                reviewsGrid.insertBefore(newCard, reviewsGrid.firstChild);

                // Animate entry
                setTimeout(() => {
                    newCard.style.transition = 'opacity var(--transition-normal), transform var(--transition-normal)';
                    newCard.style.opacity = '1';
                    newCard.style.transform = 'translateY(0)';
                }, 50);

                // Add standard card-hover custom mouse tracking
                newCard.addEventListener('mousemove', (e) => {
                    const rect = newCard.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    newCard.style.setProperty('--mouse-x', `${x}px`);
                    newCard.style.setProperty('--mouse-y', `${y}px`);
                });
            }

            // Reset and hide form
            clientReviewForm.reset();
            if (reviewFormRatingInput) reviewFormRatingInput.value = 5;

            if (starSelector) {
                const starSelects = starSelector.querySelectorAll('.star-select');
                starSelects.forEach(s => s.classList.add('active')); // Reset stars to 5
            }

            if (reviewSubmitCard) reviewSubmitCard.style.display = 'none';
            if (toggleReviewFormBtn) {
                toggleReviewFormBtn.textContent = 'Leave a Review';
                toggleReviewFormBtn.classList.remove('btn-primary');
                toggleReviewFormBtn.classList.add('btn-secondary');
            }

            // Scroll to the new review card
            setTimeout(() => {
                const headerHeight = document.getElementById('site-header')?.offsetHeight || 80;
                const yOffset = newCard.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                window.scrollTo({ top: yOffset, behavior: 'smooth' });
            }, 300);
        });
    }
});
