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
import { css } from 'styled-components';
/**
 * Internal dependencies
 */
import { themeHelpers, THEME_CONSTANTS } from '../../../theme';
import { BUTTON_TRANSITION_TIMING } from '../../button/constants';

export const menuItemStyles = css`
  ${({ theme }) =>
    themeHelpers.expandPresetStyles({
      preset:
        theme.typography.presets.paragraph[
          THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL
        ],
      theme,
    })};

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 16px;
  margin-bottom: 6px;
  border: 0;
  color: ${({ theme }) => theme.colors.fg.primary};
  font-weight: 500;
  text-align: left;
  transition: background-color ${BUTTON_TRANSITION_TIMING};
`;
