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
import Modal from 'react-modal';
import { screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderWithTheme } from '../../../testUtils';
import ConfigContext from '../../../app/config/context';
import StoryContext from '../../../app/story/context';
import CurrentUserContext from '../../../app/currentUser/context';
import PostLock from '../postLock';
import APIContext from '../../../app/api/context';

function setup(response, _storyContextValue = {}) {
  const configValue = {
    storyId: 123,
    dashboardLink: 'http://www.example.com/dashboard',
    nonce: '12345',
    postLock: {
      interval: 150,
      showLockedDialog: true,
    },
  };

  const apiValue = {
    actions: {
      getStoryLockById: () => response,
      setStoryLockById: jest.fn(),
      deleteStoryLockById: jest.fn(),
    },
  };

  const storyContextValue = {
    state: {
      story: {
        previewLink: 'http://www.example.com/preview',
        lockUser: {
          id: 150,
          name: 'John Doe',
        },
      },
    },
    ..._storyContextValue,
  };

  const userContextValue = {
    state: {
      currentUser: {
        id: 150,
        name: 'John Doe',
      },
    },
  };

  const { getByRole } = renderWithTheme(
    <FlagsProvider features={{ enablePostLocking: true }}>
      <ConfigContext.Provider value={configValue}>
        <APIContext.Provider value={apiValue}>
          <StoryContext.Provider value={storyContextValue}>
            <CurrentUserContext.Provider value={userContextValue}>
              <PostLock />
            </CurrentUserContext.Provider>
          </StoryContext.Provider>
        </APIContext.Provider>
      </ConfigContext.Provider>
    </FlagsProvider>
  );

  return { getByRole };
}
describe('PostLock', () => {
  let modalWrapper;

  beforeAll(() => {
    jest.useFakeTimers();
    modalWrapper = document.createElement('aside');
    document.documentElement.appendChild(modalWrapper);
    Modal.setAppElement(modalWrapper);
  });

  afterAll(() => {
    document.documentElement.removeChild(modalWrapper);
    jest.runAllTimers();
  });

  it('should display take over dialog', async () => {
    const storyContextValue = {
      state: {
        story: {
          previewLink: 'http://www.example.com/preview',
          lockUser: {
            id: 123,
            name: 'John Doe',
          },
        },
      },
    };
    setup(
      Promise.resolve({
        locked: true,
        user: 123,
        nonce: 'fsdfds',
        _embedded: { author: [{ id: 123, name: 'John Doe' }] },
      }),
      storyContextValue
    );

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const myStoriesButton = screen.getByText('My Stories');
    expect(myStoriesButton).toBeInTheDocument();

    const takeOverButton = screen.getByRole('button', { name: 'Take over' });
    expect(takeOverButton).toBeInTheDocument();
  });

  it('should display dialog', async () => {
    setup(
      Promise.resolve({
        locked: true,
        user: 123,
        nonce: 'fsdfds',
        _embedded: { author: [{ id: 123, name: 'John Doe' }] },
      })
    );

    jest.advanceTimersByTime(152 * 1000);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const myStoriesButton = screen.getByText('My Stories');
    expect(myStoriesButton).toBeInTheDocument();
    expect(
      screen.getByText('John Doe now has editing control of this story.')
    ).toBeInTheDocument();
  });

  it('should not display dialog', async () => {
    setup(
      Promise.resolve({
        locked: true,
        user: 150,
        nonce: 'fsdfds',
        _embedded: { author: [{ id: 150, name: 'John Doe' }] },
      })
    );

    await expect(screen.findByRole('dialog')).rejects.toThrow(
      /Unable to find role="dialog"/
    );
  });

  it('should register beforeunload listener', () => {
    jest.spyOn(window, 'addEventListener');
    setup(
      Promise.resolve({
        locked: true,
        user: 150,
        nonce: 'fsdfds',
        _embedded: { author: [{ id: 150, name: 'John Doe' }] },
      })
    );
    expect(window.addEventListener).toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    );
  });
});
