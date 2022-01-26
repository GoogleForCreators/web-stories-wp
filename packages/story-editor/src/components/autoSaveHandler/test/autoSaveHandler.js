/*
 * Copyright 2020 Google LLC
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
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import HistoryContext from '../../../app/history/context';
import StoryContext from '../../../app/story/context';
import ConfigContext from '../../../app/config/context';
import AutoSaveHandler from '..';
import useIsUploadingToStory from '../../../utils/useIsUploadingToStory';

jest.mock('../../../utils/useIsUploadingToStory');

function setup({
  hasNewChanges = true,
  status = 'draft',
  autoSaveInterval = 0.1,
  isUploading = false,
}) {
  const saveStory = jest.fn();
  const historyContextValue = { state: { hasNewChanges } };
  const configValue = {
    autoSaveInterval,
  };
  const storyContextValue = {
    state: {
      story: { status },
    },
    actions: { saveStory },
  };

  useIsUploadingToStory.mockImplementation(() => isUploading);

  const { rerender } = render(
    <ConfigContext.Provider value={configValue}>
      <HistoryContext.Provider value={historyContextValue}>
        <StoryContext.Provider value={storyContextValue}>
          <AutoSaveHandler />
        </StoryContext.Provider>
      </HistoryContext.Provider>
    </ConfigContext.Provider>
  );
  const secondarySaveStory = jest.fn();
  const secondaryStoryContextValue = {
    state: {
      story: { status },
    },
    actions: { saveStory: secondarySaveStory },
  };
  const renderAgain = () => {
    rerender(
      <ConfigContext.Provider value={configValue}>
        <HistoryContext.Provider value={historyContextValue}>
          <StoryContext.Provider value={secondaryStoryContextValue}>
            <AutoSaveHandler />
          </StoryContext.Provider>
        </HistoryContext.Provider>
      </ConfigContext.Provider>
    );
    return secondarySaveStory;
  };
  return {
    saveStory,
    renderAgain,
  };
}

describe('AutoSaveHandler', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should trigger saving in case of a draft', () => {
    const { saveStory } = setup({});
    jest.runAllTimers();
    expect(saveStory).toHaveBeenCalledTimes(1);
  });

  it('should not trigger saving in case of not having new changes', () => {
    const { saveStory } = setup({ hasNewChanges: false });
    jest.runAllTimers();
    expect(saveStory).toHaveBeenCalledTimes(0);
  });

  it('should not trigger saving in case of a non-draft post', () => {
    const { saveStory } = setup({ hasNewChanges: true, status: 'publish' });
    jest.runAllTimers();
    expect(saveStory).toHaveBeenCalledTimes(0);
  });

  it('should not trigger saving when interval is 0', () => {
    const { saveStory } = setup({
      autoSaveInterval: 0,
    });
    jest.runAllTimers();
    expect(saveStory).toHaveBeenCalledTimes(0);
  });

  it('should not trigger saving when media is uploading', () => {
    const { saveStory } = setup({
      isUploading: true,
    });
    jest.runAllTimers();
    expect(saveStory).toHaveBeenCalledTimes(0);
  });

  it('should only setup one timeout even if saveStory updates', () => {
    jest.spyOn(window, 'setTimeout');

    const { renderAgain, saveStory } = setup({});
    // The number of invocations of setTimeout might vary due to other components
    // so the only thing we can check for sure is, that the number doesn't go up by
    // changing the props in the story handler.
    const timeoutCallsBefore = setTimeout.mock.calls.length;
    const secondarySaveStory = renderAgain();
    const timeoutCallsAfter = setTimeout.mock.calls.length;
    expect(timeoutCallsAfter).toBe(timeoutCallsBefore);

    expect(secondarySaveStory).not.toBe(saveStory);

    jest.runAllTimers();
    expect(saveStory).toHaveBeenCalledTimes(0);
    expect(secondarySaveStory).toHaveBeenCalledTimes(1);
  });
});
