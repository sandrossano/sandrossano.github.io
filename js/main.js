(function() {
	"use strict";

	// Preloader
	window.addEventListener('load', function() {
		const loader = document.getElementById('loader');
		const preloader = document.getElementById('preloader');
		
		if (loader && preloader) {
			loader.style.opacity = '0';
			setTimeout(() => {
				preloader.style.opacity = '0';
				setTimeout(() => {
					preloader.style.display = 'none';
				}, 300);
			}, 500);
		}
	});

	// Smooth scroll
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function(e) {
			const href = this.getAttribute('href');
			if (href === '#') return;
			
			e.preventDefault();
			const target = document.querySelector(href);
			if (target) {
				target.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});
			}
		});
	});

	// Stats counter animation
	const statsSection = document.getElementById('stats');
	if (statsSection) {
		const stats = statsSection.querySelectorAll('.stat-count');
		let animated = false;

		const animateStats = () => {
			if (animated) return;
			
			const rect = statsSection.getBoundingClientRect();
			const isVisible = rect.top <= window.innerHeight * 0.9;

			if (isVisible) {
				animated = true;
				stats.forEach(stat => {
					const target = parseInt(stat.textContent);
					const duration = 2000;
					const start = 0;
					const increment = target / (duration / 16);
					let current = 0;

					const timer = setInterval(() => {
						current += increment;
						if (current >= target) {
							stat.textContent = target;
							clearInterval(timer);
						} else {
							stat.textContent = Math.ceil(current);
						}
					}, 16);
				});
			}
		};

		window.addEventListener('scroll', animateStats);
		animateStats();
	}

	// Back to top button
	const goTop = document.getElementById('go-top');
	if (goTop) {
		window.addEventListener('scroll', () => {
			if (window.scrollY > 500) {
				goTop.style.opacity = '1';
				goTop.style.pointerEvents = 'auto';
			} else {
				goTop.style.opacity = '0';
				goTop.style.pointerEvents = 'none';
			}
		});
	}

	// Simple carousel for services
	const owlSlider = document.getElementById('owl-slider');
	if (owlSlider) {
		const items = owlSlider.querySelectorAll('.service');
		let currentIndex = 0;

		// Show only first 3 items on desktop, 1 on mobile
		function updateCarousel() {
			const isMobile = window.innerWidth < 768;
			const visibleItems = isMobile ? 1 : 3;
			
			items.forEach((item, index) => {
				if (index >= currentIndex && index < currentIndex + visibleItems) {
					item.style.display = 'block';
				} else {
					item.style.display = 'none';
				}
			});
		}

		// Auto-rotate every 5 seconds
		setInterval(() => {
			const isMobile = window.innerWidth < 768;
			const visibleItems = isMobile ? 1 : 3;
			currentIndex = (currentIndex + 1) % (items.length - visibleItems + 1);
			updateCarousel();
		}, 5000);

		updateCarousel();
		window.addEventListener('resize', updateCarousel);
	}

	// Passions Carousel with Dots and Drag
	const passionsCarousel = document.getElementById('passions-carousel');
	if (passionsCarousel) {
		const items = passionsCarousel.querySelectorAll('.service');
		const dotsContainer = document.querySelector('.carousel-dots');
		
		// Determine items per view based on screen size
		const getItemsPerView = () => {
			const width = window.innerWidth;
			if (width <= 768) return 1;
			if (width <= 1024) return 2;
			return 3;
		};
		
		let itemsPerView = getItemsPerView();
		let totalPages = Math.ceil(items.length / itemsPerView);
		
		// Update on resize
		window.addEventListener('resize', () => {
			const newItemsPerView = getItemsPerView();
			if (newItemsPerView !== itemsPerView) {
				itemsPerView = newItemsPerView;
				totalPages = Math.ceil(items.length / itemsPerView);
				updateDots();
			}
		});
		
		// Enable mouse drag scrolling
		let isDown = false;
		let startX;
		let scrollLeft;

		passionsCarousel.addEventListener('mousedown', (e) => {
			isDown = true;
			startX = e.pageX - passionsCarousel.offsetLeft;
			scrollLeft = passionsCarousel.scrollLeft;
		});

		passionsCarousel.addEventListener('mouseleave', () => {
			isDown = false;
		});

		passionsCarousel.addEventListener('mouseup', () => {
			isDown = false;
		});

		passionsCarousel.addEventListener('mousemove', (e) => {
			if (!isDown) return;
			e.preventDefault();
			const x = e.pageX - passionsCarousel.offsetLeft;
			const walk = (x - startX) * 2;
			passionsCarousel.scrollLeft = scrollLeft - walk;
		});
		
	// Create dots
	const updateDots = () => {
		dotsContainer.innerHTML = '';
		totalPages = Math.ceil(items.length / itemsPerView);
		
		for (let i = 0; i < totalPages; i++) {
			const dot = document.createElement('button');
			dot.classList.add('carousel-dot');
			dot.setAttribute('aria-label', `Vai alla pagina ${i + 1} di ${totalPages}`);
			dot.setAttribute('type', 'button');
			if (i === 0) {
				dot.classList.add('active');
				dot.setAttribute('aria-current', 'true');
			}
			dot.addEventListener('click', () => {
				const scrollPosition = (passionsCarousel.scrollWidth / totalPages) * i;
				passionsCarousel.scrollTo({ left: scrollPosition, behavior: 'smooth' });
			});
			dotsContainer.appendChild(dot);
		}
	};
	
	updateDots();

	const getDots = () => dotsContainer.querySelectorAll('.carousel-dot');

	// Update active dot on scroll
	let scrollTimeout;
	passionsCarousel.addEventListener('scroll', () => {
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			const scrollLeft = passionsCarousel.scrollLeft;
			const scrollWidth = passionsCarousel.scrollWidth;
			const clientWidth = passionsCarousel.clientWidth;
			const maxScroll = scrollWidth - clientWidth;
			
			// Calculate which page we're on
			const scrollPerPage = maxScroll / (totalPages - 1 || 1);
			const currentPage = Math.round(scrollLeft / scrollPerPage);

			getDots().forEach((dot, index) => {
				const isActive = index === currentPage;
				dot.classList.toggle('active', isActive);
				if (isActive) {
					dot.setAttribute('aria-current', 'true');
				} else {
					dot.removeAttribute('aria-current');
				}
			});
		}, 100);
	});
}

})();
