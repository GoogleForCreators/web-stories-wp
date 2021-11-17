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
import { boolean, number, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { useState } from '@web-stories-wp/react';
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
};

export const _default = () => (
  <ThemeProvider theme={theme}>
    <Container>
      <SnackbarContainer
        notifications={[
          {
            actionLabel: text('actionLabel', ''),
            'aria-label': text(
              'aria-label',
              'this is my aria label giving my message context for screen reader users'
            ),
            customZIndex: number('customZIndex'),
            dismissible: boolean('dismissible'),
            preventAutoDismiss: boolean('preventAutoDismiss'),
            message: text('message', 'Sorry! File failed to upload.'),
            onAction: action('on action clicked'),
            onDismiss: action('on dismiss fired'),
          },
        ]}
      />
    </Container>
  </ThemeProvider>
);

export const LightThemeDefault = () => (
  <SnackbarContainer
    notifications={[
      {
        actionLabel: text('actionLabel', ''),
        customZIndex: number('customZIndex'),
        dismissible: boolean('dismissible'),
        onAction: action('on action clicked'),
        onDismiss: action('on dismiss fired'),
        preventAutoDismiss: boolean('preventAutoDismiss'),
        message: text('message', 'Sorry! File failed to upload.'),
      },
    ]}
  />
);

export const Action = () => (
  <SnackbarContainer
    notifications={[
      {
        actionLabel: text('actionLabel', 'Retry'),
        customZIndex: number('customZIndex'),
        dismissible: boolean('dismissible'),
        onAction: action('on action clicked'),
        onDismiss: action('on dismiss fired'),
        preventAutoDismiss: boolean('preventAutoDismiss'),
        message: text('message', 'Sorry! File failed to upload.'),
        timeout: 80000,
      },
    ]}
  />
);

export const EarlyDismissWithAction = () => (
  <SnackbarContainer
    notifications={[
      {
        actionLabel: text('actionLabel', 'Retry'),
        customZIndex: number('customZIndex'),
        dismissible: boolean('dismissible'),
        onAction: action('on action clicked'),
        onDismiss: action('on dismiss fired'),
        preventAutoDismiss: boolean('preventAutoDismiss'),
        message: text('message', 'Sorry! File failed to upload.'),
        timeout: 80000,
      },
    ]}
  />
);

export const NoActionWithRemoveMessageTimingOverride = () => (
  <SnackbarContainer
    notifications={[
      {
        actionLabel: text('actionLabel', ''),
        customZIndex: number('customZIndex'),
        dismissible: boolean('dismissible'),
        onAction: action('on action clicked'),
        onDismiss: action('on dismiss fired'),
        preventAutoDismiss: boolean('preventAutoDismiss'),
        message: text('message', 'Sorry! File failed to upload.'),
        timeout: 80000,
      },
    ]}
  />
);

export const LongMessage = () => (
  <SnackbarContainer
    notifications={[
      {
        actionLabel: text('actionLabel', 'Retry'),
        customZIndex: number('customZIndex'),
        dismissible: boolean('dismissible'),
        onAction: action('on action clicked'),
        onDismiss: action('on dismiss fired'),
        preventAutoDismiss: boolean('preventAutoDismiss'),
        message: text(
          'message',
          'Sorry! File failed to upload because it is way too big. Try optimizing it and upload again.'
        ),
      },
    ]}
  />
);

export const ThumbnailMessage = () => {
  const success = boolean('success');
  const landscape = boolean('landscape');

  return (
    <DarkThemeProvider>
      <Container>
        <SnackbarContainer
          notifications={[
            {
              actionLabel: text('actionLabel', 'Retry'),
              customZIndex: number('customZIndex'),
              dismissible: boolean('dismissible'),
              onAction: action('on action clicked'),
              onDismiss: action('on dismiss fired'),
              preventAutoDismiss: boolean('preventAutoDismiss'),
              message: text(
                'message',
                'Optimization failed. Try uploading a different file.'
              ),
              thumbnail: {
                src: `https://picsum.photos/${landscape ? '90/60' : '60/90'}`,
                alt: 'test',
                status: success
                  ? THUMBNAIL_STATUS.SUCCESS
                  : THUMBNAIL_STATUS.ERROR,
              },
            },
          ]}
        />
      </Container>
    </DarkThemeProvider>
  );
};

export const ShowSnackbarByClickingButton = () => {
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
    action('on dismiss called')(evt);
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
        'aria-label': text(
          'aria-label',
          'this is my aria label giving my message context for screen reader users'
        ),
        customZIndex: number('customZIndex'),
        dismissible: boolean('dismissible'),
        preventAutoDismiss: boolean('preventAutoDismiss'),
        message: randomMessage,
        onDismiss: (evt) => handleOnDismiss(evt, { id: newId }),
        timeout: 5000,
      };

      if (hasAction) {
        notification = {
          ...notification,
          actionLabel: text('actionLabel', 'Undo'),
          onAction: action('on action clicked'),
          actionHelpText: text(
            'actionHelpText',
            'Click this button to get instant cheese'
          ),
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
