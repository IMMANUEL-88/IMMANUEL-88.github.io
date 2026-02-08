document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. THEME MANAGEMENT ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check local storage or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeIcon.className = 'ri-sun-line'; // Switch to Sun
        } else {
            themeIcon.className = 'ri-moon-line'; // Switch to Moon
        }
    }

    // --- 2. MOBILE MENU TOGGLE ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        // Toggle icon between Menu and Close
        const icon = mobileBtn.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.className = 'ri-close-line';
        } else {
            icon.className = 'ri-menu-4-line';
        }
    });

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileBtn.querySelector('i').className = 'ri-menu-4-line';
        });
    });

    // --- 3. SCROLL REVEAL ANIMATIONS ---
    // Simple Intersection Observer to fade in elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Elements to animate
    const animatedElements = document.querySelectorAll('.hero-text, .section-title, .skill-card, .project-card, .timeline-item, .contact-card');
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in-section'); // Add base CSS class
        observer.observe(el);
    });

    // --- 4. TERMINAL MODE TRANSITION ---
    const tuiBtn = document.querySelector('.tui-switch-btn');
    const tuiLinkMobile = document.querySelector('.tui-link');

    function handleTransition(e) {
        e.preventDefault();
        const targetUrl = e.currentTarget.href;
        
        // Add fade-out class to body
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';

        setTimeout(() => {
            window.location.href = targetUrl;
        }, 500);
    }

    if(tuiBtn) tuiBtn.addEventListener('click', handleTransition);
    if(tuiLinkMobile) tuiLinkMobile.addEventListener('click', handleTransition);

    // --- 5. DYNAMIC YEAR ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});