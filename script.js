import { Slider } from './slider.js';

const slider = new Slider({
  slider: '.slider',
  track: '.slides',
  slidesToShow: 1,
  slidesToScroll: 1,
  infinite: true,
  arrows: true,
  buttonPrev: '.control.prev',
  buttonNext: '.control.next',
});
