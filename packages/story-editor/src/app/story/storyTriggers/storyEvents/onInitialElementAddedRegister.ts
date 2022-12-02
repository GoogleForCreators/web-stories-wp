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
import { useRef, useEffect } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import type { OnActionProps, State } from '../../../../types';
import { STORY_EVENTS } from './types';

export function isNewStory(story: State | null) {
  return (
    story?.pages?.length === 0 ||
    (story?.pages?.length === 1 && story?.pages[0]?.elements?.length <= 1)
  );
}

function OnInitialElementAddedRegister({
  currentStory,
  dispatchStoryEvent,
}: OnActionProps) {
  const hasFiredOnceRef = useRef(false);

  // Dispatch `onInitialElementAdded` story event once, the first time
  // we notice a story has any content.
  useEffect(() => {
    if (!hasFiredOnceRef.current && !isNewStory(currentStory)) {
      dispatchStoryEvent(STORY_EVENTS.onInitialElementAdded);
      hasFiredOnceRef.current = true;
    }
  }, [dispatchStoryEvent, currentStory]);

  return null;
}

export { OnInitialElementAddedRegister };
