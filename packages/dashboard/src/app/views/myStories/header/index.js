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
import { __, sprintf } from '@googleforcreators/i18n';
import { trackEvent } from '@googleforcreators/tracking';
import styled from 'styled-components';
import { Pill } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import { useLayoutContext } from '../../../../components';
import {
  DASHBOARD_VIEWS,
  STORY_STATUSES,
  STORY_SORT_MENU_ITEMS,
  TEXT_INPUT_DEBOUNCE,
} from '../../../../constants';
import {
  StoriesPropType,
  TotalStoriesByStatusPropType,
} from '../../../../types';
import {
  FilterPropTypes,
  SearchPropTypes,
  SortPropTypes,
  ViewPropTypes,
  AuthorPropTypes,
  CategoryPropTypes,
} from '../../../../utils/useStoryView';
import { useDashboardResultsLabel } from '../../../../utils';
import { BodyViewOptions, PageHeading } from '../../shared';
import { getSearchOptions } from '../../utils';

const StyledPill = styled(Pill)`
  margin: 0 2px;
  white-space: nowrap;

  & > span {
    padding-left: 8px;
    color: ${({ theme, isActive }) =>
      isActive ? theme.colors.gray[20] : theme.colors.fg.tertiary};
  }
`;
function Header({
  filter,
  initialPageReady,
  search,
  sort,
  stories,
  totalStoriesByStatus,
  view,
  author,
  category,
  queryAuthorsBySearch,
  queryCategoriesBySearch,
  showAuthorDropdown,
}) {
  const {
    actions: { scrollToTop },
  } = useLayoutContext();

  const { setKeyword } = search;

  const searchOptions = useMemo(() => getSearchOptions(stories), [stories]);

  const resultsLabel = useDashboardResultsLabel({
    currentFilter: filter.value,
    isActiveSearch: Boolean(search.keyword),
    totalResults: (filter.value.split(',') || []).reduce(
      (totalResults, filterKey) =>
        (totalResults += totalStoriesByStatus[filterKey] || 0),
      0
    ),
    view: DASHBOARD_VIEWS.DASHBOARD,
  });

  const handleClick = useCallback(
    (filterValue) => {
      filter.set(filterValue);
      scrollToTop();
    },
    [filter, scrollToTop]
  );

  const HeaderToggleButtons = useMemo(() => {
    if (
      !initialPageReady ||
      (totalStoriesByStatus && Object.keys(totalStoriesByStatus).length === 0)
    ) {
      return null;
    }

    return (
      <>
        {STORY_STATUSES.map((storyStatus) => {
          const { label, status, value } = storyStatus;
          if (!(status in totalStoriesByStatus)) {
            return null;
          }

          const count = totalStoriesByStatus[status];
          if (count === 0) {
            return null;
          }

          const ariaLabel = sprintf(
            /* translators: %s is story status */
            __('Filter stories by %s', 'web-stories'),
            label
          );
          return (
            <StyledPill
              key={value}
              onClick={() => handleClick(value)}
              isActive={filter.value === value}
              disabled={count <= 0}
              aria-label={ariaLabel}
            >
              {label}
              {count && <span>{count}</span>}
            </StyledPill>
          );
        }).filter(Boolean)}
      </>
    );
  }, [totalStoriesByStatus, filter.value, initialPageReady, handleClick]);

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
        {HeaderToggleButtons}
      </PageHeading>

      <BodyViewOptions
        showGridToggle
        showSortDropdown
        showAuthorDropdown={showAuthorDropdown}
        resultsLabel={resultsLabel}
        layoutStyle={view.style}
        handleLayoutSelect={view.toggleStyle}
        currentSort={sort.value}
        pageSortOptions={STORY_SORT_MENU_ITEMS}
        handleSortChange={onSortChange}
        author={author}
        category={category}
        queryAuthorsBySearch={queryAuthorsBySearch}
        queryCategoriesBySearch={queryCategoriesBySearch}
        sortDropdownAriaLabel={__(
          'Choose sort option for display',
          'web-stories'
        )}
      />
    </>
  );
}

Header.propTypes = {
  filter: FilterPropTypes.isRequired,
  initialPageReady: PropTypes.bool,
  search: SearchPropTypes.isRequired,
  sort: SortPropTypes.isRequired,
  stories: StoriesPropType,
  totalStoriesByStatus: TotalStoriesByStatusPropType,
  view: ViewPropTypes.isRequired,
  author: AuthorPropTypes,
  category: CategoryPropTypes,
  queryAuthorsBySearch: PropTypes.func,
  queryCategoriesBySearch: PropTypes.func,
  showAuthorDropdown: PropTypes.bool,
};

export default memo(Header);
