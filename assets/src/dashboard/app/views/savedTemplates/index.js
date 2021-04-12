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
import { useEffect, useMemo } from 'react';

/**
 * Internal dependencies
 */
import { Layout, ScrollToTop } from '../../../components';
import { SAVED_TEMPLATES_STATUSES } from '../../../constants';
import useStoryView from '../../../utils/useStoryView';
import useApi from '../../api/useApi';
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

  const { filter, page, sort, search, view } = useStoryView({
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
        allPagesFetched
        isLoading={false}
        view={view}
        page={page}
        sort={sort}
        templates={orderedSavedTemplates}
        search={search}
        actions={{
          createStoryFromTemplate,
        }}
      />

      <Layout.Fixed>
        <ScrollToTop />
      </Layout.Fixed>
    </Layout.Provider>
  );
}

export default SavedTemplates;
export { Header as SavedTemplatesHeader, Content as SavedTemplatesContent };
