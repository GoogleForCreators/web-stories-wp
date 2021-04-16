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
import { useReducer, useEffect, useMemo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { createContext } from '../../../../design-system';
import { STORY_EVENTS, OnDirtyRegister } from './storyEvents';

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

const initialStoryEventQueue = Object.values(STORY_EVENTS).reduce(
  (accum, evenType) => ({
    ...accum,
    [evenType]: false,
  }),
  {}
);

function reducer([currentStory], updatedStory) {
  return [updatedStory, currentStory];
}

export function StoryTriggersProvider({ children, story }) {
  const [eventQueue, setEventQueue] = useState(initialStoryEventQueue);

  // store prev & next versions of store
  const [[currentStory, previousStory], updateStory] = useReducer(reducer, [
    story,
    null,
  ]);
  const subscriptionMap = useMemo(createSubscriptionMap, []);

  // Update story to derive events
  useEffect(() => updateStory(story), [story]);

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
  const dispatchStoryEvent = useCallback((eventType) => {
    setEventQueue((eventMap) => ({
      ...eventMap,
      [eventType]: true,
    }));
  }, []);

  // Memoizing provider values
  const value = useMemo(() => [addEventListener, dispatchStoryEvent], [
    addEventListener,
    dispatchStoryEvent,
  ]);

  return (
    <Context.Provider value={value}>
      <>
        {/* just pass dispatcher and previous and current story into
        a component that returns null, but can use some internal
        hooks to manage and dispatch events */}
        <OnDirtyRegister
          currentStory={currentStory}
          previousStory={previousStory}
          dispatchStoryEvent={dispatchStoryEvent}
        />
        {children}
      </>
    </Context.Provider>
  );
}

StoryTriggersProvider.propTypes = {
  story: PropTypes.object,
  children: PropTypes.node,
};
