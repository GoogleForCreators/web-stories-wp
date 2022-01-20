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
import { Text, THEME_CONSTANTS } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import Dialog from '../dialog';

export default {
  title: 'Stories Editor/Components/Dialog/Base',
  component: Dialog,
};

export const _default = () => {
  return (
    <Dialog
      isOpen={boolean('isOpen', true)}
      onClose={action('closed')}
      title={text('title', 'my dialog title')}
      onPrimary={action('confirmed')}
      secondaryText={text('secondaryText', 'cancel action')}
      primaryText={text('primaryText', 'confirm action')}
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        }
      </Text>
    </Dialog>
  );
};

export const WithCustomAction = () => {
  return (
    <Dialog
      isOpen={boolean('isOpen', true)}
      onClose={action('closed')}
      title={text('title', 'my dialog title')}
      onPrimary={action('primary clicked')}
      primaryRest={{
        href: 'https://example.com',
      }}
      primaryText={text('primaryText', 'primary button')}
      secondaryText={text('secondaryText', 'secondary button')}
      onSecondary={action('secondary clicked')}
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        }
      </Text>
    </Dialog>
  );
};
