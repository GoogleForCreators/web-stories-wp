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
 * Internal dependencies
 */
import {
  calculateLuminanceFromRGB,
  calculateLuminanceFromStyleColor,
  checkContrastFromLuminances,
} from '../../../utils/contrastUtils';
import getBoundRect from '../../../utils/getBoundRect';
import { MESSAGES, PRE_PUBLISH_MESSAGE_TYPES } from '../constants';
import { PAGE_RATIO, FULLBLEED_RATIO } from '../../../constants';
import { getBox } from '../../../units/dimensions';
import getMediaSizePositionProps from '../../../elements/media/getMediaSizePositionProps';
import { setOrCreateImage } from '../../../utils/getMediaBaseColor';

const MAX_PAGE_LINKS = 3;
const LINK_TAPPABLE_REGION_MIN_WIDTH = 48;
const LINK_TAPPABLE_REGION_MIN_HEIGHT = 48;

/**
 * @typedef {import('../../../types').Page} Page
 * @typedef {import('../../../types').Element} Element
 * @typedef {import('../types').Guidance} Guidance
 * @typedef {import('../types').Page} Page
 */

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
 * @param {Element} element The text element being checked for warnings
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function textElementFontLowContrast(element) {
  if (element.backgroundTextMode === 'NONE' || !element.backgroundColor) {
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
    if (!span.style?.color) {
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
      message: MESSAGES.ACCESSIBILITY.LOW_CONTRAST.MAIN_TEXT,
      help: MESSAGES.ACCESSIBILITY.LOW_CONTRAST.HELPER_TEXT,
      elementId: element.id,
      type: PRE_PUBLISH_MESSAGE_TYPES.WARNING,
    };
  }

  return undefined;
}

const STYLES = {
  boxSizing: 'border-box',
  visibility: 'hidden',
  position: 'fixed',
  contain: 'layout paint',
  top: '-9999px',
  left: '-9999px',
  zIndex: -1,
};

const BASE_COLOR_NODE = '__WEB_STORIES_BASE_COLOR__';

export function getImagePartData(bgImgNode, overlapBox) {
  const src = bgImgNode.src;
  return new Promise((resolve, reject) => {
    let imgNode = document.body[BASE_COLOR_NODE];
    if (!imgNode) {
      imgNode = document.createElement('div');
      imgNode.id = '__web-stories-base-color';
      Object.assign(imgNode, STYLES);
      document.body.appendChild(imgNode);
      document.body[BASE_COLOR_NODE] = imgNode;
    }
    imgNode.innerHTML = '';

    const img = new Image();
    // Necessary to avoid tainting canvas with CORS image data.
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const node = document.body[BASE_COLOR_NODE];
      try {
        const canvas = document.createElement('canvas');
        canvas.width = bgImgNode.width;
        canvas.height = bgImgNode.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          node.firstElementChild,
          0,
          0,
          bgImgNode.width,
          bgImgNode.height
        );
        const imageData = ctx.getImageData(
          overlapBox.x,
          overlapBox.y,
          overlapBox.width,
          overlapBox.height
        );
        resolve(imageData);
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = (e) => {
      reject(new Error('set image error: ' + e.message));
    };

    img.src = src;
    imgNode.appendChild(img);
  });
}

function getOverlapBgColor(bgImage, overlapBox) {
  return getImagePartData(bgImage, overlapBox)
    .then((imgData) => {
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = overlapBox.width; // size of the new image / text container
      cropCanvas.height = overlapBox.height;
      const cropCtx = cropCanvas.getContext('2d');
      const cropImage = new Image();
      cropImage.crossOrigin = 'anonymous';
      cropCtx.putImageData(imgData, 0, 0);
      cropImage.src = cropCanvas.toDataURL();
      return setOrCreateImage(cropImage.src);
    })
    .catch(() => {
      // ignore errors for now
    });
}

/**
 * Check story for a background image and text elements.
 * Check the luminosity of the dominant color of the background image part where the text element is.
 * Check the contrast of that luminosity against the luminosity of the text color.
 * If the contrast is too low, return guidance. Otherwise return undefined.
 *
 * @param {Page} page
 * @return {Guidance|undefined} The guidance object for consumption
 */

export function pageBackgroundWithTextLowContrast(page) {
  const { pageSize } = page;
  const safeZoneDiff =
    (pageSize.width / FULLBLEED_RATIO - pageSize.width / PAGE_RATIO) / 2;
  page.elements.map((element, index) => {
    if (element.type === 'text') {
      const textBox = getBox(element, pageSize.width, pageSize.height);
      const textBoxBound = getBoundRect([textBox]);
      const potentialBackgroundElements = page.elements.slice(0, index);

      // todo: generalize for any image or shape behind text
      // let mostVisuallySignificantOverlap;

      potentialBackgroundElements.forEach((bgElem) => {
        if (bgElem.type === 'image' && bgElem.isBackground) {
          const { resource, scale, focalX, focalY } = bgElem;
          const bgBox = getBox(bgElem, pageSize.width, pageSize.height);
          const { width, height } = bgBox;

          const bgMediaSize = getMediaSizePositionProps(
            resource,
            width,
            height,
            scale,
            focalX,
            focalY
          );

          const overlapBox = {
            x: Math.abs(bgMediaSize.offsetX) + Math.abs(textBoxBound.startX),
            y:
              Math.abs(bgMediaSize.offsetY) +
              Math.abs(textBoxBound.startY + safeZoneDiff),
            width: textBoxBound.width,
            height: textBoxBound.height,
          };

          const [bgImage] = document.querySelectorAll(
            `[data-element-id="${bgElem.id}"] img`
          );

          getOverlapBgColor(
            bgImage,
            overlapBox
            // eslint-disable-next-line no-console
          ).then((colors) => console.log('stolen colors: ', colors));
        }
      });
    }
  });

  return undefined;
}

