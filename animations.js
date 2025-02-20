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

// Enhanced Typewriter effect with queue and callback
let currentTypewriter;
const typewriter = (element, text, speed = 50, erase = false, callback) => {
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

// Project descriptions with highlighted keywords
const projectDescriptions = [
    {
        text: "Point of Sale System - A complete retail management solution with barcode scanning and transaction management.",
        keywords: ["Point of Sale", "barcode scanning", "transaction management"]
    },
    {
        text: "Banking Application - Secure online banking platform with account management and transaction features.",
        keywords: ["Banking Application", "account management", "transaction features"]
    },
    {
        text: "AI Model - Machine learning model that learns from user feedback and improves over time.",
        keywords: ["AI Model", "machine learning", "user feedback"]
    }
];

// Highlight keywords in text
const highlightKeywords = (text, keywords) => {
    keywords.forEach(keyword => {
        text = text.replace(new RegExp(keyword, 'g'), `<span class="highlight">${keyword}</span>`);
    });
    return text;
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

// Initialize project descriptions
const projectDescElement = document.getElementById('projectDesc');
if (projectDescElement) {
    projectDescElement.textContent = '';
    typewriter(projectDescElement, projectDescriptions[0].text, 50, false, () => {
        projectDescElement.innerHTML = highlightKeywords(projectDescriptions[0].text, projectDescriptions[0].keywords);
    });
}


// Optimize carousel transitions
document.querySelectorAll('.carousel-inner').forEach(carousel => {
    carousel.style.transition = `transform ${CAROUSEL_TRANSITION_SPEED}ms ease-in-out`;
});
