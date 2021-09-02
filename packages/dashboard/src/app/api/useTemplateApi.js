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
import { useCallback, useMemo, useReducer } from '@web-stories-wp/react';
import { compareDesc } from '@web-stories-wp/date';
import getAllTemplates from '@web-stories-wp/templates';
/**
 * Internal dependencies
 */
/**
 * Internal dependencies
 */
import templateReducer, {
  defaultTemplatesState,
  ACTION_TYPES as TEMPLATE_ACTION_TYPES,
} from '../reducer/templates';
import { reshapeTemplateObject } from '../serializers';

const useTemplateApi = (dataAdapter, config) => {
  const [state, dispatch] = useReducer(templateReducer, defaultTemplatesState);

  const { cdnURL } = config;

  const fetchExternalTemplates = useCallback(async () => {
    dispatch({
      type: TEMPLATE_ACTION_TYPES.LOADING_TEMPLATES,
      payload: true,
    });

    const templatesByTag = {};

    const reshapedTemplates = (await getAllTemplates({ cdnURL }))
      .map((template) => {
        const reshapedTemplate = reshapeTemplateObject(template, cdnURL);

        reshapedTemplate.tags.forEach((tag) => {
          if (templatesByTag[tag]) {
            templatesByTag[tag].push(reshapedTemplate);
          } else {
            templatesByTag[tag] = [reshapedTemplate];
          }
        });
      })
      .sort((a, b) => compareDesc(a.creationDate, b.creationDate));
    dispatch({
      type: TEMPLATE_ACTION_TYPES.FETCH_TEMPLATES_SUCCESS,
      payload: {
        page: 1,
        templates: reshapedTemplates,
        totalPages: 1,
        totalTemplates: reshapedTemplates.length,
        templatesByTag,
      },
    });
  }, [cdnURL]);

  const fetchExternalTemplateById = useCallback(
    (templateId) => {
      if (state.templates[templateId]) {
        return Promise.resolve(state.templates[templateId]);
      }
      return Promise.reject(new Error());
    },
    [state]
  );

  const api = useMemo(
    () => ({
      fetchExternalTemplates,
      fetchExternalTemplateById,
    }),
    [fetchExternalTemplateById, fetchExternalTemplates]
  );

  return { templates: state, api };
};

export default useTemplateApi;
