export class Gallery {
  constructor({
    containerSelector = ".gallery",
    thumbsSelector = ".gallery__thumbs",
    mainSelector = ".gallery__main",
  } = {}) {
    this.container = document.querySelector(containerSelector);
    this.thumbs = this.container ? this.container.querySelector(thumbsSelector) : null;
    this.mainContainer = this.container ? this.container.querySelector(mainSelector) : null;
    this.mainImg = this.mainContainer ? this.mainContainer.querySelector("img") : null;
  }

  init() {
    if (!this.container || !this.thumbs || !this.mainContainer || !this.mainImg) return;

    this.bindThumbs();
  }

  bindThumbs() {
    const buttons = Array.from(this.thumbs.querySelectorAll(".gallery__thumb"));
    buttons.forEach((btn, index) => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        this.setActiveThumb(index, buttons);
        const img = btn.querySelector("img");
        const src = img?.getAttribute("src");
        if (src && this.mainImg && this.mainContainer) {
          this.mainImg.setAttribute("src", src);
        }
      });
    });
  }

  setActiveThumb(activeIndex, buttons) {
    buttons.forEach((b, i) => {
      if (i === activeIndex) b.classList.add("is-active");
      else b.classList.remove("is-active");
    });
  }
}
