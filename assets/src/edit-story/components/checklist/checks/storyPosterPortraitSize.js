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
import { __, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Text, THEME_CONSTANTS } from '../../../../design-system';
import { useStory } from '../../../app';
import { ChecklistCard } from '../../checklistCard';
import { hasNoFeaturedMedia } from '../utils';

const FEATURED_MEDIA_RESOURCE_MIN_HEIGHT = 853;
const FEATURED_MEDIA_RESOURCE_MIN_WIDTH = 640;
export const ASPECT_RATIO_LEFT = 3;
export const ASPECT_RATIO_RIGHT = 4;

export function storyPosterPortraitSize(story) {
  if (hasNoFeaturedMedia(story)) {
    return false;
  }

  return (
    story.featuredMedia?.height < FEATURED_MEDIA_RESOURCE_MIN_HEIGHT ||
    story.featuredMedia?.width < FEATURED_MEDIA_RESOURCE_MIN_WIDTH
  );
}

const StoryPosterPortraitSize = () => {
  const story = useStory(({ state }) => state);
  return (
    storyPosterPortraitSize(story) && (
      <ChecklistCard
        title={sprintf(
          /* translators: %s: image dimensions.  */
          __('Increase poster image size to at least %s', 'web-stories'),
          `${FEATURED_MEDIA_RESOURCE_MIN_WIDTH}x${FEATURED_MEDIA_RESOURCE_MIN_HEIGHT}px`
        )}
        /* titleProps={{ onClick: () => { perform highlight here } }} */
        footer={
          <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
            <>
              {sprintf(
                /* translators: %s: image dimensions.  */
                __("Use an image that's at least %s", 'web-stories'),
                `${FEATURED_MEDIA_RESOURCE_MIN_WIDTH}x${FEATURED_MEDIA_RESOURCE_MIN_HEIGHT}px`
              )}
              {sprintf(
                /* translators: %s: aspect ratio.  */
                __('Maintain a %s aspect ratio', 'web-stories'),
                `${ASPECT_RATIO_LEFT}:${ASPECT_RATIO_RIGHT}`
              )}
            </>
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

export default StoryPosterPortraitSize;
