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
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BEZIER } from '../../../../animation';
import {
  themeHelpers,
  Icons,
  NotificationBubble,
} from '../../../../design-system';

const Button = styled.button`
  ${themeHelpers.reset.button}
  ${themeHelpers.centerContent}
  ${themeHelpers.focusableOutlineCSS}
  ${themeHelpers.expandTextPreset(({ label }, sizes) => label[sizes.MEDIUM])}
  ${({ theme }) => css`
    color: ${theme.colors.fg.primary};
    border-radius: ${theme.borders.radius.small};
    border: 1px solid ${theme.colors.bg.tertiary};
  `}
  padding: 1px 14px 1px 4.5px;
  transform-origin: 50% 50%;

  &:active {
    transform: scale(0.99);
  }

  ${themeHelpers.mq.desktop(
    css`
      padding: 1px 16px 1px 14.5;
    `
  )}

  ${({ hasNotifications, theme }) =>
    hasNotifications &&
    css`
      background-color: ${theme.colors.bg.secondary};
      border: 1px solid ${theme.colors.bg.secondary};
    `}
`;

const Label = styled.span`
  display: none;
  ${themeHelpers.mq.desktop(
    css`
      display: block;
      min-width: 115px;
      text-align: left;
    `
  )}
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

  ${({ hasNotifications }) =>
    hasNotifications &&
    themeHelpers.mq.mobile(
      css`
        display: none;
      `
    )}
`;

const NotificationWrapper = styled.div`
  ${themeHelpers.mq.tablet(
    css`
      margin-right: 14.5px;
    `
  )}
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
      onClick={onClick}
      hasNotifications={hasNotifications}
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
