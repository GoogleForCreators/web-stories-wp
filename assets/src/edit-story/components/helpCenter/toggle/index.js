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
import { __, _n, sprintf } from '@web-stories-wp/i18n';

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
  border-color: ${({ theme }) => theme.colors.border.defaultNormal};
  padding: 8px;

  ${({ hasNotifications, theme }) =>
    hasNotifications &&
    css`
      background-color: ${theme.colors.bg.secondary};
      border-color: ${theme.colors.border.defaultNormal};
    `}
`;

const Label = styled.span`
  display: none;

  @media ${({ theme }) => theme.breakpoint.desktop} {
    display: block;
    min-width: 65px;
    text-align: left;
  }
`;

const Space = styled.div`
  width: 89px;
  @media ${({ theme }) => theme.breakpoint.desktop} {
    width: 48px;
  }
`;

const ChevronIcon = styled(Icons.ChevronDown)`
  display: block;
  height: auto;
  width: 100%;
`;

const Icon = styled.div`
  display: block;
  height: auto;
  width: 32px;
  transform-origin: 50% 50%;
  transform: rotate(${({ isOpen }) => (isOpen ? 180 : 360)}deg);
  transition: transform 300ms ${BEZIER.default};
`;

const NotificationWrapper = styled.div`
  margin: 4px;
`;

const IconWrapper = styled.div`
  margin: -6px 0;
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
      <Label>{__('Help Center', 'web-stories')}</Label>
      <Space />
      <IconWrapper>
        {hasNotifications ? (
          <NotificationWrapper>
            <NotificationBubble notificationCount={notificationCount} />
          </NotificationWrapper>
        ) : (
          <Icon isOpen={isOpen}>
            <ChevronIcon />
          </Icon>
        )}
      </IconWrapper>
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
