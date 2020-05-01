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

/**
 * Internal dependencies
 */
import { Dropdown, ListBar } from '../../../components';
import {
  STORY_SORT_MENU_ITEMS,
  DROPDOWN_TYPES,
  VIEW_STYLE,
} from '../../../constants';
import BodyWrapper from './bodyWrapper';

const DisplayFormatContainer = styled.div`
  display: flex;
  align-items: space-between;
  align-content: center;
`;

const StorySortDropdownContainer = styled.div`
  margin: auto 0 auto auto;
  align-self: flex-end;
`;

const SortDropdown = styled(Dropdown)`
  min-width: 210px;
`;

const BodyViewOptions = ({
  currentSort,
  handleLayoutSelect,
  handleSortChange,
  listBarLabel,
  layoutStyle,
  sortDropdownAriaLabel,
}) => (
  <BodyWrapper>
    <DisplayFormatContainer>
      <ListBar
        label={listBarLabel}
        layoutStyle={layoutStyle}
        onPress={handleLayoutSelect}
      />
      {layoutStyle === VIEW_STYLE.GRID && (
        <StorySortDropdownContainer>
          <SortDropdown
            ariaLabel={sortDropdownAriaLabel}
            items={STORY_SORT_MENU_ITEMS}
            type={DROPDOWN_TYPES.TRANSPARENT_MENU}
            value={currentSort}
            onChange={(newSort) => handleSortChange(newSort.value)}
          />
        </StorySortDropdownContainer>
      )}
    </DisplayFormatContainer>
  </BodyWrapper>
);

BodyViewOptions.propTypes = {
  currentSort: PropTypes.string.isRequired,
  handleLayoutSelect: PropTypes.func.isRequired,
  handleSortChange: PropTypes.func.isRequired,
  layoutStyle: PropTypes.string.isRequired,
  listBarLabel: PropTypes.string.isRequired,
  sortDropdownAriaLabel: PropTypes.string.isRequired,
};
export default BodyViewOptions;
