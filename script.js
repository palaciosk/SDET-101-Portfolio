// ===== Hamburger Menu Toggle =====
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link (mobile)
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });

        // Close menu when clicking outside (mobile)
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 768) {
                const isClickInsideNav = navMenu.contains(event.target);
                const isClickOnHamburger = hamburger.contains(event.target);
                
                if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });

        // Close menu on window resize if it becomes desktop size
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // ===== Contact Form Validation =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            const formSuccess = document.getElementById('formSuccess');
            
            let isValid = true;
            
            // Reset previous error states
            [name, email, subject, message].forEach(field => {
                field.classList.remove('error');
                const errorElement = document.getElementById(field.id + '-error');
                if (errorElement) {
                    errorElement.textContent = '';
                }
            });
            
            // Validate Name
            if (!name.value.trim()) {
                showError(name, 'Name is required');
                isValid = false;
            } else if (name.value.trim().length < 2) {
                showError(name, 'Name must be at least 2 characters');
                isValid = false;
            }
            
            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim()) {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!emailRegex.test(email.value)) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate Subject
            if (!subject.value.trim()) {
                showError(subject, 'Subject is required');
                isValid = false;
            } else if (subject.value.trim().length < 3) {
                showError(subject, 'Subject must be at least 3 characters');
                isValid = false;
            }
            
            // Validate Message
            if (!message.value.trim()) {
                showError(message, 'Message is required');
                isValid = false;
            } else if (message.value.trim().length < 10) {
                showError(message, 'Message must be at least 10 characters');
                isValid = false;
            }
            
            // If form is valid, show success message
            if (isValid) {
                formSuccess.textContent = 'Thank you! Your message has been sent successfully.';
                formSuccess.classList.add('show');
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formSuccess.classList.remove('show');
                }, 5000);
                
                // In a real application, you would send the form data to a server here
                console.log('Form submitted:', {
                    name: name.value,
                    email: email.value,
                    subject: subject.value,
                    message: message.value
                });
            } else {
                // Focus on first error field
                const firstErrorField = contactForm.querySelector('.error');
                if (firstErrorField) {
                    firstErrorField.focus();
                    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
        
        // Real-time validation on blur
        const formFields = ['name', 'email', 'subject', 'message'];
        formFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', function() {
                    validateField(field);
                });
            }
        });
    }
});

// ===== Helper function to show error =====
function showError(field, message) {
    field.classList.add('error');
    const errorElement = document.getElementById(field.id + '-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.setAttribute('aria-live', 'polite');
    }
}

// ===== Real-time field validation =====
function validateField(field) {
    const fieldId = field.id;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch(fieldId) {
        case 'name':
            if (!value) {
                isValid = false;
                errorMessage = 'Name is required';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
        case 'subject':
            if (!value) {
                isValid = false;
                errorMessage = 'Subject is required';
            } else if (value.length < 3) {
                isValid = false;
                errorMessage = 'Subject must be at least 3 characters';
            }
            break;
        case 'message':
            if (!value) {
                isValid = false;
                errorMessage = 'Message is required';
            } else if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters';
            }
            break;
    }
    
    if (isValid) {
        field.classList.remove('error');
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    } else {
        showError(field, errorMessage);
    }
}

// ===== Image Carousel Functions =====
let carouselIndices = {}; // Store current slide index for each carousel

function initializeCarousel(carouselNumber) {
    if (!carouselIndices[carouselNumber]) {
        carouselIndices[carouselNumber] = 0;
    }
    showSlide(carouselNumber, carouselIndices[carouselNumber]);
}

// Initialize all carousels on page load
document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('[id^="carousel"]');
    carousels.forEach((carousel, index) => {
        const carouselNumber = index + 1;
        initializeCarousel(carouselNumber);
        
        // Auto-play carousel (optional - can be disabled)
        // setInterval(() => {
        //     changeSlide(carouselNumber, 1);
        // }, 5000);
    });
    
    // Add keyboard navigation for carousels
    document.addEventListener('keydown', function(e) {
        const activeCarousel = document.querySelector('.carousel-container:has(.carousel-slide.active)');
        if (activeCarousel) {
            const carouselId = activeCarousel.id;
            const carouselNumber = parseInt(carouselId.replace('carousel', ''));
            
            if (e.key === 'ArrowLeft') {
                changeSlide(carouselNumber, -1);
            } else if (e.key === 'ArrowRight') {
                changeSlide(carouselNumber, 1);
            }
        }
    });
});

function showSlide(carouselNumber, index) {
    const carousel = document.getElementById('carousel' + carouselNumber);
    if (!carousel) return;
    
    const slides = carousel.getElementsByClassName('carousel-slide');
    const dots = document.querySelectorAll(`#carousel${carouselNumber} ~ .carousel-dots .dot`);
    
    if (slides.length === 0) return;
    
    // Reset indices if out of bounds
    if (index >= slides.length) {
        index = 0;
    } else if (index < 0) {
        index = slides.length - 1;
    }
    
    carouselIndices[carouselNumber] = index;
    
    // Hide all slides
    Array.from(slides).forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show current slide
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    
    // Update dots
    dots.forEach((dot, i) => {
        const isActive = i === index;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive);
    });
}

function changeSlide(carouselNumber, direction) {
    const carousel = document.getElementById('carousel' + carouselNumber);
    if (!carousel) return;
    
    const slides = carousel.getElementsByClassName('carousel-slide');
    if (slides.length === 0) return;
    
    if (!carouselIndices[carouselNumber]) {
        carouselIndices[carouselNumber] = 0;
    }
    
    carouselIndices[carouselNumber] += direction;
    showSlide(carouselNumber, carouselIndices[carouselNumber]);
}

function currentSlide(carouselNumber, index) {
    showSlide(carouselNumber, index);
}

// ===== Smooth Scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// ===== Scroll animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .link-card, .education-item, .interest-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===== Active navigation link highlighting =====
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// ===== Add loading animation for images (when using real images) =====
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    
    // If image is already loaded
    if (img.complete) {
        img.style.opacity = '1';
    }
});

