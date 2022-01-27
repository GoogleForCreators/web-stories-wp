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
import { states, useHighlights } from '../../../app/highlights';
import { useStory } from '../../../app';
import { ChecklistCard, ChecklistCardStyles } from '../../checklistCard';
import { PRIORITY_COPY } from '../constants';
import { hasNoFeaturedMedia } from '../utils';
import { useRegisterCheck } from '../countContext';
import { useIsChecklistMounted } from '../popupMountedContext';

export function storyHasNoPosterAttached(featuredMedia) {
  return (
    typeof featuredMedia?.url !== 'string' ||
    hasNoFeaturedMedia({ featuredMedia })
  );
}

export function StoryPosterAttached() {
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

  const isRendered = useMemo(
    () => storyHasNoPosterAttached(featuredMedia),
    [featuredMedia]
  );
  useRegisterCheck('StoryPosterAttached', isRendered);

  const { title, footer } = PRIORITY_COPY.storyMissingPoster;
  return isRendered && isChecklistMounted ? (
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
  ) : null;
}
