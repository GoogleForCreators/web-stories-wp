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
import { Button, Headline, Text } from '../../../design-system';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  > * {
    margin: 20px 28px;
  }
`;

export const Header = styled(Headline)`
  margin: 42px 0px 72px;

  & > svg {
    margin: 0 28px;
    height: 64px;
  }
`;

export const NewStoryButton = styled(Button)(
  ({ theme }) => css`
    margin-bottom: 0;
    margin-top: 0;
    border: 1px solid ${theme.colors.border.defaultActive};
    border-radius: ${theme.borders.radius.medium};

    :hover {
      color: ${theme.colors.bg.primary};
      background-color: ${theme.colors.interactiveBg.brandPress};
      border-color: ${theme.colors.interactiveFg.brandPress};
      transition: border-color 0.25s linear, background-color 0.25s linear,
        color 0.25s linear;
    }
  `
);

export const NavList = styled.ul`
  margin: 0;
  padding: 0;
`;

export const NavListItem = styled.li`
  margin: 8px 28px;
  padding: 0;
  list-style-type: none;
`;

export const NavButton = styled(Button)`
  border-radius: 0;
`;

const activeLinkCss = css`
  * {
    color: ${({ theme }) => theme.colors.interactiveFg.brandPress};
  }

  svg path {
    stroke: ${({ theme }) => theme.colors.interactiveFg.brandPress};
  }
`;

export const NavLink = styled(Text)(
  ({ active, theme }) => css`
    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-template-areas: 'icon link link link link';

    * {
      font-weight: ${theme.typography.weight.bold};
      transition: color 0.25s linear, stroke 0.25s linear;
    }

    ${active && activeLinkCss};

    :hover {
      ${activeLinkCss};
    }
  `
);

export const PathName = styled(Text)`
  grid-area: link;
`;

export const AppInfo = styled(Text)(
  ({ theme }) => css`
    color: ${theme.colors.fg.secondary};
  `
);
