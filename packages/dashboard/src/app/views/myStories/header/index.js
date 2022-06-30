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
  memo,
  useCallback,
  useDebouncedCallback,
  useEffect,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { __ } from '@googleforcreators/i18n';
import { trackEvent } from '@googleforcreators/tracking';
/**
 * Internal dependencies
 */
import { useLayoutContext } from '../../../../components';
import {
  DASHBOARD_VIEWS,
  STORY_SORT_MENU_ITEMS,
  TEXT_INPUT_DEBOUNCE,
} from '../../../../constants';
import {
  StoriesPropType,
  TotalStoriesByStatusPropType,
} from '../../../../types';
import { SortPropTypes, ViewPropTypes } from '../../../../utils/useStoryView';
import { useDashboardResultsLabel } from '../../../../utils';
import { BodyViewOptions, PageHeading } from '../../shared';
import { getSearchOptions } from '../../utils';
import useFilters from '../filters/useFilters';
import StoryStatusToggle from './storyStatusToggle';

function Header({
  initialPageReady,
  sort,
  stories,
  totalStoriesByStatus,
  view,
}) {
  const {
    actions: { scrollToTop },
  } = useLayoutContext();

  const searchOptions = useMemo(() => getSearchOptions(stories), [stories]);

  const { filters, updateFilter, registerFilters } = useFilters(
    ({ state: { filters }, actions: { updateFilter, registerFilters } }) => ({
      filters,
      updateFilter,
      registerFilters,
    })
  );
  const [dropDownFilters, statusFilterValue, searchFilterValue] =
    useMemo(() => {
      const status = filters.find(({ key }) => key === 'status');
      const search = filters.find(({ key }) => key === 'search');
      const rest = filters.filter(
        ({ key }) => !['status', 'search'].includes(key)
      );

      return [rest, status?.filterId, search?.filterId];
    }, [filters]);

  const totalResults = useMemo(
    () =>
      (statusFilterValue?.split(',') || []).reduce(
        (total, filterKey) => (total += totalStoriesByStatus[filterKey] || 0),
        0
      ),
    [statusFilterValue, totalStoriesByStatus]
  );

  const resultsLabel = useDashboardResultsLabel({
    currentFilter: statusFilterValue,
    isActiveSearch: Boolean(searchFilterValue),
    totalResults,
    view: DASHBOARD_VIEWS.DASHBOARD,
  });

  const onSortChange = useCallback(
    (newSort) => {
      sort.set(newSort);
      scrollToTop();
    },
    [scrollToTop, sort]
  );

  const debouncedSearchChange = useDebouncedCallback(async (value) => {
    await trackEvent('search', {
      search_type: 'dashboard',
      search_term: value,
    });
    updateFilter('search', { filterId: value });
  }, TEXT_INPUT_DEBOUNCE);

  useEffect(() => {
    registerFilters([{ key: 'search' }]);
  }, [registerFilters]);

  const clearSearch = useCallback(
    () => updateFilter('search', { filterId: null }),
    [updateFilter]
  );

  return (
    <>
      <PageHeading
        heading={__('Dashboard', 'web-stories')}
        searchPlaceholder={__('Search Stories', 'web-stories')}
        searchOptions={searchOptions}
        handleSearchChange={debouncedSearchChange}
        showSearch={initialPageReady}
        searchValue={searchFilterValue}
        onClear={clearSearch}
      >
        <StoryStatusToggle
          initialPageReady={initialPageReady}
          totalStoriesByStatus={totalStoriesByStatus}
          currentStatus={statusFilterValue}
        />
      </PageHeading>

      <BodyViewOptions
        showGridToggle
        filters={dropDownFilters}
        showSortDropdown
        resultsLabel={resultsLabel}
        layoutStyle={view.style}
        handleLayoutSelect={view.toggleStyle}
        currentSort={sort.value}
        pageSortOptions={STORY_SORT_MENU_ITEMS}
        handleSortChange={onSortChange}
        sortDropdownAriaLabel={__(
          'Choose sort option for display',
          'web-stories'
        )}
      />
    </>
  );
}

Header.propTypes = {
  initialPageReady: PropTypes.bool,
  sort: SortPropTypes.isRequired,
  stories: StoriesPropType,
  totalStoriesByStatus: TotalStoriesByStatusPropType,
  view: ViewPropTypes.isRequired,
};

export default memo(Header);
