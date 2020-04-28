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
import moment from 'moment';

/**
 * Internal dependencies
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { useContext } from 'react';
import ApiProvider, { ApiContext } from '../apiProvider';
import { ConfigProvider } from '../../config';

jest.mock('../wpAdapter', () => ({
  get: () =>
    Promise.resolve({
      headers: {
        get: () => '1',
      },
      json: () =>
        Promise.resolve([
          {
            id: 123,
            status: 'published',
            title: { rendered: 'Carlos', raw: 'Carlos' },
            story_data: { pages: [{ id: 1, elements: [] }] },
            modified: '1970-01-01T00:00:00.000Z',
          },
        ]),
    }),
  post: (path, { data }) =>
    Promise.resolve({
      id: data.id,
      status: 'published',
      title: { rendered: data.title, raw: data.title },
      story_data: { pages: [{ id: 1, elements: [] }] },
      modified: '1970-01-01T00:00:00.000Z',
    }),
}));

describe('ApiProvider', () => {
  it('should return a story in state data when the API request is fired', async () => {
    const { result } = renderHook(() => useContext(ApiContext), {
      // eslint-disable-next-line react/display-name
      wrapper: (props) => (
        <ConfigProvider
          config={{ api: { stories: 'stories' }, editStoryURL: 'editStory' }}
        >
          <ApiProvider {...props} />
        </ConfigProvider>
      ),
    });

    await act(async () => {
      await result.current.actions.storyApi.fetchStories({});
    });

    expect(result.current.state.stories.stories).toStrictEqual({
      '123': {
        bottomTargetAction: 'editStory&post=123',
        centerTargetAction: '',
        id: 123,
        modified: moment('1970-01-01T00:00:00.000Z'),
        pages: [
          {
            elements: [],
            id: 1,
          },
        ],
        status: 'published',
        title: 'Carlos',
      },
    });
  });

  it('should return an updated story in state data when the API request is fired', async () => {
    const { result } = renderHook(() => useContext(ApiContext), {
      // eslint-disable-next-line react/display-name
      wrapper: (props) => (
        <ConfigProvider
          config={{ api: { stories: 'stories' }, editStoryURL: 'editStory' }}
        >
          <ApiProvider {...props} />
        </ConfigProvider>
      ),
    });

    await act(async () => {
      await result.current.actions.storyApi.fetchStories({});
    });

    await act(async () => {
      await result.current.actions.storyApi.updateStory({
        id: 123,
        modified: moment('1970-01-01T00:00:00.000Z'),
        pages: [
          {
            elements: [],
            id: 1,
          },
        ],
        status: 'published',
        title: 'New Title',
      });
    });

    expect(result.current.state.stories.stories).toStrictEqual({
      '123': {
        bottomTargetAction: 'editStory&post=123',
        centerTargetAction: '',
        id: 123,
        modified: moment('1970-01-01T00:00:00.000Z'),
        pages: [
          {
            elements: [],
            id: 1,
          },
        ],
        status: 'published',
        title: 'New Title',
      },
    });
  });
});
