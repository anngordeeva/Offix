import { Accordion } from "./Accordion.js";

export class FaqAccordion {
  constructor(container = ".faq") {
    this.container = container;
    this.accordion = null;
    this.init();
  }

  init() {
    const faqContainer =
      typeof this.container === "string" ? document.querySelector(this.container) : this.container;

    if (!faqContainer) {
      return;
    }

    this.accordion = new Accordion(faqContainer, {
      itemSelector: ".faq__item",
      triggerSelector: ".faq__title-wrapper",
      contentSelector: ".faq__answer",
      activeClass: "active",
      allowMultiple: false,
      closeOthers: true,
    });
  }

  openItem(index) {
    if (this.accordion) {
      this.accordion.openItem(index);
    }
  }

  closeAll() {
    if (this.accordion) {
      this.accordion.closeAll();
    }
  }

  getActiveItem() {
    if (this.accordion) {
      const activeItems = this.accordion.getActiveItems();
      return activeItems.length > 0 ? activeItems[0] : null;
    }
    return null;
  }

  refresh() {
    if (this.accordion) {
      this.accordion.refresh();
    }
  }

  destroy() {
    if (this.accordion) {
      this.accordion.destroy();
      this.accordion = null;
    }
  }
}
