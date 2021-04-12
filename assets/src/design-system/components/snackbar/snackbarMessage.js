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
import { useRef, useEffect, useCallback } from 'react';
import { rgba } from 'polished';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '../../theme';
import { Button } from '../button';
import { Cross } from '../../icons';
import { Text } from '../typography';
import { focusableOutlineCSS } from '../../theme/helpers';
import { noop } from '../../utils';
import {
  Placement,
  AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MAX,
  AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MIN,
  DEFAULT_MESSAGE_Z_INDEX,
} from './constants';

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  padding: 10px 16px;
  margin-top: 20px;
  background-color: ${({ theme }) => theme.colors.inverted.bg.primary};
  color: ${({ theme }) => theme.colors.inverted.fg.primary};
  border: ${({ theme }) =>
    `1px solid ${rgba(theme.colors.standard.white, 0.24)}`};
  border-radius: ${({ theme }) => theme.borders.radius.medium};
  z-index: ${({ customZIndex }) => customZIndex || DEFAULT_MESSAGE_Z_INDEX};
  pointer-events: auto;
`;
MessageContainer.propTypes = {
  customZIndex: PropTypes.number,
};

const Message = styled(Text)`
  color: ${({ theme }) => theme.colors.inverted.fg.primary};
  max-width: 206px;
  padding-right: ${({ hasAction }) => (hasAction ? '52px' : '0px')};
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ActionButton = styled(Button)`
  align-self: flex-end;
  min-width: 1px;
  height: 2em;
  padding: 0;
  color: ${({ theme }) => theme.colors.inverted.fg.linkNormal};

  ${({ theme }) =>
    focusableOutlineCSS(
      theme.colors.border.focus,
      theme.colors.inverted.bg.primary
    )}

  &:hover,
  &:active {
    color: ${({ theme }) => theme.colors.inverted.fg.linkHover};
  }
`;

const CloseButton = styled(Button)`
  height: 2em;
  padding: 0;
  margin-left: 16px;
  color: ${({ theme }) => theme.colors.inverted.fg.primary};

  ${({ theme }) =>
    focusableOutlineCSS(
      theme.colors.border.focus,
      theme.colors.inverted.bg.primary
    )}

  svg {
    height: 32px;
  }
`;

const SnackbarMessage = ({
  actionLabel,
  onAction = noop,
  onDismiss = noop,
  isPreventAutoDismiss,
  isPreventActionDismiss,
  message,
  removeMessageTimeInterval,
  showCloseButton,
  placement = 'bottom',
  ...props
}) => {
  const autoDismissRef = useRef();
  autoDismissRef.current = isPreventAutoDismiss ? noop : onDismiss;

  const messageRemovalTimeInterval = useRef(
    typeof removeMessageTimeInterval === 'number' &&
      removeMessageTimeInterval <= AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MAX &&
      removeMessageTimeInterval >= AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MIN
      ? removeMessageTimeInterval
      : AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MAX
  );

  useEffect(() => {
    if (!autoDismissRef.current) {
      return noop;
    }

    const dismissTimeout = setTimeout(
      () => autoDismissRef.current(),
      messageRemovalTimeInterval.current
    );

    return () => clearTimeout(dismissTimeout);
  }, []);

  const handleAction = useCallback(() => {
    onAction();
    !isPreventActionDismiss && onDismiss();
  }, [onAction, onDismiss, isPreventActionDismiss]);

  const hasAction = Boolean(actionLabel);

  return (
    <MessageContainer
      role="alert"
      hasAction={hasAction}
      placement={placement}
      {...props}
    >
      <Message
        size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
        hasAction={hasAction}
      >
        {message}
      </Message>
      {(actionLabel || showCloseButton) && (
        <ActionContainer>
          {actionLabel && (
            <ActionButton onClick={handleAction}>{actionLabel}</ActionButton>
          )}
          {showCloseButton && (
            <CloseButton onClick={onDismiss}>
              <Cross aria-hidden />
            </CloseButton>
          )}
        </ActionContainer>
      )}
    </MessageContainer>
  );
};

SnackbarMessage.propTypes = {
  'aria-label': PropTypes.string.isRequired,
  customZIndex: PropTypes.number,
  message: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  isPreventAutoDismiss: PropTypes.bool,
  isPreventActionDismiss: PropTypes.bool,
  removeMessageTimeInterval: PropTypes.number,
  showCloseButton: PropTypes.bool,
  placement: Placement,
};

SnackbarMessage.defaultProps = {
  showCloseButton: true,
};

export { SnackbarMessage };
