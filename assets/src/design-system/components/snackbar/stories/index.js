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
import { SnackbarMessage } from '../snackbarMessage';

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
      <SnackbarContainer>
        <SnackbarMessage
          actionLabel={text('actionLabel', '')}
          aria-label={text(
            'aria-label',
            'this is my aria label giving my message context for screen reader users'
          )}
          customZIndex={number('customZIndex')}
          handleAction={action('handle action clicked')}
          handleDismiss={action('handle dismiss fired')}
          isPreventAutoDismiss={boolean('isPreventAutoDismiss')}
          message={text('message', 'Sorry! File failed to upload.')}
        />
      </SnackbarContainer>
    </Container>
  </ThemeProvider>
);

export const LightThemeDefault = () => (
  <SnackbarContainer>
    <SnackbarMessage
      actionLabel={text('actionLabel', '')}
      aria-label={text(
        'aria-label',
        'this is my aria label giving my message context for screen reader users'
      )}
      customZIndex={number('customZIndex')}
      handleAction={action('handle action clicked')}
      handleDismiss={action('handle dismiss fired')}
      isPreventAutoDismiss={boolean('isPreventAutoDismiss')}
      message={text('message', 'Sorry! File failed to upload.')}
    />
  </SnackbarContainer>
);

export const Action = () => (
  <SnackbarContainer customZIndex={number('customZIndex')}>
    <SnackbarMessage
      actionLabel={text('actionLabel', 'Retry')}
      aria-label={text(
        'aria-label',
        'this is my aria label giving my message context for screen reader users'
      )}
      customZIndex={number('customZIndex')}
      handleAction={action('handle action clicked')}
      handleDismiss={action('handle dismiss fired')}
      isPreventAutoDismiss={boolean('isPreventAutoDismiss')}
      message={text('message', 'Sorry! File failed to upload.')}
      removeMessageTimeInterval={80000}
      showCloseButton={false}
    />
  </SnackbarContainer>
);

export const EarlyDismissWithAction = () => (
  <SnackbarContainer customZIndex={number('customZIndex')}>
    <SnackbarMessage
      actionLabel={text('actionLabel', 'Retry')}
      aria-label={text(
        'aria-label',
        'this is my aria label giving my message context for screen reader users'
      )}
      customZIndex={number('customZIndex')}
      handleAction={action('handle action clicked')}
      handleDismiss={action('handle dismiss fired')}
      isPreventAutoDismiss={boolean('isPreventAutoDismiss')}
      message={text('message', 'Sorry! File failed to upload.')}
      removeMessageTimeInterval={80000}
    />
  </SnackbarContainer>
);

export const NoActionWithRemoveMessageTimingOverride = () => (
  <SnackbarContainer>
    <SnackbarMessage
      actionLabel={text('actionLabel', '')}
      aria-label={text(
        'aria-label',
        'this is my aria label giving my message context for screen reader users'
      )}
      customZIndex={number('customZIndex')}
      handleAction={action('handle action clicked')}
      handleDismiss={action('handle dismiss fired')}
      isPreventAutoDismiss={boolean('isPreventAutoDismiss')}
      message={text('message', 'Sorry! File failed to upload.')}
      removeMessageTimeInterval={80000}
      showCloseButton={false}
    />
  </SnackbarContainer>
);

export const LongMessage = () => (
  <SnackbarContainer>
    <SnackbarMessage
      actionLabel={text('actionLabel', 'Retry')}
      aria-label={text(
        'aria-label',
        'this is my aria label giving my message context for screen reader users'
      )}
      customZIndex={number('customZIndex')}
      handleAction={action('handle action clicked')}
      handleDismiss={action('handle dismiss fired')}
      isPreventAutoDismiss={boolean('isPreventAutoDismiss')}
      message={text(
        'message',
        'Sorry! File failed to upload because it is way too big. Try optimizing it and upload again.'
      )}
    />
  </SnackbarContainer>
);
