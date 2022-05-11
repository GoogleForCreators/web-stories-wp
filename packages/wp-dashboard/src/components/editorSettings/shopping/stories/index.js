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
 * Internal dependencies
 */
import Shopping from '..';
import { SHOPPING_PROVIDER_TYPE } from '../../../../constants';

export default {
  title: 'Dashboard/Views/EditorSettings/Shopping',
  component: Shopping,
  args: {
    shoppingProvider: SHOPPING_PROVIDER_TYPE.NONE,
    shopifyHost: 'yourstore.myshopify.com',
    shopifyAccessToken: '',
    vendors: {
      none: 'None',
      shopify: 'Shopify',
      woocommerce: 'WooCommerce',
    },
  },
  argTypes: {
    updateSettings: {
      action: 'update settings',
    },
  },
};

export const _default = (args) => {
  return <Shopping {...args} />;
};
