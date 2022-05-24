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
import styled from 'styled-components';
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
import {
  AuthorPropTypes,
  TaxonomyPropTypes,
} from '../../../utils/useStoryView.js';
import { StandardViewContentGutter, ViewStyleBar } from '../../../components';
import { DROPDOWN_TYPES, VIEW_STYLE } from '../../../constants';
import useFilters from '../myStories/filters/useFilters.js';

const DisplayFormatContainer = styled.div`
  height: 76px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -10px;
`;

const StorySortDropdownContainer = styled.div`
  margin: auto 8px;
  align-self: flex-end;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledDropDown = styled(DropDown)`
  width: 210px;
`;

const BodyViewOptionsHeader = styled.div``;
const StyledDatalist = styled(Datalist.DropDown)`
  width: 150px;
`;

const defaultAuthor = {
  filterId: null,
  toggleFilterId: noop,
  queriedAuthors: [],
};

const defaultTaxonomy = {
  filterId: null,
  filterSlug: null,
  toggleFilterId: noop,
  queriedTaxonomies: [],
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
  showTaxonomyDropdown = true,
  author = defaultAuthor,
  // taxonomy = defaultTaxonomy,
  queryAuthorsBySearch = noop,
  queryTaxonomiesBySearch = noop,
}) {
  const [{ taxonomy }, filterDispatch] = useFilters((state) => state);
  console.log(taxonomy);
  // const { taxonomy } = filterState;
  return (
    <StandardViewContentGutter>
      <BodyViewOptionsHeader id="body-view-options-header" />
      <DisplayFormatContainer>
        <Text as="span" size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          <TranslateWithMarkup>{resultsLabel}</TranslateWithMarkup>
        </Text>
        <ControlsContainer>
          {layoutStyle === VIEW_STYLE.GRID && showTaxonomyDropdown && (
            <StorySortDropdownContainer>
              <StyledDatalist
                hasSearch
                hasDropDownBorder
                searchResultsLabel={__('Search results', 'web-stories')}
                aria-label={__('Filter stories by taxonomy', 'web-stories')}
                onChange={(evt) => {
                  filterDispatch({
                    type: 'UPDATE_TAXONOMY_ID',
                    payload: { id: evt.id, slug: evt.taxonomy },
                  });
                }}
                getOptionsByQuery={(search) => taxonomy.query(search)}
                selectedId={taxonomy.filterId}
                placeholder={__('Taxonomies', 'web-stories')}
                primaryOptions={taxonomy.queriedTaxonomies}
                options={taxonomy.queriedTaxonomies}
              />
            </StorySortDropdownContainer>
          )}
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
                placeholder={__('Author', 'web-stories')}
                primaryOptions={author.queriedAuthors}
                options={author.queriedAuthors}
              />
            </StorySortDropdownContainer>
          )}
          {layoutStyle === VIEW_STYLE.GRID && showSortDropdown && (
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
          {showGridToggle && (
            <ControlsContainer>
              <ViewStyleBar
                layoutStyle={layoutStyle}
                onPress={handleLayoutSelect}
              />
            </ControlsContainer>
          )}
        </ControlsContainer>
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
  showTaxonomyDropdown: PropTypes.bool,
  author: AuthorPropTypes,
  // taxonomy: TaxonomyPropTypes,
  queryAuthorsBySearch: PropTypes.func,
  queryTaxonomiesBySearch: PropTypes.func,
};
