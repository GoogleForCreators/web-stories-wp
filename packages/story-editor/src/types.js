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
import { HexPropType } from '@web-stories-wp/patterns';

export const BorderPropTypes = PropTypes.shape({
  color: HexPropType.isRequired,
  left: PropTypes.number,
  top: PropTypes.number,
  right: PropTypes.number,
  bottom: PropTypes.number,
  locked: PropTypes.bool.isRequired,
  position: PropTypes.string.isRequired,
});

export const StylePresetPropType = PropTypes.shape({
  colors: PropTypes.array,
  textStyles: PropTypes.array,
});

const StoryPropTypes = {};

const StoryLayerPropTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

StoryPropTypes.layer = PropTypes.shape(StoryLayerPropTypes);

export { StoryPropTypes };

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
