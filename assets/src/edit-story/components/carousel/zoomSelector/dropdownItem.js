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
import { forwardRef } from 'react';
import styled, { css } from 'styled-components';
/**
 * Internal dependencies
 */
import {
  DROP_DOWN_ITEM,
  themeHelpers,
  Text,
  THEME_CONSTANTS,
} from '../../../../design-system';

const ListItem = styled.li(
  ({ disabled, theme }) => css`
    position: relative;
    padding: 6px 2px;
    margin: 4px 8px;
    border-radius: ${theme.borders.radius.small};
    align-items: center;
    cursor: ${disabled ? 'default' : 'pointer'};

    ${themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};

    &:hover {
      background-color: ${theme.colors.bg.tertiary};
    }

    ${disabled &&
    css`
      pointer-events: none;

      span {
        color: ${theme.colors.fg.secondary};
      }
    `}

    svg {
      color: ${theme.colors.fg.primary};
    }
  `
);

const ListItemDisplayText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.primary};
`;

const DropDownItem = ({ option, ...rest }, ref) => (
  <ListItem
    ref={ref}
    disabled={option.disabled}
    aria-disabled={option.disabled}
    {...rest}
  >
    <ListItemDisplayText
      forwardedAs="span"
      size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
    >
      {option.label}
    </ListItemDisplayText>
  </ListItem>
);

export default forwardRef(DropDownItem);

DropDownItem.displayName = 'DropDownItem';

DropDownItem.propTypes = {
  option: DROP_DOWN_ITEM,
};
