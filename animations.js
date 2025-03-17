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
    
    // Set Home as initial active tab
    const initialTab = document.querySelector('nav ul li a[data-tab="home"]');
    if (initialTab) {
        initialTab.classList.add('active-tab');
        const homeSection = document.getElementById('home');
        if (homeSection) {
            homeSection.classList.add('active');
            homeSection.style.display = 'block';
            homeSection.style.opacity = '1';
            homeSection.style.transform = 'translateY(0) rotateX(0deg)';
            currentActive = 'home';
            
            // Preload images in the home section
            preloadImagesInSection(homeSection);
        }
    }
    
    // Tab click event with improved error handling
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (isAnimating) return; // Prevent clicking during animation
            
            const tabId = this.getAttribute('data-tab');
            if (!tabId) return;
            
            // Skip if clicking the current active tab
            if (currentActive === tabId) return;
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active-tab'));
            
            // Add active class to current tab
            this.classList.add('active-tab');
            
            // Switch tab content with animation
            switchTab(tabId);
        });
    });
});

// Enhanced tab transition with 3D effect
function switchTab(tabId) {
    if (!tabId) return;
    
    const sections = document.querySelectorAll('.tab-section');
    const targetSection = document.getElementById(tabId);
    
    if (!targetSection) {
        console.error(`Target section with ID '${tabId}' not found`);
        return;
    }
    
    isAnimating = true;
    
    // Get current active section
    const currentSection = document.querySelector('.tab-section.active');
    
    if (currentSection) {
        // Animate current section out
        currentSection.style.transform = 'translateY(-20px) rotateX(-10deg)';
        currentSection.style.opacity = '0';
        
        setTimeout(() => {
            currentSection.style.display = 'none';
            currentSection.classList.remove('active');
            
            // Animate new section in
            targetSection.style.display = 'block';
            targetSection.classList.add('active');
            
            // Trigger a reflow
            void targetSection.offsetWidth;
            
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateY(0) rotateX(0deg)';
            
            // Preload images in the target section
            preloadImagesInSection(targetSection);
            
            // Start skill bar animations if skills tab
            if (tabId === 'skills') {
                setTimeout(animateSkillBars, 500);
            }
            
            currentActive = tabId;
            
            // Reset animation flag after animation completes
            setTimeout(() => {
                isAnimating = false;
            }, 800);
        }, 600);
    } else {
        // If no current section (first load), just show the target
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
        targetSection.style.opacity = '1';
        targetSection.style.transform = 'translateY(0) rotateX(0deg)';
        
        // Preload images in the target section
        preloadImagesInSection(targetSection);
        
        currentActive = tabId;
        isAnimating = false;
    }
}

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
    
    // Project descriptions typewriter - initialize with first description
    initProjectDescriptionTypewriter(0);
});

// Initialize project description typewriter with the specified index
function initProjectDescriptionTypewriter(index) {
    const projectDesc = document.getElementById('projectDesc');
    if (!projectDesc) return;
    
    const projectDescriptions = [
        'A Point of Sale system built with modern technologies. Features include inventory management, sales tracking, and customer management.',
        'A banking application prototype with secure authentication and transaction processing capabilities.'
    ];
    
    // Clear existing typewriter instance if it exists
    if (projectDesc._typewriterInstance) {
        projectDesc._typewriterInstance.destroy();
    }
    
    // Clear existing text
    projectDesc.textContent = '';
    projectDesc.style.opacity = '1';
    
    // Create new typewriter with current description
    const description = index < projectDescriptions.length ? projectDescriptions[index] : projectDescriptions[0];
    new Typewriter(projectDesc, [description], {
        typeSpeed: 40,
        deleteSpeed: 30,
        pauseBeforeDelete: 5000,
        pauseBeforeType: 500,
        loop: false // Don't loop for project descriptions
    });
}

