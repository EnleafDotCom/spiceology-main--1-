class ProductRecommendations extends HTMLElement {
  constructor() {
    super();

    fetch(this.dataset.url)
      .then((response) => response.text())
      .then((responseText) => {
        const html = document.createElement("div");
        html.innerHTML = responseText;
        this.innerHTML = "";
        this.appendChild(html);
      });
  }
}

if (!customElements.get("product-recommendations"))
  customElements.define("product-recommendations", ProductRecommendations);
