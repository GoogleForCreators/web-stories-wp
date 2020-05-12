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
import { __, _n, sprintf } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { useRef } from 'react';

/**
 * Internal dependencies
 */
import { TransformProvider } from '../../../../edit-story/components/transform';
import { UnitsProvider } from '../../../../edit-story/units';
import { InfiniteScroller, Layout } from '../../../components';
import useStoryView, {
  PagePropTypes,
  SearchPropTypes,
  SortPropTypes,
  ViewPropTypes,
} from '../../../utils/useStoryView';
import getAllTemplates from '../../../templates';
import { StoriesPropType } from '../../../types';
import { reshapeTemplateObject } from '../../api/useTemplateApi';
import { useConfig } from '../../config';
import FontProvider from '../../font/fontProvider';
import {
  BodyViewOptions,
  BodyWrapper,
  PageHeading,
  StoryGridView,
} from '../shared';

function Header({ search, stories, view, sort }) {
  const listBarLabel = sprintf(
    /* translators: %s: number of templates */
    _n(
      '%s total template',
      '%s total templates',
      stories.length,
      'web-stories'
    ),
    stories.length
  );
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
        listBarLabel={listBarLabel}
        layoutStyle={view.style}
        currentSort={sort.value}
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
          <UnitsProvider pageSize={view.pageSize}>
            <BodyWrapper>
              <StoryGridView
                stories={stories}
                centerActionLabel={__('View', 'web-stories')}
                bottomActionLabel={__('Use template', 'web-stories')}
                isTemplate
              />
              <InfiniteScroller
                allDataLoadedMessage={__('No more templates.', 'web-stories')}
                isLoading={false}
                canLoadMore={false}
                onLoadMore={page.requestNextPage}
              />
            </BodyWrapper>
          </UnitsProvider>
        </TransformProvider>
      </FontProvider>
    </Layout.Scrollable>
  );
}

function SavedTemplates() {
  const config = useConfig();
  const { search, view, page, sort } = useStoryView({
    filters: [],
    totalPages: 1,
  });

  /**
   * A placeholder to just have template data in the view for now.
   */
  const mockTemplates = useRef(
    getAllTemplates(config).map(reshapeTemplateObject(false))
  );

  return (
    <Layout.Provider>
      <Header
        view={view}
        search={search}
        stories={mockTemplates.current}
        sort={sort}
      />
      <Content
        view={view}
        page={page}
        sort={sort}
        stories={mockTemplates.current}
      />
    </Layout.Provider>
  );
}

Header.propTypes = {
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
