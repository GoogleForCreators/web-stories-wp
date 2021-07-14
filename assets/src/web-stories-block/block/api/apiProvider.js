/*
 * Copyright 2021 Google LLC
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
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import {
  useMemo,
  createContext,
  useState,
  useCallback,
  useReducer,
} from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import {
  ORDER_BY_SORT,
  STORIES_PER_REQUEST,
  STORY_SORT_OPTIONS,
  STORY_STATUS,
} from '../constants';
import storyReducer, {
  ACTION_TYPES as STORY_ACTION_TYPES,
  defaultStoriesState,
} from '../../../dashboard/app/reducer/stories';
import { ERRORS } from '../../../dashboard/app/textContent';

export const StoriesBlockApiContext = createContext({ state: {}, actions: {} });

export default function StoriesBlockApiProvider({ children }) {
  const {
    api: { users: usersApi, stories: storiesApi },
  } = window.webStoriesBlockSettings.config;
  const [authorSuggestions, setAuthorSuggestions] = useState([]);

  const [stories, dispatch] = useReducer(storyReducer, defaultStoriesState);

  const fetchStories = useCallback(
    async ({
      status = 'publish',
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
        const response = await apiFetch({
          path: addQueryArgs(storiesApi, query),
        });

        const totalPages =
          response.headers && parseInt(response.headers['X-WP-TotalPages']);
        const totalStoriesByStatus =
          response.headers &&
          JSON.parse(response.headers['X-WP-TotalByStatus']);

        dispatch({
          type: STORY_ACTION_TYPES.FETCH_STORIES_SUCCESS,
          payload: {
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
    [storiesApi]
  );

  const fetchAuthors = useCallback(
    async ({ searchTerm, page = 1, perPage = STORIES_PER_REQUEST }) => {
      const query = {
        context: 'edit',
        search: searchTerm || undefined,
        page,
        per_page: perPage,
      };

      try {
        setAuthorSuggestions(
          await apiFetch({
            path: addQueryArgs(usersApi, query),
          })
        );
      } catch (e) {
        setAuthorSuggestions([]);
      }
    },
    [usersApi]
  );

  const value = useMemo(
    () => ({
      state: {
        stories,
        authorSuggestions,
      },
      actions: {
        fetchStories,
        fetchAuthors,
      },
    }),
    [stories, fetchAuthors, fetchStories, authorSuggestions]
  );

  return (
    <StoriesBlockApiContext.Provider value={value}>
      {children}
    </StoriesBlockApiContext.Provider>
  );
}

StoriesBlockApiProvider.propTypes = {
  children: PropTypes.node,
};
