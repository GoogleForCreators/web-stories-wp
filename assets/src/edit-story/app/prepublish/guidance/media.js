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

const SAFE_ZONE_AREA = PAGE_HEIGHT * PAGE_WIDTH;

const MIN_PIXEL_DENSITY = 2;

const MAX_VIDEO_LENGTH_SECONDS = 60;
const MAX_VIDEO_WIDTH = 3840;
const MAX_VIDEO_HEIGHT = 2160;
const MIN_VIDEO_HEIGHT = 480;
const MIN_VIDEO_WIDTH = 852;

// todo: get video frames per second
// MIN_VIDEO_FPS = 24;
// export function videoElementFps(element) {}

const getChecklistMessage = (elementId, message) => ({
  type: 'guidance',
  elementId,
  message,
});

export function mediaElementSizeOnPage(element) {
  // triggered if only one video is on the page and it takes less than 50% of the safe zone area
  // encourage users to consider a more immersive media sizing and cropping.
  const elementArea = element.height * element.width;
  const isTooSmallOnPage = SAFE_ZONE_AREA / 2 > elementArea;

  if (isTooSmallOnPage) {
    const media = element.type === 'video' ? 'Video' : 'Image';
    return getChecklistMessage(element.id, `${media} is too small on the page`);
  }

  return undefined;
}

export function videoElementSizeOnPage(page) {
  const videoElementsOnPage = page.elements.filter(
    ({ type }) => type === 'video'
  );
  if (videoElementsOnPage.length === 1) {
    const [videoElement] = videoElementsOnPage;
    return mediaElementSizeOnPage(videoElement);
  }
  return undefined;
}

export function mediaElementResolution(element) {
  if (element.type === 'video') {
    return videoElementResolution(element);
  }

  if (element.type === 'image' || element.type === 'gif') {
    return imageElementResolution(element);
  }

  return undefined;
}

function videoElementResolution(element) {
  const videoResolutionLow =
    element.resource.full.height <= MIN_VIDEO_HEIGHT &&
    element.resource.full.width <= MIN_VIDEO_WIDTH;
  const videoResolutionHigh =
    element.resource.full.height >= MAX_VIDEO_HEIGHT &&
    element.resource.full.width >= MAX_VIDEO_WIDTH;

  if (videoResolutionHigh) {
    return getChecklistMessage(
      element.id,
      "Video's resolution is too high to display on most mobile devices (>4k)"
    );
  }

  if (videoResolutionLow) {
    return getChecklistMessage(element.id, 'Video has low resolution');
  }

  return undefined;
}

function imageElementResolution(element) {
  const resourceDims = element.resource.height * element.resource.width;
  const elementDims = element.height * element.width;
  const minDensity = resourceDims / MIN_PIXEL_DENSITY;
  if (elementDims > minDensity) {
    return getChecklistMessage(element.id, 'Image has low resolution');
  }
  return undefined;
}

export function videoElementLength(element) {
  if (element.resource.length > MAX_VIDEO_LENGTH_SECONDS) {
    return getChecklistMessage(
      element.id,
      'Video is longer than 1 minute (suggest breaking video up into multiple segments)'
    );
  }
  return undefined;
}
