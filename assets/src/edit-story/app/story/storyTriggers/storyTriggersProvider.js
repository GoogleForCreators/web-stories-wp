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
<<<<<<< HEAD
import { useReducer, useEffect, useMemo, useCallback } from 'react';
=======
import { useReducer, useEffect, useMemo, useCallback, useState } from 'react';
>>>>>>> 9a90c03ea (working initial implementation)
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { createContext } from '../../../../design-system';
<<<<<<< HEAD
import { STORY_EVENTS, StoryEventRegisters } from './storyEvents';
=======
import { STORY_EVENTS, OnDirtyRegister } from './storyEvents';
>>>>>>> 9a90c03ea (working initial implementation)

export const Context = createContext({ state: {}, actions: {} });

function createSubscriptionMap() {
  return Object.values(STORY_EVENTS).reduce(
    (accum, evenType) => ({
      ...accum,
      [evenType]: new Map(),
    }),
    {}
  );
}

<<<<<<< HEAD
=======
const initialStoryEventQueue = Object.values(STORY_EVENTS).reduce(
  (accum, evenType) => ({
    ...accum,
    [evenType]: false,
  }),
  {}
);

>>>>>>> 9a90c03ea (working initial implementation)
function reducer([currentStory], updatedStory) {
  return [updatedStory, currentStory];
}

export function StoryTriggersProvider({ children, story }) {
<<<<<<< HEAD
  // store prev & next versions of story to help compute internally fired events.
  // Not sure if this is necesarilly needed but was used a lot in FTUE. Lets keep
  // an eye on this as we create more internal event registers, and we can always
  // remove if we end up not using it.
=======
  const [eventQueue, setEventQueue] = useState(initialStoryEventQueue);

  // store prev & next versions of store
>>>>>>> 9a90c03ea (working initial implementation)
  const [[currentStory, previousStory], updateStory] = useReducer(reducer, [
    story,
    null,
  ]);
  const subscriptionMap = useMemo(createSubscriptionMap, []);

  // Update story to derive events
  useEffect(() => updateStory(story), [story]);

<<<<<<< HEAD
=======
  // Fire off and flush queued events
  useEffect(() => {
    Object.entries(eventQueue)
      .filter(([, isFiring]) => isFiring)
      .map(([e]) => e)
      .forEach((e) => {
        subscriptionMap[e.type].forEach((listener) => listener(currentStory));
      });

    setEventQueue(initialStoryEventQueue);
  }, [subscriptionMap, eventQueue, currentStory]);

>>>>>>> 9a90c03ea (working initial implementation)
  // Method provided to listen to story events
  // return self cleanup method
  const addEventListener = useCallback(
    (eventType, listener) => {
      const key = Symbol();
      subscriptionMap[eventType].set(key, listener);
      return () => subscriptionMap[eventType].delete(key);
    },
    [subscriptionMap]
  );

  // Method to push events into the queue
<<<<<<< HEAD
  const dispatchStoryEvent = useCallback(
    (eventType) => {
      subscriptionMap[eventType]?.forEach((listener) => listener(currentStory));
    },
    [subscriptionMap, currentStory]
  );
=======
  const dispatchStoryEvent = useCallback((eventType) => {
    setEventQueue((eventMap) => ({
      ...eventMap,
      [eventType]: true,
    }));
  }, []);
>>>>>>> 9a90c03ea (working initial implementation)

  // Memoizing provider values
  const value = useMemo(() => [addEventListener, dispatchStoryEvent], [
    addEventListener,
    dispatchStoryEvent,
  ]);

  return (
    <Context.Provider value={value}>
      <>
<<<<<<< HEAD
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
=======
        {/* just pass dispatcher and previous and current story into
        a component that returns null, but can use some internal
        hooks to manage and dispatch events */}
        <OnDirtyRegister
          currentStory={currentStory}
          previousStory={previousStory}
          dispatchStoryEvent={dispatchStoryEvent}
        />
>>>>>>> 9a90c03ea (working initial implementation)
        {children}
      </>
    </Context.Provider>
  );
}

StoryTriggersProvider.propTypes = {
  story: PropTypes.object,
  children: PropTypes.node,
};
