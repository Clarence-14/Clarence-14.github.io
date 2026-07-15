// main.js - Modern Interaction System

document.addEventListener('DOMContentLoaded', () => {
    // 1. Current Year for Footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Navbar shrink function (reduces padding on scroll)
    const navbarCollapsible = document.querySelector('#mainNav');
    const navbarShrink = () => {
        if (!navbarCollapsible) return;
        if (window.scrollY > 50) {
            navbarCollapsible.classList.add('navbar-shrink');
        } else {
            navbarCollapsible.classList.remove('navbar-shrink');
        }
    };

    navbarShrink(); // Initial check
    document.addEventListener('scroll', navbarShrink, { passive: true });

    // 3. Collapse mobile menu on click of nav items
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navLinks = document.querySelectorAll('#navbarResponsive .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // 4. Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        const toggleBackToTop = () => {
            if (window.scrollY > 400) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        };
        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 5. Intersection Observer for Scroll Reveals (Fade Up animations)
    // Add reveal class to targets programmatically to keep HTML readable
    const revealTargets = document.querySelectorAll(
        '.fade-up, .skill-card, .portfolio-item, .contact-form-card, .social-item-link, .page-section h2, .page-section hr.divider'
    );
    
    // Setup initial state for target elements
    revealTargets.forEach(el => {
        if (!el.classList.contains('fade-up')) {
            el.classList.add('fade-up');
        }
    });

    // Stagger delay helper for adjacent items inside layout rows
    const rows = document.querySelectorAll('.row, .social-card-container');
    rows.forEach(row => {
        const children = row.querySelectorAll('.skill-card, .portfolio-item, .social-item-link');
        children.forEach((child, index) => {
            // Distribute animation delays to achieve a wave effect
            child.style.transitionDelay = `${index * 0.1}s`;
        });
    });

    // Observer options
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after showing to prevent repeat trigger
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealTargets.forEach(target => {
        revealObserver.observe(target);
    });

    // Trigger reveal for elements that might already be in viewport on load
    const mainRevealElements = document.querySelectorAll('.fade-up');
    mainRevealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('visible');
        }
    });

    // 6. Contact Form Submission Micro-Interaction
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('contactSubmitBtn');
            if (!submitBtn) return;
            
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin me-2"></i>Sending Message...';

            const formData = new FormData(contactForm);
            
            fetch("https://formsubmit.co/ajax/thisisclarence1@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData))
            })
            .then(response => {
                if (response.ok) {
                    submitBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i>Message Sent!';
                    submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                    contactForm.reset();
                } else {
                    throw new Error("Failed to send");
                }
                
                // Restore button state after 3.5s
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                }, 3500);
            })
            .catch(error => {
                console.error("Error submitting form:", error);
                submitBtn.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>Error Sending';
                submitBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                }, 3500);
            });
        });
    }
});
