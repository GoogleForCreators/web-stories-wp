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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { PLACEMENT } from '../popup';

export const SVG_TOOLTIP_TAIL_ID = 'tooltip-tail';
const TAIL_WIDTH = 34;
const TAIL_HEIGHT = 8;

const getTailPosition = ({ placement, translateX }) => {
  switch (placement) {
    case PLACEMENT.TOP:
    case PLACEMENT.TOP_START:
    case PLACEMENT.TOP_END:
      return css`
        bottom: -${TAIL_HEIGHT - 1}px;
        transform: translateX(${translateX}px) rotate(180deg);
      `;
    case PLACEMENT.BOTTOM:
    case PLACEMENT.BOTTOM_START:
    case PLACEMENT.BOTTOM_END:
      return css`
        top: -${TAIL_HEIGHT - 1}px;
        transform: translateX(${translateX}px);
      `;
    case PLACEMENT.LEFT:
    case PLACEMENT.LEFT_START:
    case PLACEMENT.LEFT_END:
      return css`
        right: -${TAIL_WIDTH / 2 + TAIL_HEIGHT / 2 - 1}px;
        transform: rotate(90deg);
      `;
    case PLACEMENT.RIGHT:
    case PLACEMENT.RIGHT_START:
    case PLACEMENT.RIGHT_END:
      return css`
        left: -${TAIL_WIDTH / 2 + TAIL_HEIGHT / 2 - 1}px;
        transform: rotate(-90deg);
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

export const Tail = styled.span`
  @supports (clip-path: url('#${SVG_TOOLTIP_TAIL_ID}')) {
    position: absolute;
    display: block;
    height: ${TAIL_HEIGHT}px;
    width: ${TAIL_WIDTH}px;
    ${({ placement, translateX }) =>
      getTailPosition({ placement, translateX })};
    background-color: inherit;
    border: none;
    border-bottom: none;
    clip-path: url('#${SVG_TOOLTIP_TAIL_ID}');
  }
`;

Tail.propTypes = {
  placement: PropTypes.string,
  translateX: PropTypes.number,
};
