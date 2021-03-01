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
import { __ } from '@web-stories-wp/i18n';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import {
  DASHBOARD_VIEWS,
  TEMPLATES_GALLERY_SORT_MENU_ITEMS,
} from '../../../../constants';
import {
  FilterPropTypes,
  SearchPropTypes,
  SortPropTypes,
  ViewPropTypes,
} from '../../../../utils/useTemplateView';
import { useDashboardResultsLabel } from '../../../../utils';
import { PageHeading, BodyViewOptions } from '../../shared';

function Header({ filter, totalTemplates, search, sort, view }) {
  const enableInProgressTemplateActions = useFeature(
    'enableInProgressTemplateActions'
  );

  const resultsLabel = useDashboardResultsLabel({
    isActiveSearch: Boolean(search.keyword),
    totalResults: totalTemplates,
    currentFilter: filter.value,
    view: DASHBOARD_VIEWS.TEMPLATES_GALLERY,
  });

  return (
    <>
      <PageHeading heading={__('Explore Templates', 'web-stories')} />
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
    </>
  );
}

Header.propTypes = {
  filter: FilterPropTypes.isRequired,
  search: SearchPropTypes.isRequired,
  sort: SortPropTypes.isRequired,
  totalTemplates: PropTypes.number,
  view: ViewPropTypes.isRequired,
};

export default Header;
