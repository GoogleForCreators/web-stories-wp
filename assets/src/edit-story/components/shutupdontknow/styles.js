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
/**
 * Internal dependencies
 */
import {
  Button,
  BUTTON_VARIANTS,
  Headline,
  THEME_CONSTANTS,
} from '../../../design-system';

export const Wrapper = styled.div`
  /* width: 100%; */
`;

export const SmallHeadline = styled(Headline).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XX_SMALL,
})``;

export const TabButton = styled(Button).attrs({
  variant: BUTTON_VARIANTS.PLAIN,
})`
  display: flex;
  justify-content: space-between;
  height: 60px;
  width: 100%;
  padding: 16px 16px 16px 4px;
  background-color: ${({ isExpanded, theme }) =>
    isExpanded ? theme.colors.bg.primary : theme.colors.bg.secondary};
`;

export const ButtonText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IconContainer = styled.div`
  height: 32px;
  width: 32px;
`;

export const Badge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 20px;
  border-radius: ${({ theme }) => theme.borders.radius.round};
  background-color: ${({ theme }) => theme.colors.fg.negative};

  ${SmallHeadline} {
    color: ${({ theme }) => theme.colors.inverted.fg.primary};
    line-height: 20px;
  }
`;

export const TabPanel = styled.div`
  height: 560px;
  overflow-x: scroll;
  padding: 16px;
  background: ${({ theme }) => theme.colors.bg.primary};
  visibility: ${({ isExpanded }) => (isExpanded ? 'auto' : 'hidden')};
`;

export const Divider = styled.div`
  /* border: 1px solid ${({ theme }) => theme.colors.divider.primary}; */
`;
