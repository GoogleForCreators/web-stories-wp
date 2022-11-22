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
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  createContext,
} from '@googleforcreators/react';
import type { PropsWithChildren } from 'react';

/**
 * Internal dependencies
 */
import type { State, StoryTriggersState } from '../../../types';
import { STORY_EVENTS, StoryEventRegisters } from './storyEvents';

export const Context = createContext<StoryTriggersState>([]);

type Listener = (story?: State) => void;
function createSubscriptionMap(): Record<string, Map<symbol, Listener>> {
  return Object.values(STORY_EVENTS).reduce(
    (accum, evenType) => ({
      ...accum,
      [evenType]: new Map(),
    }),
    {}
  );
}

function reducer([currentStory]: StoryTuple, updatedStory: State): StoryTuple {
  return [updatedStory, currentStory];
}

type StoryTuple = [State, State | null];
export function StoryTriggersProvider({
  children,
  story,
}: PropsWithChildren<{ story: State }>) {
  // store prev & next versions of story to help compute internally fired events.
  // Not sure if this is necessarily needed but was used a lot in FTUE. Lets keep
  // an eye on this as we create more internal event registers, and we can always
  // remove if we end up not using it.
  const [[currentStory, previousStory], updateStory] = useReducer(reducer, [
    story,
    null,
  ] as StoryTuple);
  const subscriptionMap = useMemo(createSubscriptionMap, []);

  // Update story to derive events
  useEffect(() => updateStory(story), [story]);

  // Method provided to listen to story events
  // return self cleanup method
  const addEventListener = useCallback(
    (eventType: string, listener: Listener) => {
      const key = Symbol();
      subscriptionMap[eventType].set(key, listener);
      return () => subscriptionMap[eventType].delete(key);
    },
    [subscriptionMap]
  );

  // Method to push events into the queue
  const dispatchStoryEvent = useCallback(
    (eventType) => {
      subscriptionMap[eventType as keyof typeof subscriptionMap]?.forEach(
        (listener) => listener(currentStory)
      );
    },
    [subscriptionMap, currentStory]
  );

  // Memoizing provider values
  const value = useMemo(
    () => [addEventListener, dispatchStoryEvent],
    [addEventListener, dispatchStoryEvent]
  );

  return (
    <Context.Provider value={value}>
      <>
        {
          // Story event registers used to manage and fire
          // story events internally. These should only dispatch
          // events based on current & previous story and internal
          // react state. Similar to DOM EventTarget API
          //
          // If we find ourselves passing more in here
          // we should probably just be pulling the `dispatchStoryEvent`
          // method from the provider to dispatch events.
          StoryEventRegisters.map((StoryEventRegister) => (
            <StoryEventRegister
              key={StoryEventRegister.name}
              currentStory={currentStory}
              previousStory={previousStory}
              dispatchStoryEvent={dispatchStoryEvent}
            />
          ))
        }
        {children}
      </>
    </Context.Provider>
  );
}