// Optimized carousel functionality with smooth transitions and synchronized text
let currentSlide = 0;
const CAROUSEL_TRANSITION_SPEED = 400;
const projectDescriptions = [
    'A Point of Sale system built with modern technologies. Features include inventory management, sales tracking, and customer management.',
    'A banking application prototype with secure authentication and transaction processing capabilities.'
];

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
    if (projectDesc) {
        // Fade out the text
        projectDesc.style.opacity = '0';
        
        // After transition completes, update the typewriter
        setTimeout(() => {
            initProjectDescriptionTypewriter(currentSlide);
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
    const slides = carousel.querySelectorAll('a');
    
    if (!carousel || slides.length === 0 || slideIndex < 0 || slideIndex >= slides.length) return;
    
    // Update current slide
    currentSlide = slideIndex;
    
    // Apply transition
    carousel.style.transition = `transform ${CAROUSEL_TRANSITION_SPEED}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update project description with typewriter effect
    const projectDesc = document.getElementById('projectDesc');
    if (projectDesc) {
        projectDesc.style.opacity = '0';
        setTimeout(() => {
            initProjectDescriptionTypewriter(currentSlide);
        }, 300);
    }
    
    // Update indicators
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

// Initialize all animations and effects
document.addEventListener('DOMContentLoaded', function() {
    // Initialize existing functionality
    initTypewriterEffects();
    animateSkillBars();
    addCardEffects();
    
    // Initialize project description for the first slide
    initProjectDescriptionTypewriter(0);
    
    // Make sure carousel is initialized properly
    const carousel = document.querySelector('.carousel-inner');
    if (carousel) {
        carousel.style.transform = 'translateX(0)';
    }
    
    // Update carousel indicators
    const indicators = document.querySelectorAll('.carousel-indicator');
    if (indicators.length > 0) {
        indicators[0].classList.add('active');
    }
    
    // Fix click events on project images
    const projectImages = document.querySelectorAll('.carousel-inner a');
    projectImages.forEach((link, index) => {
        // Remove inline onclick attribute to avoid conflicts
        link.removeAttribute('onclick');
        
        // Add clean event listener
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openProjectModal(index);
        });
    });
});

// Project modal functionality
function openProjectModal(index) {
    const modal = document.getElementById(`projectModal${index}`);
    if (!modal) return;
    
    modal.style.display = 'block';
    modal.style.opacity = '0';
    
    // Apply entrance animation
    setTimeout(() => {
        modal.style.transition = 'opacity 0.3s ease';
        modal.style.opacity = '1';
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'translateY(0)';
        modalContent.style.opacity = '1';
    }, 10);
    
    // Clean up existing event listeners to prevent duplicates
    const existingModalClickHandler = modal._modalClickHandler;
    if (existingModalClickHandler) {
        modal.removeEventListener('click', existingModalClickHandler);
    }
    
    // Assign new click handler to close when clicking outside
    modal._modalClickHandler = function(e) {
        if (e.target === modal) {
            closeProjectModal(index);
        }
    };
    modal.addEventListener('click', modal._modalClickHandler);
    
    // Clean up existing key handler
    if (window._modalKeyHandler) {
        document.removeEventListener('keydown', window._modalKeyHandler);
    }
    
    // Assign new key handler
    window._modalKeyHandler = function(e) {
        if (e.key === 'Escape') {
            closeProjectModal(index);
        }
    };
    document.addEventListener('keydown', window._modalKeyHandler);
}

function closeProjectModal(index) {
    const modal = document.getElementById(`projectModal${index}`);
    if (!modal) return;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = 'translateY(20px)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            
            // Clean up event listeners
            if (modal._modalClickHandler) {
                modal.removeEventListener('click', modal._modalClickHandler);
            }
            if (window._modalKeyHandler) {
                document.removeEventListener('keydown', window._modalKeyHandler);
            }
        }, 300);
    }, 200);
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

// Animation for skill progress bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress-value');
    
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-in-out';
            bar.style.width = width;
        }, 300);
    });
}

// Add 3D transform effect to cards
function addCardEffects() {
    const cards = document.querySelectorAll('.testimonial-card, .professional-summary');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', handleCardHover);
        card.addEventListener('mouseleave', resetCard);
    });
}

function handleCardHover(e) {
    const card = this;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = (x - centerX) / 15;
    const rotateX = (centerY - y) / 15;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.transition = 'transform 0.1s ease';
    
    // Add shine effect
    const shine = card.querySelector('.shine') || document.createElement('div');
    if (!card.querySelector('.shine')) {
        shine.classList.add('shine');
        card.appendChild(shine);
    }
    
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;
    shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%)`;
}

function resetCard() {
    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    this.style.transition = 'transform 0.5s ease';
    
    const shine = this.querySelector('.shine');
    if (shine) {
        shine.style.background = 'none';
    }
}

// When scrolling, check if skill section is visible
window.addEventListener('scroll', function() {
    const skillsSection = document.getElementById('skills');
    if (skillsSection && isElementInViewport(skillsSection)) {
        animateSkillBars();
    }
});

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}
