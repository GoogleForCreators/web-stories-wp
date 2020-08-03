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
 * Exports
 */
export { default as SearchInput } from './searchInput';
export { default as Section } from './section';

export const Title = styled.h3`
  color: ${({ theme }) => theme.colors.fg.white};
  margin: 0;
  font-size: 19px;
  line-height: 1.4;
  flex: 3 0 0;
  display: flex;
  align-items: center;
  padding: 2px 0;
`;

export const Header = styled.div`
  display: flex;
  margin: 0 0 25px;
`;

export const MainButton = styled.button`
  cursor: pointer;
  background: transparent;
  border: 0;
  padding: 0;
  text-align: right;
  color: ${({ theme }) => theme.colors.fg.v7};
  flex: 1 0 0;
  font-family: ${({ theme }) => theme.fonts.label.family};
  font-size: ${({ theme }) => theme.fonts.label.size};
  font-weight: ${({ theme }) => theme.fonts.label.weight};
  line-height: ${({ theme }) => theme.fonts.label.lineHeight};

  &:hover {
    color: ${({ theme }) => theme.colors.hover};
  }
`;
