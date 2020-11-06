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
import { boolean, text, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

/**
 * Internal dependencies
 */
import { SnackbarContainer } from '../snackbarContainer';
import { SnackbarMessage } from '../snackbarMessage';
import { MESSAGE_SEVERITY } from '../constants';

export default {
  title: 'DesignSystem/Components/Snackbar',
};

export const _default = () => (
  <SnackbarContainer>
    <SnackbarMessage
      isPreventAutoDismiss={boolean('isPreventAutoDismiss')}
      handleAction={action('handle action clicked')}
      actionLabel={text('actionLabel', 'Retry')}
      message={text('message', 'Sorry! File failed to upload.')}
      severity={select(
        'severity',
        Object.values(MESSAGE_SEVERITY),
        MESSAGE_SEVERITY.ERROR
      )}
      ariaLabel={text(
        'ariaLabel',
        'this is my aria label giving my message context for screen reader users'
      )}
      handleDismiss={action('handle dismiss fired')}
    />
  </SnackbarContainer>
);

export const NoAction = () => (
  <SnackbarContainer>
    <SnackbarMessage
      isPreventAutoDismiss={boolean('isPreventAutoDismiss')}
      handleAction={action('handle action clicked')}
      actionLabel={text('actionLabel', '')}
      message={text('message', 'Sorry! File failed to upload.')}
      severity={select(
        'severity',
        Object.values(MESSAGE_SEVERITY),
        MESSAGE_SEVERITY.ERROR
      )}
      ariaLabel={text(
        'ariaLabel',
        'this is my aria label giving my message context for screen reader users'
      )}
      handleDismiss={action('handle dismiss fired')}
    />
  </SnackbarContainer>
);

export const LongMessage = () => (
  <SnackbarContainer>
    <SnackbarMessage
      isPreventAutoDismiss={boolean('isPreventAutoDismiss')}
      handleAction={action('handle action clicked')}
      actionLabel={text('actionLabel', 'Retry')}
      message={text(
        'message',
        'Sorry! File failed to upload because it is way too big. Try optimizing it and upload again.'
      )}
      severity={select(
        'severity',
        Object.values(MESSAGE_SEVERITY),
        MESSAGE_SEVERITY.ERROR
      )}
      ariaLabel={text(
        'ariaLabel',
        'this is my aria label giving my message context for screen reader users'
      )}
      handleDismiss={action('handle dismiss fired')}
    />
  </SnackbarContainer>
);
