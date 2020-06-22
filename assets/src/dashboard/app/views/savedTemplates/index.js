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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { useEffect, useMemo, useContext } from 'react';

/**
 * Internal dependencies
 */
import { TransformProvider } from '../../../../edit-story/components/transform';
import { UnitsProvider } from '../../../../edit-story/units';
import {
  InfiniteScroller,
  Layout,
  StandardViewContentGutter,
} from '../../../components';
import {
  DASHBOARD_VIEWS,
  SAVED_TEMPLATES_STATUSES,
  STORY_SORT_MENU_ITEMS,
} from '../../../constants';
import useDashboardResultsLabel from '../../../utils/useDashboardResultsLabel';
import useStoryView, {
  FilterPropTypes,
  PagePropTypes,
  SearchPropTypes,
  SortPropTypes,
  ViewPropTypes,
} from '../../../utils/useStoryView';
import { StoriesPropType } from '../../../types';
import FontProvider from '../../font/fontProvider';
import { BodyViewOptions, PageHeading } from '../shared';
import { ApiContext } from '../../api/apiProvider';
import SavedTemplatesGridView from './savedTemplatesGridView';

function Header({ filter, search, sort, stories, view }) {
  const resultsLabel = useDashboardResultsLabel({
    isActiveSearch: Boolean(search.keyword),
    currentFilter: filter.value,
    totalResults: stories.length,
    view: DASHBOARD_VIEWS.SAVED_TEMPLATES,
  });

  return (
    <Layout.Squishable>
      <PageHeading
        defaultTitle={__('Saved Templates', 'web-stories')}
        searchPlaceholder={__('Search Templates', 'web-stories')}
        stories={stories}
        handleTypeaheadChange={search.setKeyword}
        typeaheadValue={search.keyword}
      />
      <BodyViewOptions
        showSortDropdown
        resultsLabel={resultsLabel}
        layoutStyle={view.style}
        currentSort={sort.value}
        pageSortOptions={STORY_SORT_MENU_ITEMS}
        handleSortChange={sort.set}
        sortDropdownAriaLabel={__(
          'Choose sort option for display',
          'web-stories'
        )}
      />
    </Layout.Squishable>
  );
}

function Content({ stories, view, page }) {
  return (
    <Layout.Scrollable>
      <FontProvider>
        <TransformProvider>
          <UnitsProvider
            pageSize={{
              width: view.pageSize.width,
              height: view.pageSize.height,
            }}
          >
            <StandardViewContentGutter>
              <SavedTemplatesGridView view={view} stories={stories} />
              <InfiniteScroller
                allDataLoadedMessage={__('No more templates.', 'web-stories')}
                isLoading={false}
                canLoadMore={false}
                onLoadMore={page.requestNextPage}
              />
            </StandardViewContentGutter>
          </UnitsProvider>
        </TransformProvider>
      </FontProvider>
    </Layout.Scrollable>
  );
}

function SavedTemplates() {
  const {
    actions: {
      templateApi: { fetchMyTemplates },
    },
    state: {
      templates: { savedTemplates, savedTemplatesOrderById },
    },
  } = useContext(ApiContext);

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
        stories={orderedSavedTemplates}
        sort={sort}
      />
      <Content
        view={view}
        page={page}
        sort={sort}
        stories={orderedSavedTemplates}
      />
    </Layout.Provider>
  );
}

Header.propTypes = {
  filter: FilterPropTypes.isRequired,
  view: ViewPropTypes.isRequired,
  search: SearchPropTypes.isRequired,
  sort: SortPropTypes.isRequired,
  stories: StoriesPropType,
};

Content.propTypes = {
  view: ViewPropTypes.isRequired,
  page: PagePropTypes.isRequired,
  stories: StoriesPropType,
};

export default SavedTemplates;
export { Header as SavedTemplatesHeader, Content as SavedTemplatesContent };
