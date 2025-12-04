document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. MOUSE GLOW EFFECT (LIGHT MODE)
    // ==========================================
    const glow = document.querySelector('.mouse-glow');
    if (glow) {
        document.addEventListener('mousemove', (e) => {
            glow.style.opacity = '1';
            const x = e.clientX;
            const y = e.clientY;
            glow.style.setProperty('--x', `${x}px`);
            glow.style.setProperty('--y', `${y}px`);
        });
    }

    // ==========================================
    // 2. MOBILE MENU & BURGER
    // ==========================================
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    
    if(burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('is-active');
            burger.classList.toggle('is-active');
        });
    }

    // ==========================================
    // 3. SMOOTH SCROLL FOR ANCHORS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Закрываем мобильное меню при клике
                if(nav.classList.contains('is-active')) {
                    nav.classList.remove('is-active');
                    burger.classList.remove('is-active');
                }

                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 4. GSAP ANIMATIONS (HERO SECTION)
    // ==========================================
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        // Анимация текста и кнопок
        tl.from(".hero__tag", { y: 20, opacity: 0, duration: 0.6, delay: 0.2 })
          .from(".hero__title", { y: 30, opacity: 0, duration: 0.8 }, "-=0.4")
          .from(".hero__desc", { y: 20, opacity: 0, duration: 0.6 }, "-=0.6")
          .from(".hero__actions", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
          .from(".hero__status", { opacity: 0, duration: 0.6 }, "-=0.4");

        // Анимация визуальных элементов справа
        tl.from(".hero__blob", { scale: 0, opacity: 0, duration: 1, stagger: 0.2 }, "-=1")
          .from(".hero__card--main", { x: 50, opacity: 0, rotation: 10, duration: 0.8 }, "-=0.8")
          .from(".hero__card--float", { y: 50, opacity: 0, duration: 0.8 }, "-=0.6");

        // Эффект параллакса при движении мыши в Hero секции
        const heroVisual = document.querySelector('.hero__visual');
        if (heroVisual) {
            heroVisual.addEventListener('mousemove', (e) => {
                const x = (e.clientX - window.innerWidth / 2) * 0.02;
                const y = (e.clientY - window.innerHeight / 2) * 0.02;

                gsap.to(".hero__card--main", { x: x, y: y, duration: 1 });
                gsap.to(".hero__card--float", { x: -x * 1.5, y: -y * 1.5, duration: 1 });
            });
        }
    }

    // ==========================================
    // 5. CONTACT FORM & VALIDATION
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const phoneInput = document.getElementById('phone');
    const formSuccess = document.getElementById('formSuccess');

    // 5.1 Math Captcha Logic
    const captchaInput = document.getElementById('captcha');
    const captchaLabel = document.getElementById('captchaLabel');
    let num1 = 0, num2 = 0;

    if (captchaLabel) {
        num1 = Math.floor(Math.random() * 10);
        num2 = Math.floor(Math.random() * 10);
        captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;
    }

    // 5.2 Strict Phone Validation (ТОЛЬКО ЦИФРЫ)
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            // Регулярное выражение заменяет всё, что НЕ цифры (\D), на пустоту
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // 5.3 Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            // Сброс красных рамок
            document.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));

            // Валидация Имени
            const name = document.getElementById('name');
            if (!name.value.trim()) {
                name.classList.add('error');
                isValid = false;
            }

            // Валидация Email
            const email = document.getElementById('email');
            if (!email.value.includes('@') || !email.value.includes('.')) {
                email.classList.add('error');
                isValid = false;
            }

            // Валидация Телефона (минимум 8 цифр)
            if (!phoneInput.value || phoneInput.value.length < 8) {
                phoneInput.classList.add('error');
                isValid = false;
            }

            // Валидация Капчи
            if (parseInt(captchaInput.value) !== (num1 + num2)) {
                captchaInput.classList.add('error');
                isValid = false;
            }

            // Валидация Чекбокса
            const consent = document.getElementById('consent');
            if (!consent.checked) {
                isValid = false;
                alert("Пожалуйста, примите условия обработки данных.");
            }

            // Успешная отправка
            if (isValid) {
                const btn = contactForm.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                
                // Имитация загрузки
                btn.innerHTML = 'Отправка...';
                btn.disabled = true;

                setTimeout(() => {
                    contactForm.reset();
                    // Генерируем новый пример капчи
                    num1 = Math.floor(Math.random() * 10);
                    num2 = Math.floor(Math.random() * 10);
                    captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;

                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    
                    // Показ сообщения об успехе
                    formSuccess.style.display = 'flex';
                    setTimeout(() => {
                        formSuccess.style.display = 'none';
                    }, 5000);
                }, 1500);
            }
        });
    }

    // ==========================================
    // 6. COOKIE POPUP
    // ==========================================
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptBtn = document.getElementById('acceptCookies');

    // Проверка LocalStorage
    if (cookiePopup && !localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookiePopup.style.display = 'block';
            if (typeof gsap !== 'undefined') {
                gsap.from(cookiePopup, { y: 50, opacity: 0, duration: 0.5 });
            }
        }, 2000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            if (typeof gsap !== 'undefined') {
                gsap.to(cookiePopup, { y: 20, opacity: 0, duration: 0.3, onComplete: () => {
                    cookiePopup.style.display = 'none';
                }});
            } else {
                cookiePopup.style.display = 'none';
            }
        });
    }

    // ==========================================
    // 7. ICONS INIT
    // ==========================================
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});