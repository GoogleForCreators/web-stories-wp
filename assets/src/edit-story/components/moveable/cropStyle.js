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
const SIDES_DIFF = SIDE_WIDE - SIDE_NARROW;

// Inner side is smaller by border 1px both sides,
const INNER_SIDE_WIDE = 22;
const INNER_SIDE_NARROW = 6;

export const GlobalStyle = createGlobalStyle`
	.crop-moveable .moveable-control {
		background: ${({ theme }) =>
      theme.designSystemTheme.colors.bg.primary} !important;
		border: none !important;
		box-sizing: border-box !important;
	}

	.crop-moveable .moveable-control.moveable-n,
	.crop-moveable .moveable-control.moveable-s,
	.crop-moveable .moveable-control.moveable-e,
	.crop-moveable .moveable-control.moveable-w {
		border: 1px solid ${({ theme }) =>
      theme.designSystemTheme.colors.blue[20]} !important;
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
	.crop-moveable .moveable-control.moveable-se {
		width: ${SIDE_WIDE}px !important;
		height: ${SIDE_WIDE}px !important;
		background: ${({ theme }) =>
      theme.designSystemTheme.colors.blue[20]} !important;
		position: absolute !important;
		border-radius: 2px;
	}

	.crop-moveable .moveable-control.moveable-nw::before,
	.crop-moveable .moveable-control.moveable-ne::before,
	.crop-moveable .moveable-control.moveable-sw::before,
	.crop-moveable .moveable-control.moveable-se::before {
		content: "" !important;
		width: ${SIDE_WIDE}px !important;
		height: ${SIDE_WIDE}px !important;
		display: block !important;
		position: absolute !important;
		inset: 1px !important;
		background: ${({ theme }) =>
      theme.designSystemTheme.colors.bg.primary} !important;
	}

	.crop-moveable .moveable-control.moveable-nw,
	.crop-moveable .moveable-control.moveable-ne {
		margin-top: -8px !important;
	}

	.crop-moveable .moveable-control.moveable-sw,
	.crop-moveable .moveable-control.moveable-se {
		margin-top: -16px !important;
	}

	.crop-moveable .moveable-control.moveable-nw,
	.crop-moveable .moveable-control.moveable-sw {
		margin-left: -8px !important;
	}

	.crop-moveable .moveable-control.moveable-ne,
	.crop-moveable .moveable-control.moveable-se {
		margin-left: -16px !important;
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

	.crop-moveable .moveable-control.moveable-nw {
		transform-origin: 2px 2px !important;
		clip-path: polygon(0 0, ${SIDE_WIDE}px 0, ${SIDE_WIDE}px ${SIDE_NARROW}px, ${SIDE_NARROW}px ${SIDE_NARROW}px, ${SIDE_NARROW}px ${SIDE_WIDE}px, 0 ${SIDE_WIDE}px) !important;
	}

	.crop-moveable .moveable-control.moveable-nw::before {
		clip-path: polygon(0 0, ${INNER_SIDE_WIDE}px 0, ${INNER_SIDE_WIDE}px ${INNER_SIDE_NARROW}px, ${INNER_SIDE_NARROW}px ${INNER_SIDE_NARROW}px, ${INNER_SIDE_NARROW}px ${INNER_SIDE_WIDE}px, 0 ${INNER_SIDE_WIDE}px) !important;
		top: 1px;
		left: 1px;
	}

	.crop-moveable .moveable-control.moveable-ne {
		transform-origin: 14px 2px !important;
		clip-path: polygon(0 0, ${SIDE_WIDE}px 0, ${SIDE_WIDE}px ${SIDE_WIDE}px, ${SIDES_DIFF}px ${SIDE_WIDE}px, ${SIDES_DIFF}px ${SIDE_NARROW}px, 0 ${SIDE_NARROW}px) !important;
	}

	.crop-moveable .moveable-control.moveable-ne::before {
		clip-path: polygon(0 0, ${INNER_SIDE_WIDE}px 0, ${INNER_SIDE_WIDE}px ${INNER_SIDE_WIDE}px, ${SIDES_DIFF}px ${INNER_SIDE_WIDE}px, ${SIDES_DIFF}px ${INNER_SIDE_NARROW}px, 0 ${INNER_SIDE_NARROW}px) !important;
		top: 1px;
		right: -1px;
	}

	.crop-moveable .moveable-control.moveable-sw {
		transform-origin: 2px ${INNER_SIDE_WIDE}px !important;
		clip-path: polygon(0 0, 0 ${SIDE_WIDE}px, ${SIDE_WIDE}px ${SIDE_WIDE}px, ${SIDE_WIDE}px ${SIDES_DIFF}px, ${SIDE_NARROW}px ${SIDES_DIFF}px, ${SIDE_NARROW}px 0) !important;
	}

	.crop-moveable .moveable-control.moveable-sw::before {
		clip-path: polygon(0 0, 0 ${INNER_SIDE_WIDE}px, ${INNER_SIDE_WIDE}px ${INNER_SIDE_WIDE}px, ${INNER_SIDE_WIDE}px ${SIDES_DIFF}px, ${INNER_SIDE_NARROW}px ${SIDES_DIFF}px, ${INNER_SIDE_NARROW}px 0) !important;
		bottom: -1px;
		left: 1px;
	}

	.crop-moveable .moveable-control.moveable-se {
		transform-origin: ${INNER_SIDE_WIDE}px ${INNER_SIDE_WIDE}px !important;
		clip-path: polygon(${SIDE_WIDE}px 0, ${SIDE_WIDE}px ${SIDE_WIDE}px, 0 ${SIDE_WIDE}px, 0 ${SIDES_DIFF}px, ${SIDES_DIFF}px ${SIDES_DIFF}px, ${SIDES_DIFF}px 0) !important;
	}

	.crop-moveable .moveable-control.moveable-se::before {
		clip-path: polygon(${INNER_SIDE_WIDE}px 0, ${INNER_SIDE_WIDE}px ${INNER_SIDE_WIDE}px, 0 ${INNER_SIDE_WIDE}px, 0 ${SIDES_DIFF}px, ${SIDES_DIFF}px ${SIDES_DIFF}px, ${SIDES_DIFF}px 0) !important;
		bottom: -1px;
		right: -1px;
	}

	.crop-moveable .moveable-direction.moveable-line {
		background: ${({ theme }) =>
      theme.designSystemTheme.colors.blue[20]} !important;
		width: 2px;
		height: 2px;
		pointer-events: none;
	}
`;
