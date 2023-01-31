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
import type { ComponentPropsWithoutRef, MouseEvent } from 'react';
import { useRef, useEffect, useCallback } from '@googleforcreators/react';
import { rgba } from 'polished';
import styled, { css } from 'styled-components';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { Button } from '../button';
import { Cross, CheckmarkSmall, ExclamationOutline } from '../../icons';
import { Text } from '../typography';
import { focusableOutlineCSS } from '../../theme/helpers';
import { TextSize } from '../../theme';
import { noop } from '../../utils';
import {
  AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MAX,
  AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MIN,
  DEFAULT_MESSAGE_Z_INDEX,
  SnackbarPlacement,
  ThumbnailStatus,
} from './types';
import type { SnackbarNotificationThumbnail } from './types';

const MessageContainer = styled.div<{
  customZIndex?: number;
  hasAction?: boolean;
  placement?: SnackbarPlacement;
}>`
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

const Message = styled(Text.Paragraph)<{
  hasAction?: boolean;
  hasThumbnail?: boolean;
}>`
  color: ${({ theme }) => theme.colors.inverted.fg.primary};
  max-width: 430px;
  padding-right: ${({ hasAction, hasThumbnail }) => {
    if (hasThumbnail) {
      return '16px';
    } else if (hasAction) {
      return '52px';
    } else {
      return '0px';
    }
  }};
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ThumbnailWrapper = styled.div<{ hasAction?: boolean }>`
  position: relative;
  margin-left: 16px;
  margin-right: ${({ hasAction }) => (hasAction ? 16 : 0)}px;
`;

const Thumbnail = styled.img<{ status?: ThumbnailStatus }>`
  max-height: 45px;
  max-width: 45px;
  min-height: ${(45 * 2) / 3}px;
  min-width: ${(45 * 2) / 3}px;
  background-color: ${({ theme }) => theme.colors.fg.tertiary};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  ${({ theme, status }) => {
    if (status === ThumbnailStatus.Success) {
      return css`
        border: 1px solid ${theme.colors.green[20]};
      `;
    } else if (status === ThumbnailStatus.Error) {
      return css`
        border: 1px solid ${theme.colors.red[20]};
      `;
    }
    return undefined;
  }};
`;

const ThumbnailIcon = styled.div<{ status?: ThumbnailStatus }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${({ theme, status }) => {
    if (status === ThumbnailStatus.Success) {
      return css`
        width: 30px;
        color: ${theme.colors.fg.positive};
      `;
    } else if (status === ThumbnailStatus.Error) {
      return css`
        width: 20px;
        color: ${theme.colors.fg.negative};
      `;
    }
    return undefined;
  }};

  svg {
    width: 100%;
    height: auto;
  }
`;

const ActionButton = styled(Button)`
  align-self: flex-end;
  min-width: 1px;
  height: 2em;
  padding: 0;
  color: ${({ theme }) => theme.colors.inverted.fg.linkNormal};
  font-weight: ${({ theme }) => theme.typography.weight.bold};

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

interface SnackbarMessageProps extends ComponentPropsWithoutRef<'div'> {
  actionLabel?: JSX.Element;
  onAction?: (evt: MouseEvent<HTMLButtonElement>) => void;
  onDismiss?: () => void;
  isPreventAutoDismiss?: boolean;
  isPreventActionDismiss?: boolean;
  thumbnail?: SnackbarNotificationThumbnail;
  message?: string;
  removeMessageTimeInterval?: number;
  showCloseButton?: boolean;
  placement?: SnackbarPlacement;
  actionHelpText?: string;
}

function SnackbarMessage({
  'aria-label': ariaLabel,
  actionLabel,
  onAction = noop,
  onDismiss = noop,
  isPreventAutoDismiss,
  isPreventActionDismiss,
  thumbnail,
  message,
  removeMessageTimeInterval,
  showCloseButton = true,
  placement = SnackbarPlacement.Bottom,
  actionHelpText,
  ...props
}: SnackbarMessageProps) {
  const autoDismissRef = useRef<(() => void) | null>(null);
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
      () => autoDismissRef.current?.(),
      messageRemovalTimeInterval.current
    );
    return () => clearTimeout(dismissTimeout);
  }, []);

  const handleAction = useCallback(
    (evt: MouseEvent<HTMLButtonElement>) => {
      onAction(evt);
      !isPreventActionDismiss && onDismiss();
    },
    [onAction, onDismiss, isPreventActionDismiss]
  );

  const hasAction = Boolean(actionLabel);
  const hasThumbnail = Boolean(actionLabel);

  return (
    <MessageContainer
      role="alert"
      hasAction={hasAction}
      placement={placement}
      {...props}
    >
      <Message
        aria-label={ariaLabel}
        size={TextSize.Small}
        hasAction={hasAction}
        hasThumbnail={hasThumbnail}
      >
        {message}
      </Message>
      {thumbnail && (
        <ThumbnailWrapper hasAction={hasAction}>
          <Thumbnail
            decoding="async"
            crossOrigin="anonymous"
            src={thumbnail.src}
            alt={thumbnail.alt}
            status={thumbnail.status}
          />
          <ThumbnailIcon status={thumbnail.status}>
            {thumbnail.status === ThumbnailStatus.Success && <CheckmarkSmall />}
            {thumbnail.status === ThumbnailStatus.Error && (
              <ExclamationOutline />
            )}
          </ThumbnailIcon>
        </ThumbnailWrapper>
      )}
      {(actionLabel || showCloseButton) && (
        <ActionContainer>
          {actionLabel && (
            <ActionButton onClick={handleAction}>{actionLabel}</ActionButton>
          )}
          {showCloseButton && (
            <CloseButton
              onClick={onDismiss}
              aria-label={__('Close', 'web-stories')}
              tabIndex={-1}
            >
              <Cross aria-hidden />
            </CloseButton>
          )}
        </ActionContainer>
      )}
    </MessageContainer>
  );
}

export default SnackbarMessage;
