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
import { trackEvent, trackEventGA4 } from '@web-stories-wp/tracking';
/**
 * Internal dependencies
 */
import { ToggleButtonGroup, useLayoutContext } from '../../../../components';
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
import {
  BodyViewOptions,
  HeaderToggleButtonContainer,
  PageHeading,
} from '../../shared';
import { useConfig } from '../../../config';

function Header({
  filter,
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

  const resultsLabel = useDashboardResultsLabel({
    currentFilter: filter.value,
    isActiveSearch: Boolean(search.keyword),
    totalResults: totalStoriesByStatus?.all,
    view: DASHBOARD_VIEWS.MY_STORIES,
  });

  const handleClick = useCallback(
    (filterValue) => {
      trackEvent('filter_stories', 'dashboard', filterValue);
      trackEventGA4('filter_stories', {
        status: filterValue,
      });
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
      <HeaderToggleButtonContainer>
        <ToggleButtonGroup
          buttons={STORY_STATUSES.map((storyStatus) => {
            if (
              storyStatus.status === STORY_STATUS.PRIVATE &&
              (!totalStoriesByStatus.private ||
                totalStoriesByStatus.private < 1 ||
                !canReadPrivatePosts)
            ) {
              return null;
            }
            return {
              handleClick: () => {
                handleClick(storyStatus.value);
              },
              key: storyStatus.value,
              isActive: filter.value === storyStatus.value,
              disabled: totalStoriesByStatus?.[storyStatus.status] <= 0,
              ['aria-label']: sprintf(
                /* translators: %s is story status */
                __('Filter stories by %s', 'web-stories'),
                storyStatus.label
              ),
              text: `${storyStatus.label} ${
                totalStoriesByStatus?.[storyStatus.status]
                  ? `(${totalStoriesByStatus?.[storyStatus.status]})`
                  : ''
              }`,
            };
          }).filter(Boolean)}
        />
      </HeaderToggleButtonContainer>
    );
  }, [totalStoriesByStatus, canReadPrivatePosts, filter.value, handleClick]);

  const onSortChange = useCallback(
    (newSort) => {
      sort.set(newSort);
      scrollToTop();
    },
    [scrollToTop, sort]
  );

  const [debouncedTypeaheadChange] = useDebouncedCallback((value) => {
    trackEvent('search_stories', 'dashboard', null, null, {
      search_term: value,
    });
    trackEventGA4('search', {
      search_type: 'dashboard_stories',
      search_term: value,
    });
    search.setKeyword(value);
  }, TEXT_INPUT_DEBOUNCE);

  return (
    <>
      <PageHeading
        defaultTitle={__('My Stories', 'web-stories')}
        searchPlaceholder={__('Search Stories', 'web-stories')}
        stories={stories}
        handleTypeaheadChange={debouncedTypeaheadChange}
        typeaheadValue={search.keyword}
      >
        {HeaderToggleButtons}
      </PageHeading>
      <BodyViewOptions
        showGridToggle
        showSortDropdown
        resultsLabel={resultsLabel}
        layoutStyle={view.style}
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
  search: SearchPropTypes.isRequired,
  sort: SortPropTypes.isRequired,
  stories: StoriesPropType,
  totalStoriesByStatus: TotalStoriesByStatusPropType,
  view: ViewPropTypes.isRequired,
  wpListURL: PropTypes.string,
};

export default memo(Header);
