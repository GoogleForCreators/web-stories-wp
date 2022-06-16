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
import { renderHook, act } from '@testing-library/react';

/**
 * Internal dependencies
 */
import ApiProvider from '../apiProvider';
import { ConfigProvider } from '../../config';
import useApi from '../useApi';

const fetchStories = () => {
  return Promise.resolve({
    stories: {
      123: {
        id: 123,
        status: 'publish',
        title: 'Carlos',
        created: '1970-01-01T00:00:00.000',
        createdGmt: '1970-01-01T00:00:00.000Z',
        modified: '1970-01-01T00:00:00.000',
        modifiedGmt: '1970-01-01T00:00:00.000Z',
        author: {
          name: 'admin',
          id: 1,
        },
        locked: false,
        lockUser: {
          id: 0,
          name: '',
          avatar: null,
        },
        bottomTargetAction:
          'https://www.story-link.com/wp-admin/post.php?id=123',
        featuredMediaUrl: 'https://www.featured-media-123',
        editStoryLink: 'https://www.story-link.com/wp-admin/post.php?id=123',
        previewLink: 'https://www.story-link.com/?preview=true',
        link: 'https://www.story-link.com',
        capabilities: {
          hasEditAction: false,
          hasDeleteAction: false,
        },
      },
    },
    fetchedStoryIds: [5],
    totalPages: 1,
    totalStoriesByStatus: {
      all: 1,
      publish: 1,
      draft: 0,
    },
  });
};

const storyResponse = (story) => {
  let title = '';
  let id = story.id || 456;
  if (story?.original_id) {
    id = 456;
    title = 'Carlos (Copy)';
  } else {
    title = typeof story.title === 'string' ? story.title : story.title.raw;
  }

  return Promise.resolve({
    id,
    status: 'publish',
    title,
    created: '1970-01-01T00:00:00.000',
    createdGmt: '1970-01-01T00:00:00.000Z',
    modified: '1970-01-01T00:00:00.000',
    modifiedGmt: '1970-01-01T00:00:00.000Z',
    author: {
      name: 'admin',
      id: 1,
    },
    locked: false,
    lockUser: {
      id: 0,
      name: '',
      avatar: null,
    },
    bottomTargetAction: `https://www.story-link.com/wp-admin/post.php?id=${id}`,
    featuredMediaUrl: `https://www.featured-media-${id}`,
    editStoryLink: `https://www.story-link.com/wp-admin/post.php?id=${id}`,
    previewLink: 'https://www.story-link.com/?preview=true',
    link: 'https://www.story-link.com',
    capabilities: {
      hasEditAction: false,
      hasDeleteAction: false,
    },
  });
};

const updateStory = (story) => {
  return storyResponse(story);
};

const duplicateStory = (story) => {
  story.original_id = story.id;

  return storyResponse(story);
};

const trashStory = ({ id }) => {
  return Promise.resolve({
    id,
    status: 'publish',
    title: { raw: 'Carlos', rendered: 'Carlos' },
    modified: '1970-01-01T00:00:00.000',
    modifiedGmt: '1970-01-01T00:00:00.000',
    date: '1970-01-01T00:00:00.000',
    dateGmt: '1970-01-01T00:00:00.000',
    link: 'https://www.story-link.com',
    editLink: 'https://www.story-link.com/wp-admin/post.php?id=' + id,
  });
};

