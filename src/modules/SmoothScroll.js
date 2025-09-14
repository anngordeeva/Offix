/**
 * Модуль для плавной прокрутки с учетом высоты header
 */
export class SmoothScroll {
  constructor() {
    this.headerHeight = this.getHeaderHeight();
    this.scrollDuration = 800; // Длительность прокрутки в миллисекундах
    this.easing = this.easeInOutCubic; // Функция плавности
  }

  getHeaderHeight() {
    const header = document.querySelector(".header");
    if (header) {
      return header.offsetHeight;
    }
    return 0;
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) {
      return;
    }

    this.updateHeaderHeight();
    const targetPosition = targetSection.offsetTop - this.headerHeight;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const startTime = Date.now();

    const animateScroll = () => {
      const currentTime = Date.now();
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / this.scrollDuration, 1);
      const easedProgress = this.easing(progress);

      window.scrollTo(0, startPosition + distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }

  updateHeaderHeight() {
    this.headerHeight = this.getHeaderHeight();
  }
}
