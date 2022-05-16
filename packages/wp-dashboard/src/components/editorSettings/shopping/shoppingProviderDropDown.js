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
import PropTypes from 'prop-types';
import { __ } from '@googleforcreators/i18n';
import { DropDown } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { SHOPPING_PROVIDER_TYPE } from '../../../constants';

export const TEXT = {
  SLOT_ID_LABEL: __('Shopping provider', 'web-stories'),
};

function ShoppingProviderDropDown({ vendors, shoppingProvider, handleUpdate }) {
  const OPTIONS = [];
  Object.entries(vendors).forEach(([value, label]) =>
    OPTIONS.push({ label, value })
  );
  return (
    <DropDown
      ariaLabel={TEXT.SLOT_ID_LABEL}
      options={OPTIONS}
      selectedValue={shoppingProvider}
      onMenuItemClick={(_, newShoppingProvider) =>
        handleUpdate(newShoppingProvider)
      }
      fillWidth
    />
  );
}
ShoppingProviderDropDown.propTypes = {
  vendors: PropTypes.object,
  handleUpdate: PropTypes.func,
  shoppingProvider: PropTypes.oneOf(Object.values(SHOPPING_PROVIDER_TYPE)),
};

export default ShoppingProviderDropDown;
