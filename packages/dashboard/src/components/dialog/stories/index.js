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
  BUTTON_SIZES,
  BUTTON_TYPES,
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

export const _default = (args) => {
  return (
    <Dialog {...args}>
      <Text.Paragraph size={TextSize.Small}>
        {
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        }
      </Text.Paragraph>
    </Dialog>
  );
};

// eslint-disable-next-line react/prop-types
export const WithCustomAction = ({ onClickButton, onConfirmed, ...args }) => {
  return (
    <Dialog
      actions={
        <>
          <Button
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.SMALL}
            onClick={onClickButton}
          >
            {'Dismiss'}
          </Button>
          <Button
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.SMALL}
            href={args.href}
            onClick={onConfirmed}
          >
            {'Add to new post'}
          </Button>
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
};
WithCustomAction.args = {
  isOpen: true,
  title: 'my dialog title',
  href: 'https://example.com',
};
WithCustomAction.argTypes = {
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
};
WithCustomAction.parameters = {
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
};
