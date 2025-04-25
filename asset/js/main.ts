/**
 * Main WebPart TypeScript file
 * This file contains the core functionality for the QMI application's web part,
 * including theme management, mobile menu, calendar, and other interactive features.
 */

import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

/**
 * Interface for managing theme-related settings
 * @property selectedColorKey - The currently selected color theme key
 * @property theme - The current theme mode (light/dark)
 */
interface IThemeSettings {
  selectedColorKey: string | null;
  theme: 'light' | 'dark';
}

/**
 * Interface for managing calendar state
 * @property currentDate - The currently displayed date in the calendar
 */
interface ICalendarState {
  currentDate: Date;
}

/**
 * Interface for managing vertical carousel state
 * @property currentSlide - The index of the current slide
 * @property itemsCount - Total number of slides in the carousel
 */
interface ICarouselState {
  currentSlide: number;
  itemsCount: number;
}

/**
 * Main WebPart class that handles all the interactive functionality
 * Extends SharePoint's BaseClientSideWebPart for web part integration
 */
export default class MainWebPart extends BaseClientSideWebPart<{}> {
  private themeSettings: IThemeSettings = {
    selectedColorKey: null,
    theme: 'light'
  };

  private calendarState: ICalendarState = {
    currentDate: new Date()
  };

  private carouselState: ICarouselState = {
    currentSlide: 0,
    itemsCount: 0
  };

  public render(): void {
    this.domElement.innerHTML = `
      <!-- Your existing HTML structure here -->
    `;

    this.initializeComponents();
  }

  /**
   * Initializes all component functionality
   * This method serves as the main entry point for setting up all interactive features
   */
  /**
   * Initializes the news view toggle functionality
   * Handles switching between grid and list views
   */
  private initializeNewsViewToggle(): void {
    const gridViewBtn = document.getElementById('gridViewBtn') as HTMLButtonElement;
    const newsWrapper = document.querySelector('.news-wrapper') as HTMLElement;

    if (gridViewBtn && newsWrapper) {
      const updateView = (isGrid: boolean): void => {
        if (isGrid) {
          newsWrapper.classList.remove('view-list');
          newsWrapper.classList.add('view-grid');
          gridViewBtn.classList.add('active');
        } else {
          newsWrapper.classList.remove('view-grid');
          newsWrapper.classList.add('view-list');
          gridViewBtn.classList.remove('active');
        }
        localStorage.setItem('newsViewMode', isGrid ? 'grid' : 'list');
      };

      // Set initial view based on saved preference
      const savedViewMode = localStorage.getItem('newsViewMode');
      updateView(savedViewMode === 'grid');

      gridViewBtn.addEventListener('click', () => {
        const isCurrentlyGrid = newsWrapper.classList.contains('view-grid');
        updateView(!isCurrentlyGrid);
      });

      // Handle responsive view
      window.addEventListener('resize', () => {
        if (window.innerWidth <= 576) {
          newsWrapper.classList.remove('view-list');
          newsWrapper.classList.add('view-grid');
          gridViewBtn.classList.add('active');
        }
      });
    }
  }

  private initializeComponents(): void {
    this.initializeThemeToggle();
    this.initializeMobileMenu();
    this.initializeThemeCustomization();
    this.initializeCalendar();
    this.initializeVerticalCarousel();
    this.initializeAccessibilityFeatures();
    this.initializeCopyrightYear();
    this.initializeDateInputs();
    this.initializeNewsViewToggle(); // Add the new initialization
  }

