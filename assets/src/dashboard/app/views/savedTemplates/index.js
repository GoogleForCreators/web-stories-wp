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
import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Internal dependencies
 */
import { Layout, ScrollToTop } from '../../../components';
import { SAVED_TEMPLATES_STATUSES } from '../../../constants';
import useStoryView from '../../../utils/useStoryView';
import useApi from '../../api/useApi';
import { DashboardSnackbar, PreviewStoryView } from '../';
import Header from './header';
import Content from './content';

function SavedTemplates() {
  const {
    createStoryFromTemplate,
    fetchMyTemplates,
    savedTemplates,
    savedTemplatesOrderById,
  } = useApi(
    ({
      actions: {
        templateApi: { fetchMyTemplates },
        storyApi: { createStoryFromTemplate },
      },
      state: {
        templates: { savedTemplates, savedTemplatesOrderById },
      },
    }) => ({
      createStoryFromTemplate,
      fetchMyTemplates,
      savedTemplates,
      savedTemplatesOrderById,
    })
  );

  const { activePreview, filter, page, sort, search, view } = useStoryView({
    filters: SAVED_TEMPLATES_STATUSES,
    totalPages: 1,
  });

  const orderedSavedTemplates = useMemo(() => {
    return savedTemplatesOrderById.map((templateId) => {
      return savedTemplates[templateId];
    });
  }, [savedTemplates, savedTemplatesOrderById]);

  useEffect(() => {
    fetchMyTemplates({ page: 1 });
  }, [fetchMyTemplates]);

  const [lastActiveTemplateId, setLastActiveTemplateId] = useState(null);

  const previewTemplate = useCallback(
    (e, template) => {
      activePreview.set(e, template);
      setLastActiveTemplateId(template?.id);
    },
    [activePreview]
  );

  const handleClose = useCallback(
    (e) => {
      activePreview.set(e, undefined);
    },
    [activePreview]
  );

  if (activePreview.value) {
    return (
      <PreviewStoryView story={activePreview.value} handleClose={handleClose} />
    );
  }

  return (
    <Layout.Provider>
      <Header
        filter={filter}
        view={view}
        search={search}
        templates={orderedSavedTemplates}
        sort={sort}
      />
      <Content
        allPagesFetched={true}
        isLoading={false}
        view={view}
        page={page}
        sort={sort}
        templates={orderedSavedTemplates}
        initialFocusId={lastActiveTemplateId}
        search={search}
        actions={{
          previewTemplate,
          createStoryFromTemplate,
        }}
      />

      <Layout.Fixed>
        <DashboardSnackbar />
        <ScrollToTop />
      </Layout.Fixed>
    </Layout.Provider>
  );
}

export default SavedTemplates;
export { Header as SavedTemplatesHeader, Content as SavedTemplatesContent };
