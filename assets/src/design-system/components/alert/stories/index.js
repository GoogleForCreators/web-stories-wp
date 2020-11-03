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
import { boolean, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { ALERT_SEVERITY } from '../constants';
import { Alert } from '../';

export default {
  title: 'DesignSystem/Components/Alert',
};

const Wrapper = styled.div`
  width: 400px;
`;

export const _default = () => {
  return (
    <Wrapper>
      <Alert
        isAllowDismiss={boolean('isAllowDismiss1')}
        handleDismiss={action('error message dismiss')}
        message={text('errorMessage', 'This is an error.')}
        title={text('errorTitle', 'Error Title')}
        severity={ALERT_SEVERITY.ERROR}
      />
      <Alert
        isAllowDismiss={boolean('isAllowDismiss2')}
        handleDismiss={action('warning message dismiss')}
        message={text('warningMessage', 'This is a warning.')}
        title={text('warningTitle', 'Warning Title')}
        severity={ALERT_SEVERITY.WARNING}
      />
      <Alert
        isAllowDismiss={boolean('isAllowDismiss3')}
        handleDismiss={action('info message dismiss')}
        message={text('infoMessage', 'This is informational.')}
        title={text('infoTitle', 'Info Title')}
        severity={ALERT_SEVERITY.INFO}
      />
      <Alert
        isAllowDismiss={boolean('isAllowDismiss4')}
        handleDismiss={action('success message dismiss')}
        message={text('successMessage', 'This is successful.')}
        title={text('successTitle', 'Success Title')}
        severity={ALERT_SEVERITY.SUCCESS}
      />
      <Alert
        isAllowDismiss={boolean('isAllowDismiss5')}
        handleDismiss={action('default message dismiss')}
        message={text(
          'defaultMessage',
          'This is an alert without a severity passed in.'
        )}
        title={text('defaultTitle', 'Default Title')}
      />
      <Alert
        isAllowDismiss={boolean('isAllowDismiss6')}
        handleDismiss={action('no auto dismiss dismiss clicked')}
        isPreventAutoDismiss
        message={text(
          'preventAutoDismiss',
          'This is an alert that will not dismiss automatically after 10 seconds.'
        )}
        title={text('noAutoDismissTitle', 'No Auto Dismiss Alert')}
      />
    </Wrapper>
  );
};
