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

const Input = styled.input`
  display: block;
  appearance: none;
  box-shadow: none !important;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
  opacity: 0.86;
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.family};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.size};
  line-height: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.lineHeight};
  border-radius: 0 !important;

  &:disabled {
    background: transparent;
    color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
  }
`;

export default Input;
