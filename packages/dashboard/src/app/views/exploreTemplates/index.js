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
import {
  useMemo,
  useEffect,
  useCallback,
  useState,
} from '@web-stories-wp/react';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { Layout, ScrollToTop } from '../../../components';
import { useTemplateView, uniqueEntriesByKey } from '../../../utils';

import useApi from '../../api/useApi';
import { getTemplateFilters, composeTemplateFilter } from '../utils';
import { getRelatedTemplatesIds } from '../templateDetails/utils';
import Content from './content';
import Header from './header';
import TemplateDetailsModal from './modal';

function ExploreTemplates() {
  const [isDetailsViewOpen, setIsDetailsViewOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
  const [relatedTemplates, setRelatedTemplates] = useState([]);

  const {
    allPagesFetched,
    isLoading,
    templates,
    templatesOrderById,
    templatesByTag,
    totalPages,
    totalTemplates,
    createStoryFromTemplate,
    fetchExternalTemplates,
  } = useApi(
    ({
      state: {
        templates: {
          allPagesFetched,
          isLoading,
          templates,
          templatesOrderById,
          templatesByTag,
          totalPages,
          totalTemplates,
        },
      },
      actions: {
        storyApi: { createStoryFromTemplate },
        templateApi: { fetchExternalTemplates },
      },
    }) => ({
      allPagesFetched,
      isLoading,
      templates,
      templatesOrderById,
      templatesByTag,
      totalPages,
      totalTemplates,
      createStoryFromTemplate,
      fetchExternalTemplates,
    })
  );

  const { filter, page, search, sort, view } = useTemplateView({
    totalPages,
  });

  // extract templateFilters from template meta data
  const templateFilters = useMemo(
    () => getTemplateFilters(templates),
    [templates]
  );

  // refine templateFilters by search term
  const selectFilters = useMemo(
    () =>
      search.keyword
        ? templateFilters.filter((opt) =>
            opt.label.toLowerCase().includes(search.keyword.toLowerCase())
          )
        : templateFilters,
    [templateFilters, search.keyword]
  );

  // filter templates by the refined templateFilters
  const orderedTemplates = useMemo(() => {
    return templatesOrderById
      .map((templateId) => templates[templateId])
      .filter(composeTemplateFilter(selectFilters));
  }, [templatesOrderById, templates, selectFilters]);

  const totalVisibleTemplates = useMemo(
    () =>
      totalTemplates !== orderedTemplates.length
        ? orderedTemplates.length
        : totalTemplates,
    [orderedTemplates, totalTemplates]
  );

  // Although we may want to filter templates based on
  // repeat meta data of differing types, we only want
  // the auto-complete to show unique labels
  const searchOptions = useMemo(
    () => uniqueEntriesByKey(selectFilters, 'label'),
    [selectFilters]
  );

  const handleCreateStoryFromTemplate = useCallback(
    (templateId) => {
      const template = templates[templateId];
      trackEvent('use_template', {
        name: template.title,
        template_id: template.id,
      });
      createStoryFromTemplate(template);
    },
    [createStoryFromTemplate, templates]
  );

  const templateActions = useMemo(
    () => ({
      createStoryFromTemplate: handleCreateStoryFromTemplate,
    }),
    [handleCreateStoryFromTemplate]
  );

  const getRelatedTemplates = useCallback(
    (template) => {
      if (!template) {
        return;
      }

      const allRelatedTemplates = getRelatedTemplatesIds(
        template,
        templatesByTag
      );

      const randomRelatedTemplates = allRelatedTemplates
        .sort(() => 0.5 - Math.random()) // Randomly sort the array of ids;
        .slice(0, 6); // Get first 6 templates

      setRelatedTemplates(
        randomRelatedTemplates.map((id) => ({
          ...templates[id],
        }))
      );
    },
    [templates, templatesByTag]
  );

  const handleDetailsToggle = useCallback(
    (id) => {
      setIsDetailsViewOpen((prevIsOpen) => {
        const newIsOpen = !prevIsOpen;
        // should we add a tracking event like so?
        trackEvent('details_view_toggled', {
          status: newIsOpen ? 'open' : 'closed',
        });

        if (newIsOpen && id) {
          setActiveTemplate(
            orderedTemplates.find((templateItem) => templateItem.id === id)
          );
          setActiveTemplateIndex(
            orderedTemplates.findIndex((template) => template.id === id)
          );
        }

        return newIsOpen;
      });
    },
    [
      setIsDetailsViewOpen,
      setActiveTemplate,
      setActiveTemplateIndex,
      orderedTemplates,
    ]
  );

  const switchToTemplateByOffset = useCallback(
    (offset) => {
      setActiveTemplate(orderedTemplates[offset]);
      setActiveTemplateIndex(offset);
    },
    [setActiveTemplateIndex, setActiveTemplate, orderedTemplates]
  );

  useEffect(() => {
    fetchExternalTemplates();
  }, [fetchExternalTemplates]);

  useEffect(() => {
    if (activeTemplate) {
      getRelatedTemplates(activeTemplate);
    }
  }, [activeTemplate, getRelatedTemplates]);

  return (
    <Layout.Provider>
      <Header
        isLoading={isLoading && !totalTemplates}
        filter={filter}
        sort={sort}
        totalTemplates={totalVisibleTemplates}
        search={search}
        searchOptions={searchOptions}
        view={view}
      />
      <Content
        isLoading={isLoading}
        allPagesFetched={allPagesFetched}
        page={page}
        templates={orderedTemplates}
        totalTemplates={totalVisibleTemplates}
        search={search}
        view={view}
        templateActions={templateActions}
        handleDetailsToggle={handleDetailsToggle}
      />
      <Layout.Fixed>
        <ScrollToTop />
      </Layout.Fixed>
      <TemplateDetailsModal
        activeTemplate={activeTemplate}
        activeTemplateIndex={activeTemplateIndex}
        handleDetailsToggle={handleDetailsToggle}
        isDetailsViewOpen={isDetailsViewOpen}
        switchToTemplateByOffset={switchToTemplateByOffset}
        filteredTemplates={orderedTemplates}
        pageSize={view.pageSize}
        templateActions={templateActions}
        relatedTemplates={relatedTemplates}
        createStoryFromTemplate={createStoryFromTemplate}
      />
    </Layout.Provider>
  );
}

export default ExploreTemplates;
