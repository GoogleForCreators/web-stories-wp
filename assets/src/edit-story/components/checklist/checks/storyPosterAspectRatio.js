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

const POSTER_DIMENSION_WIDTH_PX = 640;
const POSTER_DIMENSION_HEIGHT_PX = 853;
export const ASPECT_RATIO_LEFT = 3;
export const ASPECT_RATIO_RIGHT = 4;

export function storyPosterAspectRatio(story) {
  if (
    hasNoFeaturedMedia(story) ||
    !story.featuredMedia?.width ||
    !story.featuredMedia?.height
  ) {
    return false;
  }

  const hasCorrectAspectRatio =
    Math.abs(
      story.featuredMedia.width / story.featuredMedia.height -
        ASPECT_RATIO_LEFT / ASPECT_RATIO_RIGHT
    ) <= 0.001;

  return !hasCorrectAspectRatio;
}

const StoryPosterAspectRatio = () => {
  const story = useStory(({ state }) => state);
  return (
    storyPosterAspectRatio(story) && (
      <ChecklistCard
        title={sprintf(
          /* translators: %s: image dimensions.  */
          __('Correct poster image aspect ratio to %s', 'web-stories'),
          `${POSTER_DIMENSION_WIDTH_PX}x${POSTER_DIMENSION_HEIGHT_PX}px`
        )}
        /* titleProps={{ onClick: () => { perform highlight here } }} */
        footer={
          <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
            <>
              {sprintf(
                /* translators: %s: image dimensions.  */
                __("Use an image that's at least %s", 'web-stories'),
                `${POSTER_DIMENSION_WIDTH_PX}x${POSTER_DIMENSION_HEIGHT_PX}px`
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

export default StoryPosterAspectRatio;
