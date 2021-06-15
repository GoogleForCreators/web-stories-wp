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
import styled, { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import { theme } from '../../..';
import { SnackbarContainer } from '../snackbarContainer';
import { THUMBNAIL_STATUS } from '../constants';

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
            dismissable: boolean('dismissable'),
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
        dismissable: boolean('dismissable'),
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
        dismissable: boolean('dismissable'),
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
        dismissable: boolean('dismissable'),
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
        dismissable: boolean('dismissable'),
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
        dismissable: boolean('dismissable'),
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
    <SnackbarContainer
      notifications={[
        {
          actionLabel: text('actionLabel', 'Retry'),
          customZIndex: number('customZIndex'),
          dismissable: boolean('dismissable'),
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
            status: success ? THUMBNAIL_STATUS.SUCCESS : THUMBNAIL_STATUS.ERROR,
          },
        },
      ]}
    />
  );
};
