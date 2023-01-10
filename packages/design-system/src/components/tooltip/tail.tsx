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
import styled, { css } from 'styled-components';

/**
 * Internal dependencies
 */
import { Placement } from '../popup';

export const SVG_TOOLTIP_TAIL_ID = 'tooltip-tail';
const TAIL_WIDTH = 34;
export const TAIL_HEIGHT = 8;

interface TailPositionProps {
  placement: Placement;
  translateX: number;
  isRTL: boolean;
}

const getTailPosition = ({
  placement,
  translateX,
  isRTL,
}: TailPositionProps) => {
  switch (placement) {
    case Placement.Top:
    case Placement.TopStart:
    case Placement.TopEnd:
      return css`
        bottom: -${TAIL_HEIGHT - 1}px;
        /*! @noflip */
        transform: translateX(${translateX}px) rotate(180deg);
      `;
    case Placement.Bottom:
    case Placement.BottomStart:
    case Placement.BottomEnd:
      return css`
        top: -${TAIL_HEIGHT - 1}px;
        /*! @noflip */
        transform: translateX(${translateX}px);
      `;
    case Placement.Left:
    case Placement.LeftStart:
    case Placement.LeftEnd:
      return css`
        right: -${TAIL_WIDTH / 2 + TAIL_HEIGHT / 2 - 1}px;
        transform: rotate(${isRTL ? '-90deg' : '90deg'});
      `;
    case Placement.Right:
    case Placement.RightStart:
    case Placement.RightEnd:
      return css`
        left: -${TAIL_WIDTH / 2 + TAIL_HEIGHT / 2 - 1}px;
        transform: rotate(${isRTL ? '90deg' : '-90deg'});
      `;
    default:
      return ``;
  }
};

export const SvgForTail = styled.svg`
  position: absolute;
  width: 0;
  height: 0;
`;

export const Tail = styled.span<TailPositionProps>`
  @supports (clip-path: url('#${SVG_TOOLTIP_TAIL_ID}')) {
    position: absolute;
    display: block;
    height: ${TAIL_HEIGHT}px;
    width: ${TAIL_WIDTH}px;
    ${({ placement, translateX, isRTL }) =>
      getTailPosition({ placement, translateX, isRTL })};
    background-color: inherit;
    border: none;
    border-bottom: none;
    clip-path: url('#${SVG_TOOLTIP_TAIL_ID}');
  }
`;
