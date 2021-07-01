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
import { List } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { states, useHighlights } from '../../../app/highlights';
import { useStory } from '../../../app';
import { ChecklistCard, ChecklistCardStyles } from '../../checklistCard';
import { PRIORITY_COPY } from '../constants';
import { hasNoFeaturedMedia } from '../utils';
import { useRegisterCheck } from '../checkCountContext';

export function storyHasNoPosterAttached(story) {
  return (
    typeof story.featuredMedia?.url !== 'string' || hasNoFeaturedMedia(story)
  );
}

export function StoryPosterAttached() {
  //@TODO refine this context selector and storyHasNoPosterAttached to run more selectively
  const story = useStory(({ state }) => state);
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);
  const handleClick = useCallback(
    () =>
      setHighlights({
        highlight: states.POSTER,
      }),
    [setHighlights]
  );

  const isRendered = storyHasNoPosterAttached(story);
  useRegisterCheck('StoryPosterAttached', isRendered);

  const { title, footer } = PRIORITY_COPY.storyMissingPoster;
  return (
    isRendered && (
      <ChecklistCard
        title={title}
        titleProps={{
          onClick: handleClick,
        }}
        footer={
          <ChecklistCardStyles.CardListWrapper>
            <List>{footer}</List>
          </ChecklistCardStyles.CardListWrapper>
        }
      />
    )
  );
}
