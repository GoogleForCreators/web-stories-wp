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
import { rgba } from 'polished';

const Box = styled.div`
  height: 32px;
  width: 122px;
  color: ${({ theme }) =>
    rgba(theme.DEPRECATED_THEME.colors.fg.white, 0.86)} !important;
  background-color: ${({ theme }) =>
    rgba(theme.DEPRECATED_THEME.colors.bg.black, 0.3)} !important;
  border-radius: 4px;
  overflow: hidden;
  align-items: center;
`;

const inputStyles = css`
  border: 1px solid;
  border-color: transparent;
  outline: none;
  &:focus {
    border-color: ${({ theme }) =>
      theme.DEPRECATED_THEME.colors.whiteout} !important;
    box-shadow: none !important;
  }
`;

export const ColorBox = styled(Box)`
  input {
    ${inputStyles}
  }
`;

export const ColorInput = styled(Box).attrs({ as: 'input' })`
  ${inputStyles}
`;
