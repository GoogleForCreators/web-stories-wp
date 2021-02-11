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
/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import { PRE_PUBLISH_MESSAGE_TYPES } from './constants';

/**
 * @typedef {import('../../types').Page} Page
 * @typedef {import('../../types').Element} Element
 */
/**
 * Guidance return object
 *
 * @typedef {Guidance} Guidance
 * @property {string} type The type/severity of the message [error, warning, guidance]
 * @property {string} message The main text describing the error
 * @property {string} help The descriptive text describing the error
 * @property {Page[]} [pages] The page objects containing elements which failed checks
 * @property {Element[]} [elements] The element objects which failed checks
 * @property {string} [pageId] The ID of the page being checked
 * @property {string} [elementId] The ID of the element being checked
 * @property {string} [storyId] The ID of the story element being checked
 *
 */

export const GuidancePropType = PropTypes.shape({
  type: PropTypes.oneOf([
    PRE_PUBLISH_MESSAGE_TYPES.ERROR,
    PRE_PUBLISH_MESSAGE_TYPES.WARNING,
    PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
  ]).isRequired,
  pages: PropTypes.arrayOf(StoryPropTypes.page),
  elements: PropTypes.arrayOf(StoryPropTypes.element),
  page: PropTypes.number,
  elementId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  storyId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  message: PropTypes.string.isRequired,
  help: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
});

export const GuidanceChecklist = PropTypes.arrayOf(GuidancePropType);
