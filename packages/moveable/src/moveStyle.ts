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

/**
 * Internal dependencies
 */
import arrowCircle from './inline-icons/arrow_circle.svg';

export const GlobalStyle = createGlobalStyle`
  .default-moveable .moveable-control,
  .default-moveable .moveable-line.moveable-rotation-line .moveable-control {
    background: ${({ theme }) => theme.colors.bg.primary} !important;
    border: 1px solid ${({ theme }) =>
      theme.colors.border.selection} !important;
  }

  .default-moveable.type-text .moveable-direction.moveable-n, .default-moveable.type-text .moveable-direction.moveable-s {
    pointer-events: none;
  }
  .default-moveable .moveable-control.moveable-n {
    display: none !important;
  }

  .default-moveable .moveable-line {
    border: 0;
    background: transparent !important;
    width: 1px;
    height: 1px;
  }

  .default-moveable .moveable-horizontal {
    border-bottom: 1px dashed ${({ theme }) =>
      theme.colors.border.focus} !important;
  }

  .default-moveable .moveable-vertical {
    border-right: 1px dashed ${({ theme }) =>
      theme.colors.border.focus} !important;
  }

  .default-moveable .moveable-gap {
    border-color: ${({ theme }) =>
      theme.colors.border.negativePress} !important;
  }

  .default-moveable .moveable-target {
    border-style: solid !important;
  }

  .default-moveable .moveable-control.moveable-s,
  .default-moveable .moveable-control.moveable-e,
  .default-moveable .moveable-control.moveable-w {
    border-radius: 4px;
  }

  .default-moveable .moveable-control.moveable-nw,
  .default-moveable .moveable-control.moveable-ne,
  .default-moveable .moveable-control.moveable-sw,
  .default-moveable .moveable-control.moveable-se {
    border-radius: 2px;
    width: 8px;
    height: 8px;
    margin-left: -4px;
    margin-top: -4px;
  }

  .default-moveable .moveable-control.moveable-s {
    height: 6px !important;
    width: 16px !important;
    margin-top: -3px !important;
  }

  .default-moveable .moveable-control.moveable-e {
    height: 16px !important;
    width: 6px !important;
    margin-left: -3px !important;
  }

  .default-moveable .moveable-control.moveable-w {
    height: 16px !important;
    width: 6px !important;
    margin-left: -3px !important;
  }

  .default-moveable.moveable-control-box .moveable-line.moveable-direction {
    background: ${({ theme }) => theme.colors.border.selection} !important;
    width: 1px;
    height: 1px;
  }

  .default-moveable.moveable-control-box .moveable-line.moveable-rotation-line {
    background: ${({ theme }) => theme.colors.border.selection} !important;
    width: 1px;
    height: 12px;
    top: 28px;
  }

  .default-moveable.moveable-control-box .moveable-control.moveable-rotation-control {
    border-radius: 50px;
    width: 29px;
    height: 29px;
    margin-left: -14.5px;
    top: 10.5px;
  }

  .default-moveable.moveable-control-box .moveable-control.moveable-rotation-control::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 28px;
    left: -1px;
    top: -1px;
    background-image: url("${arrowCircle}");
    background-size: 100%;
    /* The svg is made into an image and styles can't be shared across documents.
    Black is the default so invert to white. */
    filter: invert(100%);
  }

  .default-moveable.hide-handles .moveable-line.moveable-rotation-line,
  .default-moveable.hide-handles .moveable-line.moveable-direction {
    display: none;
  }

  .default-moveable.visually-hide-handles .moveable-control.moveable-e,
  .default-moveable.visually-hide-handles .moveable-control.moveable-w,
  .default-moveable.visually-hide-handles .moveable-control.moveable-s,
  .default-moveable.visually-hide-handles .moveable-control.moveable-ne,
  .default-moveable.visually-hide-handles .moveable-control.moveable-nw,
  .default-moveable.visually-hide-handles .moveable-control.moveable-sw {
    opacity: 0;
  }

  .default-moveable.immoveable .moveable-line.moveable-direction {
    cursor: default;
  }
`;
