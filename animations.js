// Intersection Observer for scroll animations with improved effect
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            
            // Add extra animations for icons in skills section
            const icons = entry.target.querySelectorAll('.skill-item i');
            icons.forEach((icon, index) => {
                icon.style.animationDelay = `${index * 0.1}s`;
                icon.style.animation = 'bounceIn 0.6s forwards';
            });
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

// Observe all elements with animate-on-scroll class
document.querySelectorAll('.animate-on-scroll').forEach(element => {
    observer.observe(element);
});

// Enhanced tab switching with 3D box transition
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('.tab-section');
    let currentActive = null;
    let isAnimating = false; // Flag to prevent double animations
    
    // Add animation styles
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes bounceIn {
            0% { transform: scale(0); opacity: 0; }
            60% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        .active-tab {
            color: #4facfe !important;
            background-color: rgba(79, 172, 254, 0.1);
            transform: translateY(-3px);
        }
        
        .active-tab::before {
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Prevent animation if already in progress
            if (isAnimating) return;
            
            const target = tab.getAttribute('data-tab');
            
            // If clicking the same tab, do nothing
            if (currentActive && currentActive.id === target) return;
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active-tab'));
            
            // Add active class to current tab
            tab.classList.add('active-tab');
            
            if (currentActive) {
                // Set animating flag
                isAnimating = true;
                
                // Animate current section out
                currentActive.classList.add('slide-out');
                
                // Use the exact animation duration from our CSS
                setTimeout(() => {
                    currentActive.style.display = 'none';
                    currentActive.classList.remove('active', 'slide-out');
                    
                    // Animate new section in
                    const activeSection = document.getElementById(target);
                    activeSection.style.display = 'block';
                    
                    // Force all images to load immediately
                    preloadImagesInSection(activeSection);
                    
                    setTimeout(() => {
                        activeSection.classList.add('active', 'slide-in');
                        currentActive = activeSection;
                        
                        // Remove slide-in class after animation completes
                        setTimeout(() => {
                            activeSection.classList.remove('slide-in');
                            isAnimating = false; // Reset animation flag
                        }, 1200); // Match the CSS animation duration
                    }, 50);
                }, 1200); // Match the CSS animation duration
            } else {
                // First load - no animation needed
                const activeSection = document.getElementById(target);
                activeSection.style.display = 'block';
                preloadImagesInSection(activeSection);
                
                setTimeout(() => {
                    activeSection.classList.add('active');
                    currentActive = activeSection;
                }, 50);
            }
        });
    });

    // Pre-load images function
    function preloadImagesInSection(section) {
        const images = section.querySelectorAll('img');
        images.forEach(img => {
            // Remove lazy loading for visible sections
            if (img.hasAttribute('loading')) {
                img.removeAttribute('loading');
            }
            
            // Force reload by setting src again
            const src = img.getAttribute('src');
            if (src) {
                // Create a new image to preload
                const preloadImg = new Image();
                preloadImg.onload = function() {
                    // Once preloaded, update the original img
                    img.src = src;
                    // Add fade-in effect
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, 100);
                };
                preloadImg.src = src;
            }
        });
    }

    // Initialize the first tab as active
    document.querySelector('nav ul li a').click();
});

// Enhanced Typewriter effect with improved mechanics
// This fixes the issue where the typewriter would go farther than the text
class Typewriter {
    constructor(element, textArray, options = {}) {
        this.element = element;
        this.textArray = textArray;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        this.typingTimeout = null;
        
        // Options with defaults
        this.options = {
            typeSpeed: options.typeSpeed || 50,
            deleteSpeed: options.deleteSpeed || 30,
            pauseBeforeDelete: options.pauseBeforeDelete || 2000,
            pauseBeforeType: options.pauseBeforeType || 500,
            loop: options.loop !== undefined ? options.loop : true
        };
        
        this.element.textContent = '';
        this.element.style.borderRight = '3px solid #4facfe';
        this.element.style.paddingRight = '4px';
        this.element.style.display = 'inline-block';
        
        // Clear any existing timeouts
        if (this.element._typewriterTimeout) {
            clearTimeout(this.element._typewriterTimeout);
        }
        
        // Store reference to timeout on the element itself to prevent multiple instances
        this.element._typewriterInstance = this;
        
        // Start typing
        this.type();
    }
    
    type() {
        // Clear any existing timeout
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
            this.typingTimeout = null;
        }
        
        // Get current text
        const currentText = this.textArray[this.currentTextIndex];
        
        // Determine typing or deleting speed
        const speed = this.isDeleting 
            ? this.options.deleteSpeed 
            : this.options.typeSpeed;
        
        if (this.isPaused) {
            // If paused, wait then resume
            this.typingTimeout = setTimeout(() => {
                this.isPaused = false;
                this.type();
            }, this.isDeleting ? this.options.pauseBeforeType : this.options.pauseBeforeDelete);
            return;
        }
        
