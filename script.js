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
    let lastScrollY = window.scrollY; // متغير جديد لتتبع اتجاه التمرير

    function handleNavbarScroll() {
        const currentScrollY = window.scrollY;

        // إخفاء أو إظهار الشريط بناءً على اتجاه التمرير
        if (currentScrollY > lastScrollY && currentScrollY > CONFIG.scrollThreshold) {
            // إذا نزل المستخدم للأسفل: أخفِ الشريط (اسحبه للأعلى)
            if (navbar) navbar.style.top = "-120px"; // يمكنك زيادة الرقم إذا كان الشريط الخاص بك أطول
        } else {
            // إذا صعد المستخدم للأعلى: أظهر الشريط
            if (navbar) navbar.style.top = "0";
        }

        // الكود الأصلي الخاص بك (لإضافة لون خلفية أو ظل عند النزول)
        if (currentScrollY > CONFIG.scrollThreshold) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }

        // تحديث موضع التمرير للمرة القادمة
        lastScrollY = currentScrollY;
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
    // Booking System
    // ============================================
    const CONFIG = {
        // ضع روابط الـ Webhook من n8n هنا
        WEBHOOK_GET_SLOTS: '', // مثال: 'https://n8n.example.com/webhook/get-slots'
        WEBHOOK_BOOK_SLOT: ''  // مثال: 'https://n8n.example.com/webhook/book-slot'
    };

    const bookingState = {
        name: '',
        phone: '',
        date: null,
        time: null,
        currentDate: new Date()
    };

    const DOM = {
        modal: document.getElementById('booking-modal'),
        closeBtn: document.querySelector('.booking-modal__close'),
        triggers: document.querySelectorAll('[data-booking-trigger="true"]'),
        
        steps: document.querySelectorAll('.booking-step'),
        
        // Step 1
        inputName: document.getElementById('patient-name'),
        inputPhone: document.getElementById('patient-phone'),
        btnNextToDate: document.getElementById('btn-next-to-date'),
        
        // Step 2
        btnBackToData: document.getElementById('btn-back-to-data'),
        btnNextToTime: document.getElementById('btn-next-to-time'),
        calendarTitle: document.getElementById('calendar-title'),
        calendarGrid: document.getElementById('calendar-grid'),
        prevMonthBtn: document.getElementById('prev-month'),
        nextMonthBtn: document.getElementById('next-month'),
        
        // Step 3
        btnBackToDate: document.getElementById('btn-back-to-date'),
        btnConfirm: document.getElementById('btn-confirm-booking'),
        selectedDateDisplay: document.getElementById('selected-date-display'),
        timeSlotsGrid: document.getElementById('time-slots-grid'),
        slotsLoading: document.getElementById('slots-loading'),
        
        // Step 4 & Error
        btnCloseSuccess: document.getElementById('btn-close-success'),
        btnRetry: document.getElementById('btn-retry'),
        successName: document.getElementById('success-name'),
        successDate: document.getElementById('success-date'),
        successTime: document.getElementById('success-time'),
        errorMessageText: document.getElementById('error-message-text')
    };

    function initBooking() {
        if (!DOM.modal) return;
        
        DOM.triggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        });
        
        DOM.closeBtn.addEventListener('click', closeModal);
        DOM.modal.addEventListener('click', (e) => {
            if (e.target === DOM.modal) closeModal();
        });
        
        DOM.btnNextToDate.addEventListener('click', () => {
            if (validateData()) {
                showStep('step-date');
                renderCalendar();
            }
        });
        
        DOM.btnBackToData.addEventListener('click', () => {
            showStep('step-data');
        });
        
        DOM.btnNextToTime.addEventListener('click', () => {
            if (bookingState.date) {
                showStep('step-time');
                DOM.selectedDateDisplay.textContent = formatDateArabic(new Date(bookingState.date));
                fetchAndRenderSlots();
            }
        });
        
        DOM.btnBackToDate.addEventListener('click', () => {
            bookingState.time = null;
            DOM.btnConfirm.disabled = true;
            showStep('step-date');
        });
        
        DOM.btnConfirm.addEventListener('click', submitBooking);
        
        DOM.btnCloseSuccess.addEventListener('click', closeModal);
        DOM.btnRetry.addEventListener('click', () => {
            bookingState.time = null;
            DOM.btnConfirm.disabled = true;
            DOM.btnConfirm.textContent = 'تأكيد الحجز';
            showStep('step-time');
            fetchAndRenderSlots();
        });
        
        DOM.prevMonthBtn.addEventListener('click', () => {
            bookingState.currentDate.setMonth(bookingState.currentDate.getMonth() - 1);
            renderCalendar();
        });
        
        DOM.nextMonthBtn.addEventListener('click', () => {
            bookingState.currentDate.setMonth(bookingState.currentDate.getMonth() + 1);
            renderCalendar();
        });
    }

    function openModal() {
        DOM.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (!DOM.steps[0].classList.contains('active')) {
            showStep('step-data');
        }
    }

    function closeModal() {
        DOM.modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            resetBookingState();
            showStep('step-data');
        }, 300);
    }

    function showStep(stepId) {
        DOM.steps.forEach(step => step.classList.remove('active'));
        document.getElementById(stepId).classList.add('active');
    }

    function resetBookingState() {
        bookingState.name = '';
        bookingState.phone = '';
        bookingState.date = null;
        bookingState.time = null;
        bookingState.currentDate = new Date();
        
        DOM.inputName.value = '';
        DOM.inputPhone.value = '';
        DOM.inputName.classList.remove('invalid');
        DOM.inputPhone.classList.remove('invalid');
        
        DOM.btnNextToTime.disabled = true;
        DOM.btnConfirm.disabled = true;
        DOM.btnConfirm.textContent = 'تأكيد الحجز';
    }

    function validateData() {
        let isValid = true;
        
        const name = DOM.inputName.value.trim();
        if (name.length < 3) {
            DOM.inputName.classList.add('invalid');
            isValid = false;
        } else {
            DOM.inputName.classList.remove('invalid');
            bookingState.name = name;
        }
        
        const phone = DOM.inputPhone.value.trim();
        const phoneRegex = /^05\d{8}$/;
        if (!phoneRegex.test(phone)) {
            DOM.inputPhone.classList.add('invalid');
            isValid = false;
        } else {
            DOM.inputPhone.classList.remove('invalid');
            bookingState.phone = phone;
        }
        
        return isValid;
    }

    function renderCalendar() {
        const year = bookingState.currentDate.getFullYear();
        const month = bookingState.currentDate.getMonth();
        
        const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
        DOM.calendarTitle.textContent = `${monthNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        let startingDay = firstDay.getDay(); 
        const totalDays = lastDay.getDate();
        
        let html = '';
        for (let i = 0; i < startingDay; i++) {
            html += `<div class="calendar-day empty"></div>`;
        }
        
        const today = new Date();
        today.setHours(0,0,0,0);
        
        for (let i = 1; i <= totalDays; i++) {
            const cellDate = new Date(year, month, i);
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            
            let classes = ['calendar-day'];
            let isDisabled = false;
            
            if (cellDate < today) {
                classes.push('disabled');
                isDisabled = true;
            }
            
            if (bookingState.date === dateString) {
                classes.push('selected');
            }
            
            if (isDisabled) {
                html += `<div class="${classes.join(' ')}">${i}</div>`;
            } else {
                html += `<div class="${classes.join(' ')}" data-date="${dateString}">${i}</div>`;
            }
        }
        
        DOM.calendarGrid.innerHTML = html;
        
        document.querySelectorAll('.calendar-day[data-date]').forEach(day => {
            day.addEventListener('click', function() {
                document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
                this.classList.add('selected');
                bookingState.date = this.dataset.date;
                DOM.btnNextToTime.disabled = false;
            });
        });
        
        const prevMonthDate = new Date(year, month - 1, 1);
        const currentMonthFirst = new Date(today.getFullYear(), today.getMonth(), 1);
        
        if (prevMonthDate < currentMonthFirst) {
            DOM.prevMonthBtn.style.opacity = '0.3';
            DOM.prevMonthBtn.style.pointerEvents = 'none';
        } else {
            DOM.prevMonthBtn.style.opacity = '1';
            DOM.prevMonthBtn.style.pointerEvents = 'auto';
        }
    }

    function formatDateArabic(date) {
        const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
        const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
        return `${days[date.getDay()]}، ${date.getDate()} ${months[date.getMonth()]}`;
    }

    const ALL_SLOTS = [
        "09:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
        "12:00 - 13:00",
        "13:00 - 14:00",
        "14:00 - 15:00",
        "15:00 - 16:00",
        "16:00 - 17:00",
        "17:00 - 18:00"
    ];

    async function fetchAndRenderSlots() {
        DOM.timeSlotsGrid.innerHTML = '';
        DOM.slotsLoading.style.display = 'flex';
        bookingState.time = null;
        DOM.btnConfirm.disabled = true;
        
        let bookedSlots = [];
        
        if (CONFIG.WEBHOOK_GET_SLOTS) {
            try {
                const response = await fetch(CONFIG.WEBHOOK_GET_SLOTS, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ date: bookingState.date })
                });
                const data = await response.json();
                // Expecting n8n to return something like { bookedSlots: ["09:00 - 10:00", ...] }
                bookedSlots = data.bookedSlots || [];
            } catch (error) {
                console.error("Failed to fetch slots:", error);
            }
        } else {
            // محاكاة (Mock Data) في حال عدم إدخال الروابط
            await new Promise(resolve => setTimeout(resolve, 800));
            const randIdx = Math.floor(Math.random() * 5);
            bookedSlots = [ALL_SLOTS[randIdx], ALL_SLOTS[randIdx + 2]];
        }
        
        DOM.slotsLoading.style.display = 'none';
        
        let html = '';
        ALL_SLOTS.forEach(slot => {
            const isBooked = bookedSlots.includes(slot);
            const timeFormatted = formatTimeDisplay(slot);
            
            if (isBooked) {
                html += `<div class="time-slot slot--booked">${timeFormatted}</div>`;
            } else {
                html += `<div class="time-slot slot--available" data-time="${slot}">${timeFormatted}</div>`;
            }
        });
        
        DOM.timeSlotsGrid.innerHTML = html;
        
        document.querySelectorAll('.time-slot.slot--available').forEach(slot => {
            slot.addEventListener('click', function() {
                document.querySelectorAll('.time-slot.slot--selected').forEach(el => el.classList.remove('slot--selected'));
                this.classList.add('slot--selected');
                bookingState.time = this.dataset.time;
                DOM.btnConfirm.disabled = false;
            });
        });
    }

    function formatTimeDisplay(slot) {
        const parts = slot.split(' - ');
        return `${format12Hour(parts[0])} – ${format12Hour(parts[1])}`;
    }

    function format12Hour(time24) {
        let [h, m] = time24.split(':');
        h = parseInt(h);
        h = h % 12 || 12;
        return `${h}:${m}`;
    }

    async function submitBooking() {
        DOM.btnConfirm.disabled = true;
        DOM.btnConfirm.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>';
        
        const payload = {
            patientName: bookingState.name,
            phone: bookingState.phone,
            appointmentDate: bookingState.date,
            appointmentTime: bookingState.time
        };
        
        if (CONFIG.WEBHOOK_BOOK_SLOT) {
            try {
                const response = await fetch(CONFIG.WEBHOOK_BOOK_SLOT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                
                // Expecting n8n to return { success: true/false, message: "..." }
                if (data.success) {
                    showSuccess();
                } else {
                    showError(data.message || "عذراً، هذا الموعد تم حجزه للتو. يرجى اختيار موعد آخر.");
                }
            } catch (error) {
                console.error("Booking failed:", error);
                showError("حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.");
            }
        } else {
            // محاكاة الإرسال
            await new Promise(resolve => setTimeout(resolve, 1500));
            if (Math.random() < 0.15) { // 15% chance of conflict
                showError("عذراً، هذا الموعد تم حجزه للتو. يرجى اختيار موعد آخر.");
            } else {
                showSuccess();
            }
        }
    }

    function showSuccess() {
        DOM.successName.textContent = bookingState.name;
        DOM.successDate.textContent = formatDateArabic(new Date(bookingState.date));
        DOM.successTime.textContent = formatTimeDisplay(bookingState.time);
        showStep('step-success');
    }

    function showError(msg) {
        DOM.errorMessageText.textContent = msg;
        showStep('step-error');
    }

    // ============================================
    // Initialize
    // ============================================
    function init() {
        handleNavbarScroll();
        animateHero();
        initScrollReveal();
        renderServices();
        updateActiveNavLink();
        initBooking();
    }

    // Run init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
