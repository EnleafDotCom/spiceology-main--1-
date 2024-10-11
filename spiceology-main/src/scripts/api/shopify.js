import Qs from "qs";
export const fetchCart = () => fetch("/cart.json");

export const addVariantsToCart = (items) =>
  fetch("/cart/add.js", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items,
    }),
  });

export const updateVariantQuantity = (variantId, quantity = 1) =>
  fetch("/cart/change.js", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: `${variantId}`,
      quantity,
    }),
  });

export const updateCartNote = (note) =>
  fetch("/cart/update.js", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ note }),
  });

export const updateCartAttributes = (attributes = {}, note = null) => {
  const body = { attributes };
  if (note !== null) {
    body.note = note;
  }

  return fetch("/cart/update.js", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

export const graphQl = (query) =>
  fetch("/api/2024-07/graphql.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Shopify-Storefront-Access-Token": "600f986ef5e2289fceb4c47b3a43cb4a",
    },
    body: JSON.stringify({ query }),
  }).then((r) => r.json());

export const search = (query, resources = {}) => {
  const params = {
    q: query,
    resources,
  };

  return fetch(
    `/search/suggest.json?${Qs.stringify(params, { encode: false })}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  ).then((r) => r.json());
};
