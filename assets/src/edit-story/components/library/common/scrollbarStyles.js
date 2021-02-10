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
import { css } from 'styled-components';
import { rgba } from 'polished';

export const ScrollBarStyles = css`
  ::-webkit-scrollbar {
    width: 2px;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    border: none;
    background-color: ${({ theme }) =>
      rgba(theme.DEPRECATED_THEME.colors.bg.white, 0.38)};
  }

  :focus {
    outline: 2px solid
      ${({ theme }) => theme.DEPRECATED_THEME.colors.accent.secondary};
  }
`;
