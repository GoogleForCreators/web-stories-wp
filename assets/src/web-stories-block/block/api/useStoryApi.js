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
import { useCallback, useMemo, useReducer } from 'react';
import queryString from 'query-string';

/**
 * Internal dependencies
 */
import {
  STORY_STATUSES,
  STORY_SORT_OPTIONS,
  ORDER_BY_SORT,
  STORIES_PER_REQUEST,
  STORY_STATUS,
} from '../../../dashboard/constants';
import storyReducer, {
  defaultStoriesState,
  ACTION_TYPES as STORY_ACTION_TYPES,
} from '../../../dashboard/app/reducer/stories';
import { ERRORS } from '../../../dashboard/app/textContent';

const useStoryApi = (dataAdapter, { editStoryURL, storyApi }) => {
  const [state, dispatch] = useReducer(storyReducer, defaultStoriesState);

  const fetchStories = useCallback(
    async ({
      status = STORY_STATUSES[0].value,
      sortOption = STORY_SORT_OPTIONS.LAST_MODIFIED,
      sortDirection,
      searchTerm,
      author,
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
            message: {
              body: ERRORS.LOAD_STORIES.DEFAULT_MESSAGE,
              title: ERRORS.LOAD_STORIES.TITLE,
            },
          },
        });
        return;
      }

      const query = {
        _embed: 'author',
        context: 'edit',
        _web_stories_envelope: true,
        search: searchTerm || undefined,
        author: author || undefined,
        orderby: sortOption,
        page,
        per_page: perPage,
        order: sortDirection || ORDER_BY_SORT[sortOption],
        status,
      };

      try {
        const path = queryString.stringifyUrl({
          url: storyApi,
          query,
        });

        const response = await dataAdapter.get(path);

        const totalPages =
          response.headers && parseInt(response.headers['X-WP-TotalPages']);
        const totalStoriesByStatus =
          response.headers &&
          JSON.parse(response.headers['X-WP-TotalByStatus']);

        dispatch({
          type: STORY_ACTION_TYPES.FETCH_STORIES_SUCCESS,
          payload: {
            editStoryURL,
            stories: response.body,
            totalPages,
            totalStoriesByStatus: {
              ...totalStoriesByStatus,
              [STORY_STATUS.PUBLISHED_AND_FUTURE]:
                totalStoriesByStatus[STORY_STATUS.PUBLISH] +
                totalStoriesByStatus[STORY_STATUS.FUTURE],
            },
            page,
          },
        });
      } catch (err) {
        dispatch({
          type: STORY_ACTION_TYPES.FETCH_STORIES_FAILURE,
          payload: {
            message: {
              body: err.message,
              title: ERRORS.LOAD_STORIES.TITLE,
            },
            code: err.code,
          },
        });
      } finally {
        dispatch({
          type: STORY_ACTION_TYPES.LOADING_STORIES,
          payload: false,
        });
      }
    },
    [storyApi, dataAdapter, editStoryURL]
  );

  const api = useMemo(
    () => ({
      fetchStories,
    }),
    [fetchStories]
  );

  return { stories: state, api };
};

export default useStoryApi;
