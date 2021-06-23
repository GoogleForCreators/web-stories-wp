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
import { sprintf, __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS, Text } from '../../../../design-system';
import { useStory } from '../../../app';
import { ChecklistCard } from '../../checklistCard';
import { filterStoryElements } from '../utils';

const MIN_FONT_SIZE = 12;

export function textElementFontSizeTooSmall(element) {
  return (
    element.type === 'text' &&
    element.fontSize &&
    element.fontSize < MIN_FONT_SIZE
  );
}

const TextElementFontSizeTooSmall = () => {
  const story = useStory(({ state }) => state);
  const elements = filterStoryElements(story, textElementFontSizeTooSmall);
  return (
    elements.length > 0 && (
      <ChecklistCard
        title={sprintf(
          /* translators: %d: minimum font size. */
          __('Increase font size to %s or above', 'web-stories'),
          MIN_FONT_SIZE
        )}
        footer={
          <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
            {sprintf(
              /* translators: %d: minimum font size. */
              __(
                'Ensure legibility by selecting text size %d or greater',
                'web-stories'
              ),
              MIN_FONT_SIZE
            )}
            {
              //       <Link
              //         href={'#' /* figure out what this links to */}
              //         size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
              //       >
              //         {'Learn more'}
              //       </Link>
            }
          </Text>
        }
        /*
        todo thumbnails for elements
        thumbnailCount={elements.length}
        thumbnail={<>
            {elements.map(() => <Thumbnail />)}
          </>}
      */
      />
    )
  );
};

export default TextElementFontSizeTooSmall;
