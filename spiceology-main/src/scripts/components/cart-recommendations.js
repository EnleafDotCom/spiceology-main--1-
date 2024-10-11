document.addEventListener("alpine:init", () => {
  Alpine.data("cartRecommendations", () => ({
    products: null,
    loading: false,

    init() {
      Alpine.effect(() => {
        const items = Alpine.store("main").cart?.items;
        this.refresh();
      });
    },

    async refresh() {
      let cartProductIds = Alpine.store('main').cart.items.slice(0, 10).map(
        (item) => item.product_id
      )
      cartProductIds = Array.from(new Set(cartProductIds))

      const limit = Math.floor(10 / cartProductIds.length);

      let responses = []

      try {
        this.loading = true;
        const promises = cartProductIds.map((productId) =>
          fetch(`${window.Shopify.routes.root}recommendations/products.json?product_id=${productId}&intent=related&limit=${limit}`)
            .then((response) => response.json())
        )
        responses = await Promise.all(promises);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        this.loading = false;
      }

      const apiProducts = responses.map((response) => response.products)
        .flat()
        .filter(
          (product) => !cartProductIds.includes(product?.id)
        )
        .reduce((uniqueProducts, product) => {
          if (!uniqueProducts.some((p) => p.id === product.id)) {
            uniqueProducts.push(product);
          }
          return uniqueProducts;
        }, []);

      this.products = apiProducts.map((product) => {
        return {
          id: product.id,
          title: product.title,
          featured_image: product.featured_image,
          url: product.url,
          active_variant_id: product.variants.find((variant) => variant.available)?.id,
          variants: product.variants.map((variant) => {
            return {
              id: variant.id,
              variantTitle: variant.title,
              variantPrice: variant.price,
              variantCompareAtPrice: variant.compare_at_price,
              isAvailable: variant.available,
              optionValues: variant.options,
            }
          }),
        };
      });
    },
  }));
});
