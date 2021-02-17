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
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import { ReactComponent as Checkmark } from '../../../../icons/checkmark.svg';
import { ScrollBarStyles } from '../../../library/common/scrollbarStyles';

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
  scrollbar-width: thin;
  scrollbar-color: transparent
    ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.bg.white, 0.38)};

  ${ScrollBarStyles}
`;

export const Group = styled.ul`
  margin: 0;
`;

export const GroupLabel = styled.li`
  background: transparent;
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.tab.family};
  font-weight: ${({ theme }) => theme.DEPRECATED_THEME.fonts.tab.weight};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.tab.size};
  line-height: 14px;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.accent.secondary};
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
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.size};
  font-weight: ${({ theme }) => theme.DEPRECATED_THEME.fonts.label.weight};
  letter-spacing: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.label.letterSpacing};
  white-space: nowrap;
  line-height: 1;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
  cursor: pointer;
  background-clip: padding-box;

  :first-of-type {
    margin-top: 0;
  }

  :hover,
  :focus {
    background-color: ${({ theme }) =>
      rgba(theme.DEPRECATED_THEME.colors.bg.white, 0.1)};
  }

  :focus {
    border: 2px solid
      ${({ theme }) => theme.DEPRECATED_THEME.colors.accent.secondary};
    outline: none;
  }
`;

export const Selected = styled(Checkmark)`
  display: inline-block;
  width: 8px;
  height: auto;
  margin-right: 8px;
`;

export const NoResult = styled.div`
  width: 100%;
  padding: 13px 11px;
  margin: 0;
  text-align: center;
  color: ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.fg.white, 0.75)};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.tab.size};
  line-height: 14px;
`;
