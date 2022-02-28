/*
 * Copyright 2022 Google LLC
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
import {
  Button,
  BUTTON_TYPES,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { focusStyle } from '../panels/shared';

export const NoStylesWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100% + 32px);
  margin: 0 0 -8px -16px;
  background-color: ${({ theme }) => theme.colors.opacity.black24};
  height: 64px;
`;

export const MoreButton = styled(Button).attrs({
  type: BUTTON_TYPES.PLAIN,
  size: BUTTON_SIZES.SMALL,
  variant: BUTTON_VARIANTS.RECTANGLE,
})`
  ${focusStyle};
  margin: 12px 0;
  padding: 0 16px;
  justify-content: center;
  align-self: center;
  width: 100%;
  svg {
    transform: rotate(-90deg);
    height: 32px;
    width: 32px;
    margin-left: -4px;
  }
`;
