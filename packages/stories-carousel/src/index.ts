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

__webpack_public_path__ = window.webStoriesCarouselSettings.publicPath;

document.addEventListener('DOMContentLoaded', () => {
  void (async () => {
    // Do not initialize Glider.js if browser supports CSS carousels.
    if (CSS.supports('scroll-marker-group: after')) {
      return;
    }

    const carouselWrappers: NodeListOf<HTMLElement> = document.querySelectorAll(
      '.web-stories-list__carousel'
    );

    const isRTL =
      window.webStoriesCarouselSettings.config.isRTL ||
      'rtl' === document.documentElement.getAttribute('dir');

    if (!carouselWrappers.length) {
      return;
    }

    const { default: Glider } = await import(
      /* webpackChunkName: "chunk-web-stories-glider" */ '@web-stories-wp/glider' // @ts-expexct-error
    );

    carouselWrappers.forEach((carouselWrapper: HTMLElement) => {
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
        carouselWrapper.querySelector(
          '.web-stories-list__story'
        ) as unknown as HTMLElement
      );

      const itemWidth =
        Number.parseFloat(itemStyle.width) +
        (Number.parseFloat(itemStyle.marginLeft) +
          Number.parseFloat(itemStyle.marginRight));

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
          slidesToShow: 'auto',
          slidesToScroll: 'auto',
          itemWidth,
          duration: 0.25,
          scrollLock: true,
          arrows: navArrows,
        });
      }
    });
  })();
});
