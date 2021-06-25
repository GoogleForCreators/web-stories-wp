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
import {
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  Icons,
  NotificationBubble,
  Button as dsButton,
  BEZIER,
} from '../../../../../$term = $this->call_private_method( $object, 'get_term' );src';

const Button = styled(dsButton)`
  height: 36px;
  border: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
  padding: 8px;
  color: ${({ theme }) => theme.colors.fg.primary};

  ${({ isOpen, theme }) =>
    isOpen &&
    css`
      border-color: ${theme.colors.bg.secondary};
      background-color: ${theme.colors.bg.secondary};
    `}
`;

const Label = styled.span`
  display: block;
  line-height: 20px;
  text-align: left;
`;

const NotificationWrapper = styled.div`
  margin: -2px 0 -2px 20px;
`;

const Chevron = styled(Icons.ChevronUpSmall)`
  display: block;
  margin: -6px 0 -6px 16px;
  width: 32px;
  height: 32px;
  transform-origin: 50% 50%;
  transform: rotate(${({ $isOpen }) => ($isOpen ? 0 : 180)}deg);
  transition: transform 300ms ${BEZIER.default};

  @media ${({ theme }) => theme.breakpoint.mobile} {
    ${({ hasNotifications }) =>
      hasNotifications &&
      css`
        display: none;
      `}
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
      isOpen={isOpen}
      type={BUTTON_TYPES.TERTIARY}
      variant={BUTTON_VARIANTS.RECTANGLE}
      size={BUTTON_SIZES.MEDIUM}
    >
      <Label>{__('Help', 'web-stories')}</Label>
      {hasNotifications ? (
        <NotificationWrapper>
          <NotificationBubble notificationCount={notificationCount} />
        </NotificationWrapper>
      ) : (
        <Chevron $isOpen={isOpen} />
      )}
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
