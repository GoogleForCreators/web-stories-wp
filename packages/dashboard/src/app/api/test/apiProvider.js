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
import { renderHook, act } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import ApiProvider from '../apiProvider';
import { ConfigProvider } from '../../config';
import useApi from '../useApi';
import { ERRORS } from '../../textContent';

const fetchStories = () => {
  return Promise.resolve({
    stories: {
      123: {
        id: 123,
        status: 'publish',
        title: 'Carlos',
        created: '1970-01-01T00:00:00.000',
        created_gmt: '1970-01-01T00:00:00.000Z',
        modified: '1970-01-01T00:00:00.000',
        modified_gmt: '1970-01-01T00:00:00.000Z',
        author: 'admin',
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
        originalStoryData: {
          id: 123,
          date: '1970-01-01T00:00:00.000',
          date_gmt: '1970-01-01T00:00:00.000',
          modified: '1970-01-01T00:00:00.000',
          modified_gmt: '1970-01-01T00:00:00.000',
          status: 'publish',
          link: 'https://www.story-link.com',
          title: {
            raw: 'Carlos',
            rendered: 'Carlos',
          },
          preview_link: 'https://www.story-link.com/?preview=true',
          edit_link: 'https://www.story-link.com/wp-admin/post.php?id=123',
          _embedded: {
            author: [{ id: 1, name: 'admin' }],
            'wp:featuredmedia': [
              { id: 0, source_url: 'https://www.featured-media-123' },
            ],
          },
        },
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

const getUser = function () {
  return Promise.resolve({
    id: 1,
    name: 'dev',
    url: 'https://www.story-link.com',
    description: '',
    link: 'https://www.story-link.com/author/dev/',
    slug: 'dev',
    avatar_urls: {},
    meta: {
      web_stories_tracking_optin: false,
      web_stories_media_optimization: true,
      web_stories_onboarding: {
        safeZone: true,
      },
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
    created_gmt: '1970-01-01T00:00:00.000Z',
    modified: '1970-01-01T00:00:00.000',
    modified_gmt: '1970-01-01T00:00:00.000Z',
    author: 'admin',
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
    originalStoryData: {
      id: id,
      date: '1970-01-01T00:00:00.000',
      date_gmt: '1970-01-01T00:00:00.000',
      modified: '1970-01-01T00:00:00.000',
      modified_gmt: '1970-01-01T00:00:00.000',
      status: 'publish',
      link: 'https://www.story-link.com',
      title: {
        raw: title,
        rendered: title,
      },
      author: 1,
      preview_link: 'https://www.story-link.com/?preview=true',
      edit_link: `https://www.story-link.com/wp-admin/post.php?id=${id}`,
      _embedded: {
        author: [{ id: 1, name: 'admin' }],
        'wp:featuredmedia': [
          { id: 0, source_url: `https://www.featured-media-${id}` },
        ],
      },
    },
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
  const {
    originalStoryData: { id },
  } = story;

  story.original_id = id;

  return storyResponse(story);
};

const trashStory = ({ id }) => {
  return Promise.resolve({
    id,
    status: 'publish',
    title: { raw: 'Carlos', rendered: 'Carlos' },
    modified: '1970-01-01T00:00:00.000',
    modified_gmt: '1970-01-01T00:00:00.000',
    date: '1970-01-01T00:00:00.000',
    date_gmt: '1970-01-01T00:00:00.000',
    link: 'https://www.story-link.com',
    preview_link: 'https://www.story-link.com/?preview=true',
    edit_link: 'https://www.story-link.com/wp-admin/post.php?id=' + id,
  });
};

describe('ApiProvider', () => {
  it('should return a story in state data when the API request is fired', async () => {
    const { result } = renderHook(() => useApi(), {
      wrapper: (props) => (
        <ConfigProvider
          config={{
            api: { stories: 'stories' },
            apiCallbacks: { fetchStories, getUser },
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
        modified_gmt: '1970-01-01T00:00:00.000Z',
        featuredMediaUrl: 'https://www.featured-media-123',
        created: '1970-01-01T00:00:00.000',
        created_gmt: '1970-01-01T00:00:00.000Z',
        author: 'admin',
        link: 'https://www.story-link.com',
        lockUser: {
          avatar: null,
          id: 0,
          name: '',
        },
        locked: false,
        originalStoryData: {
          id: 123,
          modified: '1970-01-01T00:00:00.000',
          modified_gmt: '1970-01-01T00:00:00.000',
          preview_link: 'https://www.story-link.com/?preview=true',
          edit_link: 'https://www.story-link.com/wp-admin/post.php?id=123',
          date: '1970-01-01T00:00:00.000',
          date_gmt: '1970-01-01T00:00:00.000',
          status: 'publish',
          link: 'https://www.story-link.com',
          title: {
            raw: 'Carlos',
            rendered: 'Carlos',
          },
          _embedded: {
            author: [{ id: 1, name: 'admin' }],
            'wp:featuredmedia': [
              { id: 0, source_url: 'https://www.featured-media-123' },
            ],
          },
        },
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
            apiCallbacks: { fetchStories, getUser, updateStory },
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
        preview_link: 'https://www.story-link.com/?preview=true',
        edit_link: 'https://www.story-link.com/wp-admin/post.php?id=123',
        originalStoryData: {
          author: 1,
        },
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
        modified_gmt: '1970-01-01T00:00:00.000Z',
        created: '1970-01-01T00:00:00.000',
        created_gmt: '1970-01-01T00:00:00.000Z',
        author: 'admin',
        link: 'https://www.story-link.com',
        lockUser: {
          avatar: null,
          id: 0,
          name: '',
        },
        locked: false,
        originalStoryData: {
          id: 123,
          modified: '1970-01-01T00:00:00.000',
          modified_gmt: '1970-01-01T00:00:00.000',
          preview_link: 'https://www.story-link.com/?preview=true',
          edit_link: 'https://www.story-link.com/wp-admin/post.php?id=123',
          date: '1970-01-01T00:00:00.000',
          date_gmt: '1970-01-01T00:00:00.000',
          status: 'publish',
          author: 1,
          link: 'https://www.story-link.com',
          title: {
            raw: 'New Title',
            rendered: 'New Title',
          },
          _embedded: {
            author: [{ id: 1, name: 'admin' }],
            'wp:featuredmedia': [
              { id: 0, source_url: 'https://www.featured-media-123' },
            ],
          },
        },
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
            apiCallbacks: { fetchStories, getUser, duplicateStory },
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
        originalStoryData: { id: 123 },
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
        modified_gmt: '1970-01-01T00:00:00.000Z',
        created: '1970-01-01T00:00:00.000',
        created_gmt: '1970-01-01T00:00:00.000Z',
        author: 'admin',
        link: 'https://www.story-link.com',
        lockUser: {
          avatar: null,
          id: 0,
          name: '',
        },
        locked: false,
        originalStoryData: {
          id: 123,
          modified: '1970-01-01T00:00:00.000',
          modified_gmt: '1970-01-01T00:00:00.000',
          preview_link: 'https://www.story-link.com/?preview=true',
          edit_link: 'https://www.story-link.com/wp-admin/post.php?id=123',
          date: '1970-01-01T00:00:00.000',
          date_gmt: '1970-01-01T00:00:00.000',
          status: 'publish',
          link: 'https://www.story-link.com',
          title: {
            raw: 'Carlos',
            rendered: 'Carlos',
          },
          _embedded: {
            author: [{ id: 1, name: 'admin' }],
            'wp:featuredmedia': [
              { id: 0, source_url: 'https://www.featured-media-123' },
            ],
          },
        },
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
        modified_gmt: '1970-01-01T00:00:00.000Z',
        created: '1970-01-01T00:00:00.000',
        created_gmt: '1970-01-01T00:00:00.000Z',
        author: 'admin',
        link: 'https://www.story-link.com',
        lockUser: {
          avatar: null,
          id: 0,
          name: '',
        },
        locked: false,
        originalStoryData: {
          id: 456,
          modified: '1970-01-01T00:00:00.000',
          modified_gmt: '1970-01-01T00:00:00.000',
          preview_link: 'https://www.story-link.com/?preview=true',
          edit_link: 'https://www.story-link.com/wp-admin/post.php?id=456',
          date: '1970-01-01T00:00:00.000',
          date_gmt: '1970-01-01T00:00:00.000',
          status: 'publish',
          author: 1,
          link: 'https://www.story-link.com',
          title: {
            raw: 'Carlos (Copy)',
            rendered: 'Carlos (Copy)',
          },
          _embedded: {
            author: [{ id: 1, name: 'admin' }],
            'wp:featuredmedia': [
              { id: 0, source_url: 'https://www.featured-media-456' },
            ],
          },
        },
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
            apiCallbacks: { fetchStories, getUser, trashStory },
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
            apiCallbacks: { fetchStories, getUser },
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

describe('useSettingsApi', () => {
  it('should return an error when fetching settings API request fails', async () => {
    const { result } = renderHook(() => useApi(), {
      wrapper: (props) => (
        <ConfigProvider
          config={{
            api: { settings: 'wordpress' },
            apiCallbacks: { fetchSettings: () => Promise.reject({}), getUser }, // eslint-disable-line prefer-promise-reject-errors
          }}
        >
          <ApiProvider {...props} />
        </ConfigProvider>
      ),
    });

    await act(async () => {
      await result.current.actions.settingsApi.fetchSettings();
    });

    expect(result.current.state.settings.error.message).toStrictEqual(
      ERRORS.LOAD_SETTINGS.MESSAGE
    );
  });

  it('should return an error when updating settings API request fails', async () => {
    const { result } = renderHook(() => useApi(), {
      wrapper: (props) => (
        <ConfigProvider
          config={{
            api: { settings: 'wordpress' },
            apiCallbacks: { updateSettings: () => Promise.reject({}), getUser }, // eslint-disable-line prefer-promise-reject-errors
          }}
        >
          <ApiProvider {...props} />
        </ConfigProvider>
      ),
    });

    await act(async () => {
      await result.current.actions.settingsApi.updateSettings('2738237892739');
    });

    expect(result.current.state.settings.error.message).toStrictEqual(
      ERRORS.UPDATE_EDITOR_SETTINGS.MESSAGE
    );
  });
});
