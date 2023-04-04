'use strict';

///////////////////////////////////////
// Modal window
//It's good to have these at the top, good practice

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page Navigation (aka using Event delegation )
document.querySelector('.nav__link').addEventListener('click', function (e) {
  e.preventDefault();

  //matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabs, and when clicked on, content will appears as related

//Use event delegation to help not slow down the page because the function will be repeated for a few elements
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard clause: An if statement which will return early if some condition is matched.
  if (!clicked) return;
  //none of the code will be executed if this statement is true

  //Active tab
  //removing all the popped up tabs and contents
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // When the tab is clicked, that tab still move up. Aka active.
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    // We're going to the parents to look for those siblings
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation: Intersection Observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// This is used to calculate the navigation bar height relating to the viewport

const stickyNav = function (entries) {
  const [entry] = entries;
  // We don't need to loop over it because we only have 1 entry in the headerObserver function

  if (!entry.isIntersecting) nav.classList.add('sticky');
  // This means: when the target isn't intersecting the root, then we want the sticky class to be applied.
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  // We use null here because we are interested in the entire viewport
  threshold: 0,
  // 0 because we want the nav bar to show as soon as it sctools completely out of view
  rootMargin: `-${navHeight}px`,
  // A box of X px that will be applied outside of our target element.
  //Percentage and rem don't work as a unit here. ONLY PX!!!
  // Not good to have this hardcoded since usually we want to create a responsive website
});

headerObserver.observe(header);

// AKA this whole section means: When the distance between the start of the 'Feature' section/the end of the header section and the viewport is the same as the navigation

// Reveal sections
// The animations are achieved through CSS, so we are just showing and hiding those animations
const allSections = document.querySelectorAll('.section');
// We're observing all sections through this selection.

//ObsCallback
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  // This means: when the target isn't intersecting the root, the function will not run. And skip to the rest of the code.

  entry.target.classList.remove('section--hidden');
  // This is the way of knowing which section is intersecting with the viewport at the moment.
  // We are removing 'section--hidden' as we approach each section. (as in the HTMl script)
  observer.unobserve(entry.target);
};

//ObsOptions
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

//There is no big difference into going next and previous slides,
//we just needs to minus instead of adding 
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
/*


btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();

  ///////////////////
  .getBoundingClientRect() = showes DOM rectangle that has the X & Y coordinate of the element in the page
  We need these coordinates here to tell JS where it should scroll to.

  //used to read the height and the width of the view port:
    console.log('height/width viewport', document.documentElement.clientHeight,document.documentElement.clientWidth)

  //Scrolling

    Interested coordinates: x/left=0 (don't want any horizontal scroll), y/top coordinates (this is where the section should start)
      window.scrollTo(s1coords.left, s1coords.top);
    They are always relative to the view port (when we're at the top), not the document.

    Solution to this: add the current scroll position of the section to the input.
      window.scrollTo(
      s1coords.left + window.pageXOffset,
      determined the absolute position of this element relative to the document
      s1coords.top + window.pageYOffset
      );

    Clearer code: 
      window.scrollTo({
        left: s1coords.left + window.pageXOffset,
        top: s1coords.top + window.pageYOffset,
        behaviour: 'smooth',
      });

  //Using in Modern broswers ONLY
  section1.scrollIntoView({ behaviour: 'smooth' });
});

// Orginal way for page navigation
document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});

*/
