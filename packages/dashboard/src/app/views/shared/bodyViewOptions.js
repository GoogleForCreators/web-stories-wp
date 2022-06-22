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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { TranslateWithMarkup, __ } from '@googleforcreators/i18n';
import {
  Text,
  THEME_CONSTANTS,
  DropDown,
  Datalist,
  noop,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { AuthorPropTypes } from '../../../utils/useStoryView.js';
import { StandardViewContentGutter, ViewStyleBar } from '../../../components';
import { DROPDOWN_TYPES, VIEW_STYLE } from '../../../constants';
import useFilters from '../myStories/filters/useFilters';

const DisplayFormatContainer = styled.div`
  min-height: 76px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  justify-content: start;
  align-items: center;
  margin-top: -10px;
`;

const StorySortDropdownContainer = styled.div`
  margin: auto 8px;
  align-self: flex-end;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 1rem 0;
  row-gap: 1rem;
  justify-self: end;
`;

const StyledDropDown = styled(DropDown)`
  width: 210px;
`;

const BodyViewOptionsHeader = styled.div``;
const StyledDatalist = styled(Datalist.DropDown)`
  max-width: 350px;
`;

const defaultAuthor = {
  filterId: null,
  toggleFilterId: noop,
  queriedAuthors: [],
};

export default function BodyViewOptions({
  currentSort,
  handleLayoutSelect,
  handleSortChange,
  resultsLabel,
  layoutStyle,
  pageSortOptions = [],
  showGridToggle,
  showSortDropdown,
  sortDropdownAriaLabel,
  showAuthorDropdown = false,
  author = defaultAuthor,
  queryAuthorsBySearch = noop,
  filters = [],
}) {
  const { updateFilter } = useFilters(({ actions: { updateFilter } }) => ({
    updateFilter,
  }));
  return (
    <StandardViewContentGutter>
      <BodyViewOptionsHeader id="body-view-options-header" />
      <DisplayFormatContainer>
        <Text as="span" size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          <TranslateWithMarkup>{resultsLabel}</TranslateWithMarkup>
        </Text>
        <ControlsContainer>
          {filters?.length
            ? filters.map((filter) => (
                <StorySortDropdownContainer
                  key={filter.key}
                  title={filter.placeholder}
                >
                  <StyledDatalist
                    hasSearch
                    hasDropDownBorder
                    searchResultsLabel={__('Search results', 'web-stories')}
                    aria-label={filter.ariaLabel}
                    onChange={({ id }) => {
                      updateFilter(filter.key, {
                        filterId: id,
                      });
                    }}
                    getOptionsByQuery={async (search) => {
                      await filter.query(filter, search);
                    }}
                    selectedId={filter.filterId}
                    placeholder={filter.placeholder}
                    primaryOptions={filter.primaryOptions}
                    options={filter.queriedOptions}
                    noMatchesFoundLabel={filter.noMatchesFoundLabel}
                    searchPlaceholder={filter.searchPlaceholder}
                    offsetOverride
                    containerStyleOverrides={css`
                      flex-direction: column;
                    `}
                  />
                </StorySortDropdownContainer>
              ))
            : null}
          {layoutStyle === VIEW_STYLE.GRID && showAuthorDropdown && (
            <StorySortDropdownContainer>
              <StyledDatalist
                hasSearch
                hasDropDownBorder
                searchResultsLabel={__('Search results', 'web-stories')}
                aria-label={__('Filter stories by author', 'web-stories')}
                onChange={author.toggleFilterId}
                getOptionsByQuery={queryAuthorsBySearch}
                selectedId={author.filterId}
                placeholder={__('All Authors', 'web-stories')}
                primaryOptions={author.queriedAuthors}
                options={author.queriedAuthors}
                noMatchesFoundLabel={__('No authors found', 'web-stories')}
                searchPlaceholder={__('Search authors', 'web-stories')}
                offsetOverride
              />
            </StorySortDropdownContainer>
          )}
          {showSortDropdown && (
            <StorySortDropdownContainer>
              <StyledDropDown
                ariaLabel={sortDropdownAriaLabel}
                options={pageSortOptions}
                type={DROPDOWN_TYPES.MENU}
                selectedValue={currentSort}
                onMenuItemClick={(_, newSort) => handleSortChange(newSort)}
              />
            </StorySortDropdownContainer>
          )}
        </ControlsContainer>
        {showGridToggle && (
          <ViewStyleBar
            layoutStyle={layoutStyle}
            onPress={handleLayoutSelect}
          />
        )}
      </DisplayFormatContainer>
    </StandardViewContentGutter>
  );
}

BodyViewOptions.propTypes = {
  currentSort: PropTypes.string.isRequired,
  handleLayoutSelect: PropTypes.func,
  handleSortChange: PropTypes.func,
  layoutStyle: PropTypes.string.isRequired,
  resultsLabel: PropTypes.string.isRequired,
  pageSortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  showGridToggle: PropTypes.bool,
  showSortDropdown: PropTypes.bool,
  sortDropdownAriaLabel: PropTypes.string.isRequired,
  showAuthorDropdown: PropTypes.bool,
  author: AuthorPropTypes,
  queryAuthorsBySearch: PropTypes.func,
  filters: PropTypes.array,
};
