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
import { Dropdown, ViewStyleBar } from '../../../components';
import {
  STORY_SORT_MENU_ITEMS,
  DROPDOWN_TYPES,
  VIEW_STYLE,
} from '../../../constants';
import BodyWrapper from './bodyWrapper';

const DisplayFormatContainer = styled.div`
  height: ${({ theme }) => theme.formatContainer.height}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StorySortDropdownContainer = styled.div`
  margin: auto 8px;
  align-self: flex-end;
`;

const SortDropdown = styled(Dropdown)`
  min-width: 210px;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Label = styled.span`
  font-family: ${({ theme }) => theme.fonts.body2.family};
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing}em;
  font-size: ${({ theme }) => theme.fonts.body2.size}px;
  color: ${({ theme }) => theme.colors.gray500};
`;

const BodyViewOptions = ({
  currentSort,
  handleLayoutSelect,
  handleSortChange,
  listBarLabel,
  layoutStyle,
  showGridToggle,
  sortDropdownAriaLabel,
}) => (
  <BodyWrapper>
    <DisplayFormatContainer>
      <Label>{listBarLabel}</Label>
      <ControlsContainer>
        {layoutStyle === VIEW_STYLE.GRID && (
          <StorySortDropdownContainer>
            <SortDropdown
              alignment="flex-end"
              ariaLabel={sortDropdownAriaLabel}
              items={STORY_SORT_MENU_ITEMS}
              type={DROPDOWN_TYPES.MENU}
              value={currentSort}
              onChange={(newSort) => handleSortChange(newSort.value)}
            />
          </StorySortDropdownContainer>
        )}
        {showGridToggle && (
          <ViewStyleBar
            label={listBarLabel}
            layoutStyle={layoutStyle}
            onPress={handleLayoutSelect}
          />
        )}
      </ControlsContainer>
    </DisplayFormatContainer>
  </BodyWrapper>
);

BodyViewOptions.propTypes = {
  currentSort: PropTypes.string.isRequired,
  handleLayoutSelect: PropTypes.func,
  handleSortChange: PropTypes.func.isRequired,
  layoutStyle: PropTypes.string.isRequired,
  listBarLabel: PropTypes.string.isRequired,
  showGridToggle: PropTypes.bool,
  sortDropdownAriaLabel: PropTypes.string.isRequired,
};
export default BodyViewOptions;