describe('ApiProvider', () => {
  it('should return a story in state data when the API request is fired', async () => {
    const { result } = renderHook(() => useApi(), {
      wrapper: (props) => (
        <ConfigProvider
          config={{
            api: { stories: 'stories' },
            apiCallbacks: { fetchStories },
          }}
        >
          <ApiProvider {...props} />
        </ConfigProvider>
      ),
    });

    await act(async () => {
      await result.current.actions.storyApi.fetchStories({});
    });

    expect(result.current.state.stories.stories).toStrictEqual({
      123: {
        bottomTargetAction:
          'https://www.story-link.com/wp-admin/post.php?id=123',
        capabilities: {
          hasDeleteAction: false,
          hasEditAction: false,
        },
        editStoryLink: 'https://www.story-link.com/wp-admin/post.php?id=123',
        id: 123,
        modified: '1970-01-01T00:00:00.000',
        modifiedGmt: '1970-01-01T00:00:00.000Z',
        featuredMediaUrl: 'https://www.featured-media-123',
        created: '1970-01-01T00:00:00.000',
        createdGmt: '1970-01-01T00:00:00.000Z',
        author: {
          name: 'admin',
          id: 1,
        },
        link: 'https://www.story-link.com',
        lockUser: {
          avatar: null,
          id: 0,
          name: '',
        },
        locked: false,
        previewLink: 'https://www.story-link.com/?preview=true',
        status: 'publish',
        title: 'Carlos',
      },
    });
  });

  it('should return an updated story in state data when the API request is fired', async () => {
    const { result } = renderHook(() => useApi(), {
      wrapper: (props) => (
        <ConfigProvider
          config={{
            api: { stories: 'stories' },
            apiCallbacks: { fetchStories, updateStory },
          }}
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
        modified: undefined,
        status: 'publish',
        title: { raw: 'New Title' },
        link: 'https://www.story-link.com',
        editLink: 'https://www.story-link.com/wp-admin/post.php?id=123',
      });
    });

    expect(result.current.state.stories.stories).toStrictEqual({
      123: {
        bottomTargetAction:
          'https://www.story-link.com/wp-admin/post.php?id=123',
        capabilities: {
          hasDeleteAction: false,
          hasEditAction: false,
        },
        featuredMediaUrl: 'https://www.featured-media-123',
        editStoryLink: 'https://www.story-link.com/wp-admin/post.php?id=123',
        id: 123,
        modified: '1970-01-01T00:00:00.000',
        modifiedGmt: '1970-01-01T00:00:00.000Z',
        created: '1970-01-01T00:00:00.000',
        createdGmt: '1970-01-01T00:00:00.000Z',
        author: {
          name: 'admin',
          id: 1,
        },
        link: 'https://www.story-link.com',
        lockUser: {
          avatar: null,
          id: 0,
          name: '',
        },
        locked: false,
        previewLink: 'https://www.story-link.com/?preview=true',
        status: 'publish',
        title: 'New Title',
      },
    });
  });

  it('should return a duplicated story in state data when the duplicate method is called.', async () => {
    const { result } = renderHook(() => useApi(), {
      wrapper: (props) => (
        <ConfigProvider
          config={{
            api: { stories: 'stories' },
            apiCallbacks: { fetchStories, duplicateStory },
          }}
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
        id: 123,
      });
    });

    expect(result.current.state.stories.stories).toStrictEqual({
      123: {
        bottomTargetAction:
          'https://www.story-link.com/wp-admin/post.php?id=123',
        capabilities: {
          hasDeleteAction: false,
          hasEditAction: false,
        },
        featuredMediaUrl: 'https://www.featured-media-123',
        editStoryLink: 'https://www.story-link.com/wp-admin/post.php?id=123',
        id: 123,
        modified: '1970-01-01T00:00:00.000',
        modifiedGmt: '1970-01-01T00:00:00.000Z',
        created: '1970-01-01T00:00:00.000',
        createdGmt: '1970-01-01T00:00:00.000Z',
        author: {
          name: 'admin',
          id: 1,
        },
        link: 'https://www.story-link.com',
        lockUser: {
          avatar: null,
          id: 0,
          name: '',
        },
        locked: false,
        previewLink: 'https://www.story-link.com/?preview=true',
        status: 'publish',
        title: 'Carlos',
      },
      456: {
        bottomTargetAction:
          'https://www.story-link.com/wp-admin/post.php?id=456',
        capabilities: {
          hasDeleteAction: false,
          hasEditAction: false,
        },
        editStoryLink: 'https://www.story-link.com/wp-admin/post.php?id=456',
        featuredMediaUrl: 'https://www.featured-media-456',
        id: 456,
        modified: '1970-01-01T00:00:00.000',
        modifiedGmt: '1970-01-01T00:00:00.000Z',
        created: '1970-01-01T00:00:00.000',
        createdGmt: '1970-01-01T00:00:00.000Z',
        author: {
          name: 'admin',
          id: 1,
        },
        link: 'https://www.story-link.com',
        lockUser: {
          avatar: null,
          id: 0,
          name: '',
        },
        locked: false,
        previewLink: 'https://www.story-link.com/?preview=true',
        status: 'publish',
        title: 'Carlos (Copy)',
      },
    });
  });

  it('should delete a story when the trash story method is called.', async () => {
    const { result } = renderHook(() => useApi(), {
      wrapper: (props) => (
        <ConfigProvider
          config={{
            api: { stories: 'stories' },
            apiCallbacks: { fetchStories, trashStory },
          }}
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

  it('should call initialFetch listeners once when first storystatuses returned', async () => {
    const listenerMock = jest.fn();
    const { result } = renderHook(() => useApi(), {
      wrapper: (props) => (
        <ConfigProvider
          config={{
            api: { stories: 'stories' },
            apiCallbacks: { fetchStories },
          }}
        >
          <ApiProvider {...props} />
        </ConfigProvider>
      ),
    });

    act(() => {
      result.current.actions.storyApi.addInitialFetchListener(listenerMock);
    });

    await act(async () => {
      await result.current.actions.storyApi.fetchStories({});
    });

    expect(listenerMock).toHaveBeenCalledTimes(1);
    expect(listenerMock).toHaveBeenCalledWith({ all: 1, draft: 0, publish: 1 });

    // Run again just to make sure it doesn't call the listeners more than once
    await act(async () => {
      await result.current.actions.storyApi.fetchStories({});
    });

    expect(listenerMock).toHaveBeenCalledTimes(1);
  });
});
