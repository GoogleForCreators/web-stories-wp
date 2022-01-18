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
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  Text,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import Dialog from '../dialog';

export default {
  title: 'Dashboard/Components/Dialog/Base',
  component: Dialog,
  args: {
    isOpen: true,
    title: 'my dialog title',
    secondaryText: 'cancel action',
    primaryText: 'confirm action',
  },
  parameters: {
    controls: {
      include: ['isOpen', 'title', 'secondaryText', 'primaryText'],
    },
  },
};

export const _default = (args) => {
  return (
    <Dialog
      onClose={action('closed')}
      onPrimary={action('confirmed')}
      {...args}
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        }
      </Text>
    </Dialog>
  );
};

export const WithCustomAction = (args) => {
  return (
    <Dialog
      onClose={action('closed')}
      actions={
        <>
          <Button
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.SMALL}
            onClick={action('closed')}
          >
            {'Dismiss'}
          </Button>
          <Button
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.SMALL}
            href={args.href}
            onClick={action('confirmed')}
          >
            {'Add to new post'}
          </Button>
        </>
      }
      {...args}
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        }
      </Text>
    </Dialog>
  );
};
WithCustomAction.args = {
  isOpen: true,
  title: 'my dialog title',
  href: 'https://example.com',
};
WithCustomAction.parameters = {
  controls: {
    include: ['isOpen', 'title', 'href'],
  },
};
