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
    let isAnimating = false;
    
    // Add planets and landing pads to sections
    sections.forEach((section, index) => {
        const planetType = index === 0 ? 'earth' : 
                         index === 1 ? 'moon' : 
                         index === 2 ? 'mars' : 'earth';
        
        // Add planet
        const planet = document.createElement('div');
        planet.className = `planet ${planetType}`;
        section.appendChild(planet);
        
        // Add landing pad
        const landingPad = document.createElement('div');
        landingPad.className = 'landing-pad';
        planet.appendChild(landingPad);
    });
    
    // Create rocket and astronaut
    const rocket = document.createElement('div');
    rocket.className = 'rocket';
    document.body.appendChild(rocket);
    
    const astronaut = document.createElement('div');
    astronaut.className = 'astronaut';
    document.body.appendChild(astronaut);
    
    // Position rocket and astronaut initially
    positionRocketAndAstronaut('home');
    
    // Tab click event with improved error handling
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (isAnimating) return;
            
            const tabId = this.getAttribute('data-tab');
            if (!tabId || currentActive === tabId) return;
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active-tab'));
            
            // Add active class to current tab
            this.classList.add('active-tab');
            
            // Animate rocket launch
            animateTabTransition(currentActive, tabId);
        });
    });
    
    function positionRocketAndAstronaut(tabId) {
        const section = document.getElementById(tabId);
        if (!section) return;
        
        const planet = section.querySelector('.planet');
        if (!planet) return;
        
        const planetRect = planet.getBoundingClientRect();
        
        // Position relative to the planet
        const rocketX = planetRect.right - 90; // Adjust for rocket size
        const rocketY = planetRect.top + 20; // Land slightly above the planet
        
        rocket.style.left = `${rocketX}px`;
        rocket.style.top = `${rocketY}px`;
        rocket.style.transform = 'rotate(-45deg)'; // Landing angle
        
        // Position astronaut near the rocket
        const astronautX = rocketX + 40;
        const astronautY = rocketY + 10;
        
        astronaut.style.left = `${astronautX}px`;
        astronaut.style.top = `${astronautY}px`;
    }
    
    function animateTabTransition(fromTab, toTab) {
        isAnimating = true;
        
        // Get the current and target planets' positions
        const currentSection = document.getElementById(fromTab);
        const targetSection = document.getElementById(toTab);
        const currentPlanet = currentSection?.querySelector('.planet');
        const targetPlanet = targetSection?.querySelector('.planet');
        
        if (!currentPlanet || !targetPlanet) return;
        
        const currentRect = currentPlanet.getBoundingClientRect();
        const targetRect = targetPlanet.getBoundingClientRect();
        
        // Calculate trajectory
        const startX = currentRect.right - 90;
        const startY = currentRect.top + 20;
        const endX = targetRect.right - 90;
        const endY = targetRect.top + 20; // Adjust to land slightly above the planet
        
        // Reset animations first
        rocket.style.animation = 'none';
        astronaut.style.animation = 'none';
        rocket.offsetHeight; // Force reflow
        
        // Launch animation
        setTimeout(() => {
            rocket.style.animation = 'rocketLaunch 2s forwards';
            console.log('Rocket animation started');
            
            // Switch tab content after launch
            setTimeout(() => {
                createSmokeParticles();
                switchTab(toTab);
                
                // Reset positions for landing
                rocket.style.left = `${endX}px`;
                rocket.style.top = `${endY}px`;
                
                // Reset animations again before landing
                rocket.style.animation = 'none';
                astronaut.style.animation = 'none';
                rocket.offsetHeight; // Force reflow
                
                // Start landing animation
                rocket.style.animation = 'rocketLand 2s ease-in-out forwards';
                astronaut.style.animation = 'rocketLand 2s forwards';
                
                setTimeout(() => {
                    createSmokeParticles();
                    isAnimating = false;
                    currentActive = toTab;
                    
                    // Final position adjustment
                    positionRocketAndAstronaut(toTab);
                    
                    // Clear animations after landing
                    rocket.style.animation = 'none';
                    astronaut.style.animation = 'none';
                }, 2000);
            }, 2000);
        }, 250);
    }
    
    function switchTab(tabId) {
        if (!tabId) return;
        
        const sections = document.querySelectorAll('.tab-section');
        const targetSection = document.getElementById(tabId);
        
        if (!targetSection) return;
        
        const currentSection = document.querySelector('.tab-section.active');
        
        if (currentSection) {
            currentSection.style.opacity = '0';
            currentSection.style.transform = 'translateY(-20px) rotateX(10deg)';
            
            setTimeout(() => {
                currentSection.style.display = 'none';
                currentSection.classList.remove('active');
                
                targetSection.style.display = 'block';
                targetSection.classList.add('active');
                
                // Force reflow
                void targetSection.offsetWidth;
                
                // Trigger animation
                targetSection.style.opacity = '1';
                targetSection.style.transform = 'translateY(0) rotateX(0deg)';
                
                if (tabId === 'skills') {
                    setTimeout(animateSkillBars, 300);
                }
            }, 400);
        } else {
            targetSection.style.display = 'block';
            targetSection.classList.add('active');
        }
    }
    
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
        }
    }
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
            "Welcome to my portfolio!",
            "I'm a passionate developer",
            "Let's create something amazing together!"
        ], {
            typeSpeed: 80,
            deleteSpeed: 40,
            pauseBeforeDelete: 2000,
            pauseBeforeType: 500
        });
    }

    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        mirror: false
    });

    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Initialize project description typewriter - initialize with first description
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
