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
import { PAGE_HEIGHT, PAGE_WIDTH } from '../../../constants';
import getBoundRect from '../../../utils/getBoundRect';
import { MESSAGES, PRE_PUBLISH_MESSAGE_TYPES } from '../constants';

const SAFE_ZONE_AREA = PAGE_HEIGHT * PAGE_WIDTH;

const MAX_VIDEO_WIDTH = 3840;
const MAX_VIDEO_HEIGHT = 2160;
const MIN_VIDEO_HEIGHT = 480;
const MIN_VIDEO_WIDTH = 852;

const MAX_VIDEO_LENGTH_SECONDS = 60;

/**
 * @typedef {import('../../../types').Page} Page
 * @typedef {import('../../../types').Element} Element
 * @typedef {import('../types').Guidance} Guidance
 */

/**
 * Compare an element's size to the safe zone area it is overlapping
 * If the element takes up <50% of the safe zone, return guidance. Otherwise return undefined.
 *
 * @param {Element} element The element being checked for guidelines
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function mediaElementSizeOnPage(element) {
  // Background elements behave differently since they will always be full screen. They have rect
  // information that's not valid when the image is applied as a background.
  if (element.isBackground) {
    return undefined;
  }

  // use the bounding rectangle for rotated elements
  const { startX, startY, endX, endY } = getBoundRect([element]);
  // get the intersecting area of the element's rectangle and the safe zone's rectangle
  const safeZone = {
      left: 0,
      right: PAGE_WIDTH,
      bottom: PAGE_HEIGHT,
      top: 0,
    },
    elemRect = {
      left: startX,
      right: endX,
      bottom: endY,
      top: startY,
    };
  const xOverlap = Math.max(
    0,
    Math.min(safeZone.right, elemRect.right) -
      Math.max(safeZone.left, elemRect.left)
  );
  const yOverlap = Math.max(
    0,
    Math.min(safeZone.bottom, elemRect.bottom) -
      Math.max(safeZone.top, elemRect.top)
  );

  const elementArea = xOverlap * yOverlap;

  const isTooSmallOnPage = elementArea < SAFE_ZONE_AREA / 2;

  if (isTooSmallOnPage) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
      elementId: element.id,
      message: MESSAGES.MEDIA.VIDEO_IMAGE_TOO_SMALL_ON_PAGE.MAIN_TEXT,
      help: MESSAGES.MEDIA.VIDEO_IMAGE_TOO_SMALL_ON_PAGE.HELPER_TEXT,
    };
  }

  return undefined;
}

/**
 * If there is only one video on the page, check it for its size on the page.
 *
 * Note: when using this check, make sure not to check video elements individually to avoid
 * duplicate checks.
 *
 * @param {Page} page The page being checked
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function videoElementSizeOnPage(page) {
  const videoElementsOnPage = page.elements.filter(
    ({ type }) => type === 'video'
  );
  if (videoElementsOnPage.length === 1) {
    const [videoElement] = videoElementsOnPage;
    return {
      pageId: page.id,
      ...mediaElementSizeOnPage(videoElement),
    };
  }
  return undefined;
}

/**
 * Check an element's resolution. If the resolution is not within guidelines, return guidance.
 * Otherwise return undefined.
 *
 * @param {Element} element The element being checked
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function mediaElementResolution(element) {
  switch (element.type) {
    case 'image':
      return imageElementResolution(element);
    case 'video':
      return videoElementResolution(element);
    case 'gif':
      return gifElementResolution(element);
    default:
      throw new Error('Invalid media type');
  }
}

function videoElementResolution(element) {
  const videoResolutionLow =
    element.resource?.sizes?.full?.height <= MIN_VIDEO_HEIGHT &&
    element.resource?.sizes?.full?.width <= MIN_VIDEO_WIDTH;
  const videoResolutionHigh =
    element.resource?.sizes?.full?.height >= MAX_VIDEO_HEIGHT &&
    element.resource?.sizes?.full?.width >= MAX_VIDEO_WIDTH;

  if (videoResolutionHigh) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
      elementId: element.id,
      message: MESSAGES.MEDIA.VIDEO_RESOLUTION_TOO_HIGH.MAIN_TEXT,
      help: MESSAGES.MEDIA.VIDEO_RESOLUTION_TOO_HIGH.HELPER_TEXT,
    };
  }

  if (videoResolutionLow) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
      elementId: element.id,
      message: MESSAGES.MEDIA.VIDEO_RESOLUTION_TOO_LOW.MAIN_TEXT,
      help: MESSAGES.MEDIA.VIDEO_RESOLUTION_TOO_LOW.HELPER_TEXT,
    };
  }

  return undefined;
}

function imageElementResolution(element) {
  const heightResTooLow =
    element.resource?.sizes?.full?.height < 2 * element.height;
  const widthResTooLow =
    element.resource?.sizes?.full?.width < 2 * element.width;

  if (heightResTooLow || widthResTooLow) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
      elementId: element.id,
      message: MESSAGES.MEDIA.LOW_IMAGE_RESOLUTION.MAIN_TEXT,
      help: MESSAGES.MEDIA.LOW_IMAGE_RESOLUTION.HELPER_TEXT,
    };
  }
  return undefined;
}

function gifElementResolution(element) {
  // gif/output uses the MP4 video provided by the 3P Media API for displaying gifs
  const heightResTooLow =
    element.resource?.output?.sizes?.mp4?.full?.height < 2 * element.height;
  const widthResTooLow =
    element.resource?.output?.sizes?.mp4?.full?.width < 2 * element.width;

  if (heightResTooLow || widthResTooLow) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
      elementId: element.id,
      message: MESSAGES.MEDIA.LOW_IMAGE_RESOLUTION.MAIN_TEXT,
      help: MESSAGES.MEDIA.LOW_IMAGE_RESOLUTION.HELPER_TEXT,
    };
  }
  return undefined;
}

/**
 * Check a video element's length.
 * If the length is longer than 1 minute, return guidance. Otherwise return undefined.
 *
 * @param {Element} element The element being checked
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function videoElementLength(element) {
  if (element.resource?.length > MAX_VIDEO_LENGTH_SECONDS) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
      elementId: element.id,
      message: MESSAGES.MEDIA.VIDEO_TOO_LONG.MAIN_TEXT,
      help: MESSAGES.MEDIA.VIDEO_TOO_LONG.HELPER_TEXT,
    };
  }
  return undefined;
}
