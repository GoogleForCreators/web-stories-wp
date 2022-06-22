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
import { AnimationProps } from '@googleforcreators/animation';
import {
  StoryPropTypes,
  BackgroundAudioPropType,
} from '@googleforcreators/elements';

export const PageSizePropType = PropTypes.shape({
  width: PropTypes.number,
  height: PropTypes.number,
  containerHeight: PropTypes.number,
});

StoryPropTypes.story = PropTypes.shape({
  storyId: PropTypes.number,
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  author: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string.isRequired,
  }),
  slug: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  modified: PropTypes.string.isRequired,
  excerpt: PropTypes.string.isRequired,
  featuredMedia: PropTypes.shape({
    id: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    isExternal: PropTypes.bool,
  }),
  password: PropTypes.string.isRequired,
  currentStoryStyles: PropTypes.object,
  autoAdvance: PropTypes.bool,
  defaultPageDuration: PropTypes.number,
  backgroundAudio: PropTypes.shape({
    resource: BackgroundAudioPropType,
  }),
});

StoryPropTypes.size = PropTypes.exact({
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
});

export const AnimationPropType = PropTypes.shape(AnimationProps);

export default StoryPropTypes;

/**
 * Page object.
 *
 * @typedef {Page} Page
 * @property {Element[]} elements Array of all elements.
 */

/**
 * Story object.
 *
 * @typedef {Story} Story
 * @property {Object} story - A story object.
 * @property {number} storyId Story post id.
 * @property {string} title Story title.
 * @property {string} status Post status, draft or published.
 * @property {Array<Page>} pages Array of all pages.
 * @property {Object} author Story author.
 * @property {string} slug The slug of the story.
 * @property {string} date The publish date of the story.
 * @property {string} modified The modified date of the story.
 * @property {string} content AMP HTML content.
 * @property {string} excerpt Short description.
 * @property {Object} featuredMedia Featured media object.
 * @property {string} password Password
 */
