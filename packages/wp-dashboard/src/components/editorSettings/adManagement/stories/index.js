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
import AdManagement from '..';
import { AD_NETWORK_TYPE } from '../../../../constants';

export default {
  title: 'Dashboard/Views/EditorSettings/AdManagement',
  component: AdManagement,
  args: {
    publisherId: 'publisher Id',
    adSenseSlotId: 'ad sense slot id',
    adManagerSlotId: 'ad manager slot id',
    installed: false,
    active: false,
    adsenseActive: false,
    adsenseLink: '',
  },
  argTypes: {
    updateSettings: { action: 'trigger ad update' },
    adNetwork: {
      options: Object.values(AD_NETWORK_TYPE),
      control: 'radio',
    },
  },
  parameters: {
    controls: {
      exclude: ['siteKitStatus'],
    },
  },
};

export const _default = (args) => {
  return (
    <AdManagement
      siteKitStatus={{
        installed: args.installed,
        active: args.active,
        adsenseActive: args.adsenseActive,
        adsenseLink: args.adsenseLink,
      }}
      {...args}
    />
  );
};
