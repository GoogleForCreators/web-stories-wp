/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import Glider from 'glider-js';
import 'glider-js/glider.css';

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready';

domReady(() => {
  const carouselWrappers = document.querySelectorAll(
    '.web-stories-list__carousel'
  );

  const isRTL =
    window.webStoriesCarouselSettings.config.isRTL ||
    'rtl' === document.documentElement.getAttribute('dir');

  if (!carouselWrappers.length) {
    return;
  }

  /**
   * Override to add basic support for the nav arrows for RTL
   *
   * Glider-JS doesn't support RTL at the moment, this is to add basic
   * functioning support for the nav arrows as otherwise the nav arrows
   * becomes useless on RTL sites.
   *
   * @todo Maybe replace glider-js with other lightweight lib which has RTL support. or Replace it with 'amp-carousel' once we have the support.
   *
   * @param {Object|string} slide Slide arrow string based on action.
   * @param {boolean}       dot   Is dot navigation action.
   * @param {Object}        e     Event object.
   *
   * @return {boolean} Navigation done.
   */
  Glider.prototype.scrollItem = function (slide, dot, e) {
    // glider-js doesn't seem to pass right amount of arguments.
    if (e === undefined && dot?.target) {
      e = dot;
      dot = false;
    }

    if (e === undefined) {
      // Somehow we ended up triggering this function twice. Abort to prevent scrolling back and forth.
      return false;
    }

    if (e) {
      e.preventDefault();
    }

    // Somehow slidesToScroll and slidesToShow can end up being 0.
    this.opt.slidesToScroll = Math.max(1, this.opt.slidesToScroll);
    this.opt.slidesToShow = Math.max(1, this.opt.slidesToShow);
    // This will also cause this.itemWidth to be Infinity because division by zero returns Infinity in JS.
    // Update this.itemWidth with actual value in this case.
    if (this.itemWidth === Infinity) {
      // It's a sibling.
      const carouselWrapper = e.target.parentElement.querySelector(
        '.web-stories-list__carousel'
      );
      const itemStyle = window.getComputedStyle(
        carouselWrapper.querySelector('.web-stories-list__story')
      );

      this.itemWidth =
        parseFloat(itemStyle.width) +
        (parseFloat(itemStyle.marginLeft) + parseFloat(itemStyle.marginRight));
    }

    const originalSlide = slide;
    ++this.animate_id;

    if (dot === true) {
      slide = slide * this.containerWidth;
      slide = Math.round(slide / this.itemWidth) * this.itemWidth;
    } else {
      if (typeof slide === 'string') {
        const backwards = slide === 'prev';

        // use precise location if fractional slides are on
        if (this.opt.slidesToScroll % 1 || this.opt.slidesToShow % 1) {
          slide = this.getCurrentSlide();
        } else {
          slide = !isNaN(this.slide) ? this.slide : 0;
        }

        if (backwards) {
          slide -= this.opt.slidesToScroll;
        } else {
          slide += this.opt.slidesToScroll;
        }

        if (this.opt.rewind) {
          const scrollLeft = this.ele.scrollLeft;
          slide =
            backwards && !scrollLeft
              ? this.slides.length
              : !backwards &&
                scrollLeft + this.containerWidth >= Math.floor(this.trackWidth)
              ? 0
              : slide;
        }
      }

      slide = Math.min(slide, this.slides.length);

      this.slide = slide;
      slide = this.itemWidth * slide;
    }

    this.scrollTo(
      slide,
      this.opt.duration * Math.abs(this.ele.scrollLeft - slide),
      function () {
        this.updateControls();
        this.emit('animated', {
          value: originalSlide,
          type:
            typeof originalSlide === 'string' ? 'arrow' : dot ? 'dot' : 'slide',
        });
      }
    );

    return false;
  };

  Array.from(carouselWrappers).forEach((carouselWrapper) => {
    // For multiple instance of the glider we need to link nav arrows appropriately.
    const carouselId = carouselWrapper.dataset.id;

    const navArrows = !isRTL
      ? {
          prev: `.${carouselId} .glider-prev`,
          next: `.${carouselId} .glider-next`,
        }
      : {
          prev: `.${carouselId} .glider-next`,
          next: `.${carouselId} .glider-prev`,
        };

    const isCircles = carouselWrapper.classList.contains('circles');
    const itemStyle = window.getComputedStyle(
      carouselWrapper.querySelector('.web-stories-list__story')
    );

    const itemWidth =
      parseFloat(itemStyle.width) +
      (parseFloat(itemStyle.marginLeft) + parseFloat(itemStyle.marginRight));

    // For circles view we would want to keep it auto.
    if (isCircles) {
      /* eslint-disable-next-line no-new -- we do not store the object as no further computation required with the built object. */
      new Glider(carouselWrapper, {
        // Set to `auto` and provide item width to adjust to viewport
        slidesToShow: 'auto',
        slidesToScroll: 'auto',
        itemWidth,
        duration: 0.25,
        scrollLock: true,
        arrows: navArrows,
      });
    } else {
      // For Box Carousel we are showing single slide below tablets viewport.
      /* eslint-disable-next-line no-new -- we do not store the object as no further computation required with the built object. */
      new Glider(carouselWrapper, {
        // Mobile-first defaults
        slidesToShow: 1,
        slidesToScroll: 1,
        scrollLock: true,
        arrows: navArrows,
        responsive: [
          {
            // screens greater than >= 775px
            breakpoint: 775,
            settings: {
              // Set to `auto` and provide item width to adjust to viewport
              slidesToShow: 'auto',
              slidesToScroll: 'auto',
              itemWidth,
              duration: 0.25,
            },
          },
        ],
      });
    }
  });
});
