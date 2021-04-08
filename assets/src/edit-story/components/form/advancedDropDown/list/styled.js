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
import {
  themeHelpers,
  THEME_CONSTANTS,
  Text,
} from '../../../../../design-system';
import { ReactComponent as Checkmark } from '../../../../icons/checkmark.svg';

export const List = styled.div`
  width: 100%;
  overflow-x: visible;
  overflow-y: auto;
  overscroll-behavior: none auto;
  max-height: 305px;
  padding: 0 0 10px 0;
  margin: 10px 0 0 0;
  font-size: 14px;
  text-align: left;
  list-style: none;
`;

export const Group = styled.ul`
  margin: 0;
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
  position: relative;
  padding: 8px 16px;
  margin: 6px 0 0 0;
  ${themeHelpers.expandTextPreset(({ label }, { SMALL }) => label[SMALL])}
  white-space: nowrap;
  line-height: 1;
  cursor: pointer;
  background-clip: padding-box;
  color: ${({ theme }) => theme.colors.fg.primary};

  :first-of-type {
    margin-top: 0;
  }

  :hover,
  :focus {
    background-color: ${({ theme }) =>
      theme.colors.interactiveBg.tertiaryHover};
    border-radius: ${({ theme }) => theme.borders.radius.small};
  }

  :focus {
    outline: none;
  }
`;

export const Selected = styled(Checkmark)`
  display: inline-block;
  width: 8px;
  height: auto;
  margin-right: 8px;
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
