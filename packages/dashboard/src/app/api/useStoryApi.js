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
} from '@googleforcreators/react';
import { getTimeTracker } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import storyReducer, {
  defaultStoriesState,
  ACTION_TYPES as STORY_ACTION_TYPES,
} from '../reducer/stories';
import { ERRORS } from '../textContent';
import { useConfig } from '../config';

const useStoryApi = () => {
  const isInitialFetch = useRef(true);
  const initialFetchListeners = useMemo(() => new Map(), []);
  const [state, dispatch] = useReducer(storyReducer, defaultStoriesState);
  const { apiCallbacks } = useConfig();

  const fetchStories = useCallback(
    async (queryParams) => {
      dispatch({
        type: STORY_ACTION_TYPES.LOADING_STORIES,
        payload: true,
      });

      const trackTiming = getTimeTracker('load_stories');

      try {
        // Maybe not making a lot of sense to expect fetchedStoryIds from the api callbacks response.
        // However the order of ids get changed if we try to create that array here
        // which may ( or may not ) cause some regression. @todo Reflect on fetchedStoryIds again in next phase.
        const { stories, fetchedStoryIds, totalPages, totalStoriesByStatus } =
          await apiCallbacks.fetchStories(queryParams);

        // Hook into first fetch of story statuses.
        if (isInitialFetch.current) {
          initialFetchListeners.forEach((listener) => {
            listener(totalStoriesByStatus);
          });
        }

        isInitialFetch.current = false;

        dispatch({
          type: STORY_ACTION_TYPES.FETCH_STORIES_SUCCESS,
          payload: {
            stories,
            totalPages,
            totalStoriesByStatus,
            fetchedStoryIds,
            page: queryParams.page,
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
    [apiCallbacks, initialFetchListeners]
  );

  const updateStory = useCallback(
    async (story) => {
      const trackTiming = getTimeTracker('load_update_story');

      try {
        const response = await apiCallbacks.updateStory(story);

        dispatch({
          type: STORY_ACTION_TYPES.UPDATE_STORY,
          payload: response,
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
    [apiCallbacks]
  );

  const trashStory = useCallback(
    async (story) => {
      const trackTiming = getTimeTracker('load_trash_story');

      try {
        await apiCallbacks.trashStory(story.id);
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
    [apiCallbacks]
  );

  const createStoryFromTemplate = useCallback(
    async (template) => {
      dispatch({
        type: STORY_ACTION_TYPES.CREATING_STORY_FROM_TEMPLATE,
        payload: true,
      });

      try {
        const response = await apiCallbacks.createStoryFromTemplate(template);

        dispatch({
          type: STORY_ACTION_TYPES.CREATE_STORY_FROM_TEMPLATE_SUCCESS,
        });

        window.location = response.editLink;
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
    [apiCallbacks]
  );

  const duplicateStory = useCallback(
    async (story) => {
      const trackTiming = getTimeTracker('load_duplicate_story');

      try {
        const response = await apiCallbacks.duplicateStory(story);

        dispatch({
          type: STORY_ACTION_TYPES.DUPLICATE_STORY,
          payload: response,
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
    [apiCallbacks]
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

  return {
    stories: state,
    api: {
      duplicateStory,
      fetchStories,
      createStoryFromTemplate,
      trashStory,
      updateStory,
      addInitialFetchListener,
    },
  };
};

export default useStoryApi;
