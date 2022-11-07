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
import {
  useEffect,
  identity,
  useContextSelector,
} from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { Context } from './storyTriggersProvider';

export function useStoryTriggers(selector) {
  return useContextSelector(Context, selector ?? identity);
}

function getAddEventListener(v) {
  return v[0];
}

function getDispatch(v) {
  return v[1];
}

/**
 * Example usage:
 * ```js
 *  useStoryTriggerListener(
      STORY_EVENTS.onInitialElementAdded,
      useCallback((story) => {
        // do something with new story data
        // on this event
      }, [])
    )
 * ```
 *
 * @param {string} eventType a `STORY_EVENT`
 * @param {Function} listener preferably memoized.
 * @return {void}
 */
export function useStoryTriggerListener(eventType, listener) {
  const addEventListener = useContextSelector(Context, getAddEventListener);
  useEffect(
    () => addEventListener(eventType, listener),
    [eventType, listener, addEventListener]
  );
}

/**
 * Example usage:
 * ```js
 *  const dispatchStoryEvent = useStoryTriggersDispatch();
 *   // later in some effect or action
 *  dispatchStoryEvent(STORY_EVENTS.onInitialElementAdded);
 * ```
 *
 * @return {Function} takes and dispatches a `STORY_EVENT`
 */
export function useStoryTriggersDispatch() {
  return useContextSelector(Context, getDispatch);
}
