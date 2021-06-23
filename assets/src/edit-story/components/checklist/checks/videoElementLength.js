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
import { THEME_CONSTANTS, Text } from '../../../../design-system';
import { useStory } from '../../../app';
import { ChecklistCard } from '../../checklistCard';
import { filterStoryElements } from '../utils/filterStoryElements';

const MAX_VIDEO_LENGTH_SECONDS = 60;
const MAX_VIDEO_LENGTH_MINUTES = Math.floor(MAX_VIDEO_LENGTH_SECONDS / 60);

export function videoElementLength(element) {
  return (
    element.type === 'video' &&
    element.resource?.length > MAX_VIDEO_LENGTH_SECONDS
  );
}

const VideoElementLength = () => {
  const story = useStory(({ state }) => state);

  const failingElements = filterStoryElements(story, videoElementLength);
  return (
    failingElements.length > 0 && (
      <ChecklistCard
        title={sprintf(
          /* translators: %d: maximum video length in minutes. */
          _n(
            'Split videos into segments of %d minute or less',
            'Split videos into segments of %d minutes or less',
            MAX_VIDEO_LENGTH_MINUTES,
            'web-stories'
          ),
          MAX_VIDEO_LENGTH_MINUTES
        )}
        footer={
          <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
            {__('Shorter videos help readers navigate stories', 'web-stories')}
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
              {elements.map(() => <Thumbnail onClick={() => perform highlight here } />)}
            </>}
        */
      />
    )
  );
};
export default VideoElementLength;
