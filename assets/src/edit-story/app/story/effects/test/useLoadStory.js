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
import React from 'react';

/**
 * Internal dependencies
 */
import { createStory } from '../../../api/test/_utils';
import useLoadStory from '../useLoadStory';
import APIContext from '../../../api/context';
import HistoryContext from '../../../history/context';

const getStoryById = jest.fn();
const getDemoStoryById = jest.fn();
const clearHistory = jest.fn();

const apiContextValue = { actions: { getStoryById, getDemoStoryById } };
const historyContextValue = { actions: { clearHistory } };

function ContextWrapper({ children }) {
  return (
    <APIContext.Provider value={apiContextValue}>
      <HistoryContext.Provider value={historyContextValue}>
        {children}
      </HistoryContext.Provider>
    </APIContext.Provider>
  );
}

ContextWrapper.propTypes = {
  children: PropTypes.any.isRequired,
};

describe('useLoadStory', () => {
  beforeEach(() => {
    getStoryById.mockReset();
    getDemoStoryById.mockReset();
    clearHistory.mockReset();
  });

  it('should load story', async () => {
    getStoryById.mockReturnValue(
      Promise.resolve(
        createStory({
          date: '2020-01-01T19:20:20',
          date_gmt: '2020-01-01T20:20:20',
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
          isDemo: false,
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
      })
    );
  });
});
