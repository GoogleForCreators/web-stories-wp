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
import { useMemo } from 'react';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app/story';

import { ChecklistCard, DefaultFooterText } from '../../checklistCard';
import { DESIGN_COPY, MAX_STORY_PAGES, MIN_STORY_PAGES } from '../constants';

export function storyPagesCount(story) {
  const hasTooFewPages = story.pages.length < MIN_STORY_PAGES;
  const hasTooManyPages = story.pages.length > MAX_STORY_PAGES;

  return hasTooFewPages || hasTooManyPages;
}

const StoryPagesCount = () => {
  const story = useStory(({ state }) => state);

  const badPageCount = useMemo(() => storyPagesCount(story), [story]);

  const { storyTooShort, storyTooLong } = DESIGN_COPY;
  const copySource = badPageCount
    ? story.pages.length < MIN_STORY_PAGES
      ? storyTooShort
      : storyTooLong
    : {};
  return (
    badPageCount && (
      <ChecklistCard
        title={copySource.title}
        footer={<DefaultFooterText>{copySource.title}</DefaultFooterText>}
      />
    )
  );
};

export default StoryPagesCount;
