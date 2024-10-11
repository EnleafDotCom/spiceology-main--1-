import KeenSlider from "keen-slider";

class ButtonSlider extends HTMLElement {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.slidesContainer = this.querySelector(".keen-slider");
    this.slides = this.querySelectorAll(".keen-slider__slide");
    const options = JSON.parse(this.getAttribute("data-slider-options"));
    const buttonId = this.getAttribute("data-button-id");

    const useIndexButtons = this.slidesContainer.getAttribute(
      "data-use-index-btns"
    );

    // get left, right nav buttons and add click events to them
    const navButtons = this.querySelectorAll(".slider-button");
    if (navButtons.length > 0) {
      navButtons[0].addEventListener("click", () => this.slider.prev());
      navButtons[1].addEventListener("click", () => this.slider.next());
    }

    // get dots and add click events to them
    let dots = this.querySelectorAll(".dot");
    let thumbnails = this.querySelectorAll(".thumbnail");

    const handleDotClick = (index) => () => {
      this.slider.moveToIdx(index, true);
      dots.forEach((dot) => dot.classList.remove("active"));
      dots[index].classList.add("active");
    };

    if (dots.length > 0) {
      dots.forEach((dot, index) => {
        dot.addEventListener("click", handleDotClick(index));
        dots[0].classList.add("active");
      });
    }

    if (thumbnails.length > 0) {
      thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener("click", handleDotClick(index));
        thumbnails[0].classList.add("active");
      });
    }

    // get buttons that update slider slides and add events to them
    const handleClick = () => {
      setTimeout(() => this.slider.update(options, 0), 0);
      let dots = this.querySelectorAll(".dot");
      if (dots.length === 0) return;
      dots = this.querySelectorAll(".dot");
      dots.forEach((dot, index) => {
        dot.addEventListener("click", handleDotClick(index));
        dots[0].classList.add("active");
      });
    };

    let buttons;
    if (buttonId) {
      buttons = document.querySelectorAll(`.${buttonId}`);
    } else {
      buttons = this.querySelectorAll(".button__tab");
    }

    buttons.forEach((button) => button.addEventListener("click", handleClick));
    buttons.forEach((button) => button.addEventListener("focus", handleClick));

    if (useIndexButtons === "true") {
      // get index buttons and move the active slide to that index
      const handleIndexButtonClick = (index) => () => {
        this.slider.moveToIdx(index, true);
      };

      const indexButtons = document.querySelectorAll(".index-btn");

      if (indexButtons.length > 0) {
        indexButtons.forEach((button, index) => {
          button.addEventListener("click", handleIndexButtonClick(index));
        });
      }
    }

    // get slide count elements and update them on events
    const slideCurrent = this.querySelector(".slide-current");
    const slideTotal = this.querySelector(".slide-total");

    this.slider = new KeenSlider(this.slidesContainer, options);

    // this.slider.on("updated", () => {
    //   console.log("updated!");
    //   console.log(this.slider);
    //   this.slides.forEach((slide) => {
    //     if (slideCurrent) {
    //       slideCurrent.textContent = this.slider.track.details.rel + 1;
    //     }
    //     if (slideTotal) {
    //       slideTotal.textContent = this.slider.track.details.slides.length;
    //     }
    //     const index = parseInt(slide.getAttribute("data-active-slide"));
    //     if (index) {
    //       this.slider.moveToIdx(index, true);
    //     }
    //   });
    // });
    // update dot classes on events
    this.slider.on("optionsChanged", () => {
      dots = this.querySelectorAll(".dot");
      if (dots.length === 0) return;
      dots.forEach((dot, index) => {
        dot.addEventListener("click", handleDotClick(index));
        dots[0].classList.add("active");
      });
    });

    this.slider.on("slideChanged", (slider) => {
      this.slider.slides.forEach((slide, index) => {
        if (index === this.slider.track.details.rel) {
          slide.classList.add("active");
        } else {
          slide.classList.remove("active");
        }
      });

      if (slideCurrent) {
        slideCurrent.textContent = this.slider.track.details.rel + 1;
      }

      if (slideTotal) {
        slider - button;
        slideTotal.textContent = this.slider.track.details.slides.length;
      }

      //-------- Home slider ---------/
      if (this.slidesContainer.classList.contains("home-slider")) {
        const slides = this.slider.slides;

        slides.forEach((slide, index) => {
          // Clear all active classes
          slide.classList.remove("active", "active-2", "active-3", "active-4");
        });

        const currentSlideIndex = slider.track.details.rel;
        const totalSlides = slides.length;

        // Add the active class to the current slide
        slides[currentSlideIndex].classList.add("active");

        // Add classes for the next slides, wrapping around if needed
        for (let i = 1; i <= 4; i++) {
          const nextSlideIndex = (currentSlideIndex + i) % totalSlides;
          if (i === 1) {
            slides[nextSlideIndex].classList.add("active-2");
          } else if (i === 2) {
            slides[nextSlideIndex].classList.add("active-3");
          } else if (i === 3) {
            slides[nextSlideIndex].classList.add("active-4");
          }
        }

        if (slideCurrent) {
          slideCurrent.textContent = currentSlideIndex + 1;
        }

        if (slideTotal) {
          slideTotal.textContent = totalSlides;
        }
      }

      //-------- Dots ---------/
      if (dots.length === 0 && thumbnails.length === 0) return;
      if (thumbnails.length > 0) {
        thumbnails.forEach((thumbnail) => thumbnail.classList.remove("active"));
        thumbnails[this.slider.track.details.rel].classList.add("active");
      }
      if (dots.length > 0) {
        dots.forEach((dot) => dot.classList.remove("active"));
        dots[this.slider.track.details.rel].classList.add("active");
      }

      if (dots.length === 0) return;
      dots.forEach((dot) => dot.classList.remove("active"));
      dots[this.slider.track.details.rel].classList.add("active");
    });

    setTimeout(() => {
      if (this.slider) {
        this.slider.update();
      }
    }, 0);
  }
}

/*
  Register the element.
  Set timeout allows us to grab the dynamic classes added by Alpine
  after they have been added to the DOM.
*/
setTimeout(() => {
  if (!customElements.get("button-slider"))
    customElements.define("button-slider", ButtonSlider);
}, 0);
