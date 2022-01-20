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
import { useCallback, useMemo } from '@googleforcreators/react';
import { List, THEME_CONSTANTS } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import {
  PRIORITY_COPY,
  ASPECT_RATIO_LEFT,
  ASPECT_RATIO_RIGHT,
  FEATURED_MEDIA_RESOURCE_MIN_HEIGHT,
  FEATURED_MEDIA_RESOURCE_MIN_WIDTH,
} from '../constants';
import { states, useHighlights } from '../../../app/highlights';
import { ChecklistCard, ChecklistCardStyles } from '../../checklistCard';
import { hasNoFeaturedMedia } from '../utils';
import { useRegisterCheck } from '../countContext';
import { useIsChecklistMounted } from '../popupMountedContext';

export function storyPosterSize(featuredMedia) {
  if (hasNoFeaturedMedia({ featuredMedia })) {
    return false;
  }
  if (
    featuredMedia?.height < FEATURED_MEDIA_RESOURCE_MIN_HEIGHT ||
    featuredMedia?.width < FEATURED_MEDIA_RESOURCE_MIN_WIDTH
  ) {
    return true;
  }
  const hasCorrectAspectRatio =
    Math.abs(
      featuredMedia.width / featuredMedia.height -
        ASPECT_RATIO_LEFT / ASPECT_RATIO_RIGHT
    ) <= 0.001;

  return !hasCorrectAspectRatio;
}

const StoryPosterSize = () => {
  const isChecklistMounted = useIsChecklistMounted();
  const featuredMedia = useStory(({ state }) => state?.story?.featuredMedia);
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);
  const handleClick = useCallback(
    () =>
      setHighlights({
        highlight: states.POSTER,
      }),
    [setHighlights]
  );
  const { footer, title } = PRIORITY_COPY.storyPosterSize;

  const isRendered = useMemo(
    () => storyPosterSize(featuredMedia),
    [featuredMedia]
  );
  useRegisterCheck('StoryPosterSize', isRendered);
  return (
    isRendered &&
    isChecklistMounted && (
      <ChecklistCard
        title={title}
        titleProps={{
          onClick: handleClick,
        }}
        footer={
          <ChecklistCardStyles.CardListWrapper>
            <List size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
              {footer}
            </List>
          </ChecklistCardStyles.CardListWrapper>
        }
      />
    )
  );
};

export default StoryPosterSize;
