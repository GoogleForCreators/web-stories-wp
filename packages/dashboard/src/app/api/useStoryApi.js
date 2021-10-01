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
import { createSolidFromString } from '@web-stories-wp/patterns';
import { getTimeTracker } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import {
  STORY_STATUSES,
  STORY_SORT_OPTIONS,
  STORIES_PER_REQUEST,
} from '../../constants';
import storyReducer, {
  defaultStoriesState,
  ACTION_TYPES as STORY_ACTION_TYPES,
} from '../reducer/stories';
import { reshapeStoryObject } from '../serializers';
import { ERRORS } from '../textContent';
import { useConfig } from '../config';

const useStoryApi = (storyApi) => {
  const isInitialFetch = useRef(true);
  const initialFetchListeners = useMemo(() => new Map(), []);
  const [state, dispatch] = useReducer(storyReducer, defaultStoriesState);
  const flags = useFeatures();
  const {
    apiCallbacks: {
      duplicateStory: duplicateStoryCallback,
      fetchStories: fetchStoriesCallback,
      trashStory: trashStoryCallback,
      updateStory: updateStoryCallback,
      createStoryFromTemplate: createStoryFromTemplateCallback,
    },
  } = useConfig();

  const fetchStories = useCallback(
    async (queryParams) => {
      const {
        status = STORY_STATUSES[0].value, // @todo Move these to wp-dashboard?
        sortOption = STORY_SORT_OPTIONS.LAST_MODIFIED,
        sortDirection,
        searchTerm,
        page = 1,
        perPage = STORIES_PER_REQUEST,
      } = queryParams;

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

      const trackTiming = getTimeTracker('load_stories');

      try {
        const response = await fetchStoriesCallback(
          {
            status,
            sortOption,
            sortDirection,
            searchTerm,
            page,
            perPage,
          },
          storyApi
        );

        const totalPages =
          response.headers && parseInt(response.headers['X-WP-TotalPages']); // @todo Rename from wp-dashboard.
        const totalStoriesByStatus =
          response.headers &&
          JSON.parse(response.headers['X-WP-TotalByStatus']); // @todo Rename from wp-dashboard.

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
    [storyApi, fetchStoriesCallback, initialFetchListeners]
  );

  const updateStory = useCallback(
    async (story) => {
      const trackTiming = getTimeTracker('load_update_story');

      try {
        const response = await updateStoryCallback(story, storyApi);

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
    [storyApi, updateStoryCallback]
  );

  const trashStory = useCallback(
    async (story) => {
      const trackTiming = getTimeTracker('load_trash_story');

      try {
        await trashStoryCallback(story.id, storyApi);
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
    [storyApi, trashStoryCallback]
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

        const storyData = {
          pages,
          version,
          autoAdvance: true,
          defaultPageDuration: 7,
          currentStoryStyles: {
            colors: convertedColors,
          },
        };

        const response = await createStoryFromTemplateCallback(
          storyData,
          storyPropsToSave,
          storyApi
        );

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
    [createStoryFromTemplateCallback, storyApi, flags]
  );

  const duplicateStory = useCallback(
    async (story) => {
      const trackTiming = getTimeTracker('load_duplicate_story');

      try {
        const response = await duplicateStoryCallback(story, storyApi);

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
    [storyApi, duplicateStoryCallback]
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
