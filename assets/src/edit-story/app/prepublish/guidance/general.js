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
// import { __ } from '@wordpress/i18n/build-types';
// import { PRE_PUBLISH_MESSAGE_TYPES } from '../constants';

/**
 * @typedef {import('../types').Guidance} Guidance
 * @typedef {import('../../../types').Story} Story
 */

/**
 * Check the number of pages in a Story.
 * If the Story has less than 4 pages or more than 30 pages return guidance
 * Otherwise return undefined.
 *
 * @param {Story} story The story object being checked
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function storyPagesCount(/*story*/) {}

/**
 * Check the length of the story's title
 * If the Story title is longer than 40 characters return guidance
 * Otherwise return undefined
 *
 * @param {Story} story The story object being checked
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function storyTitleLength(/*story*/) {}

/**
 * Check that a cover/poster is attached to the Story
 * If the Story has less than 4 pages or more than 30 pages return guidance
 * Otherwise return undefined.
 *
 * @param {Story} story The story object being checked
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function storyPosterAttached(/*story*/) {}

// todo: square and landscape story cover/poster sizes
/**
 * Check the number of pages in a Story.
 * If the Story has less than 4 pages or more than 30 pages return guidance
 * Otherwise return undefined.
 *
 * @param {Story} story The story object being checked
 * @return {Guidance|undefined} The guidance object for consumption
 */
// export function storyPosterSize(story) {}
