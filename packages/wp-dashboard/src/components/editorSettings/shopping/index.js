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
import { useCallback } from '@googleforcreators/react';
import { __, TranslateWithMarkup } from '@googleforcreators/i18n';
import { THEME_CONSTANTS } from '@googleforcreators/design-system';
import { trackClick } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import {
  InlineLink,
  MultilineForm,
  SettingHeading,
  TextInputHelperText,
} from '../components';
import { SHOPPING_PROVIDER_TYPE } from '../../../constants';
import ShopifySettings from './shopify';
import ShoppingProviderDropDown from './shoppingProviderDropDown';

export const TEXT = {
  SECTION_HEADING: __('Shopping', 'web-stories'),
  SHOPPING_PROVIDER_HELPER_MESSAGE: __(
    'Once configured you can add products from this provider.',
    'web-stories'
  ),
  HELPER_MESSAGE: __(
    'Connect your store so you can easily add products to your stories.',
    'web-stories'
  ),
  WOOCOMMERCE_INSTALL: __(
    'Install <a>WooCommerce</a> to easily add shoppable products to Web Stories.',
    'web-stories'
  ),
  WOOCOMMERCE_ACTIVE: __(
    'Activate <a>WooCommerce</a> to easily add shoppable products to Web Stories.',
    'web-stories'
  ),
  WOOCOMMERCE_MANAGE: __(
    'Manage products in <a>WooCommerce</a> to make them available in Web Stories.',
    'web-stories'
  ),
};

function Shopping({
  updateSettings,
  shoppingProvider,
  shopifyHost,
  shopifyAccessToken,
  vendors,
  woocommerce,
}) {
  const handleUpdateShoppingProvider = useCallback(
    (newValue) => updateSettings({ shoppingProvider: newValue }),
    [updateSettings]
  );

  const handleUpdateShopifyHost = useCallback(
    (newValue) => updateSettings({ shopifyHost: newValue }),
    [updateSettings]
  );

  const handleUpdateShopifyAccessToken = useCallback(
    (newValue) => updateSettings({ shopifyAccessToken: newValue }),
    [updateSettings]
  );

  const onWoocommerceClick = useCallback(
    (evt) => trackClick(evt, 'click_woocommerce_link'),
    []
  );

  const { canManage, installed, active, link } = woocommerce;

  let woocommerceMessage;
  if (installed === false) {
    woocommerceMessage = TEXT.WOOCOMMERCE_INSTALL;
  } else if (active === false) {
    woocommerceMessage = TEXT.WOOCOMMERCE_ACTIVE;
  } else if (canManage === true) {
    woocommerceMessage = TEXT.WOOCOMMERCE_MANAGE;
  }

  return (
    <MultilineForm onSubmit={(e) => e.preventDefault()}>
      <div>
        <SettingHeading>{TEXT.SECTION_HEADING}</SettingHeading>

        <TextInputHelperText
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
        >
          {TEXT.HELPER_MESSAGE}
        </TextInputHelperText>
        {shoppingProvider === SHOPPING_PROVIDER_TYPE.WOOCOMMERCE &&
          woocommerceMessage &&
          link && (
            <TextInputHelperText
              data-testid="woocommerceMessage"
              size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
            >
              <TranslateWithMarkup
                mapping={{
                  a: (
                    <InlineLink
                      href={link}
                      rel="noreferrer"
                      target="_blank"
                      size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                      onClick={onWoocommerceClick}
                    />
                  ),
                }}
              >
                {woocommerceMessage}
              </TranslateWithMarkup>
            </TextInputHelperText>
          )}
      </div>

      <div>
        <ShoppingProviderDropDown
          vendors={vendors}
          shoppingProvider={shoppingProvider}
          handleUpdate={handleUpdateShoppingProvider}
        />

        <TextInputHelperText
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
        >
          {TEXT.SHOPPING_PROVIDER_HELPER_MESSAGE}
        </TextInputHelperText>

        {shoppingProvider === SHOPPING_PROVIDER_TYPE.SHOPIFY && (
          <ShopifySettings
            handleUpdateHost={handleUpdateShopifyHost}
            handleUpdateAccessToken={handleUpdateShopifyAccessToken}
            host={shopifyHost}
            accessToken={shopifyAccessToken}
          />
        )}
      </div>
    </MultilineForm>
  );
}

Shopping.propTypes = {
  vendors: PropTypes.object.isRequired,
  woocommerce: PropTypes.object,
  updateSettings: PropTypes.func.isRequired,
  shoppingProvider: PropTypes.string,
  shopifyHost: PropTypes.string,
  shopifyAccessToken: PropTypes.string,
};

export default Shopping;