/**
 * Check text element for font size too small (<12)
 *
 * @param {Element} element The text element being checked for warnings
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function textElementFontSizeTooSmall(element) {
  if (element.fontSize && element.fontSize < 12) {
    return {
      message: MESSAGES.ACCESSIBILITY.FONT_TOO_SMALL.MAIN_TEXT,
      help: MESSAGES.ACCESSIBILITY.FONT_TOO_SMALL.HELPER_TEXT,
      elementId: element.id,
      type: PRE_PUBLISH_MESSAGE_TYPES.WARNING,
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
  const scaleMultiplier = element.scale / 100;
  if (
    element.width * scaleMultiplier > element.resource?.sizes?.full?.width ||
    element.height * scaleMultiplier > element.resource?.sizes?.full?.height
  ) {
    return {
      message: MESSAGES.ACCESSIBILITY.LOW_IMAGE_RESOLUTION.MAIN_TEXT,
      help: MESSAGES.ACCESSIBILITY.LOW_IMAGE_RESOLUTION.HELPER_TEXT,
      elementId: element.id,
      type: PRE_PUBLISH_MESSAGE_TYPES.WARNING,
    };
  }

  return undefined;
}

/**
 * Check video element for doesn’t include description.
 *
 * @param {Element} element The video element being checked for warnings
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function videoElementMissingDescription(element) {
  if (!element.alt?.length && !element.resource?.alt?.length) {
    return {
      message: MESSAGES.ACCESSIBILITY.MISSING_VIDEO_DESCRIPTION.MAIN_TEXT,
      help: MESSAGES.ACCESSIBILITY.MISSING_VIDEO_DESCRIPTION.HELPER_TEXT,
      elementId: element.id,
      type: PRE_PUBLISH_MESSAGE_TYPES.WARNING,
    };
  }

  return undefined;
}

/**
 * Check video element for doesn’t include captions
 *
 * @param {Element} element The video element being checked for warnings
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function videoElementMissingCaptions(element) {
  if (!element.tracks?.length) {
    return {
      message: MESSAGES.ACCESSIBILITY.MISSING_CAPTIONS.MAIN_TEXT,
      help: MESSAGES.ACCESSIBILITY.MISSING_CAPTIONS.HELPER_TEXT,
      elementId: element.id,
      type: PRE_PUBLISH_MESSAGE_TYPES.WARNING,
    };
  }

  return undefined;
}

/**
 * Check page for too many links (more than 3)
 *
 * @param {Page} page The page being checked for warnings
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function pageTooManyLinks(page) {
  let linkCount = 0;
  page.elements.forEach((element) => {
    if (element.link?.url?.length) {
      linkCount += 1;
    }
  });

  if (linkCount > MAX_PAGE_LINKS) {
    return {
      message: MESSAGES.ACCESSIBILITY.TOO_MANY_LINKS.MAIN_TEXT,
      help: MESSAGES.ACCESSIBILITY.TOO_MANY_LINKS.HELPER_TEXT,
      pageId: page.id,
      type: PRE_PUBLISH_MESSAGE_TYPES.WARNING,
    };
  }

  return undefined;
}

/**
 * Check element with link for tappable region too small
 *
 * @param {Element} element The element being checked for warnings
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function elementLinkTappableRegionTooSmall(element) {
  if (!element.link?.url?.length) {
    return undefined;
  }

  if (
    element.width < LINK_TAPPABLE_REGION_MIN_WIDTH ||
    element.height < LINK_TAPPABLE_REGION_MIN_HEIGHT
  ) {
    return {
      message: MESSAGES.ACCESSIBILITY.LINK_REGION_TOO_SMALL.MAIN_TEXT,
      help: MESSAGES.ACCESSIBILITY.LINK_REGION_TOO_SMALL.HELPER_TEXT,
      elementId: element.id,
      type: PRE_PUBLISH_MESSAGE_TYPES.WARNING,
    };
  }

  return undefined;
}

/**
 * Check image element for missing alt text
 *
 * @param {Element} element The image element being checked for warnings
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function imageElementMissingAlt(element) {
  if (!element.alt?.length && !element.resource?.alt?.length) {
    return {
      message: MESSAGES.ACCESSIBILITY.MISSING_IMAGE_ALT_TEXT.MAIN_TEXT,
      help: MESSAGES.ACCESSIBILITY.MISSING_IMAGE_ALT_TEXT.HELPER_TEXT,
      elementId: element.id,
      type: PRE_PUBLISH_MESSAGE_TYPES.WARNING,
    };
  }

  return undefined;
}
