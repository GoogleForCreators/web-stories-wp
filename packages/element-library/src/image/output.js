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
import PropTypes from 'prop-types';
import { calculateSrcSet, isBlobURL } from '@googleforcreators/media';
import {
  PAGE_WIDTH,
  FULLBLEED_HEIGHT,
  FULLBLEED_RATIO,
} from '@googleforcreators/units';
import { StoryPropTypes } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import MediaOutput from '../media/output';

/**
 * Returns AMP HTML for saving into post content for displaying in the FE.
 *
 * @param {Object<*>} props Props.
 * @return {*} Rendered component.
 */
function ImageOutput({ element, box, flags }) {
  const { alt, isBackground, resource, width, height, scale } = element;

  const props = {
    layout: 'fill',
    src: flags?.allowBlobs || !isBlobURL(resource.src) ? resource.src : '',
    alt: alt !== undefined ? alt : resource.alt,
  };

  const srcSet = calculateSrcSet(resource);
  if (srcSet) {
    props.srcSet = srcSet;

    // `width` of background elements reflects their original size.
    // We need to account for both aspect-scale-to-fit background and element scale level.
    let displayWidth = width;
    if (isBackground) {
      const aspectRatio = width / height;
      const widthAsBackground =
        aspectRatio <= FULLBLEED_RATIO
          ? PAGE_WIDTH
          : aspectRatio * FULLBLEED_HEIGHT;
      displayWidth = widthAsBackground * (scale / 100);
    }

    // If `srcset` exists but `sizes` doesn't, amp-img will generate a sizes attribute
    // with best-guess values that can result in poor image selection.
    const imageWidthPercent = displayWidth / PAGE_WIDTH;
    const mobileWidth = Math.round(imageWidthPercent * 100) + 'vw';
    // Width of a story page in desktop mode is 45vh.
    const desktopWidth = Math.round(imageWidthPercent * 45) + 'vh';
    // 1024px is the minimum width for STAMP desktop mode.
    props.sizes = `(min-width: 1024px) ${desktopWidth}, ${mobileWidth}`;

    // Prevent inline `width` style from being inserted by AMP (due to presence of `sizes` attribute),
    // which avoids an undesirable interaction between AMP and the Optimizer's SSR transforms.
    // See https://github.com/googleforcreators/web-stories-wp/pull/8099#issuecomment-870987667.
    props['disable-inline-width'] = true;
  }

  return (
    <MediaOutput box={box} element={element} data-leaf-element="true">
      <amp-img {...props} />
    </MediaOutput>
  );
}

ImageOutput.propTypes = {
  element: StoryPropTypes.elements.image.isRequired,
  box: StoryPropTypes.box.isRequired,
  flags: PropTypes.object,
};

export default ImageOutput;
