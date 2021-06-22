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
import { __, _n, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Text, THEME_CONSTANTS } from '../../../../design-system';
import { useStory } from '../../../app';
import { ChecklistCard } from '../../checklistCard';

export const MAX_STORY_TITLE_LENGTH_WORDS = 10;
export const MAX_STORY_TITLE_LENGTH_CHARS = 40;

export function storyMissingTitle(story) {
  return typeof story.title !== 'string' || story.title?.trim() === '';
}

const StoryMissingTitle = () => {
  const story = useStory(({ state }) => state);
  return (
    storyMissingTitle(story) && (
      <ChecklistCard
        title={__('Add Web Story title', 'web-stories')}
        /* titleProps={{ onClick: () => { perform highlight here } }} */
        footer={
          <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
            {sprintf(
              /* translators: %d: maximum story title length in words. */
              _n(
                'Keep under %d word',
                'Keep under %d words',
                MAX_STORY_TITLE_LENGTH_WORDS,
                'web-stories'
              ),
              MAX_STORY_TITLE_LENGTH_WORDS
            )}
            {
              //  <Link
              //   href={'#' /* figure out what this links to */
              //   size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
              // >
              //   {'Learn more'}
              // </Link>
            }
          </Text>
        }
      />
    )
  );
};

export default StoryMissingTitle;
