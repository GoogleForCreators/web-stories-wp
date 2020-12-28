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

  if (!carouselWrappers.length) {
    return;
  }

  Array.from(carouselWrappers).forEach((carouselWrapper) => {
    /* eslint-disable-next-line no-new -- we do not store the object as no further computation required with the built object. */
    new Glider(carouselWrapper, {
      // Mobile-first defaults
      slidesToShow: 1,
      slidesToScroll: 1,
      scrollLock: true,
      arrows: {
        prev: '.glider-prev',
        next: '.glider-next',
      },
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
