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
                    const shouldBeVisible = filterValue === 'all' || item.getAttribute('data-category') === filterValue;
                    const isVisible = item.style.display !== 'none';

                    if (shouldBeVisible && !isVisible) {
                        item.style.display = 'block';
                        // Add fade-in animation
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else if (!shouldBeVisible && isVisible) {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
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

            // Basic validation
            if (!data.name || !data.email || !data.tel || !data.service) {
                alert('Please fill in all required fields.');
                return;
            }

            // Show success message (in a real application, this would send to a server)
            alert('Thank you for your interest! We will contact you within 24 hours to schedule your consultation.');

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
                    preloader.style.display = 'flex';
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
                            setTimeout(() => {
                                preloader.style.display = 'none';
                            }, 600);
                        }, 800);
                    }, 300);
                } else {
                    // Fallback if preloader doesn't exist
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Gallery slideshow functionality
    const gallerySlideshows = document.querySelectorAll('.gallery-slideshow');

    gallerySlideshows.forEach((slideshow, index) => {
        const slides = slideshow.querySelectorAll('.gallery-slide');
        const intervalTime = 3000 + (index * 500); // Stagger the timing: 3s, 3.5s, 4s, etc.
        let currentSlide = 0;
        let intervalId = null;

        const nextSlide = () => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        };

        const startSlideshow = () => {
            // Clear any existing interval before starting a new one to prevent duplicates
            clearInterval(intervalId);
            intervalId = setInterval(nextSlide, intervalTime);
        };

        // Pause on hover
        slideshow.addEventListener('mouseenter', () => {
            clearInterval(intervalId);
        });

        // Resume on mouse leave
        slideshow.addEventListener('mouseleave', () => {
            // Resume after a short delay for a smoother user experience
            setTimeout(startSlideshow, 1000);
        });

        startSlideshow(); // Start the slideshow initially
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
});