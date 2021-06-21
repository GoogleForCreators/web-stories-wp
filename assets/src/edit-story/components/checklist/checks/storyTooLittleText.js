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
import { sprintf, _n, __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app/story';

import { ChecklistCard } from '../../checklistCard';
import { THEME_CONSTANTS, Text } from '../../../../design-system';
import stripHTML from '../../../utils/stripHTML';

const MIN_STORY_CHARACTER_COUNT = 100;

function characterCountForPage(page) {
  let characterCount = 0;
  page.elements.forEach((element) => {
    if (element.type === 'text') {
      characterCount += stripHTML(element.content).length;
    }
  });
  return characterCount;
}

export function storyTooLittleText(story) {
  let characterCount = 0;
  story.pages.forEach((page) => {
    characterCount += characterCountForPage(page);
  });
  return characterCount < MIN_STORY_CHARACTER_COUNT;
}

const StoryTooLittleText = () => {
  const story = useStory(({ state }) => state);
  return (
    storyTooLittleText(story) && (
      <ChecklistCard
        title={__('Add more text to page', 'web-stories')}
        titleProps={{
          onClick: () => {
            /* perform highlight here */
          },
        }}
        footer={
          <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
            {sprintf(
              /* translators: %d: minimum number of story characters. */
              _n(
                'Include at least %d character',
                'Include at least %d characters',
                MIN_STORY_CHARACTER_COUNT,
                'web-stories'
              ),
              MIN_STORY_CHARACTER_COUNT
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

export default StoryTooLittleText;
