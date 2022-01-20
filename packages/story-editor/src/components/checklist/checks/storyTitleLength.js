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
import { useCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app/story';
import { useHighlights, states } from '../../../app/highlights';
import { ChecklistCard, DefaultFooterText } from '../../checklistCard';
import { PRIORITY_COPY, MAX_STORY_TITLE_LENGTH_CHARS } from '../constants';
import { useRegisterCheck } from '../countContext';
import { useIsChecklistMounted } from '../popupMountedContext';

export function storyTitleLength(title) {
  return title?.length > MAX_STORY_TITLE_LENGTH_CHARS;
}

const StoryTitleLength = () => {
  const isChecklistMounted = useIsChecklistMounted();
  const storyTitle = useStory(({ state }) => state?.story?.title);
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);
  const handleClick = useCallback(
    () =>
      setHighlights({
        highlight: states.STORY_TITLE,
      }),
    [setHighlights]
  );

  const isRendered = storyTitleLength(storyTitle);
  useRegisterCheck('StoryTitleLength', isRendered);

  const { title, footer } = PRIORITY_COPY.storyTitleTooLong;
  return (
    isRendered &&
    isChecklistMounted && (
      <ChecklistCard
        title={title}
        footer={<DefaultFooterText>{footer}</DefaultFooterText>}
        titleProps={{
          onClick: handleClick,
        }}
      />
    )
  );
};

export default StoryTitleLength;
