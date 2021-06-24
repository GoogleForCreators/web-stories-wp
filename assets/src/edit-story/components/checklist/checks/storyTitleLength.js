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
import { sprintf, _n } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
/**
 * Internal dependencies
 */
import { useStory } from '../../../app/story';

import { ChecklistCard } from '../../checklistCard';
import { THEME_CONSTANTS, Text } from '../../../../design-system';

export const MAX_STORY_TITLE_LENGTH_CHARS = 40;

export function storyTitleLength(story) {
  return story.title?.length > MAX_STORY_TITLE_LENGTH_CHARS;
}

const StoryTitleLength = () => {
  const story = useStory(({ state }) => state);
  return (
    storyTitleLength(story) && (
      <ChecklistCard
        title={sprintf(
          /* translators: %d: minimum number of story characters. */
          _n(
            'Shorten title to fewer than %d character',
            'Shorten title to fewer than %d characters',
            MAX_STORY_TITLE_LENGTH_CHARS,
            'web-stories'
          ),
          MAX_STORY_TITLE_LENGTH_CHARS
        )}
        titleProps={{
          onClick: () => {
            /* perform highlight here */
          },
        }}
        footer={
          <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
            {sprintf(
              /* translators: %d: maximum number of story characters. */
              _n(
                'Limit story title to %d character or less',
                'Limit story title to %d characters or less',
                MAX_STORY_TITLE_LENGTH_CHARS,
                'web-stories'
              ),
              MAX_STORY_TITLE_LENGTH_CHARS
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

export default StoryTitleLength;
