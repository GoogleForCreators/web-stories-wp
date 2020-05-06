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
import moment from 'moment';

/**
 * Internal dependencies
 */
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
  }) => ({
    isLocal,
    id,
    title,
    createdBy,
    description,
    status: 'template',
    modified: moment(modified),
    tags,
    colors,
    pages,
    centerTargetAction: `#${APP_ROUTES.TEMPLATE_DETAIL}?id=${id}&isLocal=${isLocal}`,
    bottomTargetAction: () => {},
  });
}

// TODO: Remove this eslint rule once endpoints are working
/* eslint-disable no-unused-vars */
const useTemplateApi = (dataAdapter, config) => {
  const [state, dispatch] = useReducer(templateReducer, defaultTemplatesState);

  const { pluginDir } = config;

  const createStoryFromTemplatePages = useCallback((pages) => {
    return Promise.resolve({ success: true, storyId: -1 });
  }, []);

  const fetchSavedTemplates = useCallback((filters) => {
    // Saved Templates = Bookmarked Templates + My Templates
    dispatch({
      type: TEMPLATE_ACTION_TYPES.PLACEHOLDER,
      paylod: {
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
      paylod: {
        templates: [],
        totalPages: 0,
        totalTemplates: 0,
        page: 1,
      },
    });
  }, []);

  const fetchMyTemplates = useCallback((filters) => {
    dispatch({
      type: TEMPLATE_ACTION_TYPES.PLACEHOLDER,
      paylod: {
        templates: [],
        totalPages: 0,
        totalTemplates: 0,
        page: 1,
      },
    });
  }, []);

  const fetchMyTemplateById = useCallback((templateId) => {
    return Promise.resolve({});
  }, []);

  const fetchExternalTemplates = useCallback(
    (filters) => {
      dispatch({
        type: TEMPLATE_ACTION_TYPES.LOADING_TEMPLATES,
        payload: true,
      });

      const reshapedTemplates = getAllTemplates({ pluginDir }).map(
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

      dispatch({
        type: TEMPLATE_ACTION_TYPES.LOADING_TEMPLATES,
      });
    },
    [pluginDir]
  );

  const fetchExternalTemplateById = useCallback(
    async (templateId) => {
      if (state.templates[templateId]) {
        return state.templates[templateId];
      }

      await fetchExternalTemplates();

      return state.templates[templateId];
    },
    [fetchExternalTemplates, state]
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

  const createTemplateFromStory = useCallback(async (story) => {
    // api call to create a template from a story
    await dispatch({
      type: TEMPLATE_ACTION_TYPES.CREATE_TEMPLATE_FROM_STORY,
    });
  }, []);

  const fetchRelatedTemplates = useCallback(() => {
    if (!state.templates) {
      return [];
    }
    // this will return anywhere between 1 and 5 "related" templates
    const randomStartingIndex = Math.floor(
      Math.random() * state.templatesOrderById.length
    );
    return [...state.templatesOrderById]
      .splice(randomStartingIndex, 5)
      .map((id) => {
        return state.templates[id];
      });
  }, [state.templatesOrderById, state.templates]);

  const api = useMemo(
    () => ({
      bookmarkTemplateById,
      createStoryFromTemplatePages,
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
      createStoryFromTemplatePages,
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
