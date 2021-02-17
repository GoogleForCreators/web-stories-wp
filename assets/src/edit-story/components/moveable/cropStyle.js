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
import { createGlobalStyle } from 'styled-components';

const SIDE_WIDE = 24;
const SIDE_NARROW = 8;
const SIDE_BORDER = 1;
const SIDES_DIFF = SIDE_WIDE - SIDE_NARROW;

export const GlobalStyle = createGlobalStyle`
  .crop-moveable .moveable-control {
    background: ${({ theme }) => theme.colors.bg.primary} !important;
    border: none !important;
    box-sizing: border-box !important;
  }

  .crop-moveable .moveable-control.moveable-n,
  .crop-moveable .moveable-control.moveable-s,
  .crop-moveable .moveable-control.moveable-e,
  .crop-moveable .moveable-control.moveable-w {
    border: 1px solid ${({ theme }) =>
      theme.colors.border.selection} !important;
    border-radius: 4px;
  }

  .crop-moveable .moveable-control.moveable-n,
  .crop-moveable .moveable-control.moveable-s {
    width: ${SIDE_WIDE}px !important;
    height: ${SIDE_NARROW}px !important;
    margin-left: -12px !important;
  }

  .crop-moveable .moveable-control.moveable-n {
    margin-top: -8px !important;
  }
  .crop-moveable .moveable-control.moveable-s {
    margin-top: 0px !important;
  }
  .crop-moveable .moveable-control.moveable-e {
    margin-left: 0 !important;
  }
  .crop-moveable .moveable-control.moveable-w {
    margin-top: 0 !important;
    margin-left: -8px !important;
  }

  .crop-moveable .moveable-control.moveable-e,
  .crop-moveable .moveable-control.moveable-w {
    width: ${SIDE_NARROW}px !important;
    height: ${SIDE_WIDE}px !important;
    margin-top: -12px !important;
  }

  .crop-moveable .moveable-control.moveable-nw,
  .crop-moveable .moveable-control.moveable-ne,
  .crop-moveable .moveable-control.moveable-sw,
  .crop-moveable .moveable-control.moveable-se,
  .crop-moveable .moveable-control.moveable-nw::before,
  .crop-moveable .moveable-control.moveable-ne::before,
  .crop-moveable .moveable-control.moveable-sw::before,
  .crop-moveable .moveable-control.moveable-se::before,
  .crop-moveable .moveable-control.moveable-nw::after,
  .crop-moveable .moveable-control.moveable-ne::after,
  .crop-moveable .moveable-control.moveable-sw::after,
  .crop-moveable .moveable-control.moveable-se::after {
    left: initial !important;
    right: initial !important;
    top: initial !important;
    bottom: initial !important;
    background: ${({ theme }) => theme.colors.bg.primary} !important;
    position: absolute !important;
    border-style: solid !important;
    border-color: ${({ theme }) => theme.colors.border.selection} !important;
  }

  .crop-moveable .moveable-control.moveable-nw::before,
  .crop-moveable .moveable-control.moveable-ne::before,
  .crop-moveable .moveable-control.moveable-sw::before,
  .crop-moveable .moveable-control.moveable-se::before,
  .crop-moveable .moveable-control.moveable-nw::after,
  .crop-moveable .moveable-control.moveable-ne::after,
  .crop-moveable .moveable-control.moveable-sw::after,
  .crop-moveable .moveable-control.moveable-se::after {
    content: '';
  }

  /* The corner piece */
  .crop-moveable .moveable-control.moveable-nw,
  .crop-moveable .moveable-control.moveable-ne,
  .crop-moveable .moveable-control.moveable-sw,
  .crop-moveable .moveable-control.moveable-se {
    width: ${SIDE_NARROW - SIDE_BORDER}px !important;
    height: ${SIDE_NARROW - SIDE_BORDER}px !important;
  }

  /* top left corner piece */
  .crop-moveable .moveable-control.moveable-nw {
    top: -${SIDE_BORDER}px !important;
    left: -${SIDE_BORDER}px !important;
    border-width: 1px 0 0 1px !important;
    border-radius: 2px 0 0 0 !important;
  }

  /* top right corner piece */
  .crop-moveable .moveable-control.moveable-ne {
    top: -${SIDE_BORDER}px !important;
    right: -${SIDE_NARROW - SIDE_BORDER}px !important;
    border-width: 1px 1px 0 0 !important;
    border-radius: 0 2px 0 0 !important;
  }

  /* bottom left corner piece */
  .crop-moveable .moveable-control.moveable-sw {
    left: -${SIDE_BORDER}px !important;
    bottom: -${SIDE_NARROW - SIDE_BORDER}px !important;
    border-width: 0 0 1px 1px !important;
    border-radius: 0 0 0 2px !important;
  }

  /* bottom right corner piece */
  .crop-moveable .moveable-control.moveable-se {
    right: -${SIDE_NARROW - SIDE_BORDER}px !important;
    bottom: -${SIDE_NARROW - SIDE_BORDER}px !important;
    border-width:  0 1px 1px 0 !important;
    border-radius: 0 0 2px 0 !important;
  }

  /* The horizontal edges */
  .crop-moveable .moveable-control.moveable-nw::before,
  .crop-moveable .moveable-control.moveable-ne::before,
  .crop-moveable .moveable-control.moveable-sw::before,
  .crop-moveable .moveable-control.moveable-se::before {
    width: ${SIDES_DIFF + SIDE_BORDER}px !important;
    height: ${SIDE_NARROW}px !important;
    top: 0;
  }

  /* The horizontal edges to the left of corner */
  .crop-moveable .moveable-control.moveable-nw::before,
  .crop-moveable .moveable-control.moveable-sw::before {
    left: ${SIDE_NARROW - 2 * SIDE_BORDER}px !important;
    border-width: 1px 1px 1px 0;
    border-radius: 0 2px 2px 0;
  }

  /* The horizontal edges to the right of corner */
  .crop-moveable .moveable-control.moveable-ne::before,
  .crop-moveable .moveable-control.moveable-se::before {
    right: ${SIDE_NARROW - 2 * SIDE_BORDER}px !important;
    border-width: 1px 0 1px 1px;
    border-radius: 2px 0 0 2px;
  }

  /* The horizontal edges along the top */
  .crop-moveable .moveable-control.moveable-nw::before,
  .crop-moveable .moveable-control.moveable-ne::before {
    top: -${SIDE_BORDER}px !important;
  }

  /* The horizontal edges along the bottom */
  .crop-moveable .moveable-control.moveable-sw::before,
  .crop-moveable .moveable-control.moveable-se::before {
    bottom: -${SIDE_BORDER}px !important;
  }

  /* The vertical edges */
  .crop-moveable .moveable-control.moveable-nw::after,
  .crop-moveable .moveable-control.moveable-ne::after,
  .crop-moveable .moveable-control.moveable-sw::after,
  .crop-moveable .moveable-control.moveable-se::after {
    width: ${SIDE_NARROW}px !important;
    height: ${SIDES_DIFF + SIDE_BORDER}px !important;
  }

  /* The vertical edges below corner */
  .crop-moveable .moveable-control.moveable-nw::after,
  .crop-moveable .moveable-control.moveable-ne::after {
    top: ${SIDE_NARROW - 2 * SIDE_BORDER}px !important;
    border-width: 0 1px 1px 1px;
    border-radius: 0 0 2px 2px;
  }

  /* The vertical edges above corner */
  .crop-moveable .moveable-control.moveable-sw::after,
  .crop-moveable .moveable-control.moveable-se::after {
    bottom: ${SIDE_NARROW - 2 * SIDE_BORDER}px !important;
    border-width: 1px 1px 0 1px;
    border-radius: 2px 2px 0 0;
  }

  /* The vertical edges along the left edge */
  .crop-moveable .moveable-control.moveable-nw::after,
  .crop-moveable .moveable-control.moveable-sw::after {
    left: -${SIDE_BORDER}px !important;
  }

  /* The vertical edges along the right edge */
  .crop-moveable .moveable-control.moveable-ne::after,
  .crop-moveable .moveable-control.moveable-se::after {
    right: -${SIDE_BORDER}px !important;
  }


  .crop-moveable .moveable-line.moveable-direction[data-line-index="0"] {
    margin-top: -4px;
  }
  .crop-moveable .moveable-line.moveable-direction[data-line-index="3"] {
    margin-top: 4px;
  }
  .crop-moveable .moveable-line.moveable-direction[data-line-index="1"] {
    margin-left: 4px;
  }
  .crop-moveable .moveable-line.moveable-direction[data-line-index="2"] {
    margin-left: -4px;
  }

  .crop-moveable .moveable-direction.moveable-line {
    background: ${({ theme }) => theme.colors.border.selection} !important;
    width: 2px;
    height: 2px;
    pointer-events: none;
  }
`;
