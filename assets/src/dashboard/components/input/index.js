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

export const TextInput = styled.input`
  margin: 0;
  padding: ${({ theme }) => theme.fonts.textInput.padding};
  border-radius: 6px;
  border: ${({ theme }) => theme.fonts.textInput.border};
  font-family: ${({ theme }) => theme.fonts.textInput.family};
  font-size: ${({ theme }) => theme.fonts.textInput.size}px;
  letter-spacing: ${({ theme }) => theme.fonts.textInput.letterSpacing};
`;
