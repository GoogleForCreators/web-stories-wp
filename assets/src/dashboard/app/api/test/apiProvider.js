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
        'X-WP-Total': 1,
        'X-WP-TotalPages': 1,
        'X-WP-TotalByStatus': '{"all":1,"publish":1,"draft":0}',
      },
      body: [
        {
          id: 123,
          status: 'publish',
          author: 1,
          title: { rendered: 'Carlos', raw: 'Carlos' },
          story_data: { pages: [{ id: 1, elements: [] }] },
          modified: '1970-01-01T00:00:00.000Z',
          date: '1970-01-01T00:00:00.000Z',
        },
      ],
    }),
  post: (path, { data }) => {
    const title = typeof data.title === 'string' ? data.title : data.title.raw;
    return Promise.resolve({
      id: data.id || 456,
      status: 'publish',
      title: { rendered: title, raw: title },
      author: 1,
      story_data: { pages: [{ id: 1, elements: [] }] },
      modified: '1970-01-01T00:00:00.000Z',
      date: '1970-01-01T00:00:00.000Z',
    });
  },
  deleteRequest: (path, { data }) =>
    Promise.resolve({
      id: data.id,
      status: 'publish',
      title: { rendered: data.title, raw: data.title },
      story_data: { pages: [{ id: 1, elements: [] }] },
      modified: '1970-01-01T00:00:00.000Z',
      date: '1970-01-01T00:00:00.000Z',
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
        editStoryLink: 'editStory&post=123',
        id: 123,
        modified: moment('1970-01-01T00:00:00.000Z'),
        created: moment('1970-01-01T00:00:00.000Z'),
        author: 1,
        originalStoryData: {
          id: 123,
          modified: '1970-01-01T00:00:00.000Z',
          date: '1970-01-01T00:00:00.000Z',
          status: 'publish',
          author: 1,
          story_data: {
            pages: [
              {
                elements: [],
                id: 1,
              },
            ],
          },
          title: {
            raw: 'Carlos',
            rendered: 'Carlos',
          },
        },
        pages: [
          {
            elements: [],
            id: 1,
          },
        ],
        status: 'publish',
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
        status: 'publish',
        title: 'New Title',
      });
    });

    expect(result.current.state.stories.stories).toStrictEqual({
      '123': {
        bottomTargetAction: 'editStory&post=123',
        centerTargetAction: '',
        editStoryLink: 'editStory&post=123',
        id: 123,
        modified: moment('1970-01-01T00:00:00.000Z'),
        created: moment('1970-01-01T00:00:00.000Z'),
        author: 1,
        originalStoryData: {
          id: 123,
          modified: '1970-01-01T00:00:00.000Z',
          date: '1970-01-01T00:00:00.000Z',
          status: 'publish',
          author: 1,
          story_data: {
            pages: [
              {
                elements: [],
                id: 1,
              },
            ],
          },
          title: {
            raw: 'New Title',
            rendered: 'New Title',
          },
        },
        pages: [
          {
            elements: [],
            id: 1,
          },
        ],
        status: 'publish',
        title: 'New Title',
      },
    });
  });

  it('should return an duplicated story in state data when the duplicate method is called.', async () => {
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
      await result.current.actions.storyApi.duplicateStory({
        pages: [
          {
            elements: [],
            id: 1,
          },
        ],
        status: 'publish',
        title: 'Carlos',
        author: 1,
        originalStoryData: {
          story_data: {
            author: 1,
            pages: [
              {
                elements: [],
                id: 1,
              },
            ],
          },
          title: {
            raw: 'Carlos',
          },
        },
      });
    });

    expect(result.current.state.stories.stories).toStrictEqual({
      '123': {
        bottomTargetAction: 'editStory&post=123',
        centerTargetAction: '',
        editStoryLink: 'editStory&post=123',
        id: 123,
        modified: moment('1970-01-01T00:00:00.000Z'),
        created: moment('1970-01-01T00:00:00.000Z'),
        author: 1,
        originalStoryData: {
          id: 123,
          modified: '1970-01-01T00:00:00.000Z',
          date: '1970-01-01T00:00:00.000Z',
          status: 'publish',
          author: 1,
          story_data: {
            pages: [
              {
                elements: [],
                id: 1,
              },
            ],
          },
          title: {
            raw: 'Carlos',
            rendered: 'Carlos',
          },
        },
        pages: [
          {
            elements: [],
            id: 1,
          },
        ],
        status: 'publish',
        title: 'Carlos',
      },
      '456': {
        bottomTargetAction: 'editStory&post=456',
        centerTargetAction: '',
        editStoryLink: 'editStory&post=456',
        id: 456,
        modified: moment('1970-01-01T00:00:00.000Z'),
        created: moment('1970-01-01T00:00:00.000Z'),
        author: 1,
        originalStoryData: {
          id: 456,
          modified: '1970-01-01T00:00:00.000Z',
          date: '1970-01-01T00:00:00.000Z',
          status: 'publish',
          author: 1,
          story_data: {
            pages: [
              {
                elements: [],
                id: 1,
              },
            ],
          },
          title: {
            raw: 'Carlos (Copy)',
            rendered: 'Carlos (Copy)',
          },
        },
        pages: [
          {
            elements: [],
            id: 1,
          },
        ],
        status: 'publish',
        title: 'Carlos (Copy)',
      },
    });
  });

  it('should delete a story when the trash story method is called.', async () => {
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
      await result.current.actions.storyApi.trashStory({
        id: 123,
      });
    });

    expect(result.current.state.stories.stories).toStrictEqual({});
  });
});
