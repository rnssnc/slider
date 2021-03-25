export default class Slider {
  constructor(options = {}) {
    this.slider = document.querySelector(options.slider);
    this.track = document.querySelector(options.track);
    this.centerMode = options.centerMode;
    this.arrows = options.arrows;
    this.slidesToShow = options.slidesToShow;
    this.slidesToScroll = options.slidesToScroll;
    this.infinite = options.infinite;
    this.variableWidth = options.variableWidth;
    this.slides = this.track.children;
    this.transitionTime = 0.3;

    this.startSlide = options.startSlide || 0;
    this.setupStyles();

    this.isClonesAdded = false;
    this.defaultLength = this.slides.length;

    this.setupSlider();

    if (options.responsive) {
      this.responsive = options.responsive;
      this.handleResposive(this.responsive);
    }

    if (this.arrows) {
      this.buttonNext = document.querySelector(options.buttonNext);
      this.buttonPrev = document.querySelector(options.buttonPrev);

      this.buttonNext.addEventListener('click', this.nextSlide);
      this.buttonPrev.addEventListener('click', this.prevSlide);
    }

    // this.shiftX = 0;
    // this.newLeft = 0;
    this.posX1 = 0;
    this.posX2 = 0;
    this.track.addEventListener('pointerdown', (e) => {
      if (this.track.style.transition == '') {
        e.preventDefault(); // prevent selection start (browser action)

        // this.shiftX = e.clientX - this.track.getBoundingClientRect().left;
        this.shiftX = 0;
        this.posX1 = e.clientX;
        this.track.setPointerCapture(e.pointerId);

        this.track.addEventListener('pointermove', this.handlePointerMove);
        document.addEventListener('pointerup', this.handlePointerUp);
      }
    });

    // window.addEventListener('resize', this.setupSlider);
  }
  setupSlider = () => {
    this.sliderWidth = this.slider.getBoundingClientRect().width;
    this.slideWidth = this.sliderWidth / this.slidesToShow;

    this.currentSlideIndex = this.startSlide;
    if (this.currentSlide) this.removeActiveState(this.currentSlide);
    this.previousSlide;

    this.defaultTranslate = 0;
    this.transformValue = 0;
    this.widthWithoutClones = this.defaultLength * this.slideWidth;

    if (this.centerMode) {
      console.log('check');
      this.index = this.startSlide + 1;
      this.edgeLimit = this.startSlide;
    } else {
      this.index = this.slidesToShow;
      this.edgeLimit = this.slidesToShow;
    }

    //Different listeners for infinite
    this.handleInfinite();

    this.track.style.transform = `translateX(${this.defaultTranslate}px)`;
    this.currentSlide = this.slides[this.currentSlideIndex];

    this.addActiveState(this.currentSlide);

    this.setTrackWidth(this.track);
    this.track.addEventListener('transitionend', this.handleTransitionEnd);

    // createTrack();
    if (!this.variableWidth) this.fitSlides(this.slides);
  };

  handleResposive = (responsiveOptions) => {
    for (const key in responsiveOptions) {
      const mediaQuery = window.matchMedia(
        `screen and (max-width: ${key}px) and (min-width: ${this.responsive[key]['from']}px)`,
      );
      const handleTabletChange = (e) => {
        // Check if the media query is true
        console.log(e);
        if (e.matches) {
          const obj = this.responsive[key];
          for (const key in obj) this[key] = obj[key];

          this.setupSlider();
        }
      };

      // Register event listener
      mediaQuery.addEventListener('change', handleTabletChange);

      // Initial check
      handleTabletChange(mediaQuery);
    }
  };

  setupStyles = () => {
    this.wrapSlides(this.slides);

    this.styles = document.createElement('link');
    this.styles.rel = 'stylesheet';
    this.styles.href = 'slider.css';
    document.head.append(this.styles);

    this.slider.classList.add('rnssnc-slider');
    this.track.classList.add('rnssnc-slides');
  };

  wrapSlides = (slides) => {
    [...slides].forEach((slide) => {
      const div = document.createElement('div');
      div.classList.add('rnssnc-slide');
      div.appendChild(slide);
      this.track.appendChild(div);
    });
  };

  addActiveState(currentSlide) {
    this.previousSlide = this.currentSlide;

    currentSlide.classList.add('slide-active');
    const newActiveState = new Event('newActiveState');
    this.slider.dispatchEvent(newActiveState);
  }

  removeActiveState(currentSlide) {
    currentSlide.classList.remove('slide-active');
  }

  handleInfinite = () => {
    if (this.infinite) {
      this.addClones(this.slidesToShow);
      this.transformValue = this.defaultTranslate;
      this.currentSlideIndex = +this.currentSlideIndex + this.slidesToShow;

      this.nextSlide = (e) => {
        if (this.index < this.slides.length - this.slidesToShow)
          this.shiftSlide(this.slidesToScroll) || e.preventDefault();
      };

      this.prevSlide = (e) => {
        if (this.index >= this.slidesToScroll)
          this.shiftSlide(-this.slidesToScroll) || e.preventDefault();
      };
    } else {
      this.nextSlide = (e) => {
        if (this.index <= this.slides.length - this.slidesToScroll)
          this.shiftSlide(this.slidesToScroll) || e.preventDefault();
        else {
          if (this.currentSlideIndex < this.slides.length - 1) {
            this.currentSlideIndex++;
            this.removeActiveState(this.currentSlide);
            this.currentSlide = this.slides[this.currentSlideIndex];
            this.addActiveState(this.currentSlide);
          }
        }
      };

      this.prevSlide = (e) => {
        if (this.index > this.edgeLimit)
          this.shiftSlide(-this.slidesToScroll) || e.preventDefault();
        else {
          if (this.currentSlideIndex > 0) {
            this.currentSlideIndex--;
            this.removeActiveState(this.currentSlide);
            this.currentSlide = this.slides[this.currentSlideIndex];
            this.addActiveState(this.currentSlide);
          }
        }
      };
    }
  };

  handlePointerUp = (e) => {
    this.track.removeEventListener('pointermove', this.handlePointerMove);
    if (this.infinite) {
      if (this.track.style.transition != null)
        if (this.transformValue + this.posX2 < this.transformValue) this.nextSlide(e);
        else if (this.transformValue + this.posX2 > this.transformValue) this.prevSlide(e);
    } else {
      if (this.transformValue + this.posX2 < this.transformValue) this.nextSlide(e);
      else if (this.transformValue + this.posX2 > this.transformValue) this.prevSlide(e);
    }
    this.posX1 = 0;
    this.posX2 = 0;

    this.track.releasePointerCapture(e.pointerId);
    document.removeEventListener('pointerup', this.handlePointerUp);
  };

  handlePointerMove = (e) => {
    // this.newLeft = e.clientX - this.shiftX - this.track.getBoundingClientRect().left;
    this.posX2 = e.clientX - this.posX1;
    // this.posX1 = e.clientX;

    // если указатель находится за пределами слайдера => отрегулировать "left", чтобы оставаться в пределах границ
    // if (this.newLeft < 0) {
    //   this.newLeft = 0;
    // }
    // let rightEdge = this.slider.offsetWidth - this.track.offsetWidth;
    // if (this.newLeft > this.rightEdge) {
    //   this.newLeft = this.rightEdge;
    // }

    // fix translateX while on first/last elem
    if (
      (this.index <= this.slidesToShow &&
        this.posX2 - this.slideWidth * this.slidesToScroll >= 0) ||
      (this.index == this.defaultLength && -this.posX2 >= this.slideWidth * this.slidesToShow)
    )
      return;
    if (!this.infinite)
      if (
        this.index === this.slides.length &&
        this.transformValue + this.posX2 <= this.transformValue
      )
        return;
      else if (
        this.index == this.slidesToShow &&
        this.transformValue + this.posX2 > this.transformValue
      )
        return;
    this.track.style.transform = `translateX(${this.transformValue + this.posX2}px)`;
  };

  handleTransitionEnd = (e) => {
    if (e.propertyName == 'transform') {
      this.track.style.transition = null;
      if (this.infinite && this.index == this.slides.length - this.slidesToShow) {
        this.transformValue = this.defaultTranslate;
        this.track.style.transform = `translateX(${this.defaultTranslate}px)`;
        this.index = this.slidesToShow;

        this.currentSlideIndex = +this.startSlide + +this.slidesToShow;
      } else if (this.infinite && this.index == 0) {
        this.transformValue = -this.widthWithoutClones;
        this.track.style.transform = `translateX(${-this.widthWithoutClones}px)`;
        this.index = this.defaultLength;

        this.currentSlideIndex = this.slides.length - this.slidesToShow - 2;
      }
      this.currentSlide = this.slides[this.currentSlideIndex];
      this.addActiveState(this.currentSlide);
    }
  };

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
    if (!this.isClonesAdded) {
      this.track.append(...appendNode);
      this.track.prepend(...prependNode.reverse());

      this.isClonesAdded = true;
    }
    // this.track.style.transform = `translateX(${this.defaultTranslate}px)`;
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

    this.currentSlideIndex = +this.currentSlideIndex + +count;
    this.removeActiveState(this.currentSlide);
  }
}
