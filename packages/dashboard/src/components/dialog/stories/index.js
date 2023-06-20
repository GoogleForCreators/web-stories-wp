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
import {
  Button,
  ButtonAsLink,
  ButtonSize,
  ButtonType,
  Text,
  TextSize,
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
  argTypes: {
    onClose: {
      action: 'closed',
    },
    onPrimary: {
      action: 'confirmed',
    },
  },
  parameters: {
    controls: {
      include: ['isOpen', 'title', 'secondaryText', 'primaryText'],
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
  render: ({ onClickButton, onConfirmed, ...args }) => {
    return (
      <Dialog
        actions={
          <>
            <Button
              type={ButtonType.Tertiary}
              size={ButtonSize.Small}
              onClick={onClickButton}
            >
              {'Dismiss'}
            </Button>
            <ButtonAsLink
              type={ButtonType.Primary}
              size={ButtonSize.Small}
              href={args.href}
              onClick={onConfirmed}
            >
              {'Add to new post'}
            </ButtonAsLink>
          </>
        }
        {...args}
      >
        <Text.Paragraph size={TextSize.Small}>
          {
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
          }
        </Text.Paragraph>
      </Dialog>
    );
  },

  args: {
    isOpen: true,
    title: 'my dialog title',
    href: 'https://example.com',
  },

  argTypes: {
    onClose: {
      action: 'closed',
    },
    onClickButton: {
      action: 'closed',
      name: 'dismiss click',
    },
    onConfirmed: {
      action: 'confirmed',
      name: 'confirm click',
    },
  },

  parameters: {
    controls: {
      include: [
        'isOpen',
        'title',
        'href',
        'onClose',
        'dismiss click',
        'confirm click',
      ],
    },
  },
};
