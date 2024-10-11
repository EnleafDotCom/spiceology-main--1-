import AlpineInit from "./alpine/AlpineInit";

import forEachNode from "./utils/forEachNode";

//
// === Hydrate store ===
//

const { HYDRATE_VARIANT_ID } = window;

const urlSearchParams = new URLSearchParams(window.location.search);
const query = Object.fromEntries(urlSearchParams.entries());
const variantId = Number(query.variant) || HYDRATE_VARIANT_ID;

if (variantId) {
  Alpine.store("main").setActiveVariantId(variantId);
}


const images = document.querySelectorAll('[loading="lazy"]')

forEachNode(images, (image) => {
  if (image.complete) {
    image.classList.add('loaded')
  } else {
    image.classList.add('loading')
    image.addEventListener('load', () => {
      image.classList.remove('loading')
      image.classList.add('loaded')
    })
  }
})
