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
import { action } from '@storybook/addon-actions';
import { select } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import { AD_NETWORK_TYPE } from '../../../../../constants';
import AdNetwork from '../';

export default {
  title: 'Dashboard/Views/EditorSettings/AdNetwork',
  component: AdNetwork,
};

export const _default = () => {
  return (
    <AdNetwork
      adNetwork={select(
        'adNetwork',
        Object.values(AD_NETWORK_TYPE),
        AD_NETWORK_TYPE.NONE
      )}
      handleUpdate={(newAdNetwork) => action('update ad network')(newAdNetwork)}
    />
  );
};
