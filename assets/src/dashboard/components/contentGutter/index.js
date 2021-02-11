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

export const StandardViewContentGutter = styled.div(
  ({ theme }) => css`
    margin: 0 52px;

    @media ${theme.breakpoint.mobile} {
      margin: 0 10px;
    }
  `
);

export const DetailViewContentGutter = styled.div(
  ({ theme }) => `
    padding-top: ${
      theme.DEPRECATED_THEME.navBar.height +
      theme.DEPRECATED_THEME.detailViewContentGutter.desktop / 2
    }px;
    margin: 0 ${theme.DEPRECATED_THEME.detailViewContentGutter.desktop}px;


    @media ${theme.DEPRECATED_THEME.breakpoint.tablet} {
      padding-top: ${
        theme.DEPRECATED_THEME.navBar.height +
        theme.DEPRECATED_THEME.detailViewContentGutter.tablet / 2
      }px;
      margin: 0 ${theme.DEPRECATED_THEME.detailViewContentGutter.tablet}px;
    }

    @media ${theme.DEPRECATED_THEME.breakpoint.smallDisplayPhone} {
      margin: 0 ${theme.DEPRECATED_THEME.detailViewContentGutter.min}px;
    }
  `
);
