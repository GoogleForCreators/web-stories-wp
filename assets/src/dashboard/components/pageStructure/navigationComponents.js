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

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.leftRail.contentPadding}px;
`;

export const NavLink = styled.a`
  margin: 0 0 20px ${({ theme }) => theme.leftRail.inset}px;
  font-family: ${({ theme }) => theme.fonts.tab.family};
  font-size: ${({ theme }) => theme.fonts.tab.size}px;
  font-weight: ${({ active }) => (active ? '500' : 'normal')};
  line-height: ${({ theme }) => theme.fonts.tab.lineHeight}px;
  letter-spacing: ${({ theme }) => theme.fonts.tab.letterSpacing}em;
  text-decoration: none;
  color: ${({ theme, active }) =>
    active ? theme.colors.gray900 : theme.colors.gray600};

  &:last-child {
    margin-bottom: 0;
  }

  @media ${({ theme }) => theme.breakpoint.min} {
    font-size: ${({ theme }) => theme.fonts.tab.minSize}px;
  }
`;

export const Rule = styled.div`
  height: 1px;
  margin-left: ${({ theme }) =>
    theme.leftRail.contentPadding + theme.leftRail.inset}px;
  background-color: ${({ theme }) => theme.colors.gray50};
`;

export const AppInfo = styled.div`
  margin-left: ${({ theme }) => theme.leftRail.inset}px;
  color: ${({ theme }) => theme.colors.gray500};
  font-family: ${({ theme }) => theme.fonts.smallLabel.family};
  font-size: ${({ theme }) => theme.fonts.smallLabel.size}px;
  letter-spacing: ${({ theme }) => theme.fonts.smallLabel.letterSpacing};
`;

export const LogoPlaceholder = styled.div`
  height: 40px;
  width: 145px;
  margin: ${({ theme }) => theme.leftRail.logoMargin};
  background-color: ${({ theme }) => theme.colors.gray100};
`;
