/*
 * Copyright 2021 Google LLC
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
import styled, { css } from 'styled-components';
/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BEZIER } from '../../../../animation';
import {
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  Icons,
  NotificationBubble,
  Button as dsButton,
} from '../../../../design-system';

const Button = styled(dsButton)`
  border: ${({ theme }) => `1px solid ${theme.colors.bg.tertiary}`};
  padding: 1px 14px 1px 4.5px;

  @media ${({ theme }) => theme.breakpoint.desktop} {
    padding: 1px 16px 1px 14.5;
  }

  ${({ hasNotifications, theme }) =>
    hasNotifications &&
    css`
      background-color: ${theme.colors.bg.secondary};
      border: 1px solid ${theme.colors.bg.secondary};
    `}
`;

const Label = styled.span`
  display: none;

  @media ${({ theme }) => theme.breakpoint.desktop} {
    display: block;
    min-width: 115px;
    text-align: left;
  }
`;

const HelpIcon = styled(Icons.Help)`
  height: 32px;
  width: auto;
  margin-right: 4.5px;
`;

const ChevronIcon = styled(Icons.Chevron)`
  display: block;
  height: auto;
  width: 11px;
  transform-origin: 50% 50%;
  transform: rotate(${({ isOpen }) => (isOpen ? 360 : 180)}deg);
  transition: 0.2s transform ${BEZIER.outSine};

  @media ${({ theme }) => theme.breakpoint.mobile} {
    ${({ hasNotifications }) =>
      hasNotifications &&
      css`
        display: none;
      `}
  }
`;

const NotificationWrapper = styled.div`
  @media ${({ theme }) => theme.breakpoint.tablet} {
    margin-right: 14.5px;
  }
`;

function Toggle({
  isOpen = false,
  popupId = '',
  onClick = () => {},
  notificationCount = 0,
}) {
  const hasNotifications = notificationCount > 0;
  return (
    <Button
      aria-haspopup
      aria-pressed={isOpen}
      aria-expanded={isOpen}
      aria-owns={popupId}
      aria-label={
        hasNotifications
          ? sprintf(
              /* translators: %s:  number of unread notifications. */
              _n(
                'Help Center: %s unread notification',
                'Help Center: %s unread notifications',
                notificationCount,
                'web-stories'
              ),
              notificationCount
            )
          : __('Help Center', 'web-stories')
      }
      onClick={onClick}
      hasNotifications={hasNotifications}
      type={hasNotifications ? BUTTON_TYPES.SECONDARY : BUTTON_TYPES.PLAIN}
      variant={BUTTON_VARIANTS.RECTANGLE}
      size={BUTTON_SIZES.MEDIUM}
    >
      <HelpIcon />
      <Label>{__('Help Center', 'web-stories')}</Label>
      {hasNotifications && (
        <NotificationWrapper>
          <NotificationBubble notificationCount={notificationCount} />
        </NotificationWrapper>
      )}
      <ChevronIcon hasNotifications={hasNotifications} isOpen={isOpen} />
    </Button>
  );
}

Toggle.propTypes = {
  isOpen: PropTypes.bool,
  popupId: PropTypes.string,
  onClick: PropTypes.func,
  notificationCount: PropTypes.number,
};

export { Toggle };
