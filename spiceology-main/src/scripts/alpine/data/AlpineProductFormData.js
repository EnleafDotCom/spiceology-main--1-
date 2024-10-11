import Alpine from "alpinejs";

Alpine.data("productForm", (variants, initialActiveVariantId, isPDP) => {
  function checkForQueryParam() {
    let variantId;
    const urlParams = new URLSearchParams(location.search);
    for (const [key, value] of urlParams) {
      if (key === "variant" && value) {
        variantId = value;
      }
    }
    return variantId;
  }

  const updatedInitialActiveVariantId =
    checkForQueryParam() || initialActiveVariantId;

  let initialActiveVariant = variants.find(
    (variant) =>
      variant.id ==
      (isPDP ? updatedInitialActiveVariantId : initialActiveVariantId)
  );

  if (!initialActiveVariant) {
    initialActiveVariant = variants[0];
  }

  if (isPDP) {
    Alpine.store("main").setActiveVariantId(initialActiveVariant.id);
  }

  const reactiveData = Alpine.reactive({
    activeVariant: initialActiveVariant,
  });

  Alpine.effect(() => {
    const activeProductVariantId = Alpine.store("main").activeProductVariantId;

    if (isPDP) {
      const newActiveVariant = variants.find(
        (variant) => variant.id == activeProductVariantId
      );
      if (newActiveVariant) {
        reactiveData.activeVariant = newActiveVariant;
      }
    }
  });

  return {
    isOptionValueSelected(optionIndex, value) {
      optionIndex = parseInt(optionIndex.replace("option", "")) - 1;
      return (
        this.reactiveData.activeVariant?.optionValues[optionIndex] == value
      );
    },
    getVariant(optionIndex, value) {
      optionIndex = parseInt(optionIndex.replace("option", "")) - 1;
      const optionValues = [...this.reactiveData.activeVariant.optionValues];
      optionValues[optionIndex] = value;
      return this.variants.find(
        (variant) =>
          JSON.stringify(variant.optionValues) == JSON.stringify(optionValues)
      );
    },
    isOptionAvailable(optionIndex, value) {
      const variant = this.getVariant(optionIndex, value);

      if (variant) {
        return variant.isAvailable;
      }
      return false;
    },
    onOptionChanged(optionIndex, value) {
      const variant = this.getVariant(optionIndex, value);
      if (variant) {
        if (isPDP) {
          Alpine.store("main").setActiveVariantId(variant.id);
        }
        this.reactiveData.activeVariant = variant;
      }
    },
    changeActiveVariant(newVariantId) {
      const newActiveVariant = this.variants.find(
        (variant) => variant.id == newVariantId
      );
      if (newActiveVariant && isPDP) {
        Alpine.store("main").setActiveVariantId(newActiveVariant.id);
      }
      this.reactiveData.activeVariant = newActiveVariant;
    },
    incrementQuantity() {
      const { inventoryPolicy, inventory } = this.reactiveData.activeVariant;
      const sellPastAvailable = inventoryPolicy == "continue";
      if (!sellPastAvailable && this.quantity >= inventory) return;
      this.quantity++;
    },
    decrementQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    incrementDisabled() {
      const { inventoryPolicy, inventory } = this.reactiveData.activeVariant;
      const sellPastAvailable = inventoryPolicy == "continue";
      return !sellPastAvailable && this.quantity >= inventory;
    },
    reactiveData,
    variants,
    quantity: 1,
  };
});
