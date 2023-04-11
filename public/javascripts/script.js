console.log("test");
document.querySelector(`.mobile-nav-btn`).addEventListener("click", () => {
  console.log("test");

  document.querySelector(`.mobile-nav-btn`).classList.toggle(`active`);
  document.querySelector(`.nav`).classList.toggle(`active-nav`);
});

var swiper = new Swiper(".swiper-container", {
  loop: true,
  slidesPerView: 6,
  speed: 1000,
  spaceBetween: 0,
  autoplay: {
    delay: 500,
    disableOnInteraction: false,
    pauseOnMouseEnter: false,
    reverseDirection: false,
    stopOnLastSlide: false,
    waitForTransition: true,
  },
  breakpoints: {
    // when window width is >= 640px
    0: {
      slidesPerView: 2,
    },
    // when window width is >= 768px
    768: {
      slidesPerView: 6,
    },
  },
});
