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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { STORY_EVENTS } from './types';

function OnPageAddedRegister({ currentStory, dispatchStoryEvent }) {
  const hasFiredOnceRef = useRef({
    [STORY_EVENTS.onSecondPageAdded]: false,
    [STORY_EVENTS.onFifthPageAdded]: false,
  });

  // Dispatch `onSecondPageAdded` story event once, the first time
  // the story grows to 2 or more pages.
  useEffect(() => {
    if (
      !hasFiredOnceRef.current[STORY_EVENTS.onSecondPageAdded] &&
      currentStory?.pages?.length >= 2
    ) {
      dispatchStoryEvent(STORY_EVENTS.onSecondPageAdded);
      hasFiredOnceRef.current[STORY_EVENTS.onSecondPageAdded] = true;
    }
  }, [dispatchStoryEvent, currentStory?.pages]);

  // Dispatch `onFifthPageAdded` story event once, the first time
  // the story grows to 5 or more pages.
  useEffect(() => {
    if (
      !hasFiredOnceRef.current[STORY_EVENTS.onFifthPageAdded] &&
      currentStory?.pages?.length >= 5
    ) {
      dispatchStoryEvent(STORY_EVENTS.onFifthPageAdded);
      hasFiredOnceRef.current[STORY_EVENTS.onFifthPageAdded] = true;
    }
  }, [dispatchStoryEvent, currentStory?.pages]);

  return null;
}

OnPageAddedRegister.propTypes = {
  currentStory: PropTypes.shape({
    story: PropTypes.shape({
      pages: PropTypes.array,
    }),
  }),
  prevStory: PropTypes.shape({
    story: PropTypes.shape({
      pages: PropTypes.array,
    }),
  }),
  dispatchStoryEvent: PropTypes.func.isRequired,
};

export { OnPageAddedRegister };
