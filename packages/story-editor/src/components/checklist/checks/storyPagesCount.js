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
import { useMemo } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app/story';

import { ChecklistCard, DefaultFooterText } from '../../checklistCard';
import { useRegisterCheck } from '../countContext';
import { DESIGN_COPY, MAX_STORY_PAGES, MIN_STORY_PAGES } from '../constants';
import { useIsChecklistMounted } from '../popupMountedContext';

export function storyPagesCount(numPages) {
  const hasTooFewPages = numPages < MIN_STORY_PAGES;
  const hasTooManyPages = numPages > MAX_STORY_PAGES;

  return { hasTooFewPages, hasTooManyPages };
}

const StoryPagesCount = () => {
  const isChecklistMounted = useIsChecklistMounted();
  const numPages = useStory(({ state }) => state?.pages?.length);

  const { hasTooFewPages, hasTooManyPages } = useMemo(
    () => storyPagesCount(numPages),
    [numPages]
  );

  const { storyTooShort, storyTooLong } = DESIGN_COPY;
  const copySource =
    (hasTooFewPages && storyTooShort) ||
    (hasTooManyPages && storyTooLong) ||
    {};

  const isRendered = hasTooFewPages || hasTooManyPages;
  useRegisterCheck('StoryPagesCount', isRendered);

  return (
    isRendered &&
    isChecklistMounted && (
      <ChecklistCard
        title={copySource.title}
        footer={<DefaultFooterText>{copySource.title}</DefaultFooterText>}
      />
    )
  );
};

export default StoryPagesCount;
