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
import LocalAutoSaveHandler from '..';
import useIsUploadingToStory from '../../../utils/useIsUploadingToStory';

jest.mock('../../../utils/useIsUploadingToStory');

const mockSaveLocal = jest.fn();
jest.mock('@googleforcreators/design-system', () => ({
  ...jest.requireActual('@googleforcreators/design-system'),
  sessionStore: {
    getItemByKey: jest.fn(() => false),
    setItemByKey: (key, data) => mockSaveLocal(key, data),
    deleteItemByKey: jest.fn(),
  },
}));

function setup({
  hasNewChanges = true,
  status = 'auto-draft',
  isUploading = false,
}) {
  const historyContextValue = { state: { hasNewChanges } };
  const configValue = {
    localAutoSaveInterval: 0.1,
  };
  const storyContextValue = {
    state: {
      story: { status, storyId: 1 },
      pages: [{ id: 1 }],
      meta: {
        isAutoSavingStory: false,
      },
    },
    actions: {
      restoreLocalAutoSave: jest.fn(),
    },
  };

  useIsUploadingToStory.mockImplementation(() => isUploading);

  render(
    <ConfigContext.Provider value={configValue}>
      <HistoryContext.Provider value={historyContextValue}>
        <StoryContext.Provider value={storyContextValue}>
          <LocalAutoSaveHandler />
        </StoryContext.Provider>
      </HistoryContext.Provider>
    </ConfigContext.Provider>
  );
}

describe('AutoSaveHandler', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    mockSaveLocal.mockRestore();
  });

  it('should trigger saving for auto-draft', () => {
    setup({});
    jest.runAllTimers();
    expect(mockSaveLocal).toHaveBeenLastCalledWith(
      'wp_stories_autosave_story_auto-draft',
      {
        pages: [{ id: 1 }],
        story: { status: 'auto-draft', storyId: 1 },
      }
    );
  });

  it('should trigger saving for a saved story', () => {
    setup({ status: 'draft' });
    jest.runAllTimers();
    expect(mockSaveLocal).toHaveBeenLastCalledWith(
      'wp_stories_autosave_story_1',
      {
        pages: [{ id: 1 }],
        story: { status: 'draft', storyId: 1 },
      }
    );
  });

  it('should not trigger saving in case of not having new changes', () => {
    setup({ hasNewChanges: false });
    jest.runAllTimers();
    expect(mockSaveLocal).toHaveBeenCalledTimes(0);
  });

  it('should not trigger saving when media is uploading', () => {
    setup({
      isUploading: true,
    });
    jest.runAllTimers();
    expect(mockSaveLocal).toHaveBeenCalledTimes(0);
  });
});
