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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { useRef, useEffect } from 'react';

/**
 * Internal dependencies
 */
import { Close } from '../../icons';
import { AlertSeveritiesPropType } from '../../types';
import { AUTO_REMOVE_ALERT_TIME_INTERVAL } from '../../constants';
import {
  AlertContainer,
  AlertText,
  AlertTitle,
  DismissButton,
} from './components';

const Alert = ({
  isPreventAutoDismiss,
  isAllowDismiss,
  message,
  severity,
  title,
  handleDismissClick,
}) => {
  const autoDismissRef = useRef();
  autoDismissRef.current = isPreventAutoDismiss ? () => {} : handleDismissClick;

  useEffect(() => {
    if (!autoDismissRef.current) {
      return () => {};
    }
    const dismissTimeout = setTimeout(
      () => autoDismissRef.current(),
      AUTO_REMOVE_ALERT_TIME_INTERVAL
    );

    return () => clearTimeout(dismissTimeout);
  }, []);

  return (
    <AlertContainer
      severity={severity}
      role="alert"
      aria-label={__('Alert Notification', 'web-stories')}
    >
      <AlertText>
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </AlertText>
      {isAllowDismiss && (
        <DismissButton
          onClick={handleDismissClick}
          ariaLabel={__('Dismiss Alert', 'web-stories')}
        >
          <Close />
        </DismissButton>
      )}
    </AlertContainer>
  );
};

Alert.propTypes = {
  isAllowDismiss: PropTypes.bool,
  message: PropTypes.string.isRequired,
  handleDismissClick: PropTypes.func,
  isPreventAutoDismiss: PropTypes.bool,
  severity: AlertSeveritiesPropType,
  title: PropTypes.string,
};

export default Alert;
