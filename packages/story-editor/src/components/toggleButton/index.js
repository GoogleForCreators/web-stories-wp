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
import {
  Button as dsButton,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  Disclosure,
  Text,
  TOOLTIP_PLACEMENT,
  themeHelpers,
  THEME_CONSTANTS,
  theme as dsTheme,
} from '@googleforcreators/design-system';
import { forwardRef } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import Tooltip from '../tooltip';

const buttonHeight = 36;

const Button = styled(dsButton)`
  width: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  border-style: solid;
  padding: 0 10px;
  white-space: nowrap;
  // Handle props-dependent styling in one place
  ${({ isOpen, hasText, height = buttonHeight, theme }) => css`
    height: ${height}px;
    min-width: ${height}px;
    color: ${theme.colors.fg.primary};
    border-color: ${
      isOpen ? theme.colors.bg.secondary : theme.colors.border.defaultNormal
    };
    background-color: ${
      isOpen ? theme.colors.bg.secondary : theme.colors.bg.primary
    };
    ${
      hasText &&
      css`
        ${themeHelpers.expandPresetStyles({
          preset: {
            ...theme.typography.presets.paragraph[
              THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL
            ],
          },
          theme,
        })};
      `
    }
  }`}

  // This should be sufficient to ensure proper spacing of button content
  > :not(svg):last-child {
    margin-right: 0;
  }

  // Margin is set to -8px to compensate for empty space
  // around the actual icon graphic in the svg
  .main-icon {
    height: ${THEME_CONSTANTS.ICON_SIZE}px;
    width: auto;
    margin: -8px;
    display: block;
  }
`;
Button.propTypes = {
  hasText: PropTypes.bool,
  isOpen: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

// `badgeSize` is the default height and min-width of the badge circle/oval
// Hard-coded here, but can be overridden by `size` prop in the component
const badgeSize = 22;

// Defaults for badge come from typography.presets.label.small
const badgeText =
  dsTheme.typography.presets.label[
    THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL
  ];

// TODO: Extract `CountBadge` to its own component?
const CountBadge = styled(Text).attrs({ as: 'span' })`
  ${({ size = badgeSize, fontSize = badgeText.size, theme }) => css`
    min-width: ${size}px;
    width: auto;
    height: ${size}px;
    padding: 0 ${size / 4}px;
    margin: 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.fg.primary};
    background-color: ${theme.colors.bg.quaternary};
    border-radius: 9999px;
    font-size: ${fontSize}px;
    line-height: 0;
  `}
`;
CountBadge.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export const ToggleButton = forwardRef(
  (
    {
      copy,
      isOpen = false,
      notificationCount = 0,
      MainIcon,
      label,
      shortcut,
      popupZIndexOverride,
      hasMenuList = false,
      ...rest
    },
    ref
  ) => {
    const hasNotifications = notificationCount > 0;

    return (
      <Tooltip
        hasTail
        title={label}
        placement={TOOLTIP_PLACEMENT.TOP}
        shortcut={shortcut}
        popupZIndexOverride={popupZIndexOverride}
      >
        <Button
          ref={ref}
          aria-haspopup
          aria-pressed={isOpen}
          aria-expanded={isOpen}
          hasText={Boolean(copy)}
          isOpen={isOpen}
          isSquare={!hasNotifications}
          type={BUTTON_TYPES.TERTIARY}
          variant={BUTTON_VARIANTS.RECTANGLE}
          size={BUTTON_SIZES.MEDIUM}
          {...rest}
        >
          {MainIcon && <MainIcon className="main-icon" />}
          {copy}
          {hasNotifications && <CountBadge>{notificationCount}</CountBadge>}
          {hasMenuList && <Disclosure direction="down" isOpen={isOpen} />}
        </Button>
      </Tooltip>
    );
  }
);

ToggleButton.displayName = 'ToggleButton';

ToggleButton.propTypes = {
  copy: PropTypes.string,
  isOpen: PropTypes.bool,
  label: PropTypes.string,
  MainIcon: PropTypes.object,
  notificationCount: PropTypes.number,
  shortcut: PropTypes.string,
  popupZIndexOverride: PropTypes.number,
  hasMenuList: PropTypes.bool,
};
