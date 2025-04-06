document.addEventListener('DOMContentLoaded', () => {
  // ===============================================
  // Theme Toggle Section
  // Controls the theme settings panel toggle button and dropdown
  // Located in the fixed settings button on the page
  // ===============================================
  const themeBtn = document.getElementById('themeBtn');
  const themeDropdown = document.getElementById('themeDropdown');

  if (themeBtn && themeDropdown) {
    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!themeDropdown.contains(e.target) && !themeBtn.contains(e.target)) {
        themeDropdown.classList.remove('show');
      }
    });

    const themeCloseBtn = document.querySelector('#themeDropdown .btn-outline-secondary');
    if (themeCloseBtn) {
      themeCloseBtn.addEventListener('click', () => {
        themeDropdown.classList.remove('show');
      });
    }
  }

  // ===============================================
  // Mobile Menu Toggle Section
  // Controls the responsive navigation menu for mobile devices
  // Located in the header section when viewport width is small
  // ===============================================
  const toggleBtn = document.getElementById('menuToggle');
  const menu = document.getElementById('mainMenu');

  if (toggleBtn && menu) {
    toggleBtn.addEventListener('click', () => {
      menu.classList.toggle('active');
    });

    const closeBtn = document.getElementById('closeMenuBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        menu.classList.remove('active');
      });
    }

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggleBtn.contains(e.target)) {
        menu.classList.remove('active');
      }
    });
  }

  // ===============================================
  // Theme Color Customization Section
  // Manages the color palette selection in theme settings
  // Persists selected color using localStorage
  // ===============================================
  const colorCircles = document.querySelectorAll('.color-circle');

  function updateSelectedColor(element) {
    colorCircles.forEach(c => c.classList.remove('selected'));
    element.classList.add('selected');

    const selectedColor = getComputedStyle(document.documentElement)
      .getPropertyValue(element.dataset.color);
    document.documentElement.style.setProperty('--main-color', selectedColor);

    localStorage.setItem('selectedColorKey', element.dataset.color);
  }

  // Apply saved color on load
  const savedColorKey = localStorage.getItem('selectedColorKey');
  if (savedColorKey) {
    const savedColorElement = [...colorCircles].find(c => c.dataset.color === savedColorKey);
    if (savedColorElement) updateSelectedColor(savedColorElement);
  } else {
    const defaultColor = document.querySelector('.color-circle.bg-pink');
    if (defaultColor) updateSelectedColor(defaultColor);
  }

  colorCircles.forEach(circle => {
    circle.addEventListener('click', () => updateSelectedColor(circle));
  });

  // ===============================================
  // Light/Dark Theme Toggle Section
  // Manages the light/dark mode theme switching
  // Persists theme preference using localStorage
  // ===============================================
  const lightOption = document.getElementById('lightOption');
  const darkOption = document.getElementById('darkOption');

  if (lightOption && darkOption) {
    function activateLightTheme() {
      document.documentElement.classList.remove('dark-theme');
      lightOption.classList.add('selected');
      darkOption.classList.remove('selected');
      localStorage.setItem('theme', 'light');
    }

    function activateDarkTheme() {
      document.documentElement.classList.add('dark-theme');
      darkOption.classList.add('selected');
      lightOption.classList.remove('selected');
      localStorage.setItem('theme', 'dark');
    }

    lightOption.addEventListener('click', activateLightTheme);
    darkOption.addEventListener('click', activateDarkTheme);

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      activateDarkTheme();
    } else {
      activateLightTheme();
    }
  }

  // ===============================================
  // News View Toggle Section
  // Controls grid/list view switching for news items
  // Includes responsive behavior for mobile devices
  // ===============================================
  const gridBtn = document.getElementById('gridViewBtn');
  const listBtn = document.getElementById('listViewBtn');
  const newsWrapper = document.querySelector('.news-wrapper');

  if (gridBtn && listBtn && newsWrapper) {
    gridBtn.addEventListener('click', () => {
      newsWrapper.classList.remove('view-list');
      newsWrapper.classList.add('view-grid');
      gridBtn.classList.add('selected');
      listBtn.classList.remove('selected');
    });

    listBtn.addEventListener('click', () => {
      newsWrapper.classList.remove('view-grid');
      newsWrapper.classList.add('view-list');
      listBtn.classList.add('selected');
      gridBtn.classList.remove('selected');
    });

    // Handle responsive view
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 576) {
        newsWrapper.classList.remove('view-list');
        newsWrapper.classList.add('view-grid');
        gridBtn.classList.add('selected');
        listBtn.classList.remove('selected');
      }
    });
  }

  // ===============================================
  // Calendar Week Navigation Section
  // Manages the weekly calendar view and navigation
  // Highlights current day and displays month/year
  // ===============================================
  const weekContainer = document.getElementById('weekDaysContainer');
  const monthLabel = document.getElementById('calendarMonthLabel');
  const prevBtn = document.getElementById('prevWeekBtn');
  const nextBtn = document.getElementById('nextWeekBtn');

  if (weekContainer && monthLabel && prevBtn && nextBtn) {
    let currentDate = new Date();

    function getStartOfWeek(date) {
      const day = date.getDay();
      return new Date(date.setDate(date.getDate() - day));
    }

    function renderWeek(date) {
      const start = getStartOfWeek(new Date(date));
      const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      weekContainer.innerHTML = '';

      monthLabel.textContent = start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      for (let i = 0; i < 7; i++) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);

        const dayBlock = document.createElement('div');
        dayBlock.className = 'cursor-pointer';
        const isToday = new Date().toDateString() === day.toDateString();

        dayBlock.innerHTML = `
          <div class="fw-bold small">${dayNames[i]}</div>
          <div class="fw-semibold px-2 py-1 rounded ${isToday ? 'bg-main text-white' : ''}">
            ${day.getDate()}
          </div>
        `;
        weekContainer.appendChild(dayBlock);
      }
    }

    prevBtn.addEventListener('click', () => {
      currentDate.setDate(currentDate.getDate() - 7);
      renderWeek(currentDate);
    });

    nextBtn.addEventListener('click', () => {
      currentDate.setDate(currentDate.getDate() + 7);
      renderWeek(currentDate);
    });

    renderWeek(currentDate);
  }

  // ===============================================
  // Pre-register Events Calendar Section
  // Secondary calendar instance for event registration
  // Shares functionality with main calendar
  // ===============================================
  const weekContainer2 = document.getElementById('weekDaysContainer2');
  const monthLabel2 = document.getElementById('calendarMonthLabel2');
  const prevBtn2 = document.getElementById('prevWeekBtn2');
  const nextBtn2 = document.getElementById('nextWeekBtn2');

  if (weekContainer2 && monthLabel2 && prevBtn2 && nextBtn2) {
    let currentDate2 = new Date();

    function renderWeek2(date) {
      const start = getStartOfWeek(new Date(date));
      const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      weekContainer2.innerHTML = '';

      monthLabel2.textContent = start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      for (let i = 0; i < 7; i++) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);

        const dayBlock = document.createElement('div');
        dayBlock.className = 'cursor-pointer';
        const isToday = new Date().toDateString() === day.toDateString();

        dayBlock.innerHTML = `
          <div class="fw-bold small">${dayNames[i]}</div>
          <div class="fw-semibold px-2 py-1 rounded ${isToday ? 'bg-main text-white' : ''}">
            ${day.getDate()}
          </div>
        `;
        weekContainer2.appendChild(dayBlock);
      }
    }

    prevBtn2.addEventListener('click', () => {
      currentDate2.setDate(currentDate2.getDate() - 7);
      renderWeek2(currentDate2);
    });

    nextBtn2.addEventListener('click', () => {
      currentDate2.setDate(currentDate2.getDate() + 7);
      renderWeek2(currentDate2);
    });

    renderWeek2(currentDate2);
  }

  // ===============================================
  // Vertical Carousel Section
  // Manages vertical sliding carousel with dot navigation
  // Includes arrow controls and circular navigation
  // ===============================================
  const inner = document.querySelector('.vertical-carousel-inner');
  const items = document.querySelectorAll('.vertical-carousel-item');
  const dots = document.querySelectorAll('.vertical-carousel-dots button');

  if (inner && items.length && dots.length) {
    let currentSlide = 0;

    function goToSlide(index) {
      if (index < 0) index = items.length - 1;
      if (index >= items.length) index = 0;
      currentSlide = index;

      dots.forEach(d => d.classList.remove('active'));
      dots[index].classList.add('active');

      const translateY = -index * 100;
      inner.style.transform = `translateY(${translateY}%)`;
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
      });
    });

    items.forEach((item, index) => {
      item.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
      });
    });

    const upArrow = document.querySelector('.carousel-arrow-up');
    const downArrow = document.querySelector('.carousel-arrow-down');

    if (upArrow && downArrow) {
      upArrow.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
      });

      downArrow.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
      });
    }

    goToSlide(0);
  }

  // ===============================================
  // Accessibility Features Section
  // Implements keyboard navigation and accessibility
  // Shows skip link on tab key press
  // ===============================================
  document.addEventListener('keydown', function (e) {
    if (e.key === "Tab") {
      document.querySelector('.skip-link').style.top = "10px";
    }
  });

  // ===============================================
  // Copyright Year Section
  // Automatically updates the copyright year
  // ===============================================
  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ===============================================
  // Date Input Initialization Section
  // Configures Flatpickr date picker for date inputs
  // Enables calendar icon trigger functionality
  // ===============================================
  document.addEventListener('DOMContentLoaded', function() {
      // Get all date input groups
      const dateInputs = document.querySelectorAll('.input-group input[aria-label*="Date"]');
      
      dateInputs.forEach(input => {
          const config = {
              dateFormat: 'Y-m-d',
              allowInput: true,
              clickOpens: true,
              wrap: true
          };
          
          // Initialize Flatpickr on the parent input-group to allow calendar icon to trigger the picker
          flatpickr(input.closest('.input-group'), config);
      });
  });
});