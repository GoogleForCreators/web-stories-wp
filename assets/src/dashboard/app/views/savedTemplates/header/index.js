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
import { useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce/lib';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { trackEvent } from '../../../../../tracking';
import { useLayoutContext } from '../../../../components';
import {
  DASHBOARD_VIEWS,
  STORY_SORT_MENU_ITEMS,
  TEXT_INPUT_DEBOUNCE,
} from '../../../../constants';
import { useDashboardResultsLabel } from '../../../../utils';
import {
  FilterPropTypes,
  SearchPropTypes,
  SortPropTypes,
  ViewPropTypes,
} from '../../../../utils/useStoryView';
import { TemplatesPropType } from '../../../../types';
import { BodyViewOptions, PageHeading } from '../../shared';

function Header({ filter, search, sort, templates, view }) {
  const {
    actions: { scrollToTop },
  } = useLayoutContext();

  const resultsLabel = useDashboardResultsLabel({
    isActiveSearch: Boolean(search.keyword),
    currentFilter: filter.value,
    totalResults: templates.length,
    view: DASHBOARD_VIEWS.SAVED_TEMPLATES,
  });

  const onSortChange = useCallback(
    (newSort) => {
      sort.set(newSort);
      scrollToTop();
    },
    [scrollToTop, sort]
  );

  const [debouncedTypeaheadChange] = useDebouncedCallback(async (value) => {
    await trackEvent('search_saved_templates', 'dashboard', '', '', {
      search_term: value,
    });
    search.setKeyword(value);
  }, TEXT_INPUT_DEBOUNCE);

  return (
    <>
      <PageHeading
        defaultTitle={__('Saved Templates', 'web-stories')}
        searchPlaceholder={__('Search Templates', 'web-stories')}
        stories={templates}
        handleTypeaheadChange={debouncedTypeaheadChange}
        typeaheadValue={search.keyword}
      />
      <BodyViewOptions
        showSortDropdown
        resultsLabel={resultsLabel}
        layoutStyle={view.style}
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

export default Header;

Header.propTypes = {
  filter: FilterPropTypes.isRequired,
  view: ViewPropTypes.isRequired,
  search: SearchPropTypes.isRequired,
  sort: SortPropTypes.isRequired,
  templates: TemplatesPropType,
};
