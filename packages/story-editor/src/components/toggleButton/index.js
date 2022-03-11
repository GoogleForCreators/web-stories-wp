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
  Text,
  TOOLTIP_PLACEMENT,
  Tooltip,
} from '@googleforcreators/design-system';
import { forwardRef } from '@googleforcreators/react';

const Button = styled(dsButton)`
  height: 36px;
  width: ${({ isSquare }) => (isSquare ? 36 : 58)}px;
  display: inline-block;
  border: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
  padding: 2px 0;
  color: ${({ theme }) => theme.colors.fg.primary};
  ${({ isOpen, theme }) =>
    isOpen &&
    css`
      border-color: ${theme.colors.bg.secondary};
      background-color: ${theme.colors.bg.secondary};
    `}
  ${({ hasText }) =>
    hasText &&
    css`
      padding: 2px 0 2px 8px;
      width: auto;
      span {
        padding-left: 6px;
      }
    `}
`;
Button.propTypes = {
  hasText: PropTypes.bool,
  isOpen: PropTypes.bool,
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const NotificationCount = styled(Text).attrs({ as: 'span' })`
  margin: -2px 0 -2px;
  padding-right: 6px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.violet[20]};
`;

export const ToggleButton = forwardRef(
  (
    {
      copy,
      hideTooltip,
      isOpen = false,
      notificationCount = 0,
      MainIcon,
      label,
      shortcut,
      popupZIndexOverride,
      ...rest
    },
    ref
  ) => {
    const hasNotifications = notificationCount > 0;
    return (
      <Tooltip
        hasTail
        title={!hideTooltip && label}
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
          <Wrapper>
            {MainIcon && <MainIcon />}
            {copy && copy}
            {hasNotifications && (
              <NotificationCount>{notificationCount}</NotificationCount>
            )}
          </Wrapper>
        </Button>
      </Tooltip>
    );
  }
);

ToggleButton.displayName = 'ToggleButton';

ToggleButton.propTypes = {
  copy: PropTypes.string,
  hideTooltip: PropTypes.bool,
  isOpen: PropTypes.bool,
  label: PropTypes.string,
  MainIcon: PropTypes.object,
  notificationCount: PropTypes.number,
  shortcut: PropTypes.string,
  popupZIndexOverride: PropTypes.number,
};