  /**
   * Initializes the theme toggle functionality
   * Handles the theme dropdown visibility and click events
   */
  private initializeThemeToggle(): void {
    const themeBtn = document.getElementById('themeBtn') as HTMLButtonElement;
    const themeDropdown = document.getElementById('themeDropdown') as HTMLDivElement;

    if (themeBtn && themeDropdown) {
      themeBtn.addEventListener('click', (e: MouseEvent) => {
        e.stopPropagation();
        themeDropdown.classList.toggle('show');
      });

      document.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!themeDropdown.contains(target) && !themeBtn.contains(target)) {
          themeDropdown.classList.remove('show');
        }
      });

      const themeCloseBtn = themeDropdown.querySelector('.btn-outline-secondary') as HTMLButtonElement;
      if (themeCloseBtn) {
        themeCloseBtn.addEventListener('click', () => {
          themeDropdown.classList.remove('show');
        });
      }
    }
  }

  /**
   * Initializes the mobile menu functionality
   * Sets up event listeners for menu toggle and close actions
   */
  private initializeMobileMenu(): void {
    const toggleBtn = document.getElementById('menuToggle') as HTMLButtonElement;
    const menu = document.getElementById('mainMenu') as HTMLDivElement;

    if (toggleBtn && menu) {
      toggleBtn.addEventListener('click', () => {
        menu.classList.toggle('active');
      });

      const closeBtn = document.getElementById('closeMenuBtn') as HTMLButtonElement;
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          menu.classList.remove('active');
        });
      }

      document.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!menu.contains(target) && !toggleBtn.contains(target)) {
          menu.classList.remove('active');
        }
      });
    }
  }

  /**
   * Initializes theme customization features
   * Handles color selection, persistence, and application
   */
  private initializeThemeCustomization(): void {
    const colorCircles = document.querySelectorAll('.color-circle') as NodeListOf<HTMLElement>;

    const updateSelectedColor = (element: HTMLElement): void => {
      colorCircles.forEach(c => c.classList.remove('selected'));
      element.classList.add('selected');

      const selectedColor = getComputedStyle(document.documentElement)
        .getPropertyValue(element.dataset.color || '');
      document.documentElement.style.setProperty('--main-color', selectedColor);

      this.themeSettings.selectedColorKey = element.dataset.color || null;
      localStorage.setItem('selectedColorKey', this.themeSettings.selectedColorKey || '');
    };

    const savedColorKey = localStorage.getItem('selectedColorKey');
    if (savedColorKey) {
      const savedColorElement = Array.from(colorCircles).find(c => c.dataset.color === savedColorKey);
      if (savedColorElement) updateSelectedColor(savedColorElement);
    } else {
      const defaultColor = document.querySelector('.color-circle.bg-pink') as HTMLElement;
      if (defaultColor) updateSelectedColor(defaultColor);
    }

    colorCircles.forEach(circle => {
      circle.addEventListener('click', () => updateSelectedColor(circle));
    });
  }

  /**
   * Initializes the calendar component
   * Sets up the weekly calendar view with navigation and date display
   */
  private initializeCalendar(): void {
    const weekContainer = document.getElementById('weekDaysContainer') as HTMLDivElement;
    const monthLabel = document.getElementById('calendarMonthLabel') as HTMLElement;
    const prevBtn = document.getElementById('prevWeekBtn') as HTMLButtonElement;
    const nextBtn = document.getElementById('nextWeekBtn') as HTMLButtonElement;

    if (weekContainer && monthLabel && prevBtn && nextBtn) {
      const getStartOfWeek = (date: Date): Date => {
        const day = date.getDay();
        return new Date(date.setDate(date.getDate() - day));
      };

      const renderWeek = (date: Date): void => {
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
      };

      prevBtn.addEventListener('click', () => {
        this.calendarState.currentDate.setDate(this.calendarState.currentDate.getDate() - 7);
        renderWeek(this.calendarState.currentDate);
      });

      nextBtn.addEventListener('click', () => {
        this.calendarState.currentDate.setDate(this.calendarState.currentDate.getDate() + 7);
        renderWeek(this.calendarState.currentDate);
      });

      renderWeek(this.calendarState.currentDate);
    }
  }

  /**
   * Initializes the vertical carousel component
   * Handles slide navigation, dots indicators, and arrow controls
   */
  private initializeVerticalCarousel(): void {
    const inner = document.querySelector('.vertical-carousel-inner') as HTMLElement;
    const items = document.querySelectorAll('.vertical-carousel-item') as NodeListOf<HTMLElement>;
    const dots = document.querySelectorAll('.vertical-carousel-dots button') as NodeListOf<HTMLButtonElement>;

    if (inner && items.length && dots.length) {
      this.carouselState.itemsCount = items.length;

      const goToSlide = (index: number): void => {
        if (index < 0) index = this.carouselState.itemsCount - 1;
        if (index >= this.carouselState.itemsCount) index = 0;
        this.carouselState.currentSlide = index;

        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');

        const translateY = -index * 100;
        inner.style.transform = `translateY(${translateY}%)`;
      };

      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
      });

      items.forEach((item, index) => {
        item.addEventListener('click', () => goToSlide(this.carouselState.currentSlide + 1));
      });

      const upArrow = document.querySelector('.carousel-arrow-up') as HTMLElement;
      const downArrow = document.querySelector('.carousel-arrow-down') as HTMLElement;

      if (upArrow && downArrow) {
        upArrow.addEventListener('click', () => goToSlide(this.carouselState.currentSlide - 1));
        downArrow.addEventListener('click', () => goToSlide(this.carouselState.currentSlide + 1));
      }

      goToSlide(0);
    }
  }

  /**
   * Initializes accessibility features
   * Sets up keyboard navigation and skip links for better accessibility
   */
  private initializeAccessibilityFeatures(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const skipLink = document.querySelector('.skip-link') as HTMLElement;
        if (skipLink) skipLink.style.top = '10px';
      }
    });
  }

  /**
   * Initializes the copyright year
   * Updates the copyright year element with the current year
   */
  private initializeCopyrightYear(): void {
    const yearElement = document.getElementById('currentYear') as HTMLElement;
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear().toString();
    }
  }

  /**
   * Initializes date input fields
   * Sets up Flatpickr date picker for all date input fields
   */
  private initializeDateInputs(): void {
    const dateInputs = document.querySelectorAll('.input-group input[aria-label*="Date"]') as NodeListOf<HTMLInputElement>;
    
    dateInputs.forEach(input => {
      const config = {
        dateFormat: 'Y-m-d',
        allowInput: true,
        clickOpens: true,
        wrap: true
      };
      
      if (input.closest('.input-group')) {
        // Initialize Flatpickr (assuming it's available globally)
        (window as any).flatpickr(input.closest('.input-group'), config);
      }
    });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'Main WebPart Properties'
          },
          groups: []
        }
      ]
    };
  }
}