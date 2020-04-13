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
import { STORY_SORT_MENU_ITEMS } from '../../../constants';

const DisplayFormatContainer = styled.div`
  margin: ${({ theme }) => `${theme.pageGutter.desktop}px 0`};
  padding-bottom: 20px;
  padding-left: 15px;

  border-bottom: ${({ theme }) => theme.subNavigationBar.border};
  display: flex;
  align-items: space-between;
  align-content: center;

  @media ${({ theme }) => theme.breakpoint.smallDisplayPhone} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StorySortDropdownContainer = styled.div`
  margin: auto 0 auto auto;
  align-self: flex-end;
  @media ${({ theme }) => theme.breakpoint.smallDisplayPhone} {
    align-self: flex-start;
    margin: 20px 0 0;
  }
`;

const SortDropdown = styled(Dropdown)`
  min-width: 147px;
  ul {
    right: 20px;
    max-width: 147px;
  }

  @media ${({ theme }) => theme.breakpoint.smallDisplayPhone} {
    ul {
      left: 20px;
    }
  }
`;

const BodyViewOptions = ({
  currentSort,
  handleLayoutSelect,
  handleSortChange,
  listBarLabel,
  layoutStyle,
  sortDropdownAriaLabel,
}) => (
  <DisplayFormatContainer>
    <ListBar
      label={listBarLabel}
      layoutStyle={layoutStyle}
      onPress={handleLayoutSelect}
    />
    <StorySortDropdownContainer>
      <SortDropdown
        ariaLabel={sortDropdownAriaLabel}
        items={STORY_SORT_MENU_ITEMS}
        value={currentSort}
        onChange={(newSort) => handleSortChange(newSort.value)}
      />
    </StorySortDropdownContainer>
  </DisplayFormatContainer>
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
