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
import { CardGrid, CardGridItem } from '../../../../../dashboard/components';

const StoryGrid = styled(CardGrid)`
  overflow: auto;
  height: calc(100% - 95px);
  grid-template-rows: auto;

  width: ${({ theme }) =>
    `calc(100% - ${theme.DEPRECATED_THEME.standardViewContentGutter.desktop}px)`};

  @media ${({ theme }) => theme.DEPRECATED_THEME.breakpoint.smallDisplayPhone} {
    width: ${({ theme }) =>
      `calc(100% - ${theme.DEPRECATED_THEME.standardViewContentGutter.min}px)`};
  }
`;

const StoryGridItem = styled(CardGridItem)`
  position: relative;
`;

export { StoryGrid, StoryGridItem };
