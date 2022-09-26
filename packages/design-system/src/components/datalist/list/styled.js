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
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { themeHelpers, THEME_CONSTANTS } from '../../../theme';
import { Checkmark } from '../../../icons';
import { Text } from '../../typography';

export const List = styled.div`
  width: 100%;
  overflow-x: visible;
  overflow-y: auto;
  overscroll-behavior: none auto;
  max-height: 305px;
  padding: 4px;
  margin: 10px 0 0 0;
  font-size: 14px;
  text-align: left;
  list-style: none;
  border-radius: ${({ theme }) => theme.borders.radius.small};

  ${themeHelpers.focusableOutlineCSS}

  ${({ $listStyleOverrides }) => $listStyleOverrides}
`;

export const Group = styled.ul`
  margin: 0;
  padding: 0;
`;

export const GroupLabel = styled.li`
  background: transparent;
  padding: 8px;
  margin: 0;
`;

export const Option = styled.li.attrs(({ fontFamily }) => ({
  style: {
    fontFamily,
  },
}))`
  display: flex;
  align-items: center;
  position: relative;
  padding: 6px 16px;
  margin: 6px 0 0 0;
  cursor: pointer;
  background-clip: padding-box;
  color: ${({ theme }) => theme.colors.fg.primary};
  border-radius: ${({ theme }) => theme.borders.radius.small};

  ${themeHelpers.expandTextPreset(({ label }, { SMALL }) => label[SMALL])}
  ${themeHelpers.focusableOutlineCSS}

  /* override preset line-height to avoid letters being cut off */
  line-height: 16px;

  :first-of-type {
    margin-top: 0;
  }

  :hover {
    background-color: ${({ theme }) =>
      theme.colors.interactiveBg.tertiaryHover};
  }

  :focus {
    outline: none;
  }
`;

export const Selected = styled(Checkmark)`
  width: 16px;
  min-width: 16px;
  height: auto;
  margin-right: 4px;
  color: ${({ theme }) => theme.colors.fg.primary};
`;

export const NoResult = styled(Text).attrs(() => ({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL,
}))`
  width: 100%;
  padding: 13px 11px;
  margin: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

export const OverflowEllipses = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
