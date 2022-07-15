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
import { __ } from '@googleforcreators/i18n';

/**
 * External dependencies
 */
import {
  useDebouncedCallback,
  useCallback,
  useMemo,
  useEffect,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import {
  DASHBOARD_VIEWS,
  DEFAULT_TEMPLATE_FILTERS,
  TEMPLATES_GALLERY_SORT_MENU_ITEMS,
  TEMPLATES_GALLERY_SORT_OPTIONS,
  TEXT_INPUT_DEBOUNCE,
} from '../../../../constants';
import { ViewPropTypes } from '../../../../utils/useTemplateView';
import useTemplateFilters from '../filters/useTemplateFilters';
import { useDashboardResultsLabel } from '../../../../utils';
import { PageHeading, BodyViewOptions } from '../../shared';

function Header({ isLoading, totalTemplates, view, searchOptions = [] }) {
  const enableInProgressTemplateActions = useFeature(
    'enableInProgressTemplateActions'
  );

  const { filters, sortObject, updateFilter, updateSort, registerFilters } =
    useTemplateFilters(
      ({
        state: { filters, sortObject },
        actions: { updateFilter, updateSort, registerFilters },
      }) => ({
        filters,
        sortObject,
        updateFilter,
        updateSort,
        registerFilters,
      })
    );

  const [statusFilterValue, searchFilterValue] = useMemo(() => {
    const status = filters.find(({ key }) => key === 'status');
    const search = filters.find(({ key }) => key === 'search');
    return [status?.filterId, search?.filterId];
  }, [filters]);

  const debouncedSearchChange = useDebouncedCallback((value) => {
    updateFilter('search', { filterId: value });
  }, TEXT_INPUT_DEBOUNCE);

  useEffect(() => {
    registerFilters([{ key: 'search' }]);
    registerFilters([
      { key: 'status', filterId: DEFAULT_TEMPLATE_FILTERS.filters.status },
    ]);
  }, [registerFilters]);

  const clearSearch = useCallback(
    () => updateFilter('search', { filterId: null }),
    [updateFilter]
  );

  const resultsLabel = useDashboardResultsLabel({
    totalResults: totalTemplates,
    currentFilter: statusFilterValue,
    view: DASHBOARD_VIEWS.TEMPLATES_GALLERY,
  });

  return (
    <>
      <PageHeading
        heading={__('Explore Templates', 'web-stories')}
        searchPlaceholder={__('Search Templates', 'web-stories')}
        showSearch
        searchOptions={searchOptions}
        searchValue={searchFilterValue}
        handleSearchChange={debouncedSearchChange}
        onClear={clearSearch}
      />
      <BodyViewOptions
        resultsLabel={resultsLabel}
        layoutStyle={view.style}
        handleLayoutSelect={view.toggleStyle}
        isLoading={isLoading}
        pageSortOptions={TEMPLATES_GALLERY_SORT_MENU_ITEMS}
        pageSortDefaultOption={TEMPLATES_GALLERY_SORT_OPTIONS.POPULAR}
        currentSort={sortObject}
        handleSortChange={updateSort}
        showSortDropdown={enableInProgressTemplateActions}
        sortDropdownAriaLabel={__(
          'Choose sort option for display',
          'web-stories'
        )}
      />
    </>
  );
}

Header.propTypes = {
  isLoading: PropTypes.bool,
  totalTemplates: PropTypes.number,
  view: ViewPropTypes.isRequired,
  searchOptions: PropTypes.arrayOf(PropTypes.object),
};

export default Header;
