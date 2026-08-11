/**
 * Dr. Adeeb Bazhair - Premium Medical Website
 * JavaScript interactions and animations
 */

(function() {
    'use strict';

    // ============================================
    // Configuration
    // ============================================
    const CONFIG = {
        scrollThreshold: 50,
        revealOffset: 0.15,
        mobileBreakpoint: 768,
    };

    // ============================================
    // Services Data Structure
    // ============================================
    // Services will be populated dynamically.
    // To add services, push objects to this array with:
    // { title: 'Service Name', description: 'Description', icon: 'SVG string' }
    const services = [];

    // ============================================
    // DOM Elements
    // ============================================
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.querySelector('.navbar__mobile-toggle');
    const navMenu = document.querySelector('.navbar__nav');
    const navLinks = document.querySelectorAll('.navbar__links a');
    const servicesGrid = document.getElementById('services-grid');
    const servicesEmpty = document.getElementById('services-empty');
    const heroContent = document.querySelector('.hero__content');
    const heroImage = document.querySelector('.hero__image-wrapper');

    // ============================================
    // Navbar Scroll Behavior
    // ============================================
    function handleNavbarScroll() {
        if (window.scrollY > CONFIG.scrollThreshold) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }
    }

    // Throttle scroll event
    let scrollTicking = false;
    window.addEventListener('scroll', function() {
        if (!scrollTicking) {
            window.requestAnimationFrame(function() {
                handleNavbarScroll();
                updateActiveNavLink();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // ============================================
    // Mobile Menu
    // ============================================
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            const isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isOpen);
            navMenu.classList.toggle('open');
            document.body.style.overflow = isOpen ? '' : 'hidden';
        });

        // Close mobile menu when clicking a link
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= CONFIG.mobileBreakpoint) {
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('open');
                    document.body.style.overflow = '';
                }
            });
        });

        // Close on resize if larger than mobile
        window.addEventListener('resize', function() {
            if (window.innerWidth > CONFIG.mobileBreakpoint) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // Smooth Scroll Navigation
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Active Navigation Link
    // ============================================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        let currentSection = '';

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    // ============================================
    // Scroll Reveal Animation
    // ============================================
    function initScrollReveal() {
        // Add reveal class to elements that should animate
        const revealElements = document.querySelectorAll(
            '.credentials__header, .credential-card, ' +
            '.benefits__header, .benefit-card, ' +
            '.services__header, .services__empty, .service-card, ' +
            '.about__image-col, .about__content-col, ' +
            '.appointment__content, ' +
            '.hero__highlights .hero__highlight-item'
        );

        revealElements.forEach(function(el, index) {
            el.classList.add('reveal');
            // Add staggered delays for sibling elements
            const parent = el.parentElement;
            if (parent) {
                const siblings = Array.from(parent.children).filter(function(child) {
                    return child.classList.contains('reveal');
                });
                const siblingIndex = siblings.indexOf(el);
                if (siblingIndex > 0 && siblingIndex < 5) {
                    el.classList.add('reveal-delay-' + siblingIndex);
                }
            }
        });

        // Intersection Observer for reveal
        const revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: CONFIG.revealOffset,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.reveal').forEach(function(el) {
            revealObserver.observe(el);
        });
    }

    // ============================================
    // Hero Entrance Animation
    // ============================================
    function animateHero() {
        // Animate hero content elements
        const heroElements = [
            '.hero__badge',
            '.hero__title',
            '.hero__description',
            '.hero__cta-group'
        ];

        heroElements.forEach(function(selector, index) {
            const el = document.querySelector(selector);
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(25px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.style.transitionDelay = (0.2 + index * 0.15) + 's';
                
                // Trigger animation after a small delay
                requestAnimationFrame(function() {
                    requestAnimationFrame(function() {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    });
                });
            }
        });

        // Animate hero image
        const heroImageEl = document.querySelector('.hero__image-frame');
        if (heroImageEl) {
            heroImageEl.style.opacity = '0';
            heroImageEl.style.transform = 'translateX(-30px) scale(0.97)';
            heroImageEl.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroImageEl.style.transitionDelay = '0.4s';
            
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    heroImageEl.style.opacity = '1';
                    heroImageEl.style.transform = 'translateX(0) scale(1)';
                });
            });
        }

        // Animate image badge
        const badge = document.querySelector('.hero__image-badge');
        if (badge) {
            badge.style.opacity = '0';
            badge.style.transform = 'translateY(10px) scale(0.95)';
            badge.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            badge.style.transitionDelay = '1s';
            
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    badge.style.opacity = '1';
                    badge.style.transform = 'translateY(0) scale(1)';
                });
            });
        }
    }

    // ============================================
    // Services Dynamic Loading
    // ============================================
    function renderServices() {
        if (!servicesGrid || !servicesEmpty) return;

        if (services.length === 0) {
            servicesGrid.style.display = 'none';
            servicesEmpty.style.display = 'flex';
            return;
        }

        servicesEmpty.style.display = 'none';
        servicesGrid.style.display = 'grid';
        servicesGrid.innerHTML = '';

        services.forEach(function(service) {
            const card = document.createElement('div');
            card.className = 'service-card reveal';
            card.innerHTML = 
                '<div class="service-card__icon">' + (service.icon || '') + '</div>' +
                '<h3 class="service-card__title">' + service.title + '</h3>' +
                '<p class="service-card__desc">' + service.description + '</p>';
            servicesGrid.appendChild(card);
        });

        // Re-observe new elements for scroll reveal
        const revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: CONFIG.revealOffset,
            rootMargin: '0px 0px -50px 0px'
        });

        servicesGrid.querySelectorAll('.reveal').forEach(function(el) {
            revealObserver.observe(el);
        });
    }

    // Make services array accessible for external data loading
    window.DrAdeebServices = {
        services: services,
        addService: function(service) {
            services.push(service);
            renderServices();
        },
        setServices: function(newServices) {
            services.length = 0;
            newServices.forEach(function(s) { services.push(s); });
            renderServices();
        }
    };

    // ============================================
    // Initialize
    // ============================================
    function init() {
        handleNavbarScroll();
        animateHero();
        initScrollReveal();
        renderServices();
        updateActiveNavLink();
    }

    // Run init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
