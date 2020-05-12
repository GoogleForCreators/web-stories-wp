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
import { __, sprintf, _n } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { useState, useContext, useMemo, useCallback, useEffect } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { UnitsProvider } from '../../../../edit-story/units';
import { TransformProvider } from '../../../../edit-story/components/transform';

import {
  Layout,
  Dropdown,
  InfiniteScroller,
  ScrollToTop,
} from '../../../components';
import { DropdownContainer } from '../../../components/dropdown';

import {
  VIEW_STYLE,
  DROPDOWN_TYPES,
  STORY_SORT_OPTIONS,
} from '../../../constants';
import { clamp, usePagePreviewSize } from '../../../utils/';
import { ApiContext } from '../../api/apiProvider';
import FontProvider from '../../font/fontProvider';
import {
  BodyWrapper,
  PageHeading,
  NoResults,
  StoryGridView,
  BodyViewOptions,
} from '../shared';
import useTemplateFilters from './templateFilters';

const HeadingDropdownsContainer = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-evenly;

  ${DropdownContainer} {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
`;
function TemplatesGallery() {
  const [typeaheadValue, setTypeaheadValue] = useState('');
  const [viewStyle, setViewStyle] = useState(VIEW_STYLE.GRID);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTemplateSort, setCurrentTemplateSort] = useState(
    STORY_SORT_OPTIONS.LAST_MODIFIED
  );
  const { pageSize } = usePagePreviewSize({
    thumbnailMode: viewStyle === VIEW_STYLE.LIST,
    isGrid: viewStyle === VIEW_STYLE.GRID,
  });
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
      templateApi: { fetchExternalTemplates },
    },
  } = useContext(ApiContext);

  useEffect(() => {
    fetchExternalTemplates();
  }, [fetchExternalTemplates]);

  const orderedTemplates = useMemo(() => {
    return templatesOrderById.map((templateId) => {
      return templates[templateId];
    });
  }, [templatesOrderById, templates]);

  const handleViewStyleBarButtonSelected = useCallback(() => {
    if (viewStyle === VIEW_STYLE.LIST) {
      setViewStyle(VIEW_STYLE.GRID);
    } else {
      setViewStyle(VIEW_STYLE.LIST);
    }
  }, [viewStyle]);

  const setCurrentPageClamped = useCallback(
    (newPage) => {
      const pageRange = [1, totalPages];
      setCurrentPage(clamp(newPage, pageRange));
    },
    [totalPages]
  );

  const handleNewPageRequest = useCallback(() => {
    setCurrentPageClamped(currentPage + 1);
  }, [currentPage, setCurrentPageClamped]);

  // TODO add support for filters
  const listBarLabel = useMemo(
    () =>
      typeaheadValue
        ? sprintf(
            /* translators: %s: number of results */
            _n('%s result', '%s results', totalTemplates, 'web-stories'),
            totalTemplates
          )
        : __('Viewing all templates', 'web-stories'),
    [totalTemplates, typeaheadValue]
  );

  const {
    selectedCategories,
    selectedColors,
    onNewCategorySelected,
    onNewColorSelected,
    clearAllCategories,
    clearAllColors,
  } = useTemplateFilters();

  const BodyContent = useMemo(() => {
    if (totalTemplates > 0) {
      return (
        <BodyWrapper>
          <StoryGridView
            stories={orderedTemplates}
            centerActionLabel={__('View', 'web-stories')}
            bottomActionLabel={__('Use template', 'web-stories')}
            isTemplate
          />
          <InfiniteScroller
            canLoadMore={!allPagesFetched}
            isLoading={isLoading}
            allDataLoadedMessage={__('No more templates', 'web-stories')}
            onLoadMore={handleNewPageRequest}
          />
        </BodyWrapper>
      );
    }

    return <NoResults typeaheadValue={typeaheadValue} />;
  }, [
    allPagesFetched,
    handleNewPageRequest,
    isLoading,
    orderedTemplates,
    totalTemplates,
    typeaheadValue,
  ]);

  return (
    <FontProvider>
      <TransformProvider>
        <UnitsProvider pageSize={pageSize}>
          <Layout.Provider>
            <Layout.Squishable>
              <PageHeading
                centerContent
                defaultTitle={__('Templates', 'web-stories')}
                searchPlaceholder={__('Template Stories', 'web-stories')}
                stories={orderedTemplates}
                handleTypeaheadChange={setTypeaheadValue}
                typeaheadValue={typeaheadValue}
              >
                <HeadingDropdownsContainer>
                  <Dropdown
                    ariaLabel={__('Category Dropdown', 'web-stories')}
                    type={DROPDOWN_TYPES.PANEL}
                    placeholder={__('Category', 'web-stories')}
                    items={selectedCategories}
                    onClear={clearAllCategories}
                    onChange={onNewCategorySelected}
                  />
                  <Dropdown
                    ariaLabel={__('Style Dropdown', 'web-stories')}
                    type={DROPDOWN_TYPES.PANEL}
                    placeholder={__('Style', 'web-stories')}
                    items={[]}
                    onChange={() => {}}
                  />
                  <Dropdown
                    ariaLabel={__('Color Dropdown', 'web-stories')}
                    type={DROPDOWN_TYPES.COLOR_PANEL}
                    placeholder={__('Color', 'web-stories')}
                    items={selectedColors}
                    onClear={clearAllColors}
                    onChange={onNewColorSelected}
                  />
                  <Dropdown
                    ariaLabel={__('Layout Type Dropdown', 'web-stories')}
                    type={DROPDOWN_TYPES.PANEL}
                    placeholder={__('Layout Type', 'web-stories')}
                    items={[]}
                    onChange={() => {}}
                  />
                </HeadingDropdownsContainer>
              </PageHeading>
              <BodyViewOptions
                listBarLabel={listBarLabel}
                layoutStyle={viewStyle}
                handleLayoutSelect={handleViewStyleBarButtonSelected}
                currentSort={currentTemplateSort}
                handleSortChange={setCurrentTemplateSort}
                sortDropdownAriaLabel={__(
                  'Choose sort option for display',
                  'web-stories'
                )}
              />
            </Layout.Squishable>
            <Layout.Scrollable>{BodyContent}</Layout.Scrollable>
            <Layout.Fixed>
              <ScrollToTop />
            </Layout.Fixed>
          </Layout.Provider>
        </UnitsProvider>
      </TransformProvider>
    </FontProvider>
  );
}

export default TemplatesGallery;
