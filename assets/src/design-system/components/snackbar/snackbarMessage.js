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
import PropTypes from 'prop-types';
import { useRef, useEffect } from 'react';
import { rgba } from 'polished';
import styled, { keyframes } from 'styled-components';

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '../../theme';
import { Button } from '../button';
import { Text } from '../typography';
import {
  AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MAX,
  AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MIN,
} from './constants';

const slideIn = keyframes`
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0);
	}
`;

const MessageContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  width: ${({ hasAction }) => (hasAction ? 336 : 208)}px;
  min-height: 48px;
  padding: 14px 16px;
  margin-top: 20px;
  background-color: ${({ theme }) => theme.colors.inverted.bg.primary};
  color: ${({ theme }) => theme.colors.inverted.fg.primary};
  border: ${({ theme }) =>
    `1px solid ${rgba(theme.colors.standard.white, 0.24)}`};
  border-radius: ${({ theme }) => theme.borders.radius};

  animation: 0.5s ${slideIn} ease-out;
`;

const Message = styled(Text)`
  color: ${({ theme }) => theme.colors.inverted.fg.primary};
`;

const ActionButton = styled(Button)`
  align-self: flex-end;
  min-width: 1px;
  height: 2em;
  padding: 0;
  margin: 0 0 0 auto;
  text-decoration: underline;
  color: ${({ theme }) => theme.colors.inverted.fg.linkNormal};

  &:focus,
  &:hover,
  &:active {
    color: ${({ theme }) => theme.colors.inverted.fg.linkHover};
  }
`;

const SnackbarMessage = ({
  actionLabel,
  ariaLabel,
  handleAction = () => {},
  handleDismiss,
  isPreventAutoDismiss,
  message,
  removeMessageTimeInterval,
}) => {
  const autoDismissRef = useRef();
  autoDismissRef.current = isPreventAutoDismiss ? () => {} : handleDismiss;

  const messageRemovalTimeInterval = useRef(
    typeof removeMessageTimeInterval === 'number' &&
      removeMessageTimeInterval < AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MAX &&
      removeMessageTimeInterval > AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MIN
      ? removeMessageTimeInterval
      : AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MAX
  );

  useEffect(() => {
    if (!autoDismissRef.current) {
      return () => {};
    }

    const dismissTimeout = setTimeout(
      () => autoDismissRef.current(),
      messageRemovalTimeInterval.current
    );

    return () => clearTimeout(dismissTimeout);
  }, []);

  return (
    <MessageContainer
      role="alert"
      aria-label={ariaLabel}
      hasAction={Boolean(actionLabel)}
    >
      <Message size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {message}
      </Message>
      {actionLabel && (
        <ActionButton onClick={handleAction}>{actionLabel}</ActionButton>
      )}
    </MessageContainer>
  );
};

SnackbarMessage.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  handleDismiss: PropTypes.func.isRequired,
  actionLabel: PropTypes.string,
  handleAction: PropTypes.func,
  isPreventAutoDismiss: PropTypes.bool,
  removeMessageTimeInterval: PropTypes.number,
};

export { SnackbarMessage };
