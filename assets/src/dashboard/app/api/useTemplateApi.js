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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { toUTCDate } from '../../../date';
import getAllTemplates from '../../templates';
import { APP_ROUTES } from '../../constants';
import templateReducer, {
  defaultTemplatesState,
  ACTION_TYPES as TEMPLATE_ACTION_TYPES,
} from '../reducer/templates';

export function reshapeTemplateObject(isLocal) {
  return ({
    id,
    title,
    modified,
    tags,
    colors,
    createdBy,
    description,
    pages,
    version,
  }) => ({
    isLocal,
    id,
    title,
    createdBy,
    description,
    status: 'template',
    modified: toUTCDate(modified),
    tags,
    colors,
    pages,
    version,
    centerTargetAction: `${APP_ROUTES.TEMPLATE_DETAIL}?id=${id}&isLocal=${isLocal}`,
  });
}

// TODO once templates are all connected to an API this and the above reshapeTemplateObject should be able to be one and the same
// Connecting the ability to create a template from a story I wanted to be able to see the results on saved templates, this endpoint is still missing some template related data.
export function reshapeSavedTemplates({
  author,
  isLocal = true,
  id,
  title,
  modified,
  tags = [],
  colors = [],
  createdBy = 'N/A',
  description,
  pages,
}) {
  return {
    author,
    isLocal,
    id,
    title: title.rendered,
    createdBy,
    description,
    status: 'template',
    modified: toUTCDate(modified),
    tags,
    colors,
    pages,
    centerTargetAction: false, // `${APP_ROUTES.TEMPLATE_DETAIL}?id=${id}&isLocal=${isLocal}`,
  };
}
// TODO: Remove this eslint rule once endpoints are working
/* eslint-disable no-unused-vars */
const useTemplateApi = (dataAdapter, config) => {
  const [state, dispatch] = useReducer(templateReducer, defaultTemplatesState);

  const { cdnURL, templateApi } = config;

  const fetchSavedTemplates = useCallback(() => {
    // Saved Templates = Bookmarked Templates + My Templates
    dispatch({
      type: TEMPLATE_ACTION_TYPES.PLACEHOLDER,
      payload: {
        templates: [],
        totalPages: 0,
        totalTemplates: 0,
        page: 1,
      },
    });
    return Promise.resolve([]);
  }, []);

  const fetchBookmarkedTemplates = useCallback((filters) => {
    dispatch({
      type: TEMPLATE_ACTION_TYPES.PLACEHOLDER,
      payload: {
        templates: [],
        totalPages: 0,
        totalTemplates: 0,
        page: 1,
      },
    });
  }, []);

  const fetchMyTemplates = useCallback(
    async ({ page = 1 }) => {
      dispatch({
        type: TEMPLATE_ACTION_TYPES.LOADING_TEMPLATES,
        payload: true,
      });

      if (!templateApi) {
        dispatch({
          type: TEMPLATE_ACTION_TYPES.FETCH_MY_TEMPLATES_FAILURE,
          payload: {
            message: {
              body: __('Cannot connect to data source', 'web-stories'),
              title: __('Unable to Load Templates', 'web-stories'),
            },
          },
        });
      }

      const query = {
        page,
        per_page: 100,
        status: 'publish,draft,pending',
      };

      try {
        const path = queryString.stringifyUrl({
          url: templateApi,
          query,
        });
        const response = await dataAdapter.get(path, {
          parse: false,
          cache: 'no-cache',
        });

        const totalPages =
          response.headers && parseInt(response.headers.get('X-WP-TotalPages'));

        const totalTemplates =
          response.headers && parseInt(response.headers.get('X-WP-Total'));

        const serverTemplateResponse = await response.json();

        const reshapedTemplates = serverTemplateResponse.map(
          reshapeSavedTemplates
        );

        dispatch({
          type: TEMPLATE_ACTION_TYPES.FETCH_MY_TEMPLATES_SUCCESS,
          payload: {
            savedTemplates: reshapedTemplates,
            totalPages,
            totalTemplates,
            page,
          },
        });
      } catch (err) {
        dispatch({
          type: TEMPLATE_ACTION_TYPES.FETCH_MY_TEMPLATES_FAILURE,
          payload: {
            message: {
              body: err.message,
              title: __('Unable to Load Templates', 'web-stories'),
            },
            code: err.code,
          },
        });
      } finally {
        dispatch({
          type: TEMPLATE_ACTION_TYPES.LOADING_TEMPLATES,
          payload: false,
        });
      }
    },
    [dataAdapter, templateApi]
  );

  const fetchMyTemplateById = useCallback((templateId) => {
    return Promise.resolve({});
  }, []);

  const fetchExternalTemplates = useCallback(
    async (filters) => {
      dispatch({
        type: TEMPLATE_ACTION_TYPES.LOADING_TEMPLATES,
        payload: true,
      });

      const reshapedTemplates = (await getAllTemplates({ cdnURL })).map(
        reshapeTemplateObject(false)
      );
      dispatch({
        type: TEMPLATE_ACTION_TYPES.FETCH_TEMPLATES_SUCCESS,
        payload: {
          page: 1,
          templates: reshapedTemplates,
          totalPages: 1,
          totalTemplates: reshapedTemplates.length,
        },
      });
    },
    [cdnURL]
  );

  const fetchExternalTemplateById = useCallback(
    (templateId) => {
      if (state.templates[templateId]) {
        return Promise.resolve(state.templates[templateId]);
      }
      return Promise.reject(new Error());
    },
    [state]
  );

  const bookmarkTemplateById = useCallback((templateId, shouldBookmark) => {
    if (shouldBookmark) {
      // api call to bookmark template
      return Promise.resolve({ success: true });
    } else {
      // api call to remove bookmark from template
      return Promise.resolve({ success: true });
    }
  }, []);

  const createTemplateFromStory = useCallback(
    async (story) => {
      await dispatch({
        type: TEMPLATE_ACTION_TYPES.CREATING_TEMPLATE_FROM_STORY,
        payload: true,
      });

      try {
        const {
          content,
          story_data,
          style_presets,
          publisher_logo,
          featured_media,
          title,
        } = story.originalStoryData;

        await dataAdapter.post(templateApi, {
          data: {
            content,
            story_data,
            featured_media,
            style_presets,
            publisher_logo,
            title,
          },
        });

        dispatch({
          type: TEMPLATE_ACTION_TYPES.CREATE_TEMPLATE_FROM_STORY_SUCCESS,
        });
      } catch (err) {
        dispatch({
          type: TEMPLATE_ACTION_TYPES.CREATE_TEMPLATE_FROM_STORY_FAILURE,
          payload: {
            message: {
              body: err.message,
              title: __('Unable to Create Template from Story', 'web-stories'),
            },
            code: err.code,
          },
        });
      } finally {
        dispatch({
          type: TEMPLATE_ACTION_TYPES.CREATING_TEMPLATE_FROM_STORY,
          payload: false,
        });
      }
    },
    [dataAdapter, templateApi]
  );

  const fetchRelatedTemplates = useCallback(
    (currentTemplateId) => {
      if (!state.templates || !currentTemplateId) {
        return [];
      }

      return state.templatesOrderById
        .filter((id) => id !== currentTemplateId) // Filter out the current/active template
        .sort(() => 0.5 - Math.random()) // Randomly sort the array of ids
        .map((id) => state.templates[id]) // Map the ids to templates
        .slice(0, Math.floor(Math.random() * 5) + 1); // Return between 1 and 5 templates
    },
    [state.templatesOrderById, state.templates]
  );

  const api = useMemo(
    () => ({
      bookmarkTemplateById,
      createTemplateFromStory,
      fetchBookmarkedTemplates,
      fetchExternalTemplates,
      fetchExternalTemplateById,
      fetchMyTemplates,
      fetchMyTemplateById,
      fetchRelatedTemplates,
      fetchSavedTemplates,
    }),
    [
      bookmarkTemplateById,
      createTemplateFromStory,
      fetchBookmarkedTemplates,
      fetchExternalTemplateById,
      fetchExternalTemplates,
      fetchMyTemplates,
      fetchMyTemplateById,
      fetchRelatedTemplates,
      fetchSavedTemplates,
    ]
  );

  return { templates: state, api };
};
/* eslint-enable no-unused-vars */

export default useTemplateApi;
