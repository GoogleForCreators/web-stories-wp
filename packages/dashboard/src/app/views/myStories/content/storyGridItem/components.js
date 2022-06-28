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
import {
  Headline,
  Icons,
  THEME_CONSTANTS,
  Text,
  Image,
} from '@googleforcreators/design-system';
import PropTypes from 'prop-types';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { CardGridItem } from '../../../../../components';

export const CustomCardGridItem = styled(CardGridItem)`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: ${({ $posterHeight }) => `${$posterHeight}px auto`};
`;
CustomCardGridItem.propTypes = {
  $posterHeight: PropTypes.number,
};

// Allows grid item contents to overlay in a set space
export const CardWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

export const ScrimAnchor = styled.a`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: ${({ theme }) => theme.borders.radius.medium};

  &:hover,
  &:focus {
    box-shadow: none;
    border: ${({ theme }) => `4px solid ${theme.colors.interactiveBg.active}`};
  }
`;
// Components that create the content to display on top of a poster
// Set guidance for how content should display on top of a poster
export const StyledStoryDisplayContent = styled.div`
  padding: 20px 12px 8px 12px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

// Generic row to vertically center grid item contents
export const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
`;
export const LockedRow = styled(Row)`
  position: absolute;
  top: 8px;
  right: 8px;
  justify-content: flex-end;
  align-items: center;
`;

// Interior grid for details to allow context menu space without jostling copy
export const CardDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 80% auto;
  margin-top: 4px;
`;
export const CardDetailsColumn = styled.div`
  display: flex;
  align-items: space-between;
  flex-direction: column;
  align-self: flex-end;
`;

// Story Title
// Overriding stylelint for the sake of line clamping the title to be 3 lines.
// This is supported by all major browsers except IE 11.
// If it fails, max-height will catch so that really long titles
// don't leave their designated space, just no ellipsis.
export const Title = styled(Headline).attrs({
  as: 'h3',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL,
})`
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.inverted.fg.primary};
  margin: 0;
  max-height: calc(1.2em * 3);
  /* stylelint-disable-next-line */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  /* stylelint-disable-next-line */
  -webkit-box-orient: vertical;
`;

// All body text
export const DetailCopy = styled(Text).attrs({
  forwardedAs: 'span',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL,
})`
  color: ${({ theme }) => theme.colors.inverted.fg.primary};
  margin: 0;
`;

// specifications for exposing a locked story
export const LockAvatar = styled(Image)`
  height: 40px;
  width: 40px;
  border: ${({ theme }) =>
    `2px solid ${theme.colors.interactiveBg.brandNormal}`};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  z-index: 3;
`;

export const LockIcon = styled(Icons.LockClosed)`
  color: ${({ theme }) => theme.colors.inverted.fg.primary};
  display: inline;
  height: 36px;
  width: 36px;
  margin: -4px -4px -4px -10px;
`;
