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

export const StandardViewContentGutter = styled.div(
  ({ theme }) => `
    margin: 0 ${theme.standardViewContentGutter.desktop}px;

    @media ${theme.breakpoint.largeDisplayPhone} {
      margin: 0 ${theme.standardViewContentGutter.largeDisplayPhone}px;
    }

    @media ${theme.breakpoint.smallDisplayPhone} {
      margin: 0 ${theme.standardViewContentGutter.smallDisplayPhone}px;
    }
  `
);

export const DetailViewContentGutter = styled.div(
  ({ theme }) => `
    padding-top: ${
      theme.navBar.height + theme.detailViewContentGutter.desktop / 2
    }px;
    margin: 0 ${theme.detailViewContentGutter.desktop}px;


    @media ${theme.breakpoint.tablet} {
      padding-top: ${
        theme.navBar.height + theme.detailViewContentGutter.tablet / 2
      }px;
      margin: 0 ${theme.detailViewContentGutter.tablet}px;
    }

    @media ${theme.breakpoint.smallDisplayPhone} {
      margin: 0 ${theme.detailViewContentGutter.min}px;
    }
  `
);
