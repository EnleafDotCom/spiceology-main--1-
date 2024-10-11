import Alpine from "alpinejs";

import { reduce } from "lodash";
import * as shopify from "../../api/shopify";
import Cookies from "js-cookie";

const { CART, CUSTOMER_EMAIL, SHOPIFY_DOMAIN, GLOBALS } = window;

Alpine.store("main", {
  // Config
  shopifyDomain: SHOPIFY_DOMAIN,
  customerEmail: CUSTOMER_EMAIL,
  globals: GLOBALS,

  // App State
  activeProductVariantId: null,
  isMiniCartOpen: false,
  currentDropdown: null,
  isNavOpen: false,
  isMobileNavOpen: false,
  isMobileSearchOpen: false,
  isNavigatingToCheckout: false,
  isSearchOpen: false,
  isScrolled: false,
  showHeaderSpacer: true,

  // Cart
  cart: CART || null,
  pendingUpdateVariantId: null,
  pendingAddVariantId: null,
  addedVariantIds: [],
  isCartUpdating: false,
  cartType: "rebuy", // rebuy | custom

  init() {
    this.onScroll();
    document.addEventListener("scroll", () => {
      this.onScroll();
    });

    if (location.search === "?viewcart=true") {
      this.isMiniCartOpen = true;
    }

    if (location.hash) {
      addEventListener("DOMContentLoaded", () => {
        const el = document.getElementById(location.hash.replace("#", ""));
        if (el) {
          setTimeout(() => {
            window.scrollTo({
              top: el.offsetTop,
              left: 0,
              behavior: "instant",
            });
          }, 200);
        }

        if (this.cartType == "custom") {
          setTimeout(() => {
            // sometimes shopify caches the cart, so we need to refresh it form the API
            this.fetchCart();
          }, 1000);
        }
      });
    }

    if (this.cartType == "rebuy") {
      this.bindRebuyEvents();
    }
  },

  onScroll() {
    if (window.scrollY > 10) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
  },

  toggleMobileNav() {
    this.isMobileNavOpen = !this.isMobileNavOpen;

    if (this.isMobileNavOpen) {
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.documentElement.classList.remove("overflow-hidden");
    }

    this.isMiniCartOpen = this.isMobileNavOpen ? false : this.isMiniCartOpen;
    this.isSearchOpen = this.isMobileNavOpen ? false : this.isSearchOpen;
  },

  toggleMobileSearch() {
    this.isMobileSearchOpen = !this.isMobileSearchOpen;
    this.isMobileNavOpen = false;
    if (this.isMobileSearchOpen) {
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.documentElement.classList.remove("overflow-hidden");
    }

    this.isMiniCartOpen = this.isMobileSearchOpen ? false : this.isMiniCartOpen;
    // this.isSearchOpen = this.isMobileSearchOpen ? false : this.isSearchOpen;
    this.closeMenus();
  },

  setMiniCartOpen(isMiniCartOpen) {
    this.isMiniCartOpen = isMiniCartOpen;
    this.isSearchOpen = false;
    this.isMobileNavOpen = false;

    if (this.isRebuyEnabled()) {
      if (typeof Rebuy !== "undefined" && Rebuy?.SmartCart?.status == "ready") {
        if (this.isMiniCartOpen) {
          Rebuy.SmartCart.show();
        } else {
          Rebuy.SmartCart.hide();
        }
      } else {
        document.addEventListener("rebuy:smartcart.ready", () => {
          if (this.isMiniCartOpen) {
            Rebuy.SmartCart.show();
          } else {
            Rebuy.SmartCart.hide();
          }
        });
      }
    }
  },

  search(query, resources = {}) {
    return shopify.search(query, resources);
  },
  setSearchOpen(isSearchOpen) {
    this.isSearchOpen = isSearchOpen;
    this.isMobileNavOpen = isSearchOpen ? false : this.isMobileNavOpen;
    this.isMiniCartOpen = isSearchOpen ? false : this.isMiniCartOpen;
  },

  closeMenus() {
    document.documentElement.classList.remove("overflow-hidden");
    this.isNavOpen = false;
    this.isMobileNavOpen = false;
    this.isSearchOpen = false;
    this.currentDropdown = null;
  },

  setActiveVariantId(activeProductVariantId) {
    this.activeProductVariantId = activeProductVariantId;

    // Set query param if we haven't already
    if (window.history && window.history.replaceState) {
      window.history.replaceState(
        {},
        window.title,
        `${window.location.pathname}?variant=${activeProductVariantId}`
      );
    }
  },

  async addVariant({
    id,
    selling_plan,
    quantity = 1,
    properties = null,
    openCart = true,
  }) {
    this.pendingAddVariantId = id;

    const item = { id, quantity, selling_plan };
    if (properties) {
      item.properties = properties;
    }

    await this.addVariants({
      items: [item],
      openCart,
    });
  },

  async addVariants({
    items, // items: { id: number, quantity: number, properties: {}, selling_plan }[]
    openCart = true,
  }) {
    try {
      const response = await shopify.addVariantsToCart(items);
      const body = await response.json();
      this.pendingAddVariantId = null;

      if (body.items) {
        // ORDER HERE MATTERS
        // Shopify adds new items to the top.
        const newItems = body.items;
        const cartItems = this.cart.items;

        // Add back in unique cart items
        for (let i = 0; i < newItems.length; i++) {
          const newItem = newItems[i];
          const cartItem = cartItems.find((item) => item.key == newItem.key);
          if (cartItem) {
            cartItem.quantity = newItem.quantity;
          } else {
            cartItems.push(newItem);
          }
        }

        this.cart = {
          ...this.cart,
          ...this.calculateItems(cartItems),
        };

        if (this.isRebuyReadyAndEnabled()) {
          Rebuy.Cart.setCart(JSON.parse(JSON.stringify(this.cart)));
        }

        // klaviyo tracking
        if (_learnq) {
          _learnq.push([
            "track",
            "Added to Cart",
            {
              total_price: this.cart.total_price / 100,
              $value: this.cart.total_price / 100,
              total_discount: this.cart.total_discount,
              original_total_price: this.cart.original_total_price / 100,
              items: this.cart.items,
            },
          ]);
        }

        if (openCart) {
          this.setMiniCartOpen(true);
        }
      } else if (body.description) {
        alert(body.description);
        throw new Error(body.description);
      } else if (body.message) {
        alert(body.message);
        throw new Error(body.message);
      }

      if (openCart) {
        this.setMiniCartOpen(true);
      }
    } catch (error) {
      console.error(error);
      this.pendingAddVariantId = null;
      throw error;
    }
  },

  async updateVariantQuantity(variantId, quantity) {
    this.pendingUpdateVariantId = variantId;

    try {
      const response = await shopify.updateVariantQuantity(variantId, quantity);
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Error updating quantity: ${response.status} ${response.statusText} - ${errorBody}`
        );
      }
      const cart = await response.json();
      this.cart = cart;
      if (this.isRebuyReadyAndEnabled()) {
        Rebuy.Cart.setCart(JSON.parse(JSON.stringify(this.cart)));
      }
    } catch (error) {
      console.error("Failed to update variant quantity:", error.message);
    } finally {
      this.pendingUpdateVariantId = null;
    }
  },

  async navigateToCheckout() {
    if (
      this.isCartUpdating ||
      this.pendingAddVariantId ||
      this.pendingUpdateVariantId
    ) {
      console.warn("Cart is updating");
      return;
    }

    this.isNavigatingToCheckout = true;

    window.location.href = "/checkout";

    setTimeout(() => {
      this.isNavigatingToCheckout = false;
    }, 1000);
  },

  fetchCart() {
    this.isCartUpdating = true;

    return shopify
      .fetchCart()
      .then((response) => response.json())
      .then((cart) => {
        this.isCartUpdating = false;
        this.cart = cart;
        if (this.isRebuyReadyAndEnabled()) {
          Rebuy.Cart.setCart(JSON.parse(JSON.stringify(this.cart)));
        }
      })
      .catch((error) => {
        this.isCartUpdating = false;
        throw error;
      });
  },

  async updateCartAttributes(attributes, note = null) {
    this.isCartUpdating = true;

    const oldAttributes = this.cart.attributes;

    const newAttributes = {
      ...this.cart.attributes,
      ...attributes,
    };

    this.cart.attributes = newAttributes;

    try {
      const response = await shopify.updateCartAttributes(newAttributes, note);
      const cart = await response.json();
      this.isCartUpdating = false;
      this.cart.attributes = cart.attributes;
      this.cart.note = cart.note;
      if (this.isRebuyReadyAndEnabled()) {
        Rebuy.Cart.setCart(JSON.parse(JSON.stringify(this.cart)));
      }
    } catch (error) {
      console.error(error);
      this.cart.attributes = oldAttributes;
      this.isCartUpdating = false;
    }
  },

  async updateCartNote(note) {
    this.isCartUpdating = true;
    const oldNote = note;
    this.cart.note = note;

    try {
      const response = await shopify.updateCartNote(note);
      const cart = await response.json();
      this.isCartUpdating = false;
      this.cart.note = cart.note;
      if (this.isRebuyReadyAndEnabled()) {
        Rebuy.Cart.setCart(JSON.parse(JSON.stringify(this.cart)));
      }
    } catch (error) {
      console.error(error);
      this.cart.note = oldNote;
      this.isCartUpdating = false;
    }
  },

  calculateItems(items) {
    const item_count = items.reduce(
      (quantity, item) => quantity + (item.quantity || 0),
      0
    );

    const total_price = items.reduce((totalPrice, item) => {
      return totalPrice + (item.discounted_price || 0) * item.quantity;
    }, 0);

    return { item_count, total_price };
  },

  graphQl(query) {
    return shopify.graphQl(query);
  },

  async getRecentProducts() {
    let recentProductIds;

    try {
      recentProductIds = JSON.parse(Cookies.get("recentProductIds"));
    } catch {
      recentProductIds = [];
    }

    const promises = recentProductIds.slice(1).map((productHandle) => {
      return shopify.graphQl(`
        {
          product(handle: "${productHandle}") {
            title
            handle
            priceRange {
              minVariantPrice {
                amount
              }
              maxVariantPrice {
                amount
              }
            }
            images(first: 2) {
              edges {
                node {
                  src
                  width
                  height
                }
              }
            }
            onlineStoreUrl
            metafield(key: "tag", namespace: "custom") {
              value
            }
          }
        }
      `);
    });

    const products = await Promise.all(promises);
    return products.filter(({ data }) => !!data?.product);
  },

  storeRecentProduct(handle) {
    let recentProductIds;

    try {
      recentProductIds = JSON.parse(Cookies.get("recentProductIds"));
    } catch {
      recentProductIds = [];
    }

    if (!recentProductIds?.includes(handle)) {
      recentProductIds = [handle, ...recentProductIds].slice(0, 11);
      Cookies.set("recentProductIds", JSON.stringify(recentProductIds), {
        expires: 30,
      });
    }
  },

  // Rebuy
  isRebuyReadyAndEnabled() {
    return (
      this.cartType == "rebuy" &&
      typeof Rebuy !== "undefined" &&
      Rebuy?.SmartCart?.status == "ready"
    );
  },

  isRebuyEnabled() {
    return this.cartType == "rebuy";
  },

  clearRebuyEvents() {
    document.removeEventListener(
      "rebuy:cart.change",
      this.rebuyEventCallbackfn
    );
    document.removeEventListener(
      "rebuy:cart.show",
      this.rebuyShowEventCallbackfn
    );
    document.removeEventListener(
      "rebuy:cart.hide",
      this.rebuyHideEventCallbackfn
    );
  },

  bindRebuyEvents() {
    this.clearRebuyEvents();
    document.addEventListener("rebuy:cart.change", this.rebuyEventCallbackfn);
    document.addEventListener(
      "rebuy:smartcart.show",
      this.rebuyShowEventCallbackfn
    );
    document.addEventListener(
      "rebuy:smartcart.hide",
      this.rebuyHideEventCallbackfn
    );
  },

  rebuyShowEventCallbackfn: () => {
    Alpine.store("main").isMiniCartOpen = true;
  },

  rebuyHideEventCallbackfn: () => {
    Alpine.store("main").isMiniCartOpen = false;
  },

  rebuyEventCallbackfn: (event) => {
    const cart = {
      ...Alpine.store("main").cart,
      ...event.detail.cart.cart,
    };

    const calculateItems = Alpine.store("main").calculateItems(cart.items);

    cart.item_count = calculateItems.item_count;
    cart.total_price = calculateItems.total_price;

    Alpine.store("main").cart = cart;
  },
});
