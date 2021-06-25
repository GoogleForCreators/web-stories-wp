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
import { useMemo, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';
import { __, sprintf } from '@web-stories-wp/i18n';
import { trackEvent } from '@web-stories-wp/tracking';
import styled from 'styled-components';
import { Pill } from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import { useLayoutContext } from '../../../../components';
import {
  DASHBOARD_VIEWS,
  STORY_STATUSES,
  STORY_SORT_MENU_ITEMS,
  TEXT_INPUT_DEBOUNCE,
  STORY_STATUS,
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
} from '../../../../utils/useStoryView';
import { useDashboardResultsLabel } from '../../../../utils';
import { BodyViewOptions, PageHeading } from '../../shared';
import { useConfig } from '../../../config';
import { getSearchOptions } from '../../utils';

const StyledPill = styled(Pill)`
  margin: 0 2px;
  white-space: nowrap;

  & > span {
    padding-left: 8px;
    color: ${({ theme }) => theme.colors.fg.tertiary};
  }
`;
function Header({
  filter,
  isLoading,
  search,
  sort,
  stories,
  totalStoriesByStatus,
  view,
  wpListURL,
}) {
  const {
    actions: { scrollToTop },
  } = useLayoutContext();

  const { capabilities: { canReadPrivatePosts } = {} } = useConfig();

  const searchOptions = useMemo(() => getSearchOptions(stories), [stories]);

  const resultsLabel = useDashboardResultsLabel({
    currentFilter: filter.value,
    isActiveSearch: Boolean(search.keyword),
    totalResults: (filter.value.split(',') || []).reduce(
      (totalResults, filterKey) =>
        (totalResults += totalStoriesByStatus[filterKey] || 0),
      0
    ),
    view: DASHBOARD_VIEWS.MY_STORIES,
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
      totalStoriesByStatus &&
      Object.keys(totalStoriesByStatus).length === 0
    ) {
      return null;
    }

    return (
      <>
        {STORY_STATUSES.map((storyStatus) => {
          const isStoryPrivate = storyStatus.status === STORY_STATUS.PRIVATE;
          const cantReadPrivate =
            !canReadPrivatePosts ||
            !totalStoriesByStatus.private ||
            totalStoriesByStatus.private < 1;

          if (isStoryPrivate && cantReadPrivate) {
            return null;
          }
          const label = storyStatus.label;
          const labelCount = totalStoriesByStatus?.[storyStatus.status] ? (
            <span>{totalStoriesByStatus?.[storyStatus.status]}</span>
          ) : null;

          const ariaLabel = sprintf(
            /* translators: %s is story status */
            __('Filter stories by %s', 'web-stories'),
            storyStatus.label
          );
          return (
            <StyledPill
              key={storyStatus.value}
              onClick={() => {
                handleClick(storyStatus.value);
              }}
              isActive={filter.value === storyStatus.value}
              disabled={totalStoriesByStatus?.[storyStatus.status] <= 0}
              aria-label={ariaLabel}
            >
              {label}
              {labelCount && labelCount}
            </StyledPill>
          );
        }).filter(Boolean)}
      </>
    );
  }, [totalStoriesByStatus, canReadPrivatePosts, filter.value, handleClick]);

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
    search.setKeyword(value);
  }, TEXT_INPUT_DEBOUNCE);

  return (
    <>
      <PageHeading
        heading={__('My Stories', 'web-stories')}
        searchPlaceholder={__('Search Stories', 'web-stories')}
        searchOptions={searchOptions}
        handleSearchChange={debouncedSearchChange}
        showSearch
        searchValue={search.keyword}
      >
        {HeaderToggleButtons}
      </PageHeading>

      <BodyViewOptions
        showGridToggle
        showSortDropdown
        resultsLabel={resultsLabel}
        layoutStyle={view.style}
        isLoading={isLoading}
        handleLayoutSelect={view.toggleStyle}
        currentSort={sort.value}
        pageSortOptions={STORY_SORT_MENU_ITEMS}
        handleSortChange={onSortChange}
        wpListURL={wpListURL}
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
  isLoading: PropTypes.bool,
  search: SearchPropTypes.isRequired,
  sort: SortPropTypes.isRequired,
  stories: StoriesPropType,
  totalStoriesByStatus: TotalStoriesByStatusPropType,
  view: ViewPropTypes.isRequired,
  wpListURL: PropTypes.string,
};

export default memo(Header);
