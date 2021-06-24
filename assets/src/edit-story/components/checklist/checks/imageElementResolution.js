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

const IMAGE_SIZE_WIDTH = 828;
const IMAGE_SIZE_HEIGHT = 1792;

export function mediaElementResolution(element) {
  switch (element.type) {
    case 'image':
      return imageElementResolution(element);
    case 'gif':
      return gifElementResolution(element);
    default:
      return () => false;
  }
}

function imageElementResolution(element) {
  const heightResTooLow =
    element.resource?.sizes?.full?.height < 2 * element.height;
  const widthResTooLow =
    element.resource?.sizes?.full?.width < 2 * element.width;

  return heightResTooLow || widthResTooLow;
}

function gifElementResolution(element) {
  // gif/output uses the MP4 video provided by the 3P Media API for displaying gifs
  const heightResTooLow =
    element.resource?.output?.sizes?.mp4?.full?.height < 2 * element.height;
  const widthResTooLow =
    element.resource?.output?.sizes?.mp4?.full?.width < 2 * element.width;

  return heightResTooLow || widthResTooLow;
}

const ImageElementResolution = () => {
  const story = useStory(({ state }) => state);
  const failingElements = useMemo(
    () => filterStoryElements(story, mediaElementResolution),
    [story]
  );

  return (
    failingElements.length > 0 && (
      <ChecklistCard
        title={sprintf(
          /* translators: %s: minimum image size width x minimum image size height. */
          __(
            'Upload a higher resolution poster image to at least %s',
            'web-stories'
          ),
          `${IMAGE_SIZE_WIDTH}x${IMAGE_SIZE_HEIGHT}px`
        )}
        footer={
          <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
            {
              <>
                {sprintf(
                  /* translators: %s: minimum image size width x minimum image size height. */
                  __('Use %s for a full-screen image', 'web-stories'),
                  `${IMAGE_SIZE_WIDTH}x${IMAGE_SIZE_HEIGHT}px`
                )}{' '}
                {__(
                  'Consider similar pixel density for cropped images',
                  'web-stories'
                )}
              </>
            }
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

export default ImageElementResolution;
