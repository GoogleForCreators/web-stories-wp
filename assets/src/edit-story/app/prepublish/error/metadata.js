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
import isElementBelowLimit from '../../../utils/isElementBelowLimit';
import {
  PRE_PUBLISH_MESSAGE_TYPES,
  MESSAGES,
  ASPECT_RATIO_LEFT,
  ASPECT_RATIO_RIGHT,
} from '../constants';
import { states } from '../../highlights';

const FEATURED_MEDIA_RESOURCE_MIN_HEIGHT = 853;
const FEATURED_MEDIA_RESOURCE_MIN_WIDTH = 640;

const PUBLISHER_LOGO_MIN_HEIGHT = 96;
const PUBLISHER_LOGO_MIN_WIDTH = 96;

function hasNoFeaturedMedia(story) {
  return (story.featuredMedia?.url?.trim() || '') === '';
}

/**
 *
 * @typedef {import('../types').Guidance} Guidance
 * @typedef {import('../../../types').Story} Story
 * @typedef {import('../../../types').Page} Page
 */

/**
 * Check the story for a poster.
 * If the story does not have a poster, return an error message.
 * Otherwise, return undefined.
 *
 * @param {Story} story The story being checked for critical metadata
 * @return {Guidance|undefined} Guidance object for consumption
 */
export function storyPosterAttached(story) {
  if (
    typeof story.featuredMedia?.url !== 'string' ||
    hasNoFeaturedMedia(story)
  ) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.ERROR,
      storyId: story.id,
      message: MESSAGES.CRITICAL_METADATA.MISSING_POSTER.MAIN_TEXT,
      help: MESSAGES.CRITICAL_METADATA.MISSING_POSTER.HELPER_TEXT,
      highlight: states.POSTER,
    };
  }
  return undefined;
}

/**
 * Check the story for a title.
 * If the story does not have a title, return an error message.
 * Otherwise, return undefined.
 *
 * @param {Story} story The story being checked for critical metadata
 * @return {Guidance|undefined} Guidance object for consumption
 */
export function storyTitle(story) {
  if (typeof story.title !== 'string' || story.title?.trim() === '') {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.ERROR,
      storyId: story.id,
      message: MESSAGES.CRITICAL_METADATA.MISSING_TITLE.MAIN_TEXT,
      help: MESSAGES.CRITICAL_METADATA.MISSING_TITLE.HELPER_TEXT,
      highlight: states.STORY_TITLE,
    };
  }
  return undefined;
}

/**
 * Check that the story's poster resource has sufficient dimensions.
 * If the resource is too small in either dimension, return an error message.
 * Otherwise, return undefined.
 *
 * @param {Story} story The story being checked for critical metadata
 * @return {Guidance|undefined} Guidance object for consumption
 */
export function storyPosterPortraitSize(story) {
  if (hasNoFeaturedMedia(story)) {
    return undefined;
  }
  if (
    story.featuredMedia?.height < FEATURED_MEDIA_RESOURCE_MIN_HEIGHT ||
    story.featuredMedia?.width < FEATURED_MEDIA_RESOURCE_MIN_WIDTH
  ) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.ERROR,
      storyId: story.id,
      message: MESSAGES.CRITICAL_METADATA.POSTER_TOO_SMALL.MAIN_TEXT,
      help: MESSAGES.CRITICAL_METADATA.POSTER_TOO_SMALL.HELPER_TEXT,
      highlight: states.POSTER,
    };
  }
  return undefined;
}

/**
 * Check that the story's poster resource has the correct aspect ratio.
 * If the resource is too small in either dimension, return an error message.
 * Otherwise, return undefined.
 *
 * @param {Story} story The story being checked for critical metadata
 * @return {Guidance|undefined} Guidance object for consumption
 */
export function storyPosterAspectRatio(story) {
  if (
    hasNoFeaturedMedia(story) ||
    !story.featuredMedia?.width ||
    !story.featuredMedia?.height
  ) {
    return undefined;
  }
  const hasCorrectAspectRatio =
    Math.abs(
      story.featuredMedia.width / story.featuredMedia.height -
        ASPECT_RATIO_LEFT / ASPECT_RATIO_RIGHT
    ) <= 0.001;
  if (!hasCorrectAspectRatio) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.ERROR,
      storyId: story.id,
      message: MESSAGES.CRITICAL_METADATA.POSTER_WRONG_ASPECT_RATIO.MAIN_TEXT,
      help: MESSAGES.CRITICAL_METADATA.POSTER_WRONG_ASPECT_RATIO.HELPER_TEXT,
      highlight: states.POSTER,
    };
  }
  return undefined;
}

/**
 * Check that the story's publisher logo resource has sufficient dimensions.
 * If the resource is too small in either dimension, return an error message.
 * Otherwise, return undefined.
 *
 * @param {Story} story The story being checked for critical metadata
 * @return {Guidance|undefined} Guidance object for consumption
 */
export function publisherLogoSize(story) {
  if (
    story.publisherLogo?.height < PUBLISHER_LOGO_MIN_HEIGHT ||
    story.publisherLogo?.width < PUBLISHER_LOGO_MIN_WIDTH
  ) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.ERROR,
      storyId: story.id,
      message: MESSAGES.CRITICAL_METADATA.LOGO_TOO_SMALL.MAIN_TEXT,
      help: MESSAGES.CRITICAL_METADATA.LOGO_TOO_SMALL.HELPER_TEXT,
      highlight: states.PUBLISHER_LOGO,
    };
  }
  return undefined;
}

/**
 * Check for link and page attachment conflicts.
 * If there is an element with a link in the page attachment region, return an error message.
 * Otherwise, return undefined.
 *
 * @param {Page} page The story being checked for critical metadata
 * @return {Guidance|undefined} Guidance object for consumption
 */
export function linkInPageAttachmentRegion(page) {
  const { elements } = page;
  const hasPageAttachment = Boolean(page.pageAttachment?.url?.length);
  const linksInPageAttachmentArea =
    hasPageAttachment &&
    elements
      .filter(({ link }) => Boolean(link?.url?.length))
      .filter(isElementBelowLimit);

  if (linksInPageAttachmentArea?.length) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.ERROR,
      pageId: page.id,
      elements: linksInPageAttachmentArea,
      message: MESSAGES.CRITICAL_METADATA.LINK_ATTACHMENT_CONFLICT.MAIN_TEXT,
      help: MESSAGES.CRITICAL_METADATA.LINK_ATTACHMENT_CONFLICT.HELPER_TEXT,
    };
  }
  return undefined;
}
