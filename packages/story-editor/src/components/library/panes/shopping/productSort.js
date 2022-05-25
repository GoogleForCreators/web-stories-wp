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
import PropTypes from 'prop-types';
import { __ } from '@googleforcreators/i18n';
import { Datalist } from '@googleforcreators/design-system';
import styled from 'styled-components';

const StyledContainer = styled.div`
  margin-left: 12px;
`;

function SortDropdown({ onChange, sortId }) {

  const options = [
    {
      orderby: 'date',
      order: 'desc',
      name: __('Recently Added', 'web-stories'),
    },
    {
      orderby: 'title',
      order: 'asc',
      name: __('Alphabetical: A-Z', 'web-stories'),
    },
    {
      orderby: 'title',
      order: 'desc',
      name: __('Alphabetical: Z-A', 'web-stories'),
    },
    {
      orderby: 'price',
      order: 'asc',
      name: __('Price: low to high', 'web-stories'),
    },
    {
      orderby: 'price',
      order: 'desc',
      name: __('Price: high to low', 'web-stories'),
    },
  ];

  return (
    <StyledContainer>
      <Datalist.DropDown
        dropDownLabel={__('Sort', 'web-stories')}
        onChange={onChange}
        selectedId={sortId}
        options={options.map((option) => ({
          id: `${option.orderby}-${option.order}`,
          ...option,
        }))}
        aria-label={__('Product sort options', 'web-stories')}
      />
    </StyledContainer>
  );
}

SortDropdown.propTypes = {
  sortId: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default SortDropdown;
