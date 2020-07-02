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
import { __, sprintf } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { useCallback, useMemo, useReducer } from 'react';
import moment from 'moment';
import queryString from 'query-string';
import { useFeatures } from 'flagged';

/**
 * Internal dependencies
 */
import {
  STORY_STATUSES,
  STORY_SORT_OPTIONS,
  ORDER_BY_SORT,
  STORIES_PER_REQUEST,
} from '../../constants';
import { migrate, DATA_VERSION } from '../../../edit-story/migration/migrate';
import storyReducer, {
  defaultStoriesState,
  ACTION_TYPES as STORY_ACTION_TYPES,
} from '../reducer/stories';
import { getStoryPropsToSave, addQueryArgs } from '../../utils';

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

    const updatedStoryData = {
      ...migrate(storyData, storyData.version),
      version: DATA_VERSION,
    };

    return {
      id,
      status,
      title: title.raw,
      modified: moment(modified),
      created: moment(date),
      pages: updatedStoryData.pages,
      author,
      centerTargetAction: '',
      bottomTargetAction: `${editStoryURL}&post=${id}`,
      editStoryLink: `${editStoryURL}&post=${id}`,
      originalStoryData,
    };
  };
}

const useStoryApi = (dataAdapter, { editStoryURL, storyApi }) => {
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
            message: {
              body: __('Cannot connect to data source', 'web-stories'),
              title: __('Unable to Load Stories', 'web-stories'),
            },
          },
        });
        return;
      }

      const query = {
        context: 'edit',
        story_format: true,
        search: searchTerm || undefined,
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

        const totalPages = response.totals && parseInt(response.totals.all);
        const totalStoriesByStatus = response.totals;

        const reshapedStories = response.data
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
          payload: {
            message: {
              body: err.message,
              title: __('Unable to Load Stories', 'web-stories'),
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

  const updateStory = useCallback(
    async (story) => {
      try {
        const response = await dataAdapter.post(`${storyApi}/${story.id}`, {
          data: story,
        });
        dispatch({
          type: STORY_ACTION_TYPES.UPDATE_STORY,
          payload: reshapeStoryObject(editStoryURL)(response),
        });
      } catch (err) {
        dispatch({
          type: STORY_ACTION_TYPES.UPDATE_STORY_FAILURE,
          payload: {
            message: {
              body: err.message,
              title: __('Unable to Update Story', 'web-stories'),
            },
            code: err.code,
          },
        });
      }
    },
    [storyApi, dataAdapter, editStoryURL]
  );

  const trashStory = useCallback(
    async (story) => {
      try {
        await dataAdapter.deleteRequest(`${storyApi}/${story.id}`, {
          data: story,
        });
        dispatch({
          type: STORY_ACTION_TYPES.TRASH_STORY,
          payload: { id: story.id, storyStatus: story.status },
        });
      } catch (err) {
        dispatch({
          type: STORY_ACTION_TYPES.TRASH_STORY_FAILURE,
          payload: {
            message: {
              body: err.message,
              title: __('Unable to Delete Story', 'web-stories'),
            },
            code: err.code,
          },
        });
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
        const { createdBy, pages, version } = template;
        const storyPropsToSave = await getStoryPropsToSave({
          story: {
            status: 'auto-draft',
          },
          pages,
          metadata: {
            publisher: {
              name: createdBy,
            },
          },
          flags,
        });
        const response = await dataAdapter.post(storyApi, {
          data: {
            ...storyPropsToSave,
            story_data: {
              pages,
              version,
              autoAdvance: true,
              defaultPageDuration: 7,
            },
          },
        });

        dispatch({
          type: STORY_ACTION_TYPES.CREATE_STORY_FROM_TEMPLATE_SUCCESS,
        });

        window.location = addQueryArgs(editStoryURL, {
          post: response.id,
        });
      } catch (err) {
        dispatch({
          type: STORY_ACTION_TYPES.CREATE_STORY_FROM_TEMPLATE_FAILURE,
          payload: {
            message: {
              body: err.message,
              title: __('Unable to Create Story From Template', 'web-stories'),
            },
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
    [dataAdapter, editStoryURL, storyApi, flags]
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

        const response = await dataAdapter.post(storyApi, {
          data: {
            content,
            story_data,
            featured_media,
            style_presets,
            publisher_logo,
            title: {
              raw: sprintf(
                /* translators: %s: story title */
                __('%s (Copy)', 'web-stories'),
                title.raw
              ),
            },
            status: 'draft',
          },
        });
        dispatch({
          type: STORY_ACTION_TYPES.DUPLICATE_STORY,
          payload: reshapeStoryObject(editStoryURL)(response),
        });
      } catch (err) {
        dispatch({
          type: STORY_ACTION_TYPES.DUPLICATE_STORY_FAILURE,
          payload: {
            message: {
              body: err.message,
              title: __('Unable to Duplicate Story', 'web-stories'),
            },
            code: err.code,
          },
        });
      }
    },
    [storyApi, dataAdapter, editStoryURL]
  );

  const api = useMemo(
    () => ({
      duplicateStory,
      fetchStories,
      createStoryFromTemplate,
      trashStory,
      updateStory,
    }),
    [
      createStoryFromTemplate,
      duplicateStory,
      trashStory,
      updateStory,
      fetchStories,
    ]
  );

  return { stories: state, api };
};

export default useStoryApi;
