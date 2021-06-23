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
 * Internal dependencies
 */
/**
 * Internal dependencies
 */
import { useStory } from '../../../app/story';
import { useHighlights } from '../../../app/highlights';
import { ChecklistCard, DefaultFooterText } from '../../checklistCard';
import { PRIORITY_COPY } from '../constants';
import { STATES } from '../../../app/highlights/states';

export const MAX_STORY_TITLE_LENGTH_CHARS = 40;

export function storyTitleLength(story) {
  return story.title?.length > MAX_STORY_TITLE_LENGTH_CHARS;
}

const StoryTitleLength = () => {
  const { story } = useStory(({ state }) => state);
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);

  const { title, footer } = PRIORITY_COPY.storyTitleTooLong;
  return (
    storyTitleLength(story) && (
      <ChecklistCard
        title={title}
        footer={<DefaultFooterText>{footer}</DefaultFooterText>}
        titleProps={{
          onClick: () => {
            setHighlights({ highlight: STATES.STORY_TITLE });
          },
        }}
      />
    )
  );
};

export default StoryTitleLength;
