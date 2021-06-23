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
import { states, useHighlights } from '../../../app/highlights';
import { useStory } from '../../../app';
import { ChecklistCard, DefaultFooterText } from '../../checklistCard';
import { PRIORITY_COPY } from '../constants';

export function storyMissingExcerpt(story) {
  return !story.excerpt?.length;
}

const StoryMissingExcerpt = () => {
  const story = useStory(({ state }) => state);
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);

  const { title, footer } = PRIORITY_COPY.storyMissingDescription;

  return (
    storyMissingExcerpt(story) && (
      <ChecklistCard
        title={title}
        titleProps={{
          onClick: () => setHighlights({ highlight: states.EXCERPT }),
        }}
        footer={<DefaultFooterText>{footer}</DefaultFooterText>}
      />
    )
  );
};

export default StoryMissingExcerpt;
