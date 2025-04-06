document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.custom-vertical-carousel');
  if (!carousel) return;

  const carouselInner = carousel.querySelector('.vertical-carousel-inner');
  const slides = carousel.querySelectorAll('.vertical-carousel-item');
  const totalSlides = slides.length;
  let currentSlide = 0;

  // Initialize slide positions
  function initSlides() {
    slides.forEach((slide, index) => {
      slide.style.transform = `translateY(${index * 100}%)`;
    });
  }

  // Go to specific slide
  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    slides.forEach((slide, i) => {
      slide.style.transform = `translateY(${(i - index) * 100}%)`;
      slide.classList.toggle('active', i === index);
    });

    currentSlide = index;
  }

  // Add arrow button click handlers
  const upArrow = carousel.querySelector('.carousel-arrow-up');
  const downArrow = carousel.querySelector('.carousel-arrow-down');

  upArrow.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
  });

  downArrow.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
  });

  // Initialize the carousel
  initSlides();
  goToSlide(0);
});