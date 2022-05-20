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
import { useFeature } from 'flagged';
import PropTypes from 'prop-types';
import { __ } from '@googleforcreators/i18n';
import { Datalist } from '@googleforcreators/design-system';
import styled from 'styled-components';

const StyledDropDown = styled(Datalist.DropDown)`
  width: 170px;
  height: 36px;
  margin-left: 12px;
`;

function SortDropdown({ onChange, sortId }) {
  const isShoppingIntegrationEnabled = useFeature('shoppingIntegration');

  if (!isShoppingIntegrationEnabled) {
    return null;
  }

  const options = [
    { id: 'recent', name: __('Recently Added', 'web-stories') },
    { id: 'a-z', name: __('Alphabetical: A-Z', 'web-stories') },
    { id: 'z-a', name: __('Alphabetical: Z-A', 'web-stories') },
    { id: 'price-low', name: __('Price: low to high', 'web-stories') },
    { id: 'price-high', name: __('Price: high to low', 'web-stories') },
  ];

  return (
    <StyledDropDown
      activeItemRenderer={() => <span />}
      dropDownLabel={__('Sort', 'web-stories')}
      onChange={onChange}
      selectedId={sortId}
      options={options}
      aria-label={__('Sort by', 'web-stories')}
    />
  );
}

SortDropdown.propTypes = {
  sortId: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default SortDropdown;
