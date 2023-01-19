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
import styled, { css } from 'styled-components';

/**
 * Internal dependencies
 */
import { themeHelpers } from '../../theme';
import { BubbleVariant, type NotificationBubbleProps } from './types';

const BUBBLE_DIAMETER = 24;
const SMALL_BUBBLE_DIAMETER = 20;

function getBubbleWidth(numDigits: number) {
  return 9 * (numDigits - 1);
}

const Bubble = styled.div<{
  variant: BubbleVariant;
  digitLen: number;
  $isSmall?: boolean;
}>`
  ${({ theme, variant }) => css`
    color: ${theme.colors.fg.primary};
    background-color: ${theme.colors.bg[variant]};
    border-radius: ${theme.borders.radius.round};
  `}
  position: relative;
  height: ${BUBBLE_DIAMETER}px;
  width: ${({ digitLen }) => BUBBLE_DIAMETER + getBubbleWidth(digitLen)}px;

  ${({ digitLen, $isSmall }) =>
    $isSmall &&
    css`
      height: ${SMALL_BUBBLE_DIAMETER}px;
      width: ${SMALL_BUBBLE_DIAMETER + getBubbleWidth(digitLen)}px;
    `};
`;

const Inner = styled.span<{
  $invertColor?: boolean;
  $isSmall?: boolean;
}>`
  ${themeHelpers.fullSizeAbsolute}
  ${themeHelpers.centerContent}
  ${({ $isSmall, theme }) =>
    themeHelpers.expandTextPreset(
      ({ paragraph }, sizes) => paragraph[$isSmall ? sizes.XSmall : sizes.Small]
    )({ theme })};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ $invertColor, theme }) =>
    $invertColor ? theme.colors.inverted.fg.primary : theme.colors.fg.primary};
  user-select: none;
`;

function NotificationBubble({
  notificationCount,
  isSmall,
  variant = BubbleVariant.Accent,
  invertTextColor,
  ...props
}: NotificationBubbleProps) {
  return (
    <Bubble
      variant={variant}
      $isSmall={isSmall}
      digitLen={notificationCount?.toString().length || 1}
      {...props}
    >
      <Inner $invertColor={invertTextColor} $isSmall={isSmall}>
        {notificationCount}
      </Inner>
    </Bubble>
  );
}

export default NotificationBubble;
