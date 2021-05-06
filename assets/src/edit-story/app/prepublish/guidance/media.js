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
import { VIDEO_SIZE_THRESHOLD } from '../../media/utils/useFFmpeg';
import { MESSAGES, PRE_PUBLISH_MESSAGE_TYPES } from '../constants';
import { VideoOptimization } from '../components/videoOptimization';

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

/**
 * Check a if a video element's been optimized.
 * If is not optimized, return guidance. Otherwise return undefined.
 *
 * @param {Element} element The element being checked
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function videoElementOptimized(element = {}) {
  const idResource = element.resource?.id;
  const idOrigin = idResource?.toString().split(':')?.[0];
  const isCoverrMedia = idOrigin === 'media/coverr';
  const videoArea =
    (element.resource?.sizes?.full?.height ?? element.resource?.height ?? 0) *
    (element.resource?.sizes?.full?.width ?? element.resource?.width ?? 0);
  const isLargeVideo =
    videoArea >= VIDEO_SIZE_THRESHOLD.WIDTH * VIDEO_SIZE_THRESHOLD.HEIGHT;

  if (!isCoverrMedia && isLargeVideo && !element.resource?.isOptimized) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
      elementId: element.id,
      message: MESSAGES.MEDIA.VIDEO_NOT_OPTIMIZED.MAIN_TEXT,
      help: <VideoOptimization element={element} />,
      noHighlight: true,
    };
  }
  return undefined;
}
