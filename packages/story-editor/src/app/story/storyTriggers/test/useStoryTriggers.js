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
import PropTypes from 'prop-types';
import { renderHook, act } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { useStoryTriggers, StoryTriggersProvider, STORY_EVENTS } from '..';

function createProviderWithStory(story) {
  function ProviderWithStory({ children }) {
    return (
      <StoryTriggersProvider story={story}>{children}</StoryTriggersProvider>
    );
  }
  ProviderWithStory.propTypes = {
    children: PropTypes.node,
  };
  return ProviderWithStory;
}

describe('useStoryTriggers', () => {
  it('provides working dispatch and listener methods for story events', () => {
    const story = {};
    const listenerMock = jest.fn();
    const { result } = renderHook(() => useStoryTriggers(), {
      wrapper: createProviderWithStory(story),
    });

    const [addEventListener] = result.current;

    // Should return cleanup method
    let cleanup;
    act(() => {
      cleanup = addEventListener(
        STORY_EVENTS.onInitialElementAdded,
        listenerMock
      );
    });
    expect(typeof cleanup).toBe('function');

    // dispatching subscribed event calls all listeners
    // with current story passed to the provider
    let [, dispatchStoryEvent] = result.current;
    dispatchStoryEvent(STORY_EVENTS.onInitialElementAdded);
    expect(listenerMock).toHaveBeenCalledTimes(1);
    expect(listenerMock).toHaveBeenCalledWith(story);

    // dispatching a different story event doesn't call
    // the listener of another story event
    dispatchStoryEvent('This is not a supported story event');
    expect(listenerMock).toHaveBeenCalledTimes(1);

    // Dispatching an event after a listener
    // has cleaned up should not call that listener
    act(() => {
      cleanup();
    });
    dispatchStoryEvent = result.current[1];
    dispatchStoryEvent(STORY_EVENTS.onInitialElementAdded);
    expect(listenerMock).toHaveBeenCalledTimes(1);
  });
});
