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
import styled, { css } from 'styled-components';

/**
 * Internal dependencies
 */
import { themeHelpers } from '../../../theme';
import { Text } from '../../typography';

export const ListGroup = styled.ul`
  box-sizing: border-box;
  list-style-type: none;
  margin: 6px 0;
  display: block;
  padding-inline-start: 0;
  margin-block-start: 0;
  margin-block-end: 0;
  width: 100%;
`;

export const ListItemLabel = styled.li`
  display: flex;
  padding: 6px 2px 6px 8px;
  margin: 4px 8px;
  align-items: center;
`;

export const ListItem = styled.li(
  ({ disabled, isSelected, theme }) => css`
    display: grid;
    grid-template-columns: 16px 1fr;
    padding: 6px 2px 6px 8px;
    margin: 4px 8px;
    border-radius: ${theme.borders.radius.small};
    align-items: center;
    background-color: ${isSelected
      ? theme.colors.interactiveBg.brandNormal
      : 'inherit'};
    cursor: ${disabled ? 'default' : 'pointer'};

    ${themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};

    &:focus {
      background-color: ${isSelected
        ? theme.colors.interactiveBg.brandNormal
        : theme.colors.interactiveBg.brandHover};
    }

    &:hover {
      background-color: ${isSelected
        ? theme.colors.interactiveBg.brandNormal
        : theme.colors.interactiveBg.brandHover};
    }

    &:active {
      background-color: ${isSelected
        ? theme.colors.interactiveBg.brandActive
        : theme.colors.interactiveBg.brandPress};
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
      height: 8px;
      width: auto;
    }

    & > span {
      grid-column-start: 2;
    }
  `
);

export const ListItemDisplayText = styled(Text)(
  ({ theme }) => css`
    color: ${theme.colors.fg.primary};
  `
);

export const ListItemLabelDisplayText = styled(Text)(
  ({ theme }) => css`
    color: ${theme.colors.form.dropDownSubtitle};
  `
);

export const NoOptionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-items: center;
`;
export const NoOptionsMessage = styled(Text)`
  padding: 6px 8px;
  margin: 4px;
  color: ${({ theme }) => theme.colors.fg.tertiary};
  font-style: italic;
`;
