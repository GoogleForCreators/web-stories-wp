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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import { Dropdown, Layout } from '../../../../components';
import { DropdownContainer } from '../../../../components/dropdown';
import {
  DASHBOARD_VIEWS,
  TEMPLATES_GALLERY_SORT_MENU_ITEMS,
  DROPDOWN_TYPES,
} from '../../../../constants';
import {
  FilterPropTypes,
  SearchPropTypes,
  SortPropTypes,
  ViewPropTypes,
} from '../../../../utils/useTemplateView';
import { useDashboardResultsLabel } from '../../../../utils';
import { TemplatesPropType } from '../../../../types';
import { PageHeading, BodyViewOptions } from '../../shared';
import useTemplateFilters from '../templateFilters';

const HeadingDropdownsContainer = styled.div`
  display: flex;
  align-items: baseline;
  flex-direction: row;
  justify-content: center;
  width: 100%;

  ${DropdownContainer} {
    margin: 0 10px;
    &:last-child {
      margin-right: 0;
    }
  }
`;
function Header({ filter, totalTemplates, search, templates, sort, view }) {
  const enableInProgressTemplateActions = useFeature(
    'enableInProgressTemplateActions'
  );

  const resultsLabel = useDashboardResultsLabel({
    isActiveSearch: Boolean(search.keyword),
    totalResults: totalTemplates,
    currentFilter: filter.value,
    view: DASHBOARD_VIEWS.TEMPLATES_GALLERY,
  });

  const {
    selectedCategories,
    selectedColors,
    onNewCategorySelected,
    onNewColorSelected,
    clearAllCategories,
    clearAllColors,
  } = useTemplateFilters();

  const TemplateFilters = enableInProgressTemplateActions ? (
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
        ariaLabel={__('Color Dropdown', 'web-stories')}
        type={DROPDOWN_TYPES.COLOR_PANEL}
        placeholder={__('Color', 'web-stories')}
        items={selectedColors}
        onClear={clearAllColors}
        onChange={onNewColorSelected}
      />
    </HeadingDropdownsContainer>
  ) : null;

  return (
    <Layout.Squishable>
      <PageHeading
        centerContent
        defaultTitle={__('Templates', 'web-stories')}
        searchPlaceholder={__('Search Templates', 'web-stories')}
        stories={templates}
        showTypeahead={enableInProgressTemplateActions}
        handleTypeaheadChange={
          enableInProgressTemplateActions ? search.setKeyword : () => {}
        }
        typeaheadValue={search.keyword}
      >
        {TemplateFilters}
      </PageHeading>
      <BodyViewOptions
        resultsLabel={resultsLabel}
        layoutStyle={view.style}
        handleLayoutSelect={view.toggleStyle}
        currentSort={sort.value}
        pageSortOptions={TEMPLATES_GALLERY_SORT_MENU_ITEMS}
        showSortDropdown={enableInProgressTemplateActions}
        handleSortChange={enableInProgressTemplateActions ? sort.set : () => {}}
        sortDropdownAriaLabel={__(
          'Choose sort option for display',
          'web-stories'
        )}
      />
    </Layout.Squishable>
  );
}

Header.propTypes = {
  filter: FilterPropTypes.isRequired,
  search: SearchPropTypes.isRequired,
  sort: SortPropTypes.isRequired,
  templates: TemplatesPropType,
  totalTemplates: PropTypes.number,
  view: ViewPropTypes.isRequired,
};

export default Header;
