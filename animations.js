// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, {
    threshold: 0.1
});

// Observe all elements with animate-on-scroll class
document.querySelectorAll('.animate-on-scroll').forEach(element => {
    observer.observe(element);
});

// Enhanced tab switching with image reloading
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('.tab-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const target = tab.getAttribute('data-tab');

            // Hide all sections
            sections.forEach(section => {
                section.style.display = 'none';
                section.classList.remove('active');
            });

            // Show the selected section with 3D animation
            const activeSection = document.getElementById(target);
            activeSection.style.display = 'block';
            activeSection.classList.add('active');

            // Force reload images in the active section
            const images = activeSection.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                if (img.complete && img.naturalHeight !== 0) {
                    // Image is already loaded, no need to reload
                    return;
                }
                const src = img.src;
                img.src = '';
                img.src = src;
            });
        });
    });

    // Initialize the first tab as active
    document.querySelector('nav ul li a').click();
});

// Enhanced Typewriter effect with queue and callback
let currentTypewriter;
const typewriter = (element, text, speed = 50, erase = false, callback) => {
    if (currentTypewriter) {
        clearTimeout(currentTypewriter);
    }
    
    let i = erase ? text.length : 0;
    const type = () => {
        if (erase) {
            if (i > 0) {
                element.textContent = text.substring(0, i - 1);
                i--;
                currentTypewriter = setTimeout(type, speed / 2);
            } else {
                currentTypewriter = null;
                if (callback) callback();
            }
        } else {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                currentTypewriter = setTimeout(type, speed);
            } else {
                currentTypewriter = null;
                if (callback) callback();
            }
        }
    };
    type();
};

// Initialize typewriter effects
const dynamicText = document.querySelector('.dynamic-text');
if (dynamicText) {
    const text = dynamicText.textContent;
    dynamicText.textContent = '';
    typewriter(dynamicText, text);
}

// Optimized carousel functionality
let carouselTimeout;
const CAROUSEL_TRANSITION_SPEED = 300;

document.querySelectorAll('.carousel-inner').forEach(carousel => {
    carousel.style.transition = `transform ${CAROUSEL_TRANSITION_SPEED}ms ease-in-out`;
});
