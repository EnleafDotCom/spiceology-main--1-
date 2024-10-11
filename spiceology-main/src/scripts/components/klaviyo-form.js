import { subscribe } from "../api/klaviyo";

class KlaviyoForm extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector("form");
    this.emailInput = this.querySelector('input[name="email"]');
    // this.successWrapper = this.querySelector(".js-email-success");
    this.errorWrapper = this.querySelector(".email-error");
    this.submit = this.querySelector('button[type="submit"]');
    this.form.addEventListener("submit", this.onSubmit);

    this.emailInput.addEventListener("input", () => {
      this.form.classList.remove("error");
      this.errorWrapper.classList.remove("hidden");
    });
  }

  destroy = () => {
    this.form.removeEventListener("submit", this.onSubmit);
  };

  onSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await subscribe(KLAVIYO_LIST_ID, this.emailInput.value);

      if (!response.success) {
        throw new Error(response.errors[0]);
      }

      // Success handling
      this.handleSuccess();
    } catch (error) {
      // Error handling
      this.handleError(error);
    }
  };

  handleSuccess = () => {
    this.submit.classList.add("hidden");
    this.submit.disabled = true;
    this.emailInput.value = "You're in! Check email for confirmation.";
    this.emailInput.disabled = true;
    this.emailInput.classList.add("success");
    this.form.disabled = true;
  };

  handleError = (error) => {
    console.error(error);
    this.form.classList.add("error");
    this.form.disabled = false;
    this.errorWrapper.innerHTML = error;
  };
}

if (!customElements.get("klaviyo-form"))
  customElements.define("klaviyo-form", KlaviyoForm);
