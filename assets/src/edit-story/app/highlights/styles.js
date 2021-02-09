/*
 * Copyright 2021 Google LLC
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
import { rgba } from 'polished';
import { css, keyframes } from 'styled-components';
/**
 * Internal dependencies
 */
import { theme as dsTheme } from '../../../design-system';

const flash = keyframes`
  50% {
    background-color: ${rgba(dsTheme.colors.standard.white, 0.3)};
  }
`;

export const FLASH = css`
  background-color: ${rgba(dsTheme.colors.standard.white, 0)};
  animation: ${flash} 0.3s ease-in-out 2;
`;

export const OUTLINE = css`
  box-shadow: 0 0 0 2px ${dsTheme.colors.border.focus};
  border-radius: ${dsTheme.borders.radius.small};
`;
