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

/**
 * Internal dependencies
 */
import { List } from '../../../../design-system';
import { useStory } from '../../../app';
import { states, useHighlights } from '../../../app/highlights';
import { ChecklistCard, ChecklistCardStyles } from '../../checklistCard';
import { PRIORITY_COPY } from '../constants';
import { useRegisterCheck } from '../checkCountContext';

export function storyMissingTitle(story) {
  return (
    typeof story.story.title !== 'string' || story.story.title?.trim() === ''
  );
}

const StoryMissingTitle = () => {
  const story = useStory(({ state }) => state);
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);
  const handleClick = useCallback(
    () =>
      setHighlights({
        highlight: states.STORY_TITLE,
      }),
    [setHighlights]
  );

  const isRendered = storyMissingTitle(story);
  useRegisterCheck('StoryMissingTitle', isRendered);

  const { footer, title } = PRIORITY_COPY.storyMissingTitle;
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
};

export default StoryMissingTitle;
