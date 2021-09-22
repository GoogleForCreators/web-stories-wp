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

export const ACTION_TYPES = {
  LOADING_TEMPLATES: 'loading_templates',
  FETCH_TEMPLATES_SUCCESS: 'fetch_templates_success',
  FETCH_TEMPLATES_FAILURE: 'fetch_templates_failure',
  PLACEHOLDER: 'placeholder',
};

export const defaultTemplatesState = {
  allPagesFetched: false,
  error: {},
  isLoading: false,
  templates: {},
  templatesByTag: {},
  templatesOrderById: [],
  totalTemplates: null,
  totalPages: null,
};

function templateReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.LOADING_TEMPLATES: {
      return {
        ...state,
        isLoading: action.payload,
      };
    }

    case ACTION_TYPES.FETCH_TEMPLATES_FAILURE:
      return {
        ...state,
        error: { ...action.payload, id: Date.now() },
      };

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
        templatesByTag: action.payload.templatesByTag,
      };
    }
    case ACTION_TYPES.PLACEHOLDER:
      return defaultTemplatesState;

    default:
      return state;
  }
}

export default templateReducer;
