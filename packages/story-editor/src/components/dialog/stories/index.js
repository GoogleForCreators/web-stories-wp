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
import { Text, TextSize } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import Dialog from '../dialog';

export default {
  title: 'Stories Editor/Components/Dialog/Base',
  component: Dialog,
  args: {
    primaryText: 'confirm action',
    secondaryText: 'cancel action',
    title: 'my dialog title',
    isOpen: true,
  },
  argTypes: {
    onClose: { action: 'closed' },
    onPrimary: { action: 'primary clicked' },
    onSecondary: { action: 'secondary clicked' },
  },
  parameters: {
    controls: {
      exclude: ['actions', 'children'],
    },
  },
};

export const _default = {
  render: function Render(args) {
    return (
      <Dialog {...args}>
        <Text.Paragraph size={TextSize.Small}>
          {
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
          }
        </Text.Paragraph>
      </Dialog>
    );
  },
};

export const WithCustomAction = {
  render: _default,

  args: {
    primaryRest: {
      href: 'https://example.com',
    },
    primaryText: 'primary button',
    secondaryText: 'secondary button',
  },
};
