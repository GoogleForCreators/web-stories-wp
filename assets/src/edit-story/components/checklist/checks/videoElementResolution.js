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
import { useMemo } from 'react';
import { sprintf, __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Text, THEME_CONSTANTS } from '../../../../design-system';
import { useStory } from '../../../app';
import { ChecklistCard } from '../../checklistCard';
import { filterStoryElements } from '../utils';

const MIN_VIDEO_RESOLUTION = 480;
const MIN_VIDEO_HEIGHT = 480;
const MIN_VIDEO_WIDTH = 852;

export function videoElementResolution(element) {
  const videoResolutionLow =
    element.resource?.sizes?.full?.height <= MIN_VIDEO_HEIGHT &&
    element.resource?.sizes?.full?.width <= MIN_VIDEO_WIDTH;

  return element.type === 'video' && videoResolutionLow;
}

const VideoElementResolution = () => {
  const story = useStory(({ state }) => state);
  const failingElements = useMemo(
    () => filterStoryElements(story, videoElementResolution),
    [story]
  );

  return (
    failingElements.length > 0 && (
      <ChecklistCard
        title={sprintf(
          /* translators: %s: minimum video resolution. */
          __('Increase video resolution to at least %s', 'web-stories'),
          `${MIN_VIDEO_RESOLUTION}p`
        )}
        footer={
          <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
            {sprintf(
              /* translators: %s: minimum video resolution. */
              __(
                'Ensure your video has a minimum resolution of %s',
                'web-stories'
              ),
              `${MIN_VIDEO_RESOLUTION}p`
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
             {elements.map(() => <Thumbnail onClick={() => perform highlight here } />)}
           </>}
       */
      />
    )
  );
};

export default VideoElementResolution;
