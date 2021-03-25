import Slider from './slider.js';

const slider = new Slider({
  slider: '.slider',
  track: '.slides',
  slidesToShow: 5,
  slidesToScroll: 1,
  startSlide: 1,
  // centerMode: true
  // variableWidth: true,
  infinite: false,
  arrows: true,
  buttonPrev: '.control.prev',
  buttonNext: '.control.next',
  // responsive: {
  //   1920: {
  //     from: 1201,
  //     slidesToShow: 4,
  //     startSlide: 1,
  //   },
  //   1200: {
  //     from: 801,
  //     slidesToShow: 2,
  //   },
  //   800: {
  //     from: 0,
  //     slidesToShow: 1,
  //     startSlide: 0,
  //   },
  // },
});

slider.slider.addEventListener('newActiveState', () => {
  console.log('wow ' + slider.currentSlideIndex);
});
