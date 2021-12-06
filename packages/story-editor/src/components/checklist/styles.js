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
import { Text, THEME_CONSTANTS } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { TablistPanel } from '../tablist';
import {
  DISTANCE_FROM_TOP,
  DISTANCE_FROM_BOTTOM,
  NAVIGATION_HEIGHT,
} from '../secondaryPopup';

const BUTTON_HEIGHT = 60;
export const getTabPanelMaxHeight = (buttonCount) => {
  if (!buttonCount) {
    return undefined;
  }

  return `100vh - ${
    NAVIGATION_HEIGHT +
    buttonCount * BUTTON_HEIGHT +
    DISTANCE_FROM_TOP +
    DISTANCE_FROM_BOTTOM
  }px`;
};

export const StyledTablistPanel = styled(TablistPanel)`
  height: ${({ badgeCount }) => (badgeCount === 0 ? 0 : 'auto')};
  visibility: ${({ badgeCount }) => (badgeCount === 0 ? 'hidden' : 'visible')};

  button {
    display: ${({ badgeCount }) => (badgeCount === 0 ? 'none' : 'auto')};
  }
`;

export const PanelText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;
