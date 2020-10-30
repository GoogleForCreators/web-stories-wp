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
import isElementBelowLimit from '../../../utils/isElementBelowLimit';
import { PRE_PUBLISH_MESSAGE_TYPES } from '../constants';

const FEATURED_MEDIA_RESOURCE_MIN_HEIGHT = 853;
const FEATURED_MEDIA_RESOURCE_MIN_WIDTH = 640;

const PUBLISHER_LOGO_MIN_HEIGHT = 96;
const PUBLISHER_LOGO_MIN_WIDTH = 96;

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
  if (typeof story.featuredMediaUrl !== 'string') {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.ERROR,
      storyId: story.storyId,
      message: __('Missing story cover', 'web-stories'),
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
  if (typeof story.title !== 'string' || story.title.trim() === '') {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.ERROR,
      storyId: story.storyId,
      message: __('Missing story title', 'web-stories'),
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
  if (
    story.featuredMediaResource.height < FEATURED_MEDIA_RESOURCE_MIN_HEIGHT ||
    story.featuredMediaResource.width < FEATURED_MEDIA_RESOURCE_MIN_WIDTH
  ) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.ERROR,
      storyId: story.storyId,
      message: __("Story's portrait cover image is too small", 'web-stories'),
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
    story.publisherLogoResource.height < PUBLISHER_LOGO_MIN_HEIGHT ||
    story.publisherLogoResource.width < PUBLISHER_LOGO_MIN_WIDTH
  ) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.ERROR,
      storyId: story.storyId,
      message: __("Story's publisher logo image is too small", 'web-stories'),
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
  const isLinkInPageAttachmentArea = pages.some((page) => {
    const { elements } = page;
    const isLinkAttached = Boolean(page?.pageAttachment?.url.length);
    return (
      !isLinkAttached &&
      elements.filter(({ link }) => link?.url?.length).some(isElementBelowLimit)
    );
  });

  if (isLinkInPageAttachmentArea) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.ERROR,
      storyId: story.storyId,
      message: __(
        'Story has a link in the page attachment region',
        'web-stories'
      ),
    };
  }
  return undefined;
}
