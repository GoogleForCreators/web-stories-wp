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
import { boolean, select, text } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import AdManagement from '..';
import { AD_NETWORK_TYPE } from '../../../../constants';

export default {
  title: 'Dashboard/Views/EditorSettings/AdManagement',
  component: AdManagement,
};

export const _default = () => {
  return (
    <AdManagement
      adNetwork={select(
        'adNetwork',
        Object.values(AD_NETWORK_TYPE),
        AD_NETWORK_TYPE.NONE
      )}
      updateSettings={(adUpdate) => action('trigger ad update')(adUpdate)}
      publisherId={text('publisher Id')}
      adSenseSlotId={text('ad sense slot id')}
      adManagerSlotId={text('ad manager slot id')}
      siteKitStatus={{
        installed: boolean('installed', false),
        active: boolean('siteKitActive', false),
        adsenseActive: boolean('adsenseActive', false),
        adsenseLink: text('adsenseLink', ''),
      }}
    />
  );
};
