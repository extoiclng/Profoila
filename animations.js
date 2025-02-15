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

// Typewriter effect for dynamic text
const typewriter = (element, text, speed = 100) => {
    let i = 0;
    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    type();
};

// Initialize typewriter effect
const dynamicText = document.querySelector('.dynamic-text');
if (dynamicText) {
    const text = dynamicText.textContent;
    dynamicText.textContent = '';
    typewriter(dynamicText, text);
}