        if (this.isDeleting) {
            // Remove character
            this.currentCharIndex--;
            this.element.textContent = currentText.substring(0, this.currentCharIndex);
            
            // If deleted everything, move to next text
            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.textArray.length;
                
                // If we've gone through all texts and don't want to loop, stop
                if (!this.options.loop && this.currentTextIndex === 0) {
                    return;
                }
                
                // Pause before typing next text
                this.isPaused = true;
            }
        } else {
            // Add character
            this.currentCharIndex++;
            this.element.textContent = currentText.substring(0, this.currentCharIndex);
            
            // If typed everything, prepare to delete
            if (this.currentCharIndex === currentText.length) {
                this.isDeleting = this.options.loop; // Only delete if looping
                this.isPaused = true;
            }
        }
        
        // Call type again with appropriate delay
        this.typingTimeout = setTimeout(() => this.type(), speed);
    }
    
    // Clean up method
    destroy() {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
            this.typingTimeout = null;
        }
        this.element._typewriterInstance = null;
    }
}

// Initialize typewriter effects
document.addEventListener('DOMContentLoaded', () => {
    // Dynamic text in home section
    const dynamicText = document.querySelector('.dynamic-text');
    if (dynamicText) {
        new Typewriter(dynamicText, [
            'Web Developer', 
            'UI/UX Designer', 
            'Software Engineer',
            'Problem Solver'
        ], {
            typeSpeed: 80,
            deleteSpeed: 50
        });
    }
    
    // Project descriptions typewriter
    const projectDesc = document.getElementById('projectDesc');
    if (projectDesc) {
        const descriptions = [
            'A Point of Sale system built with modern technologies. Features include inventory management, sales tracking, and customer management.',
            'A banking application prototype with secure authentication and transaction processing capabilities.'
        ];
        
        projectDesc.textContent = ''; // Clear any initial text
        new Typewriter(projectDesc, [descriptions[0]], {
            typeSpeed: 50,
            deleteSpeed: 30,
            pauseBeforeDelete: 4000,
            pauseBeforeType: 1000,
            loop: false // Don't loop for project descriptions
        });
    }
});

// Optimized carousel functionality with smooth transitions and synchronized text
let currentSlide = 0;
const CAROUSEL_TRANSITION_SPEED = 400;

function changeSlide(step) {
    const carousel = document.querySelector('.carousel-inner');
    const slides = carousel.querySelectorAll('a');
    const projectDesc = document.getElementById('projectDesc');
    
    if (!carousel || slides.length === 0) return;
    
    // Calculate new index
    currentSlide = (currentSlide + step + slides.length) % slides.length;
    
    // Apply transform with smooth transition
    carousel.style.transition = `transform ${CAROUSEL_TRANSITION_SPEED}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update the project description text to match the current slide
    const descriptions = [
        'A Point of Sale system built with modern technologies. Features include inventory management, sales tracking, and customer management.',
        'A banking application prototype with secure authentication and transaction processing capabilities.'
    ];
    
    // Fade out the text
    if (projectDesc) {
        projectDesc.style.opacity = '0';
        setTimeout(() => {
            // Update text content and reset typewriter
            if (currentSlide < descriptions.length) {
                // Clear existing text and create new typewriter with current description
                projectDesc.textContent = '';
                new Typewriter(projectDesc, [descriptions[currentSlide]], {
                    typeSpeed: 30,
                    deleteSpeed: 20,
                    pauseBeforeDelete: 4000,
                    pauseBeforeType: 500,
                    loop: false
                });
            }
            projectDesc.style.opacity = '1';
        }, 300);
    }
    
    // Update active indicator if exists
    const indicators = document.querySelectorAll('.carousel-indicator');
    if (indicators.length) {
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
}

// Function to go to a specific slide when clicking on indicators
function goToSlide(slideIndex) {
    const carousel = document.querySelector('.carousel-inner');
    const projectDesc = document.getElementById('projectDesc');
    const slides = carousel.querySelectorAll('a');
    
    if (!carousel || slides.length === 0 || slideIndex < 0 || slideIndex >= slides.length) return;
    
    // Update current slide
    currentSlide = slideIndex;
    
    // Apply transition
    carousel.style.transition = `transform ${CAROUSEL_TRANSITION_SPEED}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update indicators
    const indicators = document.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
    
    // Update the project description text
    const descriptions = [
        'A Point of Sale system built with modern technologies. Features include inventory management, sales tracking, and customer management.',
        'A banking application prototype with secure authentication and transaction processing capabilities.'
    ];
    
    // Fade out the text
    if (projectDesc && currentSlide < descriptions.length) {
        projectDesc.style.opacity = '0';
        setTimeout(() => {
            // Update text content and reset typewriter
            projectDesc.textContent = '';
            new Typewriter(projectDesc, [descriptions[currentSlide]], {
                typeSpeed: 30,
                deleteSpeed: 20,
                pauseBeforeDelete: 4000,
                pauseBeforeType: 500,
                loop: false
            });
            projectDesc.style.opacity = '1';
        }, 300);
    }
}

// Add 3D transform hover effects to elements
document.addEventListener('DOMContentLoaded', () => {
    // Add tilt effect to skill items
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            item.style.transform = `perspective(1000px) rotateX(${deltaY * -10}deg) rotateY(${deltaX * 10}deg) translateZ(10px)`;
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                item.style.transform = '';
            }, 1000);
        });
    });
    
    // Add parallax effect to sections
    const sections = document.querySelectorAll('.tab-section');
    
    window.addEventListener('scroll', () => {
        sections.forEach(section => {
            if (section.classList.contains('active')) {
                const scrollPos = window.scrollY;
                const sectionTop = section.offsetTop;
                const offset = (scrollPos - sectionTop) * 0.1;
                
                // Apply subtle parallax to background
                section.style.backgroundPosition = `center ${offset}px`;
            }
        });
    });
    
    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
