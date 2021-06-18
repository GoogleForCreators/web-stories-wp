/*
 * Copyright 2021 Google LLC
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
// import { __ } from '@web-stories-wp/i18n';
import { useMemo } from 'react';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app/story';
import { characterCountForPage, filterStoryPages } from '../utils';
// import ChecklistCard from '../../../checklistCard';

const MAX_PAGE_CHARACTER_COUNT = 200;

/**
 * @typedef {import('../../../types').Page} Page
 */

/**
 * Check page for too much text
 *
 * @param {Page} page The page being checked for guidelines
 * @return {boolean} returns true if page has more text than MAX_PAGE_CHARACTER_COUNT
 */
export function pageTooMuchText(page) {
  return characterCountForPage(page) > MAX_PAGE_CHARACTER_COUNT;
}

export function PageTooMuchText() {
  const story = useStory(({ state }) => state);
  const failingPages = useMemo(
    () => filterStoryPages(story, pageTooMuchText),
    [story]
  );
  return failingPages.length > 0
    ? // <ChecklistCard
      //   title={__('Reduce amount of text on pages', 'web-stories')}
      //   titleProps={{
      //     onClick: () => {
      //       /* perform highlight here */
      //     },
      //   }}
      //   footer={
      //     <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
      //       {__('Keep text to max 200 characters per page.', 'web-stories')}
      //       <Link
      //         href={'#' /* figure out what this links to */}
      //         size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
      //       >
      //         {'Learn more'}
      //       </Link>
      //     </Text>
      //   }
      // />
      null
    : null;
}
