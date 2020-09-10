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
import Button from '../button';
import { TypographyPresets } from '../typography';
import { visuallyHiddenStyles } from '../../utils/visuallyHiddenStyles';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  > * {
    margin: 20px;
  }
  & > svg {
    max-width: 100%;
  }
`;

export const NavButton = styled(Button)`
  margin-bottom: 0;
  margin-top: 0;
`;

export const NavList = styled.ul`
  margin: 0;
  padding: 0;
`;

export const NavListItem = styled.li`
  margin: 8px 0;
  padding: 0;
  list-style-type: none;
`;

export const NavLink = styled.a`
  ${TypographyPresets.Medium};
  ${({ theme, active }) => `
    display: block;
    padding: 4px 20px;
    margin: 4px 0;
    font-weight: ${theme.typography.weight[active ? 'bold' : 'normal']};
    text-decoration: none;
    color: ${active ? theme.colors.gray900 : theme.colors.gray600};

    &:focus {
      color: ${active ? theme.colors.gray900 : theme.colors.gray600};
    }
    &:hover {
      color: ${active ? theme.colors.gray900 : theme.colors.gray600};
      background-color: ${theme.colors.gray50};
    }
  `}
`;

export const Rule = styled.div(
  ({ theme }) => `
    height: 1px;
    margin-left: 20px;
    background-color: ${theme.colors.gray50};
  `
);

export const AppInfo = styled.div`
  ${TypographyPresets.ExtraSmall};
  color: ${({ theme }) => theme.colors.gray500};
`;

export const VisuallyHiddenHeading = styled.h1(visuallyHiddenStyles);
