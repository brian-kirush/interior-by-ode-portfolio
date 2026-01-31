// Preloader
document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.getElementById('preloader');

    // Failsafe: Ensure preloader is hidden after 3 seconds in case of logic errors
    if (preloader) {
        setTimeout(() => {
            if (!preloader.classList.contains('hide')) {
                preloader.classList.add('hide');
                document.body.style.overflow = 'auto';
            }
        }, 3000);
    }

    // Show preloader on all pages
    if (preloader) {
        // Disable scroll while preloader is active
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            preloader.classList.add('hide');
            document.body.style.overflow = 'auto';
            // Add class to trigger content fade-in animation
            document.body.classList.add('content-loaded');
        }, 500);
    } else {
        // If there's no preloader, just show the content immediately
        document.body.classList.add('content-loaded');
    }

    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navbarMenu = document.getElementById('navbarMenu');

    if (mobileToggle && navbarMenu) {
        mobileToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            mobileToggle.innerHTML = navbarMenu.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });
    }

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.navbar-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbarMenu.classList.remove('active');
            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // Optimized Scroll Handling (Navbar & Back to Top)
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    const backToTopButton = document.querySelector('.back-to-top');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                // Navbar Logic
                if (navbar) {
                    if (scrollTop > lastScrollTop && scrollTop > 100) {
                        navbar.classList.add('hide');
                    } else {
                        navbar.classList.remove('hide');
                    }
                    navbar.classList.toggle('scrolled', scrollTop > 50);
                }

                // Back to Top Logic
                if (backToTopButton) {
                    if (scrollTop > 300) {
                        backToTopButton.classList.add('visible');
                    } else {
                        backToTopButton.classList.remove('visible');
                    }
                }

                lastScrollTop = scrollTop;
                ticking = false;
            });
            ticking = true;
        }
    });

    // Counter-up animation for stats
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const counters = document.querySelectorAll('.stat-number');
        
        const animate = (counter) => {
            const target = +counter.getAttribute('data-target');
            const suffix = counter.innerText.replace(/[0-9]/g, ''); // Get suffix like '+' or '%'
            counter.innerText = '0' + suffix; // Start from 0

            const updateCount = () => {
                const count = +counter.innerText.replace(suffix, '');
                const increment = target / 100; // Animation speed

                if (count < target) {
                    counter.innerText = Math.ceil(count + increment) + suffix;
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target + suffix;
                }
            };
            updateCount();
        };

        const observer = new IntersectionObserver((entries, observer) => {
            if (entries[0].isIntersecting) {
                counters.forEach(animate);
                observer.disconnect(); // Animate only once
            }
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // Portfolio filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length > 0 && portfolioItems.length > 0) {
        portfolioItems.forEach(item => {
            item.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
        });

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    const shouldBeVisible = filterValue === 'all' || category === filterValue;

                    if (shouldBeVisible) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            if (item.style.opacity === '0') {
                                item.style.display = 'none';
                            }
                        }, 400);
                    }
                });
            });
        });

        // Set default active button (All)
        const allButton = document.querySelector('.filter-btn[data-filter="all"]');
        if (allButton) {
            allButton.classList.add('active');
        }
    }

    // Handle consultation form submission
    const bookingForm = document.querySelector('.booking-form, .consultation-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Construct WhatsApp message
            const firstName = data.firstName || data.name || '';
            const lastName = data.lastName || '';
            const fullName = lastName ? `${firstName} ${lastName}` : firstName;
            const email = data.email || '';
            const phone = data.phone || data.tel || '';
            const projectType = data.projectType || data.service || '';
            const budget = data.budget || '';
            const timeline = data.timeline || '';
            const message = data.message || '';

            let whatsappMsg = `*New Consultation Request*\n\n`;
            whatsappMsg += `*Name:* ${fullName}\n`;
            whatsappMsg += `*Email:* ${email}\n`;
            whatsappMsg += `*Phone:* ${phone}\n`;
            whatsappMsg += `*Project Type:* ${projectType}\n`;
            if (budget) whatsappMsg += `*Budget:* ${budget}\n`;
            if (timeline) whatsappMsg += `*Timeline:* ${timeline}\n`;
            whatsappMsg += `*Message:* ${message}`;

            // Redirect to WhatsApp
            const phoneNumber = "254714084308";
            window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMsg)}`, '_blank');

            // Reset form
            this.reset();
        });
    }

    // Smooth scroll for anchor links with loading effect
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Show loading effect
                const preloader = document.getElementById('preloader');
                if (preloader) {
                    preloader.classList.remove('hide');
                    document.body.style.overflow = 'hidden';

                    // Scroll to target after a short delay to show loading effect
                    setTimeout(() => {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });

                        // Hide loading effect after scroll completes
                        setTimeout(() => {
                            preloader.classList.add('hide');
                            document.body.style.overflow = 'auto';
                        }, 800);
                    }, 300);
                } else {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Active nav link highlighting and theme switching on scroll
    const sectionsWithId = document.querySelectorAll('section[id]');

    // This logic is for the single-page scroll effect on index.html
    if (sectionsWithId.length > 0 && document.querySelector('.navbar-menu a[href^="#"]')) {
        const observerOptions = {
            rootMargin: '-80px 0px -40% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const navLink = document.querySelector(`.navbar-menu a[href="#${id}"]`);

                    // Update active nav link
                    document.querySelectorAll('.navbar-menu a').forEach(link => link.classList.remove('active'));
                    if (navLink) {
                        navLink.classList.add('active');
                    }

                    // Update navbar theme based on section's data-nav-theme attribute
                    const navTheme = entry.target.getAttribute('data-nav-theme');
                    navbar.classList.remove('nav-theme-light', 'nav-theme-dark'); // Reset themes
                    if (navTheme && navTheme !== 'nav-theme-default') {
                        navbar.classList.add(navTheme);
                    }
                }
            });
        }, observerOptions);

        sectionsWithId.forEach(section => observer.observe(section));
    } else {
        // Fallback for other pages to set active link based on URL
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                // The active class is already set in the HTML, but this is a good fallback
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Back to top button click handler
    if (backToTopButton) {
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Testimonial Slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        const slides = document.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');
        let currentSlide = 0;

        const showSlide = (n) => {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[n].classList.add('active');
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        };

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', prevSlide);
            nextBtn.addEventListener('click', nextSlide);
        }

        // Auto-play
        if (slides.length > 1) {
            setInterval(nextSlide, 7000); // Change slide every 7 seconds
        }
    }

    // Lightbox for Gallery
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxVideo = document.getElementById('lightboxVideo');
        const lightboxCaption = document.getElementById('lightbox-caption');
        let visibleItems = [];
        let currentIndex = 0;

        const showImage = () => {
            if (visibleItems.length > 0 && currentIndex >= 0 && currentIndex < visibleItems.length) {
                const item = visibleItems[currentIndex];
                const img = item.querySelector('img');
                const video = item.querySelector('video');
                const info = item.querySelector('.portfolio-info');
                
                lightbox.style.display = 'flex';
                
                if (video && lightboxVideo) {
                    if (lightboxImg) lightboxImg.style.display = 'none';
                    lightboxVideo.style.display = 'block';
                    lightboxVideo.src = video.src;
                    lightboxVideo.play();
                } else if (img && lightboxImg) {
                    if (lightboxVideo) {
                        lightboxVideo.style.display = 'none';
                        lightboxVideo.pause();
                    }
                    lightboxImg.style.display = 'block';
                    lightboxImg.src = img.src;
                }
                
                lightboxCaption.innerHTML = info ? info.innerHTML : '';
            }
        };

        // Event Delegation for Gallery Items
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (portfolioGrid) {
            portfolioGrid.addEventListener('click', (e) => {
                const imageContainer = e.target.closest('.portfolio-image');
                if (imageContainer) {
                    const item = imageContainer.closest('.portfolio-item');
                    if (item) {
                        const allGalleryItems = document.querySelectorAll('.portfolio-item');
                        visibleItems = Array.from(allGalleryItems).filter(i => i.style.display !== 'none');
                        currentIndex = visibleItems.indexOf(item);
                        if (currentIndex !== -1) showImage();
                    }
                }
            });
        }

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            if (lightboxVideo) {
                lightboxVideo.pause();
                lightboxVideo.src = "";
            }
        };

        const nextImage = () => {
            if (visibleItems.length > 0) {
                currentIndex = (currentIndex + 1) % visibleItems.length;
                showImage();
            }
        };

        const prevImage = () => {
            if (visibleItems.length > 0) {
                currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
                showImage();
            }
        };

        document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        document.querySelector('.lightbox-next').addEventListener('click', nextImage);
        document.querySelector('.lightbox-prev').addEventListener('click', prevImage);

        // Close on escape key or click outside image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'block') {
                closeLightbox();
            }
        });
    }

    // Subtle scroll-triggered animations
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });
    }

    // Before & After Image Slider
    function initBeforeAfterSlider(slider) {
        const handle = slider.querySelector('.slider-handle');
        const afterImage = slider.querySelector('.after-image');

        const moveSlider = (x) => {
            const sliderRect = slider.getBoundingClientRect();
            let newX = x - sliderRect.left;

            // Constrain the handle within the slider
            if (newX < 0) newX = 0;
            if (newX > sliderRect.width) newX = sliderRect.width;

            const percentage = (newX / sliderRect.width) * 100;
            handle.style.left = `${percentage}%`;
            afterImage.style.clipPath = `inset(0 0 0 ${percentage}%)`;
        };

        // Optimized event handling: attach window listeners only during drag
        const onMouseMove = (e) => moveSlider(e.clientX);
        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        const onTouchMove = (e) => {
            if (e.touches.length > 0) moveSlider(e.touches[0].clientX);
        };
        const onTouchEnd = () => {
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        };

        // Mouse events
        handle.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevent text selection
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        });

        // Touch events
        handle.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent scrolling
            window.addEventListener('touchmove', onTouchMove);
            window.addEventListener('touchend', onTouchEnd);
        });
    }

    document.querySelectorAll('.before-after-slider').forEach(slider => {
        if (slider) {
            initBeforeAfterSlider(slider);
        }
    });

    // Optimize Video Autoplay for Mobile (Play only when in viewport)
    const portfolioVideos = document.querySelectorAll('.portfolio-grid video');
    if (portfolioVideos.length > 0) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Play video when visible
                    const playPromise = entry.target.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(() => {}); // Handle autoplay restrictions
                    }
                } else {
                    // Pause video when not visible
                    entry.target.pause();
                }
            });
        }, { threshold: 0.25 });

        portfolioVideos.forEach(video => videoObserver.observe(video));
    }
});