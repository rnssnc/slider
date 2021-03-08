class Slider {
  constructor(options = {}) {
    this.slider = document.querySelector(options.slider);
    this.track = document.querySelector(options.track);
    this.arrows = options.arrows;
    this.slidesToShow = options.slidesToShow;
    this.slidesToScroll = options.slidesToScroll;
    this.infinite = options.infinite;
    this.slides = this.track.children;
    this.transitionTime = 0.7;

    this.sliderWidth = this.slider.getBoundingClientRect().width;
    this.slideWidth = this.sliderWidth / this.slidesToShow;

    this.defaultTranslate = 0;
    this.defaultLength = this.slides.length;
    this.transformValue = 0;
    this.widthWithoutClones = this.slides.length * this.slideWidth;
    this.index = this.slidesToShow;

    if (this.infinite) {
      // Add clones
      this.addClones(this.slidesToShow);
      this.transformValue = this.defaultTranslate;
      // Listeners
      this.buttonNext = document.querySelector('.control.next').addEventListener('click', (e) => {
        if (this.track.style.transition != null)
          if (this.index < this.slides.length - this.slidesToShow)
            this.shiftSlide(this.slidesToScroll) || e.preventDefault();
      });

      this.buttonPrev = document.querySelector('.control.prev').addEventListener('click', (e) => {
        if (this.track.style.transition != null)
          if (this.index >= this.slidesToShow) this.shiftSlide(-this.slidesToScroll) || e.preventDefault();
      });
    } else {
      this.buttonNext = document.querySelector('.control.next').addEventListener('click', (e) => {
        if (this.index < this.slides.length) this.shiftSlide(1) || e.preventDefault();
      });

      this.buttonPrev = document.querySelector('.control.prev').addEventListener('click', (e) => {
        if (this.index > this.slidesToShow) this.shiftSlide(-1) || e.preventDefault();
      });
    }

    this.setTrackWidth(this.track);

    this.track.addEventListener('transitionend', (e) => {
      if (e.propertyName == 'transform') {
        this.track.style.transition = null;
        if (this.infinite && this.index == this.slides.length - this.slidesToShow) {
          this.transformValue = this.defaultTranslate;
          this.track.style.transform = `translateX(${this.defaultTranslate}px)`;
          this.index = this.slidesToShow;
        } else if (this.infinite && this.index == 0) {
          this.transformValue = -this.widthWithoutClones;
          this.track.style.transform = `translateX(${-this.widthWithoutClones}px)`;
          this.index = this.defaultLength;
        }
      }
    });

    // createTrack();
    this.fitSlides(this.slides);
  }

  addClones(slidesToShow) {
    let appendNode = [];
    let prependNode = [];

    for (let i = 0; i < slidesToShow; i++) {
      let appendClone = this.slides[i].cloneNode(true);
      let prependClone = this.slides[this.slides.length - (i + 1)].cloneNode(true);
      appendClone.classList.add('clone');
      prependClone.classList.add('clone');

      appendNode.push(appendClone);
      prependNode.push(prependClone);
      this.defaultTranslate -= this.slideWidth;
    }
    this.track.append(...appendNode);
    this.track.prepend(...prependNode);
    this.track.style.transform = `translateX(${this.defaultTranslate}px)`;
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
    this.track.style.transition = `transform ${this.transitionTime}s`;
    this.track.style.transform = `translateX(${this.transformValue}px)`;
    this.index += count;
  }
}

const slider = new Slider({
  slider: '.slider',
  track: '.slides',
  slidesToShow: 1,
  slidesToScroll: 1,
  infinite: true,
});
