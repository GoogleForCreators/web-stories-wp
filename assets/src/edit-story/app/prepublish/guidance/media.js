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
import { PAGE_HEIGHT, PAGE_WIDTH } from '../../../constants';

const SAFE_ZONE_AREA = PAGE_HEIGHT * PAGE_WIDTH;

const MAX_VIDEO_LENGTH_SECONDS = 60;
const MAX_VIDEO_WIDTH = 3840;
const MAX_VIDEO_HEIGHT = 2160;
const MIN_VIDEO_HEIGHT = 480;
const MIN_VIDEO_WIDTH = 852;

// todo: get video frames per second
// MIN_VIDEO_FPS = 24;
// export function videoElementFps(element) {}

export function mediaElementSizeOnPage(element) {
  // get the intersecting area of the element's rectangle and the safe zone's rectangle
  const safeZone = {
      left: 0,
      right: PAGE_WIDTH,
      bottom: PAGE_HEIGHT,
      top: 0,
    },
    elemRect = {
      left: element.x,
      right: element.x + element.width,
      bottom: element.y + element.height,
      top: element.y,
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
      type: 'guidance',
      elementId: element.id,
      message:
        element.type === 'video'
          ? __(`Video is too small on the page`, 'web-stories')
          : __(`Image is too small on the page`, 'web-stories'),
    };
  }

  return undefined;
}

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
    element.resource.full.height <= MIN_VIDEO_HEIGHT &&
    element.resource.full.width <= MIN_VIDEO_WIDTH;
  const videoResolutionHigh =
    element.resource.full.height >= MAX_VIDEO_HEIGHT &&
    element.resource.full.width >= MAX_VIDEO_WIDTH;

  if (videoResolutionHigh) {
    return {
      type: 'guidance',
      elementId: element.id,
      message: __(
        "Video's resolution is too high to display on most mobile devices (>4k)",
        'web-stories'
      ),
    };
  }

  if (videoResolutionLow) {
    return {
      type: 'guidance',
      elementId: element.id,
      message: __('Video has low resolution', 'web-stories'),
    };
  }

  return undefined;
}

function imageElementResolution(element) {
  const heightResTooLow =
    element.resource.sizes.full.height < 2 * element.height;
  const widthResTooLow = element.resource.sizes.full.width < 2 * element.width;

  if (heightResTooLow || widthResTooLow) {
    return {
      type: 'guidance',
      elementId: element.id,
      message: __('Image has low resolution', 'web-stories'),
    };
  }
  return undefined;
}

function gifElementResolution(element) {
  // gif/output uses the MP4 video provided by the 3P Media API for displaying gifs
  const heightResTooLow =
    element.resource.output.sizes.mp4.full.height < 2 * element.height;
  const widthResTooLow =
    element.resource.output.sizes.mp4.full.width < 2 * element.width;

  if (heightResTooLow || widthResTooLow) {
    return {
      type: 'guidance',
      elementId: element.id,
      message: __('GIF has low resolution', 'web-stories'),
    };
  }
  return undefined;
}

export function videoElementLength(element) {
  if (element.resource.length > MAX_VIDEO_LENGTH_SECONDS) {
    return {
      type: 'guidance',
      elementId: element.id,
      message: __(
        'Video is longer than 1 minute (suggest breaking video up into multiple segments)',
        'web-stories'
      ),
    };
  }
  return undefined;
}
