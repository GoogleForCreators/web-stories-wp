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
import SnackbarContainer from '../snackbarContainer';
import { ThumbnailStatus } from '../types';
import { Button, ButtonType } from '../..';

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

export const _default = {
  render: function Render(args) {
    return (
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
  },
};

export const LightThemeDefault = {
  render: function Render(args) {
    return <SnackbarContainer notifications={[{ ...args }]} />;
  },
};

export const Action = {
  render: function Render(args) {
    return (
      <SnackbarContainer
        notifications={[
          {
            ...args,
            timeout: 80000,
          },
        ]}
      />
    );
  },

  args: {
    actionLabel: 'Retry',
  },
};

export const EarlyDismissWithAction = {
  render: function Render(args) {
    return (
      <SnackbarContainer
        notifications={[
          {
            timeout: 80000,
            ...args,
          },
        ]}
      />
    );
  },

  args: {
    actionLabel: 'Retry',
  },
};

export const NoActionWithRemoveMessageTimingOverride = {
  render: function Render(args) {
    return (
      <SnackbarContainer
        notifications={[
          {
            timeout: 80000,
            ...args,
          },
        ]}
      />
    );
  },
};

export const LongMessage = {
  render: function Render(args) {
    return <SnackbarContainer notifications={[{ ...args }]} />;
  },

  args: {
    actionLabel: 'Retry',
    message:
      'Sorry! File failed to upload because it is way too big. Try optimizing it and upload again.',
  },
};

export const ThumbnailMessage = {
  render: ({ successBool, landscapeBool, ...args }) => {
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
                    ? ThumbnailStatus.Success
                    : ThumbnailStatus.Error,
                },
                ...args,
              },
            ]}
          />
        </Container>
      </DarkThemeProvider>
    );
  },

  args: {
    actionLabel: 'Retry',
    message: 'Optimization failed. Try uploading a different file.',
    successBool: true,
    landscapeBool: true,
  },
};

export const ShowSnackbarByClickingButton = {
  render: function Render({
    // eslint-disable-next-line react/prop-types
    onAction,
    // eslint-disable-next-line react/prop-types
    onDismiss,
    ...args
  }) {
    const [messageQueue, setMessageQueue] = useState([]);

    const handleRemoveMessage = ({ id }) => {
      setMessageQueue((currentMessages) => {
        const index = currentMessages.findIndex(
          (message) => message.key === id
        );

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
          <Button type={ButtonType.Primary} onClick={handleAddSnackbarToQueue}>
            {'Show Snackbar'}
          </Button>
          <SnackbarContainer notifications={messageQueue} />
        </Container>
      </ThemeProvider>
    );
  },

  args: {
    actionLabel: 'Undo',
    actionHelpText: 'Click this button to get instant cheese',
    preventAutoDismiss: false,
  },
};
