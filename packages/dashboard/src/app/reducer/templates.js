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
 * Internal dependencies
 */
import groupBy from '../../utils/groupBy';
import reshapeSavedTemplateObject from '../serializers/savedTemplates';

export const ACTION_TYPES = {
  CREATING_TEMPLATE_FROM_STORY: 'creating_template_from_story',
  CREATE_TEMPLATE_FROM_STORY_FAILURE: 'create_template_from_story_failure',
  CREATE_TEMPLATE_FROM_STORY_SUCCESS: 'create_template_from_story_success',
  LOADING_TEMPLATES: 'loading_templates',
  FETCH_TEMPLATES_SUCCESS: 'fetch_templates_success',
  FETCH_TEMPLATES_FAILURE: 'fetch_templates_failure',
  FETCH_MY_TEMPLATES_SUCCESS: 'fetch_my_templates_success',
  FETCH_MY_TEMPLATES_FAILURE: 'fetch_my_templates_failure',
  PLACEHOLDER: 'placeholder',
};

export const defaultTemplatesState = {
  allPagesFetched: false,
  error: {},
  isLoading: false,
  savedTemplates: {},
  savedTemplatesOrderById: [],
  templates: {},
  templatesOrderById: [],
  totalTemplates: null,
  totalPages: null,
};

function templateReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.LOADING_TEMPLATES:
    case ACTION_TYPES.CREATING_TEMPLATE_FROM_STORY: {
      return {
        ...state,
        isLoading: action.payload,
      };
    }

    case ACTION_TYPES.CREATE_TEMPLATE_FROM_STORY_SUCCESS: {
      return {
        ...state,
        error: {},
      };
    }

    case ACTION_TYPES.FETCH_MY_TEMPLATES_FAILURE:
    case ACTION_TYPES.FETCH_TEMPLATES_FAILURE:
    case ACTION_TYPES.CREATE_TEMPLATE_FROM_STORY_FAILURE:
      return {
        ...state,
        error: { ...action.payload, id: Date.now() },
      };

    case ACTION_TYPES.FETCH_MY_TEMPLATES_SUCCESS: {
      const fetchedTemplatesById = [];

      const reshapedSavedTemplates = action.payload.savedTemplates.reduce(
        (acc, current) => {
          if (!current) {
            return acc;
          }
          fetchedTemplatesById.push(current.id);
          acc[current.id] = reshapeSavedTemplateObject(current);
          return acc;
        },
        {}
      );

      const combinedTemplateIds =
        action.payload.page === 1
          ? fetchedTemplatesById
          : [...state.savedTemplatesById, ...fetchedTemplatesById];

      const uniqueTemplateIds = [...new Set(combinedTemplateIds)];

      return {
        ...state,
        savedTemplates: {
          ...state.savedTemplates,
          ...reshapedSavedTemplates,
        },
        isLoading: false,
        savedTemplatesOrderById: uniqueTemplateIds,
        totalTemplates: action.payload.totalTemplates,
        totalPages: action.payload.totalPages,
        error: {},
      };
    }

    case ACTION_TYPES.FETCH_TEMPLATES_SUCCESS: {
      const fetchedTemplatesById = action.payload.templates.map(({ id }) => id);

      const combinedTemplateIds =
        action.payload.page === 1
          ? fetchedTemplatesById
          : [...state.templatesOrderById, ...fetchedTemplatesById];

      const uniqueTemplateIds = [...new Set(combinedTemplateIds)];

      return {
        ...state,
        error: {},
        templatesOrderById: uniqueTemplateIds,
        templates: {
          ...state.templates,
          ...groupBy(action.payload.templates, 'id'),
        },
        isLoading: false,
        totalPages: action.payload.totalPages,
        totalTemplates: action.payload.totalTemplates,
        allPagesFetched: action.payload.page >= action.payload.totalPages,
      };
    }
    case ACTION_TYPES.PLACEHOLDER:
      return defaultTemplatesState;

    default:
      return state;
  }
}

export default templateReducer;
