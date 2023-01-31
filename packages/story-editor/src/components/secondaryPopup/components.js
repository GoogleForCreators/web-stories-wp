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
import styled from 'styled-components';
import { Button, themeHelpers } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { focusStyle } from '../panels/shared/styles';
import { NAVIGATION_HEIGHT } from './constants';

export const NavBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${NAVIGATION_HEIGHT}px;
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  ${themeHelpers.expandTextPreset(({ label }, { Medium }) => label[Medium])}
`;

export const NavButton = styled(Button)`
  ${themeHelpers.expandTextPreset(({ label }, { Medium }) => label[Medium])}
  ${focusStyle};

  svg {
    width: 32px;
  }

  * + * {
    margin-left: 12px;
  }
`;
