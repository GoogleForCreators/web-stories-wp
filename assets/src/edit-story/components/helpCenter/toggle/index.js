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
import {
  themeHelpers,
  THEME_CONSTANTS,
  Icons,
} from '../../../../design-system';

const sizes = THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES;
const Button = styled.button`
  ${themeHelpers.reset.button}
  ${themeHelpers.focusableOutlineCSS}
  ${themeHelpers.expandPresetStylesCurried(({ label }) => label[sizes.MEDIUM])}
  ${({ theme }) => css`
    color: ${theme.colors.fg.primary};
    border-radius: ${theme.borders.radius.small};
    border: 1px solid ${theme.colors.fg.secondary};
  `}
  display: flex;
  align-items: center;
  padding: 2px 14px;

  ${({ active, theme }) =>
    active &&
    css`
      background-color: ${theme.colors.bg.secondary};
      border: none;
    `}
`;

const Label = styled.span`
  display: none;
  ${themeHelpers.mq.desktop(
    css`
      display: inline;
      min-width: 115px;
    `
  )}
`;

const Icon = styled(Icons.Help)`
  height: 32px;
  width: auto;
`;

function Toggle({
  isOpen = false,
  popupId = '',
  onClick = () => {},
  numNotifications = 0,
}) {
  return (
    <Button
      aria-haspopup
      aria-pressed={isOpen}
      aria-expanded={isOpen}
      aria-owns={popupId}
      onClick={onClick}
      isActive={numNotifications.lenght > 0}
    >
      <Icon />
      <Label>{__('Help Center', 'web-stories')}</Label>
    </Button>
  );
}

Toggle.propTypes = {
  isOpen: PropTypes.bool,
  popupId: PropTypes.string,
  onClick: PropTypes.func,
  numNotifications: PropTypes.number,
};

export { Toggle };
