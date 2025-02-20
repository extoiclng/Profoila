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

// Enhanced Typewriter effect with erase and queue capability
let currentTypewriter;
const typewriter = (element, text, speed = 50, erase = false) => {
    // Clear any existing typewriter
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
            }
        } else {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                currentTypewriter = setTimeout(type, speed);
            } else {
                currentTypewriter = null;
            }
        }
    };
    type();
};


// Optimized carousel functionality
let carouselTimeout;
const CAROUSEL_TRANSITION_SPEED = 300; // milliseconds


// Initialize typewriter effects
const dynamicText = document.querySelector('.dynamic-text');
if (dynamicText) {
    const text = dynamicText.textContent;
    dynamicText.textContent = '';
    typewriter(dynamicText, text);
}

// Optimize carousel transitions
document.querySelectorAll('.carousel-inner').forEach(carousel => {
    carousel.style.transition = `transform ${CAROUSEL_TRANSITION_SPEED}ms ease-in-out`;
});
