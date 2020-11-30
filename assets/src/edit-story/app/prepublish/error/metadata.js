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
import { greatestCommonDivisor } from '../../../utils/greatestCommonDivisor';
import isElementBelowLimit from '../../../utils/isElementBelowLimit';
import {
  PRE_PUBLISH_MESSAGE_TYPES,
  MESSAGES,
  ASPECT_RATIO_LEFT,
  ASPECT_RATIO_RIGHT,
} from '../constants';

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
 */

/**
 * Check the story for a cover.
 * If the story does not have a cover, return an error message.
 * Otherwise, return undefined.
 *
 * @param {Story} story The story being checked for critical metadata
 * @return {Guidance|undefined} Guidance object for consumption
 */
export function storyCoverAttached(story) {
  if (
    typeof story.featuredMedia?.url !== 'string' ||
    hasNoFeaturedMedia(story)
  ) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.ERROR,
      storyId: story.id,
      message: MESSAGES.CRITICAL_METADATA.MISSING_COVER.MAIN_TEXT,
      help: MESSAGES.CRITICAL_METADATA.MISSING_COVER.HELPER_TEXT,
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
    };
  }
  return undefined;
}

/**
 * Check that the story's cover resource has sufficient dimensions.
 * If the resource is too small in either dimension, return an error message.
 * Otherwise, return undefined.
 *
 * @param {Story} story The story being checked for critical metadata
 * @return {Guidance|undefined} Guidance object for consumption
 */
export function storyCoverPortraitSize(story) {
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
      message: MESSAGES.CRITICAL_METADATA.COVER_TOO_SMALL.MAIN_TEXT,
      help: MESSAGES.CRITICAL_METADATA.COVER_TOO_SMALL.HELPER_TEXT,
    };
  }
  return undefined;
}

/**
 * Check that the story's cover resource has the correct aspect ratio.
 * If the resource is too small in either dimension, return an error message.
 * Otherwise, return undefined.
 *
 * @param {Story} story The story being checked for critical metadata
 * @return {Guidance|undefined} Guidance object for consumption
 */
export function storyCoverAspectRatio(story) {
  if (
    hasNoFeaturedMedia(story) ||
    !story.featuredMedia?.width ||
    !story.featuredMedia?.height
  ) {
    return undefined;
  }
  const gcd = greatestCommonDivisor(
    story.featuredMedia?.width,
    story.featuredMedia?.height
  );
  const leftRatio = story.featuredMedia?.width / gcd;
  const rightRatio = story.featuredMedia?.height / gcd;
  if (leftRatio !== ASPECT_RATIO_LEFT || rightRatio !== ASPECT_RATIO_RIGHT) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.ERROR,
      storyId: story.id,
      message: MESSAGES.CRITICAL_METADATA.COVER_WRONG_ASPECT_RATIO.MAIN_TEXT,
      help: MESSAGES.CRITICAL_METADATA.COVER_WRONG_ASPECT_RATIO.HELPER_TEXT,
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
    };
  }
  return undefined;
}

/**
 * Check for link and page attachment conflicts.
 * If there is an element with a link in the page attachment region, return an error message.
 * Otherwise, return undefined.
 *
 * @param {Story} story The story being checked for critical metadata
 * @return {Guidance|undefined} Guidance object for consumption
 */
export function linkInPageAttachmentRegion(story) {
  const { pages } = story;
  const pagesWithLinksInAttachmentArea = pages
    .filter((page) => {
      const { elements } = page;
      const hasPageAttachment = Boolean(page.pageAttachment?.url?.length);
      return (
        hasPageAttachment &&
        elements
          .filter(({ link }) => Boolean(link?.url?.length))
          .some(isElementBelowLimit)
      );
    })
    .map((page) => page.id);

  const isLinkInPageAttachmentArea = Boolean(
    pagesWithLinksInAttachmentArea.length
  );

  if (isLinkInPageAttachmentArea) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.ERROR,
      storyId: story.id,
      pages: pagesWithLinksInAttachmentArea,
      message: MESSAGES.CRITICAL_METADATA.LINK_ATTACHMENT_CONFLICT.MAIN_TEXT,
      help: MESSAGES.CRITICAL_METADATA.LINK_ATTACHMENT_CONFLICT.HELPER_TEXT,
    };
  }
  return undefined;
}
