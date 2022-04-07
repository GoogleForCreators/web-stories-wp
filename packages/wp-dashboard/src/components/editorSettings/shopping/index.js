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
import { __ } from '@googleforcreators/i18n';
import { THEME_CONSTANTS } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import {
  MultilineForm,
  SettingHeading,
  TextInputHelperText,
} from '../components';
import ShopifySettings from './shopify';

export const TEXT = {
  SECTION_HEADING: __('Shopping', 'web-stories'),
  HELPER_MESSAGE: __(
    'Connect your Shopify store so you can easily add products to your stories.',
    'web-stories'
  ),
};

function Shopping({ updateSettings, shopifyHost, shopifyAccessToken }) {
  const handleUpdateShopifyHost = useCallback(
    (newValue) => updateSettings({ shopifyHost: newValue }),
    [updateSettings]
  );

  const handleUpdateShopifyAccessToken = useCallback(
    (newValue) => updateSettings({ shopifyAccessToken: newValue }),
    [updateSettings]
  );

  return (
    <MultilineForm onSubmit={(e) => e.preventDefault()}>
      <div>
        <SettingHeading>{TEXT.SECTION_HEADING}</SettingHeading>

        <TextInputHelperText
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
        >
          {TEXT.HELPER_MESSAGE}
        </TextInputHelperText>
      </div>

      <div>
        <ShopifySettings
          handleUpdateHost={handleUpdateShopifyHost}
          handleUpdateAccessToken={handleUpdateShopifyAccessToken}
          host={shopifyHost}
          accessToken={shopifyAccessToken}
        />
      </div>
    </MultilineForm>
  );
}

Shopping.propTypes = {
  updateSettings: PropTypes.func.isRequired,
  shopifyHost: PropTypes.string,
  shopifyAccessToken: PropTypes.string,
};

export default Shopping;
