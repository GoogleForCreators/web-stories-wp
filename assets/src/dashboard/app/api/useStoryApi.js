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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { useCallback, useMemo, useReducer } from 'react';
import moment from 'moment';
import queryString from 'query-string';

/**
 * Internal dependencies
 */

import {
  STORY_STATUSES,
  STORY_SORT_OPTIONS,
  ORDER_BY_SORT,
  ITEMS_PER_PAGE,
} from '../../constants';
import storyReducer, {
  defaultStoriesState,
  ACTION_TYPES as STORY_ACTION_TYPES,
} from '../reducer/stories';

export function reshapeStoryObject(editStoryURL) {
  return function (originalStoryData) {
    const {
      id,
      title,
      modified,
      status,
      date,
      author,
      story_data: storyData,
    } = originalStoryData;
    if (
      !Array.isArray(storyData.pages) ||
      !id ||
      storyData.pages.length === 0
    ) {
      return null;
    }
    return {
      id,
      status,
      title: title.raw,
      modified: moment(modified),
      created: moment(date),
      pages: storyData.pages,
      author,
      centerTargetAction: '',
      bottomTargetAction: `${editStoryURL}&post=${id}`,
      editStoryLink: `${editStoryURL}&post=${id}`,
      originalStoryData,
    };
  };
}

const useStoryApi = (dataAdapter, { editStoryURL, wpApi }) => {
  const [state, dispatch] = useReducer(storyReducer, defaultStoriesState);

  const fetchStories = useCallback(
    async ({
      status = STORY_STATUSES[0].value,
      sortOption = STORY_SORT_OPTIONS.LAST_MODIFIED,
      sortDirection,
      searchTerm,
      page = 1,
      perPage = ITEMS_PER_PAGE,
    }) => {
      dispatch({
        type: STORY_ACTION_TYPES.LOADING_STORIES,
        payload: true,
      });

      if (!wpApi) {
        dispatch({
          type: STORY_ACTION_TYPES.FETCH_STORIES_FAILURE,
          payload: true,
        });
        return;
      }

      const query = {
        context: 'edit',
        search: searchTerm || undefined,
        orderby: sortOption,
        page,
        per_page: perPage,
        order: sortDirection || ORDER_BY_SORT[sortOption],
        status,
      };

      try {
        const path = queryString.stringifyUrl({
          url: wpApi,
          query,
        });

        const response = await dataAdapter.get(path, {
          parse: false,
          cache: 'no-cache',
        });

        const totalPages =
          response.headers && parseInt(response.headers.get('X-WP-TotalPages'));

        const totalStoriesByStatus =
          response.headers &&
          JSON.parse(response.headers.get('X-WP-TotalByStatus'));

        const serverStoryResponse = await response.json();

        const reshapedStories = serverStoryResponse
          .map(reshapeStoryObject(editStoryURL))
          .filter(Boolean);

        dispatch({
          type: STORY_ACTION_TYPES.FETCH_STORIES_SUCCESS,
          payload: {
            stories: reshapedStories,
            totalPages,
            totalStoriesByStatus,
            page,
          },
        });
      } catch (err) {
        dispatch({
          type: STORY_ACTION_TYPES.FETCH_STORIES_FAILURE,
          payload: true,
        });
      } finally {
        dispatch({
          type: STORY_ACTION_TYPES.LOADING_STORIES,
          payload: false,
        });
      }
    },
    [wpApi, dataAdapter, editStoryURL]
  );

  const updateStory = useCallback(
    async (story) => {
      try {
        const response = await dataAdapter.post(`${wpApi}/${story.id}`, {
          data: story,
        });
        dispatch({
          type: STORY_ACTION_TYPES.UPDATE_STORY,
          payload: reshapeStoryObject(editStoryURL)(response),
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    },
    [wpApi, dataAdapter, editStoryURL]
  );

  const trashStory = useCallback(
    async (story) => {
      try {
        await dataAdapter.deleteRequest(`${wpApi}/${story.id}`, {
          data: story,
        });
        dispatch({
          type: STORY_ACTION_TYPES.TRASH_STORY,
          payload: { id: story.id, storyStatus: story.status },
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    },
    [wpApi, dataAdapter]
  );

  const duplicateStory = useCallback(
    async (story) => {
      try {
        const {
          content,
          story_data,
          style_presets,
          publisher_logo,
          featured_media,
          title,
        } = story.originalStoryData;
        const response = await dataAdapter.post(wpApi, {
          data: {
            content,
            story_data,
            featured_media,
            style_presets,
            publisher_logo,
            title: {
              raw: `${title.raw} ${__('(Copy)', 'web-stories')}`,
            },
            status: 'draft',
          },
        });
        dispatch({
          type: STORY_ACTION_TYPES.DUPLICATE_STORY,
          payload: reshapeStoryObject(editStoryURL)(response),
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    },
    [wpApi, dataAdapter, editStoryURL]
  );

  const api = useMemo(
    () => ({
      updateStory,
      fetchStories,
      trashStory,
      duplicateStory,
    }),
    [duplicateStory, trashStory, updateStory, fetchStories]
  );

  return { stories: state, api };
};

export default useStoryApi;
