class Slider {
  constructor(options = {}) {
    this.slider = document.querySelector(options.slider);
    this.track = document.querySelector(options.track);
    this.arrows = options.arrows;
    this.slidesToShow = options.slidesToShow;
    this.infinite = options.infinite;
    this.slides = this.track.children;

    this.sliderWidth = this.slider.getBoundingClientRect().width;
    this.slideWidth = this.sliderWidth / this.slidesToShow;

    this.transformValue = 0;
    this.index = this.slidesToShow;

    this.setTrackWidth(this.track);

    this.buttonNext = document.querySelector('.control.next').addEventListener('click', (e) => {
      if (this.index < this.slides.length) this.shiftSlide(1) || e.preventDefault();
    });

    this.buttonNext = document.querySelector('.control.prev').addEventListener('click', (e) => {
      if (this.index > this.slidesToShow) this.shiftSlide(-1) || e.preventDefault();
    });
    // createTrack();
    this.fitSlides(this.slides);
  }

  setTrackWidth(track) {
    track.style.width = `${this.slideWidth * this.slides.length}px`;
  }

  fitSlides(slides) {
    [...slides].forEach((slide) => {
      slide.style.width = `${this.slideWidth}px`;
    });
  }

  shiftSlide(count) {
    this.transformValue += -count * this.slideWidth;
    this.track.style.transform = `translateX(${this.transformValue}px)`;
    this.index += count;
  }
}

const slider = new Slider({
  slider: '.slider',
  track: '.slides',
  slidesToShow: 1,
  infinite: true,
});
