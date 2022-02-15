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
import { useState } from '@googleforcreators/react';
import styled, { ThemeProvider } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { theme } from '../../..';
import { DarkThemeProvider } from '../../../storybookUtils/darkThemeProvider';
import { SnackbarContainer } from '../snackbarContainer';
import { THUMBNAIL_STATUS } from '../constants';
import { Button, BUTTON_TYPES } from '../..';

const buttonText = [
  'Sorry, your image failed to load',
  'Success! One cow successfully bought',
  "We're sorry, the number you are trying to reach is unavailable",
  'Pizza',
  'Pizza bread',
  'Bread sticks',
  'goulash',
  'Porcupines are cool',
  'Whales are kind of cool too',
];

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.bg.primary};
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

export default {
  title: 'DesignSystem/Components/Snackbar',
  args: {
    actionLabel: '',
    customZIndex: 1,
    dismissible: true,
    preventAutoDismiss: true,
    message: 'Sorry! File failed to upload.',
  },
  argTypes: {
    onAction: { action: 'on action clicked' },
    onDismiss: { action: 'on dismiss fired' },
  },
};

export const _default = (args) => (
  <ThemeProvider theme={theme}>
    <Container>
      <SnackbarContainer
        notifications={[
          {
            'aria-label':
              'this is my aria label giving my message context for screen reader users',
            ...args,
          },
        ]}
      />
    </Container>
  </ThemeProvider>
);

export const LightThemeDefault = (args) => (
  <SnackbarContainer notifications={[{ ...args }]} />
);

export const Action = (args) => (
  <SnackbarContainer
    notifications={[
      {
        ...args,
        timeout: 80000,
      },
    ]}
  />
);
Action.args = {
  actionLabel: 'Retry',
};

export const EarlyDismissWithAction = (args) => (
  <SnackbarContainer
    notifications={[
      {
        timeout: 80000,
        ...args,
      },
    ]}
  />
);
EarlyDismissWithAction.args = {
  actionLabel: 'Retry',
};

export const NoActionWithRemoveMessageTimingOverride = (args) => (
  <SnackbarContainer
    notifications={[
      {
        timeout: 80000,
        ...args,
      },
    ]}
  />
);

export const LongMessage = (args) => (
  <SnackbarContainer notifications={[{ ...args }]} />
);
LongMessage.args = {
  actionLabel: 'Retry',
  message:
    'Sorry! File failed to upload because it is way too big. Try optimizing it and upload again.',
};

// eslint-disable-next-line react/prop-types
export const ThumbnailMessage = ({ successBool, landscapeBool, ...args }) => {
  const success = successBool;
  const landscape = landscapeBool;

  return (
    <DarkThemeProvider>
      <Container>
        <SnackbarContainer
          notifications={[
            {
              thumbnail: {
                src: `https://picsum.photos/${landscape ? '90/60' : '60/90'}`,
                alt: 'test',
                status: success
                  ? THUMBNAIL_STATUS.SUCCESS
                  : THUMBNAIL_STATUS.ERROR,
              },
              ...args,
            },
          ]}
        />
      </Container>
    </DarkThemeProvider>
  );
};
ThumbnailMessage.args = {
  actionLabel: 'Retry',
  message: 'Optimization failed. Try uploading a different file.',
  successBool: true,
  landscapeBool: true,
};

export const ShowSnackbarByClickingButton = ({
  // eslint-disable-next-line react/prop-types
  onAction,
  // eslint-disable-next-line react/prop-types
  onDismiss,
  ...args
}) => {
  const [messageQueue, setMessageQueue] = useState([]);

  const handleRemoveMessage = ({ id }) => {
    setMessageQueue((currentMessages) => {
      const index = currentMessages.findIndex((message) => message.key === id);

      return [
        ...currentMessages.slice(0, index),
        ...currentMessages.slice(index + 1),
      ];
    });
  };

  const handleOnDismiss = (evt, notification) => {
    onDismiss(evt);
    handleRemoveMessage(notification);
  };

  const handleAddSnackbarToQueue = () => {
    const newId = uuidv4();
    const randomMessage =
      buttonText[Math.floor(Math.random() * buttonText.length)];

    setMessageQueue((currentMessages) => {
      const hasAction = Boolean(Math.round(Math.random()));

      let notification = {
        id: newId,
        'aria-label':
          'this is my aria label giving my message context for screen reader users',

        customZIndex: args.customZIndex,
        dismissible: args.dismissible,
        preventAutoDismiss: args.preventAutoDismiss,
        message: randomMessage,
        onDismiss: (evt) => handleOnDismiss(evt, { id: newId }),
        timeout: 5000,
      };

      if (hasAction) {
        notification = {
          ...notification,
          actionLabel: args.actionLabel,
          onAction,
          actionHelpText: args.actionHelpText,
        };
      }

      return [...currentMessages, notification];
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Button type={BUTTON_TYPES.PRIMARY} onClick={handleAddSnackbarToQueue}>
          {'Show Snackbar'}
        </Button>
        <SnackbarContainer notifications={messageQueue} />
      </Container>
    </ThemeProvider>
  );
};
ShowSnackbarByClickingButton.args = {
  actionLabel: 'Undo',
  actionHelpText: 'Click this button to get instant cheese',
  preventAutoDismiss: false,
};
