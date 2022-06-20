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
import styled, { css } from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import { Icons } from '@googleforcreators/design-system';
import { useCallback, useState } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import Tooltip from '../../../tooltip';
import DropDownMenu from '../../../panels/shared/media/dropDownMenu';

const StyledDropDownMenu = styled(DropDownMenu)`
  margin-left: 12px;
`;

const StyledIcon = styled(Icons.Sort)`
  width: 28px !important;
  height: 28px !important;
`;

const menuStylesOverride = css`
  min-width: 180px;
  margin-top: 0;
`;

const options = [
  {
    value: 'date-desc',
    orderby: 'date',
    order: 'desc',
    label: __('Recently Added', 'web-stories'),
  },
  {
    value: 'title-asc',
    orderby: 'title',
    order: 'asc',
    label: __('Alphabetical: A-Z', 'web-stories'),
  },
  {
    value: 'title-desc',
    orderby: 'title',
    order: 'desc',
    label: __('Alphabetical: Z-A', 'web-stories'),
  },
  {
    value: 'price-asc',
    orderby: 'price',
    order: 'asc',
    label: __('Lowest Price', 'web-stories'),
  },
  {
    value: 'price-desc',
    orderby: 'price',
    order: 'desc',
    label: __('Highest Price', 'web-stories'),
  },
];

function ProductSort({ onChange, value = 'date-desc' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onMenuOpen = () => setIsMenuOpen(true);
  const onMenuClose = () => setIsMenuOpen(false);
  const onMenuSelected = useCallback(
    (newValue) => {
      setIsMenuOpen(false);
      onChange(options.find((option) => option.value === newValue));
    },
    [onChange]
  );

  const optionsWithGroup = [
    {
      group: options.map((option) => ({
        value: `${option.orderby}-${option.order}`,
        ...option,
      })),
    },
  ];

  return (
    <StyledDropDownMenu
      onMenuOpen={onMenuOpen}
      isMenuOpen={isMenuOpen}
      onMenuSelected={onMenuSelected}
      display
      onMenuClose={onMenuClose}
      options={optionsWithGroup}
      ariaLabel={__('Product sort options', 'web-stories')}
      activeValue={value}
      dropDownHeight={340}
      menuStylesOverride={menuStylesOverride}
    >
      <Tooltip title={__('Sort', 'web-stories')}>
        <StyledIcon />
      </Tooltip>
    </StyledDropDownMenu>
  );
}

ProductSort.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default ProductSort;
