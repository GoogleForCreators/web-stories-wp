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
import { FlagsProvider } from 'flagged';
import { setAppElement } from '@googleforcreators/design-system';
import { screen, act, waitFor } from '@testing-library/react';
import {
  ConfigContext,
  StoryContext,
  CurrentUserContext,
  HistoryContext,
} from '@googleforcreators/story-editor';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import {
  getStoryLockById,
  setStoryLockById,
  deleteStoryLockById,
} from '../../../api/storyLock';
import PostLock from '../postLock';

jest.mock('../../../api/storyLock');

const autoSave = jest.fn();

function setup({
  extraStoryContextValue = {},
  extraConfigValue = {},
  extraHistoryProps = {},
}) {
  const configValue = {
    storyId: 123,
    dashboardLink: 'http://www.example.com/dashboard',
    nonce: '12345',
    postLock: {
      interval: 150,
      showLockedDialog: true,
    },
    api: {
      stories: '',
      storyLocking: '',
    },
    flags: {
      enablePostLockingTakeOver: true,
    },
    ...extraConfigValue,
  };

  const storyContextValue = {
    state: {
      story: {
        previewLink: 'http://www.example.com/preview',
        extras: {
          lockUser: {
            id: 150,
            name: 'John Doe',
          },
        },
      },
    },
    actions: {
      autoSave,
    },
    ...extraStoryContextValue,
  };

  const userContextValue = {
    state: {
      currentUser: {
        id: 150,
        name: 'John Doe',
      },
    },
  };

  const historyContextValue = {
    state: { ...extraHistoryProps },
  };

  return renderWithTheme(
    <FlagsProvider features={configValue.flags}>
      <HistoryContext.Provider value={historyContextValue}>
        <ConfigContext.Provider value={configValue}>
          <StoryContext.Provider value={storyContextValue}>
            <CurrentUserContext.Provider value={userContextValue}>
              <PostLock />
            </CurrentUserContext.Provider>
          </StoryContext.Provider>
        </ConfigContext.Provider>
      </HistoryContext.Provider>
    </FlagsProvider>
  );
}
describe('PostLock', () => {
  let modalWrapper;

  beforeAll(() => {
    jest.useFakeTimers();
    modalWrapper = document.createElement('aside');
    document.documentElement.appendChild(modalWrapper);
    setAppElement(modalWrapper);

    setStoryLockById.mockReturnValue(Promise.resolve());
    deleteStoryLockById.mockReturnValue(Promise.resolve());
  });

  afterAll(() => {
    document.documentElement.removeChild(modalWrapper);
    jest.runAllTimers();
  });

  it('should display take over dialog', async () => {
    const extraStoryContextValue = {
      state: {
        story: {
          previewLink: 'http://www.example.com/preview',
          extras: {
            lockUser: {
              id: 123,
              name: 'John Doe',
            },
          },
        },
      },
    };

    getStoryLockById.mockReturnValue(
      Promise.resolve({
        locked: true,
        user: 123,
        nonce: 'fsdfds',
        _embedded: { author: [{ id: 123, name: 'John Doe' }] },
      })
    );

    setup({ extraStoryContextValue });

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const dashboardButton = screen.getByRole('link', { name: /Dashboard/i });
    expect(dashboardButton).toBeInTheDocument();

    const takeOverButton = screen.getByRole('button', { name: 'Take over' });
    expect(takeOverButton).toBeInTheDocument();
  });

  it('should display take over dialog with no take over', async () => {
    const extraStoryContextValue = {
      state: {
        story: {
          previewLink: 'http://www.example.com/preview',
          extras: {
            lockUser: {
              id: 123,
              name: 'John Doe',
            },
          },
        },
      },
    };

    getStoryLockById.mockReturnValue(
      Promise.resolve({
        locked: true,
        user: 123,
        nonce: 'fsdfds',
        _embedded: { author: [{ id: 123, name: 'John Doe' }] },
      })
    );

    const extraConfigValue = {
      flags: {
        enablePostLockingTakeOver: false,
      },
    };

    setup({ extraStoryContextValue, extraConfigValue });

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const dashboardButton = screen.getByRole('link', {
      name: /Dashboard/i,
    });
    expect(dashboardButton).toBeInTheDocument();

    const takeOverButton = screen.queryByRole('button', { name: 'Take over' });
    expect(takeOverButton).not.toBeInTheDocument();
  });

  // eslint-disable-next-line jest/no-disabled-tests -- Investigate issues with timer in test.
  it.skip('should display dialog', async () => {
    jest.spyOn(window, 'setInterval');

    getStoryLockById.mockReturnValue(
      Promise.resolve({
        locked: true,
        user: 123,
        nonce: 'fsdfds',
        _embedded: { author: [{ id: 123, name: 'John Doe' }] },
      })
    );

    setup();

    expect(setInterval).toHaveBeenCalledOnce();

    act(() => {
      jest.advanceTimersByTime(160 * 1000);
    });

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByRole('link', { name: 'Dashboard' })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText('John Doe now has editing control of this story.')
    ).toBeInTheDocument();
  });

  it('should autosave', () => {
    jest.spyOn(window, 'setInterval');

    getStoryLockById.mockReturnValue(
      Promise.resolve({
        locked: true,
        user: 123,
        nonce: 'fsdfds',
        _embedded: { author: [{ id: 123, name: 'John Doe' }] },
      })
    );

    const extraConfigValue = {
      flags: {
        enablePostLockingTakeOver: true,
      },
    };

    const extraHistoryProps = { hasNewChanges: true };

    setup({ extraConfigValue, extraHistoryProps });

    expect(setInterval).toHaveBeenCalledOnce();

    act(() => {
      jest.advanceTimersByTime(160 * 1000);
    });

    expect(autoSave).toHaveBeenCalledWith();
  });

  it('should not display dialog', () => {
    getStoryLockById.mockReturnValue(
      Promise.resolve({
        locked: true,
        user: 150,
        nonce: 'fsdfds',
        _embedded: { author: [{ id: 150, name: 'John Doe' }] },
      })
    );

    setup({});

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should register beforeunload listener', () => {
    jest.spyOn(window, 'addEventListener');

    getStoryLockById.mockReturnValue(
      Promise.resolve({
        locked: true,
        user: 150,
        nonce: 'fsdfds',
        _embedded: { author: [{ id: 150, name: 'John Doe' }] },
      })
    );
    setup({});

    expect(window.addEventListener).toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    );
  });
});
