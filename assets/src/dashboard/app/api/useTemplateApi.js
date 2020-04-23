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
import { useState, useMemo, useCallback } from 'react';
import moment from 'moment';

/**
 * Internal dependencies
 */
import getAllTemplates from '../../templates';
import { APP_ROUTES } from '../../constants';

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
  const [templates, setTemplates] = useState([]);
  const { pluginDir } = config;

  const createStoryFromTemplatePages = useCallback((pages) => {
    return Promise.resolve({ success: true, storyId: -1 });
  }, []);

  const fetchSavedTemplates = useCallback((filters) => {
    // Saved Templates = Bookmarked Templates + My Templates
    setTemplates([]);
    return Promise.resolve([]);
  }, []);

  const fetchBookmarkedTemplates = useCallback((filters) => {
    setTemplates([]);
    return Promise.resolve([]);
  }, []);

  const fetchMyTemplates = useCallback((filters) => {
    setTemplates([]);
    return Promise.resolve([]);
  }, []);

  const fetchMyTemplateById = useCallback((templateId) => {
    return Promise.resolve({});
  }, []);

  const fetchExternalTemplates = useCallback(
    (filters) => {
      const reshapedTemplates = getAllTemplates({ pluginDir }).map(
        reshapeTemplateObject(false)
      );
      setTemplates(reshapedTemplates);
      return Promise.resolve(reshapedTemplates);
    },
    [pluginDir]
  );

  const fetchExternalTemplateById = useCallback(
    async (templateId) => {
      const fetchedTemplates = await fetchExternalTemplates();

      return Promise.resolve(
        fetchedTemplates.find((template) => template.id === templateId)
      );
    },
    [fetchExternalTemplates]
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

  const api = useMemo(
    () => ({
      bookmarkTemplateById,
      createStoryFromTemplatePages,
      fetchBookmarkedTemplates,
      fetchSavedTemplates,
      fetchMyTemplates,
      fetchMyTemplateById,
      fetchExternalTemplates,
      fetchExternalTemplateById,
    }),
    [
      bookmarkTemplateById,
      createStoryFromTemplatePages,
      fetchBookmarkedTemplates,
      fetchExternalTemplateById,
      fetchExternalTemplates,
      fetchMyTemplateById,
      fetchMyTemplates,
      fetchSavedTemplates,
    ]
  );

  return { templates, api };
};
/* eslint-enable no-unused-vars */

export default useTemplateApi;
