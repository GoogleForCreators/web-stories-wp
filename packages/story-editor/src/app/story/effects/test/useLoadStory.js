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
import { renderHook } from '@testing-library/react-hooks';
import PropTypes from 'prop-types';
import { registerElementType } from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import { createStory } from '../../../api/test/_utils';
import useLoadStory from '../useLoadStory';
import APIContext from '../../../api/context';
import HistoryContext from '../../../history/context';
import ConfigContext from '../../../config/context';

const getStoryById = jest.fn();
const clearHistory = jest.fn();

const apiContextValue = { actions: { getStoryById } };
const historyContextValue = { actions: { clearHistory } };

function ContextWrapper({ children }) {
  const configValue = {
    globalAutoAdvance: true,
    globalPageDuration: 20,
  };
  return (
    <ConfigContext.Provider value={configValue}>
      <APIContext.Provider value={apiContextValue}>
        <HistoryContext.Provider value={historyContextValue}>
          {children}
        </HistoryContext.Provider>
      </APIContext.Provider>
    </ConfigContext.Provider>
  );
}

ContextWrapper.propTypes = {
  children: PropTypes.any.isRequired,
};

describe('useLoadStory', () => {
  beforeAll(() => {
    elementTypes.forEach(registerElementType);
  });

  beforeEach(() => {
    getStoryById.mockReset();
    clearHistory.mockReset();
  });

  it('should load draft story with identical date and modified as having no publish date', async () => {
    getStoryById.mockReturnValue(
      Promise.resolve(
        createStory({
          date: '2020-01-01T19:20:20',
          dateGmt: '2020-01-01T20:20:20',
          modified: '2020-01-01T19:20:20',
          status: 'draft',
        })
      )
    );

    const restore = jest.fn();
    await renderHook(
      () =>
        useLoadStory({
          storyId: 11,
          shouldLoad: true,
          restore,
        }),
      { wrapper: ContextWrapper }
    );

    expect(restore.mock.calls[0][0].story).toStrictEqual(
      expect.objectContaining({
        storyId: 11,
        title: 'title',
        date: null,
        modified: '2020-01-01T19:20:20',
        author: { id: 1, name: 'John Doe' },
        excerpt: 'excerpt',
        featuredMedia: { id: 0, height: 0, width: 0, url: '' },
        permalinkConfig: {
          prefix: 'http://localhost:8899/web-stories/',
          suffix: '',
        },
      })
    );
  });

  it('should load draft story with specific publish date set to that date', async () => {
    getStoryById.mockReturnValue(
      Promise.resolve(
        createStory({
          date: '2020-01-01T19:20:20',
          dateGmt: '2020-01-01T20:20:20',
          modified: '2019-01-01T19:20:20',
          status: 'draft',
        })
      )
    );

    const restore = jest.fn();
    await renderHook(
      () =>
        useLoadStory({
          storyId: 12,
          shouldLoad: true,
          restore,
        }),
      { wrapper: ContextWrapper }
    );

    expect(restore.mock.calls[0][0].story).toStrictEqual(
      expect.objectContaining({
        storyId: 12,
        title: 'title',
        date: '2020-01-01T19:20:20',
        modified: '2019-01-01T19:20:20',
        author: { id: 1, name: 'John Doe' },
        excerpt: 'excerpt',
        featuredMedia: { id: 0, height: 0, width: 0, url: '' },
        permalinkConfig: {
          prefix: 'http://localhost:8899/web-stories/',
          suffix: '',
        },
      })
    );
  });

  it('should load published story with identical date and modified with actual publish date', async () => {
    getStoryById.mockReturnValue(
      Promise.resolve(
        createStory({
          date: '2020-01-01T19:20:20',
          dateGmt: '2020-01-01T20:20:20',
          modified: '2020-01-01T19:20:20',
          status: 'published',
        })
      )
    );

    const restore = jest.fn();
    await renderHook(
      () =>
        useLoadStory({
          storyId: 13,
          shouldLoad: true,
          restore,
        }),
      { wrapper: ContextWrapper }
    );

    expect(restore.mock.calls[0][0].story).toStrictEqual(
      expect.objectContaining({
        storyId: 13,
        title: 'title',
        date: '2020-01-01T19:20:20',
        modified: '2020-01-01T19:20:20',
        author: { id: 1, name: 'John Doe' },
        excerpt: 'excerpt',
        featuredMedia: { id: 0, height: 0, width: 0, url: '' },
        permalinkConfig: {
          prefix: 'http://localhost:8899/web-stories/',
          suffix: '',
        },
      })
    );
  });

  it('should load story with global page advancement settings if undefined in story', async () => {
    getStoryById.mockReturnValue(Promise.resolve(createStory()));

    const restore = jest.fn();
    await renderHook(
      () =>
        useLoadStory({
          storyId: 11,
          shouldLoad: true,
          restore,
        }),
      { wrapper: ContextWrapper }
    );

    expect(restore.mock.calls[0][0].story).toStrictEqual(
      expect.objectContaining({
        storyId: 11,
        title: 'title',
        author: { id: 1, name: 'John Doe' },
        excerpt: 'excerpt',
        featuredMedia: { id: 0, height: 0, width: 0, url: '' },
        permalinkConfig: {
          prefix: 'http://localhost:8899/web-stories/',
          suffix: '',
        },
        autoAdvance: true,
        defaultPageDuration: 20,
      })
    );
  });
});
