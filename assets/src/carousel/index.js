/*
 * Copyright 2020 Google LLC
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

  const navArrows = {
    prev: '.glider-prev',
    next: '.glider-next',
  };

  // This is to add basic support for the RTL. We switch the nav arrows.
  const navArrowsRTL = {
    prev: '.glider-next',
    next: '.glider-prev',
  };

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
    if (e) {
      e.preventDefault();
    }

    let originalSlide = slide;
    ++this.animate_id;

    if (dot === true) {
      slide = slide * this.containerWidth;
      slide = Math.round(slide / this.itemWidth) * this.itemWidth;
    } else {
      if (typeof slide === 'string') {
        let backwards = slide === 'prev';

        // use precise location if fractional slides are on
        if (this.opt.slidesToScroll % 1 || this.opt.slidesToShow % 1) {
          slide = this.getCurrentSlide();
        } else {
          slide = this.slide;
        }

        if (isRTL) {
          if (backwards) {
            slide += this.opt.slidesToScroll;
          } else {
            slide -= this.opt.slidesToScroll;
          }
        } else {
          if (backwards) {
            slide -= this.opt.slidesToScroll;
          } else {
            slide += this.opt.slidesToScroll;
          }
        }

        if (this.opt.rewind) {
          let scrollLeft = this.ele.scrollLeft;
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
    /* eslint-disable-next-line no-new -- we do not store the object as no further computation required with the built object. */
    new Glider(carouselWrapper, {
      // Mobile-first defaults
      slidesToShow: 1,
      slidesToScroll: 1,
      scrollLock: true,
      arrows: !isRTL ? navArrows : navArrowsRTL,
      responsive: [
        {
          // screens greater than >= 775px
          breakpoint: 775,
          settings: {
            // Set to `auto` and provide item width to adjust to viewport
            slidesToShow: 'auto',
            slidesToScroll: 'auto',
            itemWidth: carouselWrapper.querySelector(
              '.web-stories-list__story-placeholder'
            ).offsetWidth,
            duration: 0.25,
          },
        },
      ],
    });
  });
});
