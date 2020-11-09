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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  calculateLuminanceFromRGB,
  calculateLuminanceFromStyleColor,
  checkContrastFromLuminances,
} from '../../utils/contrastUtils';

const MAX_PAGE_LINKS = 3;
const LINK_TAPPABLE_REGION_MIN_WIDTH = 48;
const LINK_TAPPABLE_REGION_MIN_HEIGHT = 48;

let spansFromContentBuffer;
function getSpansFromContent(content) {
  // memoize buffer
  if (!spansFromContentBuffer) {
    spansFromContentBuffer = document.createElement('div');
  }

  spansFromContentBuffer.innerHTML = content;

  // return Array instead of HtmlCollection
  return Array.prototype.slice.call(
    spansFromContentBuffer.getElementsByTagName('span')
  );
}

/**
 * Check text element for low contrast between font and background color
 *
 * @param  {Object} element Element object
 * @return {Object} Prepublish check response
 */
export function textElementFontLowContrast(element) {
  if (
    element.type !== 'text' ||
    element.backgroundTextMode === 'NONE' ||
    !element.backgroundColor
  ) {
    return undefined;
  }

  // get background luminance from text fill
  // @todo: look for background image/color
  const backgroundLuminance = calculateLuminanceFromRGB(
    element.backgroundColor.color
  );

  // check all spans for contrast ratios that don't pass verification
  const spans = getSpansFromContent(element.content);
  let lowContrast = spans.some((span) => {
    if (!span.style || !span.style.color) {
      return false;
    }

    const textLuminance = calculateLuminanceFromStyleColor(span.style.color);

    const contrastCheck = checkContrastFromLuminances(
      textLuminance,
      backgroundLuminance,
      element.fontSize
    );
    return !contrastCheck.WCAG_AA;
  });

  if (lowContrast) {
    return {
      message: __(
        'Low contrast between font and background color',
        'web-stories'
      ),
      elementId: element.id,
      type: 'warning',
    };
  }

  return undefined;
}

/**
 * Check text element for font size too small (<12)
 *
 * @param  {Object} element Element object
 * @return {Object} Prepublish check response
 */
export function textElementFontSizeTooSmall(element) {
  if (element.type !== 'text') {
    return undefined;
  }

  if (element.fontSize && element.fontSize < 12) {
    return {
      message: __('Font size too small', 'web-stories'),
      elementId: element.id,
      type: 'warning',
    };
  }

  return undefined;
}

/**
 * Check image element for very low image resolution: actual image asset on screen, at the current zoom,
 * offers <1x pixel density (guideline is to strive for >828 x 1792)
 *
 * @param  {Object} element Element object
 * @return {Object} Prepublish check response
 */
export function imageElementLowResolution(element) {
  if (element.type !== 'image') {
    return undefined;
  }

  const scaleMultiplier = element.scale / 100;
  if (
    element.width * scaleMultiplier > element.resource.width ||
    element.height * scaleMultiplier > element.resource.height
  ) {
    return {
      message: __('Very low image resolution', 'web-stories'),
      elementId: element.id,
      type: 'warning',
    };
  }

  return undefined;
}

/**
 * Check video element for doesn’t include title
 *
 * @param  {Object} element Element object
 * @return {Object} Prepublish check response
 */
export function videoElementMissingTitle(element) {
  if (element.type !== 'video') {
    return undefined;
  }

  if (!element.title || !element.title.length) {
    return {
      message: __('Video is missing title', 'web-stories'),
      elementId: element.id,
      type: 'warning',
    };
  }

  return undefined;
}

/**
 * Check video element for doesn’t include assistive text
 *
 * @param  {Object} element Element object
 * @return {Object} Prepublish check response
 */
export function videoElementMissingAlt(element) {
  if (element.type !== 'video') {
    return undefined;
  }

  if (!element.alt || !element.alt.length) {
    return {
      message: __('Video is missing assistive text', 'web-stories'),
      elementId: element.id,
      type: 'warning',
    };
  }

  return undefined;
}

/**
 * Check video element for doesn’t include captions
 *
 * @param  {Object} element Element object
 * @return {Object} Prepublish check response
 */
export function videoElementMissingCaptions(element) {
  if (element.type !== 'video') {
    return undefined;
  }

  if (!element.tracks || !element.tracks.length) {
    return {
      message: __('Video is missing captions', 'web-stories'),
      elementId: element.id,
      type: 'warning',
    };
  }

  return undefined;
}

/**
 * Check page for too many links (more than 3)
 *
 * @param  {Object} page Page object
 * @return {Object} Prepublish check response
 */
export function pageTooManyLinks(page) {
  let linkCount = 0;
  page.elements.forEach((element) => {
    if (element.link && element.link.url && element.link.url.length) {
      linkCount += 1;
    }
  });

  if (linkCount > MAX_PAGE_LINKS) {
    return {
      message: __('Too many links on page', 'web-stories'),
      pageId: page.id,
      type: 'warning',
    };
  }

  return undefined;
}

/**
 * Check element with link for tappable region too small
 *
 * @param  {Object} element Element object
 * @return {Object} Prepublish check response
 */
export function elementLinkTappableRegionTooSmall(element) {
  const hasLink = element.link && element.link.url && element.link.url.length;
  if (!hasLink) {
    return undefined;
  }

  if (
    element.width < LINK_TAPPABLE_REGION_MIN_WIDTH ||
    element.height < LINK_TAPPABLE_REGION_MIN_HEIGHT
  ) {
    return {
      message: __('Link tappable region is too small', 'web-stories'),
      elementId: element.id,
      type: 'warning',
    };
  }

  return undefined;
}

/**
 * Check image element for missing alt text
 *
 * @param  {Object} element Element object
 * @return {Object} Prepublish check response
 */
export function imageElementMissingAlt(element) {
  if (element.type !== 'image') {
    return undefined;
  }

  if (!element.alt || !element.alt.length) {
    return {
      message: __('Image is missing alt text', 'web-stories'),
      elementId: element.id,
      type: 'warning',
    };
  }

  return undefined;
}
