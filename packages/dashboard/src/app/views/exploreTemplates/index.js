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
import { sprintf, __ } from '@googleforcreators/i18n';
import {
  useMemo,
  useEffect,
  useCallback,
  useState,
  useRef,
} from '@googleforcreators/react';
import { trackEvent, trackScreenView } from '@googleforcreators/tracking';
import {
  uniqueEntriesByKey,
  useLiveRegion,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { Layout, ScrollToTop } from '../../../components';
import { useTemplateView } from '../../../utils';

import useApi from '../../api/useApi';
import useRouteHistory from '../../router/useRouteHistory';
import { getTemplateFilters, composeTemplateFilter } from '../utils';
import useTemplateFilters from './filters/useTemplateFilters';
import Content from './content';
import Header from './header';
import TemplateDetailsModal from './modal';

function ExploreTemplates() {
  const speak = useLiveRegion();
  const [isDetailsViewOpen, setIsDetailsViewOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);

  const { templateIdParam, replace } = useRouteHistory(
    ({ actions, state }) => ({
      templateIdParam: state.queryParams.id,
      replace: actions.replace,
    })
  );

  const idRef = useRef(templateIdParam);

  const {
    allPagesFetched,
    isLoading,
    templates,
    templatesOrderById,
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
      totalPages,
      totalTemplates,
      createStoryFromTemplate,
      fetchExternalTemplates,
    })
  );

  const { filters, sortObject, filtersObject } = useTemplateFilters(
    ({ state: { filters, sortObject, filtersObject } }) => ({
      filters,
      sortObject,
      filtersObject,
    })
  );

  const { page, view } = useTemplateView({
    filtersObject,
    sortObject,
    totalPages,
  });

  const [searchFilterValue] = useMemo(() => {
    const search = filters.find(({ key }) => key === 'search');
    return [search?.filterId];
  }, [filters]);

  // extract templateFilters from template meta data
  const templateFilters = useMemo(
    () => getTemplateFilters(templates),
    [templates]
  );

  // refine templateFilters by search term
  const selectFilters = useMemo(
    () =>
      searchFilterValue
        ? templateFilters.filter((opt) =>
            opt.label.toLowerCase().includes(searchFilterValue.toLowerCase())
          )
        : templateFilters,
    [templateFilters, searchFilterValue]
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

  const updateTemplateView = useCallback(
    (id) => {
      const currentTemplate = orderedTemplates.find(
        (templateItem) => templateItem.id === id
      );
      setActiveTemplate(currentTemplate);
      setActiveTemplateIndex(
        orderedTemplates.findIndex((template) => template.id === id)
      );
      if (idRef.current) {
        idRef.current = undefined;
      }

      replace(`?id=${currentTemplate.id}&isLocal=${currentTemplate.isLocal}`);
    },
    [replace, orderedTemplates]
  );

  const handleDetailsToggle = useCallback(
    (id, title) => {
      setIsDetailsViewOpen((prevIsOpen) => {
        const newIsOpen = !prevIsOpen;
        title && trackScreenView(title);

        if (newIsOpen && id) {
          updateTemplateView(id);
        }

        if (!newIsOpen) {
          replace('');
          speak(__('Exit detail templates view', 'web-stories'));
        }

        return newIsOpen;
      });
    },
    [replace, speak, updateTemplateView]
  );

  const switchToTemplateByOffset = useCallback(
    (offset) => {
      const newTemplate = orderedTemplates[offset];
      setActiveTemplate(newTemplate);
      setActiveTemplateIndex(offset);
      replace(`?id=${newTemplate.id}&isLocal=${newTemplate.isLocal}`);
      speak(
        sprintf(
          /* translators: %s: template title */
          __('Viewing %s', 'web-stories'),
          newTemplate.title
        )
      );
    },
    [orderedTemplates, replace, speak]
  );

  const templateActions = useMemo(
    () => ({
      createStoryFromTemplate: handleCreateStoryFromTemplate,
      handleDetailsToggle,
      switchToTemplateByOffset,
    }),
    [
      handleCreateStoryFromTemplate,
      handleDetailsToggle,
      switchToTemplateByOffset,
    ]
  );

  useEffect(() => {
    fetchExternalTemplates();
  }, [fetchExternalTemplates]);

  useEffect(() => {
    if (idRef.current && orderedTemplates.length) {
      const isValidId = orderedTemplates.some(
        (template) => template.id === parseInt(idRef.current)
      );
      if (!isValidId) {
        replace('');
        return;
      }

      setIsDetailsViewOpen(true);
      updateTemplateView(parseInt(idRef.current));
    }
  }, [orderedTemplates, replace, updateTemplateView]);

  return (
    <Layout.Provider>
      <Header
        isLoading={isLoading && !totalTemplates}
        totalTemplates={totalVisibleTemplates}
        searchOptions={searchOptions}
        view={view}
      />
      <Content
        isLoading={isLoading}
        allPagesFetched={allPagesFetched}
        page={page}
        templates={orderedTemplates}
        totalTemplates={totalVisibleTemplates}
        search={searchFilterValue}
        view={view}
        templateActions={templateActions}
      />
      <Layout.Fixed>
        <ScrollToTop />
      </Layout.Fixed>
      <TemplateDetailsModal
        activeTemplate={activeTemplate}
        activeTemplateIndex={activeTemplateIndex}
        isDetailsViewOpen={isDetailsViewOpen}
        templateActions={templateActions}
        filteredTemplatesLength={orderedTemplates.length}
      />
    </Layout.Provider>
  );
}

export default ExploreTemplates;
