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

    // Sticky navbar with hide/show on scroll
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.classList.add('hide');
        } else {
            // Scrolling up
            navbar.classList.remove('hide');
        }

        lastScrollTop = scrollTop;

        // Add shadow when scrolled
        navbar.classList.toggle('scrolled', scrollTop > 50);
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

    // Add active class to current page in navbar
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

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
        const lightboxCaption = document.getElementById('lightbox-caption');
        const allGalleryItems = document.querySelectorAll('.gallery-section .portfolio-item');
        let visibleItems = [];
        let currentIndex = 0;

        const showImage = () => {
            if (visibleItems.length > 0 && currentIndex >= 0 && currentIndex < visibleItems.length) {
                const item = visibleItems[currentIndex];
                const img = item.querySelector('img');
                const info = item.querySelector('.portfolio-info');
                
                lightbox.style.display = 'block';
                lightboxImg.src = img.src;
                lightboxCaption.innerHTML = info ? info.innerHTML : '';
            }
        };

        allGalleryItems.forEach(item => {
            const imageContainer = item.querySelector('.portfolio-image');
            if (imageContainer) {
                imageContainer.addEventListener('click', () => {
                    // Update visible items array on each click to respect filters
                    visibleItems = Array.from(allGalleryItems).filter(i => i.style.display !== 'none');
                    currentIndex = visibleItems.indexOf(item);
                    showImage();
                });
            }
        });

        const closeLightbox = () => {
            lightbox.style.display = 'none';
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
});