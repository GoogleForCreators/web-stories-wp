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
  BUTTON_TRANSITION_TIMING,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  Disclosure,
  Text,
  TOOLTIP_PLACEMENT,
  themeHelpers,
  THEME_CONSTANTS,
  theme as dsTheme,
  resolveSizeUnits,
} from '@googleforcreators/design-system';
import { forwardRef } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import Tooltip from '../tooltip';

const buttonSize = 36;

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
  ${({ isOpen, hasText, $size = buttonSize, theme }) => css`
    height: ${resolveSizeUnits($size)};
    min-width: ${resolveSizeUnits($size)};
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

        .badge {
          margin: 0 8px;
        }
      `
    }

    .badge.open,
    &:hover .badge,
    &:focus .badge {
      background-color: ${theme.colors.bg.quaternary};
    }

  }`}

  .badge {
    transition: background-color ${BUTTON_TRANSITION_TIMING};
  }

  // Margin is set to -8px to compensate for empty space
  // around the actual icon graphic in the svg
  svg.main-icon {
    height: 32px;
    width: auto;
    margin: -8px;
    display: block;
  }
`;
Button.propTypes = {
  hasText: PropTypes.bool,
  isOpen: PropTypes.bool,
  $size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

// `badgeSize` is the default height and min-width of the badge circle/oval
// Hard-coded here, but can be overridden by `$size` prop in the component
const badgeSize = 22;

// Defaults for badge come from typography.presets.label.small
const badgeText =
  dsTheme.typography.presets.label[
    THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL
  ];

// TODO: Extract `CountBadge` to its own component
// Props prefixed with `$` won't leak into element attributes
// (`theme` is handled internally by Styled Components)
// padding and border-radius properties use css `calc()` so units
// other than px can be used for $size and still display correctly
const CountBadge = styled(Text).attrs({ as: 'span', className: 'badge' })`
  ${({ $size = badgeSize, $fontSize = badgeText.size, theme }) => css`
    min-width: ${resolveSizeUnits($size)};
    width: auto;
    height: ${resolveSizeUnits($size)};
    padding: 0 calc(${resolveSizeUnits($size)} / 4);
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.fg.primary};
    background-color: ${theme.colors.bg.tertiary};
    border-radius: calc(${resolveSizeUnits($size)} / 2);
    font-size: ${resolveSizeUnits($fontSize)};
    line-height: 0;
  `}
`;
CountBadge.propTypes = {
  $size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  $fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
          {MainIcon && <MainIcon className={'main-icon'} />}
          {copy}
          {hasNotifications && (
            <CountBadge className={isOpen ? 'open' : ''}>
              {notificationCount}
            </CountBadge>
          )}
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
