/*
 * Copyright 2022 Google LLC
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
import { DropDown } from '@googleforcreators/design-system';
import { useCallback } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { DROPDOWN_TYPES } from '../../../constants';
import useFilters from '../myStories/filters/useFilters';

const StyledDropDown = styled(DropDown)`
  width: 210px;
`;

function SortDropDown({ pageSortOptions, pageSortDefaultOption }) {
  const { sortObject, updateSort } = useFilters(
    ({ state: { sortObject }, actions: { updateSort } }) => ({
      sortObject,
      updateSort,
    })
  );

  const handleSortChange = useCallback(
    (_, orderby) => {
      updateSort({ orderby });
    },
    [updateSort]
  );

  return (
    <StyledDropDown
      ariaLabel={__('Choose sort option for display', 'web-stories')}
      options={pageSortOptions}
      type={DROPDOWN_TYPES.DropDown}
      selectedValue={sortObject?.orderby || pageSortDefaultOption}
      onMenuItemClick={handleSortChange}
    />
  );
}

SortDropDown.propTypes = {
  pageSortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  pageSortDefaultOption: PropTypes.string,
};

export default SortDropDown;
