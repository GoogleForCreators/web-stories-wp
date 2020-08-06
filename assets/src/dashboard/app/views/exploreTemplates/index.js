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
import { useCallback, useContext, useMemo, useEffect } from 'react';

/**
 * Internal dependencies
 */
import { Layout, ScrollToTop } from '../../../components';
import { useTemplateView } from '../../../utils';
import { ApiContext } from '../../api/apiProvider';
import { PreviewStoryView } from '../';

import Content from './content';
import Header from './header';

function ExploreTemplates() {
  const {
    state: {
      templates: {
        allPagesFetched,
        isLoading,
        templates,
        templatesOrderById,
        totalPages,
        totalTemplates,
      },
    },
    actions: {
      storyApi: { createStoryFromTemplate },
      templateApi: { fetchExternalTemplates },
    },
  } = useContext(ApiContext);

  const { filter, page, previewVisible, search, sort, view } = useTemplateView({
    totalPages,
  });

  useEffect(() => {
    fetchExternalTemplates();
  }, [fetchExternalTemplates]);

  const orderedTemplates = useMemo(() => {
    return templatesOrderById.map((templateId) => {
      return templates[templateId];
    });
  }, [templatesOrderById, templates]);

  const handlePreviewTemplate = useCallback(
    (e, template) => {
      previewVisible.set(e, template);
    },
    [previewVisible]
  );

  if (previewVisible.value) {
    return (
      <PreviewStoryView
        story={previewVisible.value}
        handleClose={handlePreviewTemplate}
      />
    );
  }

  return (
    <Layout.Provider>
      <Header
        filter={filter}
        sort={sort}
        templates={orderedTemplates}
        totalTemplates={totalTemplates}
        search={search}
        view={view}
      />
      <Content
        isLoading={isLoading}
        allPagesFetched={allPagesFetched}
        page={page}
        templates={orderedTemplates}
        totalTemplates={totalTemplates}
        search={search}
        view={view}
        templateActions={{ createStoryFromTemplate, handlePreviewTemplate }}
      />
      <Layout.Fixed>
        <ScrollToTop />
      </Layout.Fixed>
    </Layout.Provider>
  );
}

export default ExploreTemplates;
