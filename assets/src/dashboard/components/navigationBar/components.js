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

export const Nav = styled.nav`
  ${({ theme }) => `
    position: absolute;
    justify-content: space-between;
    align-items: center;
    border-bottom: ${theme.borders.gray50};
    background-color: ${theme.colors.white};
    display: flex;
    flex-direction: row;
    width: 100%;
    height: ${theme.navBar.height}px;
    margin-bottom: 40px;

    padding: 0 ${theme.pageGutter.large.desktop}px;

    @media ${theme.breakpoint.tablet} {
      padding: 0 ${theme.pageGutter.large.tablet}px;
    }

    @media ${theme.breakpoint.smallDisplayPhone} {
      flex-wrap: wrap;
      padding: 0 ${theme.pageGutter.small.min}px;
    }
  `}
`;

export const ActionLink = styled(Button)`
  padding: 0 24px;
`;
