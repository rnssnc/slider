import Slider from './slider.js';

const slider = new Slider({
  slider: '.slider',
  track: '.slides',
  slidesToShow: 4,
  slidesToScroll: 1,
  infinite: false,
  arrows: true,
  buttonPrev: '.control.prev',
  buttonNext: '.control.next',
});
