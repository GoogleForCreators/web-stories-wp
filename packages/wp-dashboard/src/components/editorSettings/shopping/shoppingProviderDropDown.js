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
import { __, _x } from '@googleforcreators/i18n';
import { DropDown } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { SHOPPING_PROVIDER_TYPE } from '../../../constants';

export const TEXT = {
  SLOT_ID_LABEL: __('Shopping provider', 'web-stories'),
};

const OPTIONS = [
  {
    label: _x('None', 'shopping provider', 'web-stories'),
    value: SHOPPING_PROVIDER_TYPE.NONE,
  },
  {
    label: __('WooCommerce', 'web-stories'),
    value: SHOPPING_PROVIDER_TYPE.WOOCOMMERCE,
  },
  {
    label: __('Shopify', 'web-stories'),
    value: SHOPPING_PROVIDER_TYPE.SHOPIFY,
  },
];
function ShoppingProviderDropDown({ shoppingProvider, handleUpdate }) {
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
  handleUpdate: PropTypes.func,
  shoppingProvider: PropTypes.oneOf(Object.values(SHOPPING_PROVIDER_TYPE)),
};

export default ShoppingProviderDropDown;
