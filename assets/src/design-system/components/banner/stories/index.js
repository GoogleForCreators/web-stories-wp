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
import { boolean, text } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '../../../';
import { Text } from '../../';
import { Banner } from '..';

const demoBgUrl = 'https://picsum.photos/1500/160';

export default {
  title: 'DesignSystem/Components/Banner',
  component: Banner,
};

export const _default = () => {
  return (
    <Banner
      closeButtonLabel={'Dismiss storybook banner'}
      title={'my banner'}
      onClose={action('close banner clicked')}
      isDashboard={boolean('isDashboard', false)}
      backgroundUrl={demoBgUrl}
    >
      <Text>{text('children', 'I am a banner child')}</Text>
    </Banner>
  );
};

export const EditorBanner = () => {
  return (
    <Banner
      closeButtonLabel={'Dismiss storybook banner'}
      title={'Animations are here!'}
      onClose={(e) => action('close banner clicked')(e)}
      backgroundUrl={demoBgUrl}
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.X_SMALL}>
        {
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
      </Text>
    </Banner>
  );
};

export const DashboardBanner = () => {
  return (
    <Banner
      closeButtonLabel={'Dismiss storybook banner'}
      title={'Help improve the editor!'}
      onClose={(e) => action('close banner clicked')(e)}
      isDashboard
      backgroundUrl={demoBgUrl}
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.X_SMALL}>
        {
          'Check the box to help us improve the Web Stories plugin by allowing tracking of product usage stats. All data are treated in accordance with '
        }
        <Text
          size={THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.X_SMALL}
          href="#"
          as="a"
        >
          {'Google Privacy Policy'}
        </Text>
      </Text>
    </Banner>
  );
};
