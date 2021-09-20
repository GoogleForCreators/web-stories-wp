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
import {
  useCallback,
  useMemo,
  useReducer,
  useRef,
} from '@web-stories-wp/react';
import { useFeatures } from 'flagged';
import { addQueryArgs } from '@web-stories-wp/design-system';
import { createSolidFromString } from '@web-stories-wp/patterns';
import { getTimeTracker } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import {
  STORY_STATUSES,
  STORY_SORT_OPTIONS,
  ORDER_BY_SORT,
  STORIES_PER_REQUEST,
} from '../../constants';
import storyReducer, {
  defaultStoriesState,
  ACTION_TYPES as STORY_ACTION_TYPES,
} from '../reducer/stories';
import { reshapeStoryObject } from '../serializers';
import { ERRORS } from '../textContent';

// Important: Keep in sync with REST API preloading definition.
const STORY_FIELDS = [
  'id',
  'title',
  'status',
  'date',
  'date_gmt',
  'modified',
  'modified_gmt',
  'link',
  'preview_link',
  'edit_link',
  // _web_stories_envelope will add these fields, we need them too.
  'body',
  'status',
  'headers',
].join(',');

const useStoryApi = (dataAdapter, { storyApi }) => {
  const isInitialFetch = useRef(true);
  const initialFetchListeners = useMemo(() => new Map(), []);
  const [state, dispatch] = useReducer(storyReducer, defaultStoriesState);
  const flags = useFeatures();

  const fetchStories = useCallback(
    async ({
      status = STORY_STATUSES[0].value,
      sortOption = STORY_SORT_OPTIONS.LAST_MODIFIED,
      sortDirection,
      searchTerm,
      page = 1,
      perPage = STORIES_PER_REQUEST,
    }) => {
      dispatch({
        type: STORY_ACTION_TYPES.LOADING_STORIES,
        payload: true,
      });

      if (!storyApi) {
        dispatch({
          type: STORY_ACTION_TYPES.FETCH_STORIES_FAILURE,
          payload: {
            message: ERRORS.LOAD_STORIES.DEFAULT_MESSAGE,
          },
        });
        return;
      }

      // Important: Keep in sync with REST API preloading definition.
      const query = {
        _embed: 'wp:lock,wp:lockuser,author,wp:featuredmedia',
        context: 'edit',
        _web_stories_envelope: true,
        search: searchTerm || undefined,
        orderby: sortOption,
        page,
        per_page: perPage,
        order: sortDirection || ORDER_BY_SORT[sortOption],
        status,
        _fields: STORY_FIELDS,
      };

      const trackTiming = getTimeTracker('load_stories');

      try {
        const path = addQueryArgs(storyApi, query);
        const response = await dataAdapter.get(path);

        const totalPages =
          response.headers && parseInt(response.headers['X-WP-TotalPages']);
        const totalStoriesByStatus =
          response.headers &&
          JSON.parse(response.headers['X-WP-TotalByStatus']);

        // Hook into first fetch of story statuses.
        if (isInitialFetch.current) {
          initialFetchListeners.forEach((listener) => {
            listener(totalStoriesByStatus);
          });
        }
        isInitialFetch.current = false;

        const stories = response.body;

        dispatch({
          type: STORY_ACTION_TYPES.FETCH_STORIES_SUCCESS,
          payload: {
            stories,
            totalPages,
            totalStoriesByStatus,
            page,
          },
        });
      } catch (err) {
        dispatch({
          type: STORY_ACTION_TYPES.FETCH_STORIES_FAILURE,
          payload: {
            message: ERRORS.LOAD_STORIES.MESSAGE,
            code: err.code,
          },
        });
      } finally {
        dispatch({
          type: STORY_ACTION_TYPES.LOADING_STORIES,
          payload: false,
        });
        trackTiming();
      }
    },
    [storyApi, dataAdapter, initialFetchListeners]
  );

  const updateStory = useCallback(
    async (story) => {
      const trackTiming = getTimeTracker('load_update_story');

      try {
        const path = addQueryArgs(`${storyApi}${story.id}/`, {
          _embed: 'wp:lock,wp:lockuser,author,wp:featuredmedia',
        });

        const data = {
          id: story.id,
          author: story.originalStoryData.author,
          title: story.title?.raw || story.title,
        };

        const response = await dataAdapter.post(path, {
          data,
        });

        dispatch({
          type: STORY_ACTION_TYPES.UPDATE_STORY,
          payload: reshapeStoryObject(response),
        });
      } catch (err) {
        dispatch({
          type: STORY_ACTION_TYPES.UPDATE_STORY_FAILURE,
          payload: {
            message: ERRORS.UPDATE_STORY.MESSAGE,
            code: err.code,
          },
        });
      } finally {
        trackTiming();
      }
    },
    [storyApi, dataAdapter]
  );

  const trashStory = useCallback(
    async (story) => {
      const trackTiming = getTimeTracker('load_trash_story');

      try {
        await dataAdapter.deleteRequest(`${storyApi}${story.id}`);
        dispatch({
          type: STORY_ACTION_TYPES.TRASH_STORY,
          payload: { id: story.id, storyStatus: story.status },
        });
      } catch (err) {
        dispatch({
          type: STORY_ACTION_TYPES.TRASH_STORY_FAILURE,
          payload: {
            message: ERRORS.DELETE_STORY.MESSAGE,
            code: err.code,
          },
        });
      } finally {
        trackTiming();
      }
    },
    [storyApi, dataAdapter]
  );

  const createStoryFromTemplate = useCallback(
    async (template) => {
      dispatch({
        type: STORY_ACTION_TYPES.CREATING_STORY_FROM_TEMPLATE,
        payload: true,
      });

      try {
        const { createdBy, pages, version, colors } = template;
        const { getStoryPropsToSave } = await import(
          /* webpackChunkName: "chunk-getStoryPropsToSave" */ '@web-stories-wp/story-editor'
        );
        const storyPropsToSave = await getStoryPropsToSave({
          story: {
            status: 'auto-draft',
            featuredMedia: {
              id: 0,
            },
          },
          pages,
          metadata: {
            publisher: createdBy,
          },
          flags,
        });

        const convertedColors = colors.map(({ color }) =>
          createSolidFromString(color)
        );

        const path = addQueryArgs(storyApi, {
          _fields: 'edit_link',
        });

        const response = await dataAdapter.post(path, {
          data: {
            ...storyPropsToSave,
            story_data: {
              pages,
              version,
              autoAdvance: true,
              defaultPageDuration: 7,
              currentStoryStyles: {
                colors: convertedColors,
              },
            },
          },
        });

        dispatch({
          type: STORY_ACTION_TYPES.CREATE_STORY_FROM_TEMPLATE_SUCCESS,
        });

        window.location = response.edit_link;
      } catch (err) {
        dispatch({
          type: STORY_ACTION_TYPES.CREATE_STORY_FROM_TEMPLATE_FAILURE,
          payload: {
            message: ERRORS.CREATE_STORY_FROM_TEMPLATE.MESSAGE,
            code: err.code,
          },
        });
      } finally {
        dispatch({
          type: STORY_ACTION_TYPES.CREATING_STORY_FROM_TEMPLATE,
          payload: false,
        });
      }
    },
    [dataAdapter, storyApi, flags]
  );

  const duplicateStory = useCallback(
    async (story) => {
      const trackTiming = getTimeTracker('load_duplicate_story');

      try {
        const {
          originalStoryData: { id },
        } = story;

        const path = addQueryArgs(storyApi, {
          _embed: 'wp:lock,wp:lockuser,author,wp:featuredmedia',
          _fields: STORY_FIELDS,
        });

        const response = await dataAdapter.post(path, {
          data: {
            original_id: id,
            status: 'draft',
          },
        });
        dispatch({
          type: STORY_ACTION_TYPES.DUPLICATE_STORY,
          payload: reshapeStoryObject(response),
        });
      } catch (err) {
        dispatch({
          type: STORY_ACTION_TYPES.DUPLICATE_STORY_FAILURE,
          payload: {
            message: ERRORS.DUPLICATE_STORY.MESSAGE,
            code: err.code,
          },
        });
      } finally {
        trackTiming();
      }
    },
    [storyApi, dataAdapter]
  );

  const addInitialFetchListener = useCallback(
    (listener) => {
      const key = Symbol();
      initialFetchListeners.set(key, listener);
      return () => {
        initialFetchListeners.delete(key);
      };
    },
    [initialFetchListeners]
  );

  const api = useMemo(
    () => ({
      duplicateStory,
      fetchStories,
      createStoryFromTemplate,
      trashStory,
      updateStory,
      addInitialFetchListener,
    }),
    [
      createStoryFromTemplate,
      duplicateStory,
      trashStory,
      updateStory,
      fetchStories,
      addInitialFetchListener,
    ]
  );

  return useMemo(() => ({ stories: state, api }), [state, api]);
};

export default useStoryApi;
