export class FeedbackModal {
  constructor(options = {}) {
    this.endpoint = options.endpoint || "/add.php";
    this.modalElement = null;
    this.isOpen = false;
    this.app = options.app || null; // Ссылка на экземпляр App для навигации
  }

  init() {
    // Ничего не делаем при инициализации, модалка создаётся лениво при открытии
  }

  open() {
    if (this.isOpen) return;
    this.render();
    document.body.appendChild(this.modalElement);
    document.body.style.overflow = "hidden";
    this.isOpen = true;
    const firstInput = this.modalElement.querySelector('input[name="name"]');
    if (firstInput) firstInput.focus({ preventScroll: true });
  }

  close() {
    if (!this.isOpen) return;
    this.modalElement.remove();
    document.body.style.overflow = "";
    this.isOpen = false;
    this.modalElement = null;
  }

  render() {
    const overlay = document.createElement("div");
    overlay.className = "modal";
    overlay.innerHTML = `
      <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="feedback-modal-title">
        <button type="button" class="modal__close" aria-label="Закрыть">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.4608 13.6645C14.513 13.7167 14.5545 13.7788 14.5828 13.8471C14.6111 13.9154 14.6256 13.9885 14.6256 14.0624C14.6256 14.1364 14.6111 14.2095 14.5828 14.2778C14.5545 14.3461 14.513 14.4082 14.4608 14.4604C14.4085 14.5127 14.3465 14.5541 14.2782 14.5824C14.2099 14.6107 14.1367 14.6253 14.0628 14.6253C13.9889 14.6253 13.9157 14.6107 13.8474 14.5824C13.7792 14.5541 13.7171 14.5127 13.6648 14.4604L9.00031 9.79518L4.33578 14.4604C4.23023 14.566 4.08708 14.6253 3.93781 14.6253C3.78855 14.6253 3.64539 14.566 3.53984 14.4604C3.4343 14.3549 3.375 14.2117 3.375 14.0624C3.375 13.9132 3.4343 13.77 3.53984 13.6645L8.20508 8.99995L3.53984 4.33542C3.4343 4.22987 3.375 4.08671 3.375 3.93745C3.375 3.78818 3.4343 3.64503 3.53984 3.53948C3.64539 3.43393 3.78855 3.37463 3.93781 3.37463C4.08708 3.37463 4.23023 3.43393 4.33578 3.53948L9.00031 8.20471L13.6648 3.53948C13.7704 3.43393 13.9135 3.37463 14.0628 3.37463C14.2121 3.37463 14.3552 3.43393 14.4608 3.53948C14.5663 3.64503 14.6256 3.78818 14.6256 3.93745C14.6256 4.08671 14.5663 4.22987 14.4608 4.33542L9.79555 8.99995L14.4608 13.6645Z" fill="#0B1E21"/>
          </svg>
        </button>
        <div class="modal__root">
          <div class="modal__wrapper" data-role="form-wrapper">
            <div class="modal__wrapper-grid">
              <div class="modal__content">
                <h2 class="modal__title">Start Your Virtual Office in Dubai</h2>
                <p class="modal__description">
                  Ready to set up a virtual office in Dubai? <br> Leave your details — we’ll get back to you shortly with all the essentials.
                </p>
              </div>
              <form class="feedback-form" action="${this.endpoint}" method="POST" novalidate>
                <div class="feedback-form__inputs">
                
                  <div class="feedback-form__inputs-wrapper"> 
                  
                    <div class="feedback-form__form-field">
                      <label for="feedback-name">name</label>
                      <input id="feedback-name" name="name" type="text" required placeholder="Your name" />
                      <div class="field-error" data-error-for="name"></div>
                    </div>

                    <div class="feedback-form__form-field">
                      <label for="feedback-phone">phone</label>
                      <input id="feedback-phone" name="phone" type="tel" required placeholder="Your phone" />
                      <div class="field-error" data-error-for="phone"></div>
                    </div>
                  
                  </div>

                  <div class="feedback-form__form-field">
                    <label for="feedback-email">email</label>
                    <input id="feedback-email" name="email" type="email" required placeholder="Your email" />
                    <div class="field-error" data-error-for="email"></div>
                  </div>

                  <fieldset class="feedback-form__form-field">
                    <legend>method of communication</legend>
                    <div class="feedback-form__checkboxes">
                      <label><input type="checkbox" name="contact_methods[]" value="Telegram" /> Telegram</label>
                      <label><input type="checkbox" name="contact_methods[]" value="WhatsApp" /> WhatsApp</label>
                      <label><input type="checkbox" name="contact_methods[]" value="Email" /> Email</label>
                    </div>
                    <div class="field-error" data-error-for="contact_methods"></div>
                  </fieldset>

                  <input type="hidden" name="page" value="${window.location.href}" />

                </div>

                <div class="modal__footer">
                  <button type="submit" class="modal__button" data-role="submit">Get in touch</button>
                  <span class="modal-footer__description">By clicking the button, you agree to the <a href="#">privacy policy</a></span>
                </div>

              </form>
            </div>
          </div>

          <div class="modal__wrapper" data-role="loading-wrapper">
            <div class="modal__content center">
              <div class="loader loader ">
                <span class="d"></span>
                <span class="d"></span>
                <span class="d"></span>
                <span class="d"></span>
              </div>
              <h2 class="modal__title">Submitting your request…</h2>
              <p class="modal__description">Please wait while we process your details.</p>
            </div>
          </div>
          
          <div class="modal__wrapper" data-role="success-wrapper">
            <div class="modal__content center">
              <svg width="76" height="76" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="76" height="76" rx="38" fill="#2E706A"/>
                <path d="M49.1196 32.4941L35.1195 46.4941C35.0383 46.5754 34.9418 46.64 34.8356 46.684C34.7293 46.728 34.6155 46.7507 34.5005 46.7507C34.3855 46.7507 34.2716 46.728 34.1654 46.684C34.0592 46.64 33.9627 46.5754 33.8814 46.4941L27.7564 40.3691C27.5922 40.2049 27.5 39.9822 27.5 39.75C27.5 39.5178 27.5922 39.2951 27.7564 39.1309C27.9206 38.9667 28.1433 38.8745 28.3755 38.8745C28.6077 38.8745 28.8304 38.9667 28.9945 39.1309L34.5005 44.638L47.8814 31.2559C48.0456 31.0917 48.2683 30.9995 48.5005 30.9995C48.7327 30.9995 48.9554 31.0917 49.1196 31.2559C49.2837 31.4201 49.376 31.6428 49.376 31.875C49.376 32.1072 49.2837 32.3299 49.1196 32.4941Z" fill="white"/>
              </svg>

              <h2 class="modal__title">Thank you! <br> Your request is submitted</h2>
              <p class="modal__description">Our team will contact you soon with all the details about your virtual office in Dubai.</p>
              <button type="button" class="modal__button">Homepage</button>
            </div>
          </div>

          <div class="modal__wrapper" data-role="error-wrapper">
            <div class="modal__content center">
              <svg width="76" height="76" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="76" height="76" rx="38" fill="#E34040"/>
                <path d="M46.4946 45.2559C46.5758 45.3372 46.6403 45.4337 46.6843 45.54C46.7283 45.6462 46.751 45.76 46.751 45.875C46.751 45.99 46.7283 46.1038 46.6843 46.21C46.6403 46.3163 46.5758 46.4128 46.4946 46.4941C46.4133 46.5754 46.3167 46.6398 46.2105 46.6838C46.1043 46.7278 45.9905 46.7505 45.8755 46.7505C45.7605 46.7505 45.6467 46.7278 45.5405 46.6838C45.4342 46.6398 45.3377 46.5754 45.2564 46.4941L38.0005 39.237L30.7445 46.4941C30.5804 46.6582 30.3577 46.7505 30.1255 46.7505C29.8933 46.7505 29.6706 46.6582 29.5064 46.4941C29.3422 46.3299 29.25 46.1072 29.25 45.875C29.25 45.6428 29.3422 45.4201 29.5064 45.2559L36.7635 38L29.5064 30.7441C29.3422 30.5799 29.25 30.3572 29.25 30.125C29.25 29.8928 29.3422 29.6701 29.5064 29.5059C29.6706 29.3418 29.8933 29.2495 30.1255 29.2495C30.3577 29.2495 30.5804 29.3418 30.7445 29.5059L38.0005 36.763L45.2564 29.5059C45.4206 29.3418 45.6433 29.2495 45.8755 29.2495C46.1077 29.2495 46.3304 29.3418 46.4946 29.5059C46.6587 29.6701 46.751 29.8928 46.751 30.125C46.751 30.3572 46.6587 30.5799 46.4946 30.7441L39.2375 38L46.4946 45.2559Z" fill="white"/>
              </svg>

              <h2 class="modal__title">Something went wrong</h2>
              <p class="modal__description">Please try again later or contact us directly for assistance with your virtual office setup.</p>
              <div class="modal__button-wrapper">
                <button type="button" class="modal__button white">Homepage</button>
                <button type="button" class="modal__button re-try">Try again</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.modalElement = overlay;
    this.bindEvents();
    this.bindWrapperButtons();

    // Изначально показываем только форму
    this.showWrapper("form");
  }

  bindEvents() {
    const overlay = this.modalElement;
    const closeBtn = overlay.querySelector(".modal__close");
    const form = overlay.querySelector(".feedback-form");

    const onEsc = e => {
      if (e.key === "Escape") this.close();
    };

    overlay.addEventListener("click", e => {
      if (e.target === overlay) this.close();
    });
    closeBtn.addEventListener("click", () => this.close());
    document.addEventListener("keydown", onEsc, { once: true });

    form.addEventListener("submit", async e => {
      e.preventDefault();
      const valid = this.validateForm(form);
      if (!valid) return;

      this.showWrapper("loading");

      try {
        const formData = new window.FormData(form);

        // Симуляция задержки отправки (TODO: убрать после подключения к серверу)
        // eslint-disable-next-line no-promise-executor-return
        await new Promise(resolve => setTimeout(resolve, 1500));

        // AJAX отправка на бекенд NetCat (endpoint можно поменять в options)
        try {
          const response = await fetch(this.endpoint, {
            method: "POST",
            body: formData,
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
          });

          if (!response.ok) throw new Error("Network error");

          // Показываем успех
          this.showWrapper("success");
          form.reset();
        } catch (error) {
          // Реальная обработка ошибок сервера
          // this.showWrapper("error");
          // console.log("Server error:", error);

          // СИМУЛЯЦИЯ УСПЕХА (TODO: убрать после подключения к серверу)
          // Для тестирования error состояния раскомментируйте следующую строку:
          // this.showWrapper("error");

          // eslint-disable-next-line no-console
          console.log("Server error (simulating success for demo):", error);
          this.showWrapper("success");
          form.reset();
        }
      } catch (error) {
        // Реальная обработка общих ошибок
        // this.showWrapper("error");
        // console.log("General error:", error);

        // СИМУЛЯЦИЯ УСПЕХА (TODO: убрать после подключения к серверу)
        // Для тестирования error состояния раскомментируйте следующую строку:
        // this.showWrapper("error");

        // eslint-disable-next-line no-console
        console.log("General error (simulating success for demo):", error);
        this.showWrapper("success");
        form.reset();
      }
    });

    // Очистка ошибок при вводе в поля
    const clearErrorOnInput = (input, fieldName) => {
      input.addEventListener("input", () => {
        const errorEl = form.querySelector(`.field-error[data-error-for="${fieldName}"]`);
        if (errorEl && errorEl.textContent) {
          errorEl.textContent = "";
        }
        input.classList.remove("error");
      });
    };

    // Применяем очистку ошибок для всех полей
    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const emailInput = form.querySelector('input[name="email"]');
    const methodInputs = form.querySelectorAll('input[name="contact_methods[]"]');

    if (nameInput) clearErrorOnInput(nameInput, "name");
    if (emailInput) clearErrorOnInput(emailInput, "email");
    if (methodInputs.length) {
      methodInputs.forEach(input => {
        const label = input.closest("label");

        this.updateCheckboxState(input, label);

        input.addEventListener("change", () => {
          this.updateCheckboxState(input, label);

          const errorEl = form.querySelector(`.field-error[data-error-for="contact_methods"]`);
          if (errorEl && errorEl.textContent) {
            errorEl.textContent = "";
          }
        });
      });
    }

    // Простая маска для телефона: оставляем только цифры и +
    if (phoneInput) {
      phoneInput.addEventListener("input", () => {
        const raw = phoneInput.value;
        const cleaned = raw.replace(/[^+0-9\s()-]/g, "");
        phoneInput.value = cleaned;

        const errorEl = form.querySelector(`.field-error[data-error-for="phone"]`);
        if (errorEl && errorEl.textContent) {
          errorEl.textContent = "";
        }
      });
    }
  }

  validateForm(form) {
    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const emailInput = form.querySelector('input[name="email"]');
    const methods = form.querySelectorAll('input[name="contact_methods[]"]');

    const setError = (input, field, message) => {
      const errorEl = form.querySelector(`.field-error[data-error-for="${field}"]`);
      if (errorEl) errorEl.textContent = message || "";

      if (input) {
        if (message) {
          input.classList.add("error");
        } else {
          input.classList.remove("error");
        }
      }
    };

    let isValid = true;

    // Имя: минимум 2 символа
    if (!nameInput.value || nameInput.value.trim().length < 2) {
      setError(nameInput, "name", "Please enter your name (minimum 2 characters)");
      isValid = false;
    } else {
      setError(nameInput, "name", "");
    }

    // Телефон: минимум 10 цифр
    const digits = (phoneInput.value || "").replace(/\D/g, "");
    if (digits.length < 10) {
      setError(phoneInput, "phone", "Please enter a valid phone number");
      isValid = false;
    } else {
      setError(phoneInput, "phone", "");
    }

    // Email: базовая проверка
    const email = (emailInput.value || "").trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      setError(emailInput, "email", "Please enter a valid email address");
      isValid = false;
    } else {
      setError(emailInput, "email", "");
    }

    // Способ связи: хотя бы один
    const anyChecked = Array.from(methods).some(i => i.checked);
    if (!anyChecked) {
      setError(null, "contact_methods", "Please select at least one contact method");
      isValid = false;
    } else {
      setError(null, "contact_methods", "");
    }

    return isValid;
  }

  updateCheckboxState(checkbox, label) {
    if (checkbox.checked) {
      label.classList.add("active");
    } else {
      label.classList.remove("active");
    }
  }

  showWrapper(wrapperType) {
    const overlay = this.modalElement;
    const formWrapper = overlay.querySelector('[data-role="form-wrapper"]');
    const loadingWrapper = overlay.querySelector('[data-role="loading-wrapper"]');
    const successWrapper = overlay.querySelector('[data-role="success-wrapper"]');
    const errorWrapper = overlay.querySelector('[data-role="error-wrapper"]');

    // Скрываем все wrapper-ы
    [formWrapper, loadingWrapper, successWrapper, errorWrapper].forEach(wrapper => {
      if (wrapper) {
        wrapper.style.setProperty("display", "none");
      }
    });

    // Показываем нужный wrapper
    switch (wrapperType) {
      case "form":
        if (formWrapper) formWrapper.style.setProperty("display", "flex");
        break;
      case "loading":
        if (loadingWrapper) loadingWrapper.style.setProperty("display", "flex");
        break;
      case "success":
        if (successWrapper) successWrapper.style.setProperty("display", "flex");
        break;
      case "error":
        if (errorWrapper) errorWrapper.style.setProperty("display", "flex");
        break;
    }
  }

  bindWrapperButtons() {
    const overlay = this.modalElement;

    const successHomeBtn = overlay.querySelector('[data-role="success-wrapper"] .modal__button');
    if (successHomeBtn) {
      successHomeBtn.addEventListener("click", () => {
        this.navigateToHome();
      });
    }

    // Кнопки в error-wrapper
    const errorHomeBtn = overlay.querySelector('[data-role="error-wrapper"] .modal__button.white');
    const errorRetryBtn = overlay.querySelector('[data-role="error-wrapper"] .modal__button.re-try');

    if (errorHomeBtn) {
      errorHomeBtn.addEventListener("click", () => {
        this.navigateToHome();
      });
    }

    if (errorRetryBtn) {
      errorRetryBtn.addEventListener("click", () => {
        this.showWrapper("form");
      });
    }
  }

  navigateToHome() {
    if (this.app && typeof this.app.loadPage === "function") {
      this.app.loadPage("home");
    } else {
      // Fallback для случаев, когда App не передан
      window.location.href = "/";
    }
    this.close();
  }
}
