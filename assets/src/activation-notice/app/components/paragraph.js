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

const Paragraph = styled.p`
  font-family: ${({ theme }) => theme.fonts.body.family};
  font-size: ${({ theme }) => theme.fonts.body.size};
  line-height: ${({ theme }) => theme.fonts.body.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.body.fontWeight};
  color: ${({ theme, $secondary }) =>
    $secondary ? theme.colors.secondary : theme.colors.primary};
  margin: 0 !important;
`;

export default Paragraph;
