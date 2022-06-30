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
  Datalist,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { StandardViewContentGutter, ViewStyleBar } from '../../../components';
import useFilters from '../myStories/filters/useFilters';
import SortDropDown from './sortDropDown';

const FILTER_MAX_WIDTH = 350;

const DisplayFormatContainer = styled.div`
  display: grid;
  gap: 1rem;
  min-height: 76px;
  grid-template-columns: 1fr auto auto;
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

const BodyViewOptionsHeader = styled.div``;
const StyledDatalist = styled(Datalist.DropDown)`
  max-width: ${FILTER_MAX_WIDTH}px;
`;

export default function BodyViewOptions({
  handleLayoutSelect,
  resultsLabel,
  layoutStyle,
  pageSortOptions = [],
  pageSortDefaultOption,
  showGridToggle,
  showSortDropdown,
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
                    getOptionsByQuery={filter.query}
                    getPrimaryOptions={filter.getPrimaryOptions}
                    selectedId={filter.filterId}
                    placeholder={filter.placeholder}
                    noMatchesFoundLabel={filter.noMatchesFoundLabel}
                    searchPlaceholder={filter.searchPlaceholder}
                    offsetOverride
                    maxWidth={FILTER_MAX_WIDTH}
                    containerStyleOverrides={css`
                      flex-direction: column;
                    `}
                  />
                </StorySortDropdownContainer>
              ))
            : null}
          {showSortDropdown && (
            <StorySortDropdownContainer>
              <SortDropDown
                pageSortOptions={pageSortOptions}
                pageSortDefaultOption={pageSortDefaultOption}
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
  handleLayoutSelect: PropTypes.func,
  layoutStyle: PropTypes.string.isRequired,
  resultsLabel: PropTypes.string.isRequired,
  showGridToggle: PropTypes.bool,
  showSortDropdown: PropTypes.bool,
  filters: PropTypes.array,
  pageSortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  pageSortDefaultOption: PropTypes.string,
};
