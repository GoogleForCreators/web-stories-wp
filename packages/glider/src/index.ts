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
 * Override to add basic support for the nav arrows for RTL
 *
 * Glider-JS doesn't support RTL at the moment, this is to add basic
 * functioning support for the nav arrows as otherwise the nav arrows
 * become useless on RTL sites.
 *
 * @todo Maybe replace glider-js with other lightweight lib which has RTL support. or Replace it with 'amp-carousel' once we have the support.
 * @param slideIndex Slide arrow string based on action.
 * @param isActuallyDotIndex   Is dot navigation action.
 * @param e     Event object.
 * @return Navigation done.
 */
Glider.prototype.scrollItem = function (
  slideIndex: number,
  isActuallyDotIndex: boolean,
  e: Event
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- Workaround
  // @ts-ignore
  if (e === undefined && isActuallyDotIndex?.target) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- Workaround
    // @ts-ignore
    e = isActuallyDotIndex;
    isActuallyDotIndex = false;
  }

  if (e === undefined) {
    // Somehow we ended up triggering this function twice. Abort to prevent scrolling back and forth.
    return false;
  }

  if (e) {
    e.preventDefault();
  }

  // Somehow slidesToScroll and slidesToShow can end up being 0.
  this.opt.slidesToScroll = Math.max(1, this.opt.slidesToScroll as number);
  this.opt.slidesToShow = Math.max(1, this.opt.slidesToShow as number);
  // This will also cause this.itemWidth to be Infinity because division by zero returns Infinity in JS.
  // Update this.itemWidth with actual value in this case.
  if (this.itemWidth === Number.POSITIVE_INFINITY) {
    // It's a sibling.
    const carouselWrapper = (
      e.target as HTMLElement
    ).parentElement?.querySelector(
      '.web-stories-list__carousel'
    ) as HTMLElement;
    const itemStyle = window.getComputedStyle(
      carouselWrapper.querySelector(
        '.web-stories-list__story'
      ) as unknown as HTMLElement
    );

    this.itemWidth =
      Number.parseFloat(itemStyle.width) +
      (Number.parseFloat(itemStyle.marginLeft) +
        Number.parseFloat(itemStyle.marginRight));
  }

  const originalSlide = slideIndex;
  ++this.animate_id;

  if (isActuallyDotIndex === true) {
    slideIndex = slideIndex * this.containerWidth;
    slideIndex = Math.round(slideIndex / this.itemWidth) * this.itemWidth;
  } else {
    if (typeof slideIndex === 'string') {
      const backwards = slideIndex === 'prev';

      // use precise location if fractional slides are on
      if (this.opt.slidesToScroll % 1 || this.opt.slidesToShow % 1) {
        slideIndex = this.getCurrentSlide();
      } else {
        slideIndex = !isNaN(this.slide) ? this.slide : 0;
      }

      if (backwards) {
        slideIndex -= this.opt.slidesToScroll;
      } else {
        slideIndex += this.opt.slidesToScroll;
      }

      if (this.opt.rewind) {
        const scrollLeft = (this.ele as HTMLElement)
          .scrollLeft as unknown as number;
        slideIndex =
          backwards && !scrollLeft
            ? this.slides.length
            : !backwards &&
                scrollLeft + this.containerWidth >= Math.floor(this.trackWidth)
              ? 0
              : slideIndex;
      }
    }

    slideIndex = Math.min(slideIndex, this.slides.length);

    this.slide = slideIndex;
    slideIndex = this.itemWidth * slideIndex;
  }

  this.scrollTo(
    slideIndex,
    this.opt.duration *
      Math.abs((this.ele as HTMLElement).scrollLeft - slideIndex),
    function (this: Glider<HTMLElement>) {
      this.updateControls();
      this.emit('animated', {
        value: originalSlide,
        type:
          typeof originalSlide === 'string'
            ? 'arrow'
            : isActuallyDotIndex
              ? 'dot'
              : 'slide',
      });
    }
  );

  return false;
};

export default Glider;
