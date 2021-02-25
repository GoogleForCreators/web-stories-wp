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
import { useFeatures } from 'flagged';
import { __, sprintf } from '@web-stories-wp/i18n';
import { getTimeTracker } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import base64Encode from '../../../edit-story/utils/base64Encode';
import {
  STORY_STATUSES,
  STORY_SORT_OPTIONS,
  ORDER_BY_SORT,
  STORIES_PER_REQUEST,
  STORY_STATUS,
} from '../../constants';
import storyReducer, {
  defaultStoriesState,
  ACTION_TYPES as STORY_ACTION_TYPES,
} from '../reducer/stories';
import { addQueryArgs } from '../../../design-system';
import { reshapeStoryObject, reshapeStoryPreview } from '../serializers';
import { ERRORS } from '../textContent';

const useStoryApi = (dataAdapter, { editStoryURL, storyApi, encodeMarkup }) => {
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

      const query = {
        _embed: 'wp:lock,wp:lockuser,author',
        context: 'edit',
        _web_stories_envelope: true,
        search: searchTerm || undefined,
        orderby: sortOption,
        page,
        per_page: perPage,
        order: sortDirection || ORDER_BY_SORT[sortOption],
        status,
      };

      const trackTiming = getTimeTracker('load_stories');

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

        // Hardening in case data returned by the server is malformed.
        // For example, story_data could be missing/empty.
        const cleanStories = response.body.filter((story) =>
          Array.isArray(story?.story_data?.pages)
        );

        if (
          cleanStories.length === 0 &&
          cleanStories.length !== response.body.length
        ) {
          dispatch({
            type: STORY_ACTION_TYPES.FETCH_STORIES_FAILURE,
            payload: {
              message: ERRORS.LOAD_STORIES.INCOMPLETE_DATA_MESSAGE,
            },
          });
        } else {
          dispatch({
            type: STORY_ACTION_TYPES.FETCH_STORIES_SUCCESS,
            payload: {
              editStoryURL,
              stories: cleanStories,
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
        }
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
    [storyApi, dataAdapter, editStoryURL]
  );

  const updateStory = useCallback(
    async (story) => {
      const trackTiming = getTimeTracker('load_update_story');

      try {
        const path = queryString.stringifyUrl({
          url: `${storyApi}${story.id}/`,
          query: {
            _embed: 'wp:lock,wp:lockuser,author',
          },
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
          payload: reshapeStoryObject(editStoryURL)(response),
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
    [storyApi, dataAdapter, editStoryURL]
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

  const clearStoryPreview = useCallback(() => {
    dispatch({
      type: STORY_ACTION_TYPES.CLEAR_STORY_PREVIEW,
    });
  }, []);

  const createStoryPreview = useCallback(
    async (dashboardStory) => {
      dispatch({
        type: STORY_ACTION_TYPES.CREATING_STORY_PREVIEW,
        payload: true,
      });

      const trackTiming = getTimeTracker('load_create_story_preview');

      try {
        const {
          author,
          createdBy,
          created,
          modified,
          pages,
          password,
          title,
          excerpt,
          status,
        } = dashboardStory;

        const getStoryPropsToSave = await import(
          /* webpackChunkName: "chunk-getStoryPropsToSave" */ '../../../edit-story/app/story/utils/getStoryPropsToSave'
        );
        const storyProps = await getStoryPropsToSave.default({
          story: {
            status: status || 'auto-draft',
            title: title,
            author: author || 1,
            slug: title,
            date: created || Date.now().toString(),
            modified: modified || Date.now().toString(),
            featuredMedia: {
              id: 0,
            },
            password: password || '',
            excerpt: excerpt || '',
          },
          pages,
          metadata: {
            publisher: {
              name: createdBy || '',
            },
          },
          flags,
        });

        const preppedStoryProps = reshapeStoryPreview(storyProps);

        const getStoryMarkup = await import(
          /* webpackChunkName: "chunk-getStoryMarkup" */ '../../../edit-story/output/utils/getStoryMarkup'
        );

        const markup = await getStoryMarkup(
          preppedStoryProps.story,
          preppedStoryProps.pages,
          preppedStoryProps.metadata,
          flags
        );

        dispatch({
          type: STORY_ACTION_TYPES.CREATE_STORY_PREVIEW_SUCCESS,
          payload: markup.toString(),
        });
      } catch (err) {
        dispatch({
          type: STORY_ACTION_TYPES.CREATE_STORY_PREVIEW_FAILURE,
          payload: {
            message: ERRORS.RENDER_PREVIEW.MESSAGE,
            code: err.code,
          },
        });
      } finally {
        trackTiming();
      }
    },
    [flags]
  );

  const createStoryFromTemplate = useCallback(
    async (template) => {
      dispatch({
        type: STORY_ACTION_TYPES.CREATING_STORY_FROM_TEMPLATE,
        payload: true,
      });

      try {
        const { createdBy, pages, version } = template;
        const getStoryPropsToSave = await import(
          /* webpackChunkName: "chunk-getStoryPropsToSave" */ '../../../edit-story/app/story/utils/getStoryPropsToSave'
        );
        const storyPropsToSave = await getStoryPropsToSave.default({
          story: {
            status: 'auto-draft',
            featuredMedia: {
              id: 0,
            },
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
    [dataAdapter, editStoryURL, storyApi, flags]
  );

  const duplicateStory = useCallback(
    async (story) => {
      const trackTiming = getTimeTracker('load_duplicate_story');

      try {
        const {
          content,
          story_data,
          style_presets,
          publisher_logo,
          featured_media,
          title,
        } = story.originalStoryData;

        const path = queryString.stringifyUrl({
          url: storyApi,
          query: {
            _embed: 'wp:lock,wp:lockuser,author',
          },
        });

        const storyContent = encodeMarkup
          ? base64Encode(content?.raw)
          : content?.raw;

        const response = await dataAdapter.post(path, {
          data: {
            content: content?.raw ? storyContent : undefined,
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
            message: ERRORS.DUPLICATE_STORY.MESSAGE,
            code: err.code,
          },
        });
      } finally {
        trackTiming();
      }
    },
    [storyApi, dataAdapter, editStoryURL, encodeMarkup]
  );

  const api = useMemo(
    () => ({
      clearStoryPreview,
      duplicateStory,
      fetchStories,
      createStoryFromTemplate,
      createStoryPreview,
      trashStory,
      updateStory,
    }),
    [
      clearStoryPreview,
      createStoryFromTemplate,
      createStoryPreview,
      duplicateStory,
      trashStory,
      updateStory,
      fetchStories,
    ]
  );

  return { stories: state, api };
};

export default useStoryApi;
