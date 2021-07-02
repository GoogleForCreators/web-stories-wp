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
import { useCallback } from 'react';
import { List, THEME_CONSTANTS } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { PRIORITY_COPY } from '../constants';
import { states, useHighlights } from '../../../app/highlights';
import { ChecklistCard, ChecklistCardStyles } from '../../checklistCard';
import { hasNoFeaturedMedia } from '../utils';
import { useRegisterCheck } from '../countContext';

const FEATURED_MEDIA_RESOURCE_MIN_HEIGHT = 853;
const FEATURED_MEDIA_RESOURCE_MIN_WIDTH = 640;

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
  const { story } = useStory(({ state }) => state);
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);
  const handleClick = useCallback(
    () =>
      setHighlights({
        highlight: states.POSTER,
      }),
    [setHighlights]
  );
  const { footer, title } = PRIORITY_COPY.posterTooSmall;

  const isRendered = storyPosterPortraitSize(story);
  useRegisterCheck('StoryPosterPortraitSize', isRendered);

  return (
    isRendered && (
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

export default StoryPosterPortraitSize;
