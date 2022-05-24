/*
 * Copyright 2022 Google LLC
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

/**
 * Internal dependencies
 */
import cleanForSlug from './cleanForSlug';

/**
 * For use on blur of updating story title
 * that can impact what story slug is if
 * not set independently.
 *
 * @param {Object} args Necessary data for update.
 * @param {string} args.currentSlug The currently assigned value to story's slug.
 * @param {string} args.currentTitle The currently assigned value to story's title.
 * @param {Function} args.updateStory The callback to useStory's action for updating the story with new slug.
 * @return {void}
 */
export const updateSlug = ({ currentSlug, currentTitle, updateStory }) => {
  if (!currentSlug) {
    const cleanSlug = encodeURIComponent(cleanForSlug(currentTitle));
    updateStory({ properties: { slug: cleanSlug } });
  }
};
