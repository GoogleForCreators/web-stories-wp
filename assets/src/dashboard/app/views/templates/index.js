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
import { Dropdown } from '../../../components';
import { DropdownContainer } from '../../../components/dropdown';
import {
  VIEW_STYLE,
  DROPDOWN_TYPES,
  STORY_SORT_OPTIONS,
} from '../../../constants';
import { ApiContext } from '../../api/apiProvider';
import { UnitsProvider } from '../../../../edit-story/units';
import { TransformProvider } from '../../../../edit-story/components/transform';
import FontProvider from '../../font/fontProvider';
import usePagePreviewSize from '../../../utils/usePagePreviewSize';
import {
  BodyWrapper,
  PageHeading,
  NoResults,
  StoryGridView,
  BodyViewOptions,
} from '../shared';

const ExploreFiltersContainer = styled.div`
  padding: 0 20px 20px;
  border-bottom: ${({ theme }) => theme.subNavigationBar.border};
  flex-direction: row;
  display: flex;

  ${DropdownContainer} {
    margin-right: 15px;
  }
`;

function TemplatesGallery() {
  const [typeaheadValue, setTypeaheadValue] = useState('');
  const [viewStyle, setViewStyle] = useState(VIEW_STYLE.GRID);
  const [currentTemplateSort, setCurrentTemplateSort] = useState(
    STORY_SORT_OPTIONS.LAST_MODIFIED
  );
  const { pageSize } = usePagePreviewSize({
    thumbnailMode: viewStyle === VIEW_STYLE.LIST,
  });
  const {
    state: { templates },
    actions: { templateApi },
  } = useContext(ApiContext);

  useEffect(() => {
    templateApi.fetchExternalTemplates();
  }, [templateApi]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const lowerTypeaheadValue = typeaheadValue.toLowerCase();
      return template.title.toLowerCase().includes(lowerTypeaheadValue);
    });
  }, [templates, typeaheadValue]);

  const handleViewStyleBarButtonSelected = useCallback(() => {
    if (viewStyle === VIEW_STYLE.LIST) {
      setViewStyle(VIEW_STYLE.GRID);
    } else {
      setViewStyle(VIEW_STYLE.LIST);
    }
  }, [viewStyle]);

  const filteredTemplatesCount = filteredTemplates.length;

  const listBarLabel = sprintf(
    /* translators: %s: number of stories */
    _n(
      '%s total template',
      '%s total templates',
      filteredTemplatesCount,
      'web-stories'
    ),
    filteredTemplatesCount
  );

  const BodyContent = useMemo(() => {
    if (filteredTemplatesCount > 0) {
      return (
        <BodyWrapper>
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
          <StoryGridView
            filteredStories={filteredTemplates}
            centerActionLabel={__('View details', 'web-stories')}
            bottomActionLabel={__('Use template', 'web-stories')}
          />
        </BodyWrapper>
      );
    }

    return <NoResults typeaheadValue={typeaheadValue} />;
  }, [
    filteredTemplates,
    filteredTemplatesCount,
    handleViewStyleBarButtonSelected,
    listBarLabel,
    typeaheadValue,
    viewStyle,
    currentTemplateSort,
  ]);

  return (
    <FontProvider>
      <TransformProvider>
        <UnitsProvider pageSize={pageSize}>
          <PageHeading
            defaultTitle={__('Explore Templates', 'web-stories')}
            searchPlaceholder={__('Template Stories', 'web-stories')}
            filteredStories={filteredTemplates}
            handleTypeaheadChange={setTypeaheadValue}
            typeaheadValue={typeaheadValue}
          />
          <ExploreFiltersContainer>
            <Dropdown
              ariaLabel={__('Category Dropdown', 'web-stories')}
              type={DROPDOWN_TYPES.PANEL}
              placeholder={__('Category', 'web-stories')}
              items={[]}
              onChange={() => {}}
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
              type={DROPDOWN_TYPES.PANEL}
              placeholder={__('Color', 'web-stories')}
              items={[]}
              onChange={() => {}}
            />
            <Dropdown
              ariaLabel={__('Layout Type Dropdown', 'web-stories')}
              type={DROPDOWN_TYPES.PANEL}
              placeholder={__('Layout Type', 'web-stories')}
              items={[]}
              onChange={() => {}}
            />
          </ExploreFiltersContainer>
          {BodyContent}
        </UnitsProvider>
      </TransformProvider>
    </FontProvider>
  );
}

export default TemplatesGallery;
