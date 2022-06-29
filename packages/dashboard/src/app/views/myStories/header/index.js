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
import {
  SearchPropTypes,
  SortPropTypes,
  ViewPropTypes,
} from '../../../../utils/useStoryView';
import { useDashboardResultsLabel } from '../../../../utils';
import { BodyViewOptions, PageHeading } from '../../shared';
import { getSearchOptions } from '../../utils';
import useFilters from '../filters/useFilters';
import StoryStatusToggle from './storyStatusToggle';

function Header({
  initialPageReady,
  search,
  sort,
  stories,
  totalStoriesByStatus,
  view,
}) {
  const {
    actions: { scrollToTop },
  } = useLayoutContext();

  const { setKeyword } = search;

  const searchOptions = useMemo(() => getSearchOptions(stories), [stories]);

  const { filters } = useFilters(({ state: { filters } }) => ({ filters }));
  const [dropDownFilters, statusFilter] = useMemo(() => {
    const _dropDownFilters = [];
    let _statusFilter;
    for (const filter of filters) {
      if (filter.key === 'status') {
        _statusFilter = filter;
        continue;
      }
      _dropDownFilters.push(filter);
    }
    return [_dropDownFilters, _statusFilter];
  }, [filters]);

  const totalResults = useMemo(
    () =>
      (statusFilter?.filterId.split(',') || []).reduce(
        (total, filterKey) => (total += totalStoriesByStatus[filterKey] || 0),
        0
      ),
    [statusFilter?.filterId, totalStoriesByStatus]
  );

  const resultsLabel = useDashboardResultsLabel({
    currentFilter: statusFilter?.filterId,
    isActiveSearch: Boolean(search.keyword),
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
    setKeyword(value);
  }, TEXT_INPUT_DEBOUNCE);

  const clearSearch = useCallback(() => setKeyword(''), [setKeyword]);

  return (
    <>
      <PageHeading
        heading={__('Dashboard', 'web-stories')}
        searchPlaceholder={__('Search Stories', 'web-stories')}
        searchOptions={searchOptions}
        handleSearchChange={debouncedSearchChange}
        showSearch={initialPageReady}
        searchValue={search.keyword}
        onClear={clearSearch}
      >
        <StoryStatusToggle
          initialPageReady={initialPageReady}
          totalStoriesByStatus={totalStoriesByStatus}
          currentStatus={statusFilter?.filterId}
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
  search: SearchPropTypes.isRequired,
  sort: SortPropTypes.isRequired,
  stories: StoriesPropType,
  totalStoriesByStatus: TotalStoriesByStatusPropType,
  view: ViewPropTypes.isRequired,
};

export default memo(Header);
