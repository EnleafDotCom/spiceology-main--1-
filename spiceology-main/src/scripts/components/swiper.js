// core version + navigation, pagination modules:
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

class SwiperCarousel extends HTMLElement {
  constructor() {
    super()

    const options = this.dataset.swiper ? JSON.parse(this.dataset.swiper) : {}
    let element = this
    if (!this.classList.contains('swiper')) {
      element = this.querySelector('.swiper');
    }

    this.swiper = new Swiper(element, {

      // If we need pagination
      pagination: {
        el: this.querySelector('.swiper-pagination'),
        clickable: true,
      },

      // Navigation arrows
      navigation: {
        nextEl: this.querySelector('.swiper-button-next'),
        prevEl: this.querySelector('.swiper-button-prev'),
      },

      modules: [Navigation, Pagination],

      ...options
    });

    if (options.loop) {
      this.swiper.on('slideChange', () => {
        const next = document.querySelector('.swiper-button-next')
        if (next && next.classList.contains('swiper-button-disabled')) {
          next.classList.remove('swiper-button-disabled')
        }

        const prev = document.querySelector('.swiper-button-prev')
        if (prev && prev.classList.contains('swiper-button-disabled')) {
          prev.classList.remove('swiper-button-disabled')
        }
      })
    }
  }
}

if (!customElements.get('swiper-carousel'))
  customElements.define('swiper-carousel', SwiperCarousel)
