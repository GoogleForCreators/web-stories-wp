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
import { __, sprintf, _n } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app/story';

import { ChecklistCard } from '../../checklistCard';
import { THEME_CONSTANTS, Text } from '../../../../design-system';

export const MIN_STORY_PAGES = 4;
export const MAX_STORY_PAGES = 30;

export function storyPagesCount(story) {
  const hasTooFewPages = story.pages.length < MIN_STORY_PAGES;
  const hasTooManyPages = story.pages.length > MAX_STORY_PAGES;

  return hasTooFewPages || hasTooManyPages;
}

const StoryPagesCount = () => {
  const story = useStory(({ state }) => state);
  return (
    storyPagesCount(story) && (
      <ChecklistCard
        title={
          story.pages.length < MIN_STORY_PAGES
            ? sprintf(
                /* translators: %d: maximum number of pages. */
                _n(
                  'Make Web Story at least %d page',
                  'Make Web Story at least %d pages',
                  MIN_STORY_PAGES,
                  'web-stories'
                ),
                MIN_STORY_PAGES
              )
            : sprintf(
                /* translators: %d: minimum number of pages. */
                _n(
                  'Make Web Story fewer than %d page',
                  'Make Web Story fewer than %d pages',
                  MAX_STORY_PAGES,
                  'web-stories'
                ),
                MAX_STORY_PAGES
              )
        }
        titleProps={{
          onClick: () => {
            /* perform highlight here */
          },
        }}
        footer={
          <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
            {story.pages.length < MIN_STORY_PAGES
              ? sprintf(
                  /* translators: 1: minimum number of pages. 2: maximum number of pages. */
                  __(
                    'It is recommended to have between %1$d and %2$d pages in your story',
                    'web-stories'
                  ),
                  MIN_STORY_PAGES,
                  MAX_STORY_PAGES
                )
              : sprintf(
                  /* translators: 1: minimum number of pages. 2: maximum number of pages. */
                  __(
                    'It is recommended to have between %1$d and %2$d pages in your story',
                    'web-stories'
                  ),
                  MIN_STORY_PAGES,
                  MAX_STORY_PAGES
                )}
            {
              // <Link
              //  href={'#' figure out what this links to */}
              //  size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
              // >
              // {'Learn more'}
              // </Link>
            }
          </Text>
        }
      />
    )
  );
};

export default StoryPagesCount;
