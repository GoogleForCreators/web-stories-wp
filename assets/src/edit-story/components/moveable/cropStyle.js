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
		width: 24px !important;
		height: 8px !important;
		margin-left: -12px !important;
		margin-top: -4px !important;
	}

	.crop-moveable .moveable-control.moveable-e,
	.crop-moveable .moveable-control.moveable-w {
		width: 8px !important;
		height: 24px !important;
		margin-left: -4px !important;
		margin-top: -12px !important;
	}

	.crop-moveable .moveable-control.moveable-nw,
	.crop-moveable .moveable-control.moveable-ne,
	.crop-moveable .moveable-control.moveable-sw,
	.crop-moveable .moveable-control.moveable-se {
		width: 24px !important;
		height: 24px !important;
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
		width: 24px !important;
		height: 24px !important;
		display: block !important;
		position: absolute !important;
		inset: 1px !important;
		background: ${({ theme }) =>
      theme.designSystemTheme.colors.bg.primary} !important;
	}

	.crop-moveable .moveable-control.moveable-nw,
	.crop-moveable .moveable-control.moveable-ne {
		margin-top: -4px !important;
	}

	.crop-moveable .moveable-control.moveable-sw,
	.crop-moveable .moveable-control.moveable-se {
		margin-top: -20px !important;
	}

	.crop-moveable .moveable-control.moveable-nw,
	.crop-moveable .moveable-control.moveable-sw {
		margin-left: -4px !important;
	}

	.crop-moveable .moveable-control.moveable-ne,
	.crop-moveable .moveable-control.moveable-se {
		margin-left: -20px !important;
	}

	.crop-moveable .moveable-control.moveable-nw {
		transform-origin: 2px 2px !important;
		clip-path: polygon(0 0, 24px 0, 24px 8px, 8px 8px, 8px 24px, 0 24px) !important;
	}

	.crop-moveable .moveable-control.moveable-nw::before {
		clip-path: polygon(0 0, 22px 0, 22px 6px, 6px 6px, 6px 22px, 0 22px) !important;
		top: 1px;
		left: 1px;
	}

	.crop-moveable .moveable-control.moveable-ne {
		transform-origin: 14px 2px !important;
		clip-path: polygon(0 0, 24px 0, 24px 24px, 16px 24px, 16px 8px, 0 8px) !important;
	}

	.crop-moveable .moveable-control.moveable-ne::before {
		clip-path: polygon(0 0, 22px 0, 22px 22px, 16px 22px, 16px 6px, 0 6px) !important;
		top: 1px;
		right: -1px;
	}

	.crop-moveable .moveable-control.moveable-sw {
		transform-origin: 2px 22px !important;
		clip-path: polygon(0 0, 0 24px, 24px 24px, 24px 16px, 8px 16px, 8px 0) !important;
	}

	.crop-moveable .moveable-control.moveable-sw::before {
		clip-path: polygon(0 0, 0 22px, 22px 22px, 22px 16px, 6px 16px, 6px 0) !important;
		bottom: -1px;
		left: 1px;
	}

	.crop-moveable .moveable-control.moveable-se {
		transform-origin: 22px 22px !important;
		clip-path: polygon(24px 0, 24px 24px, 0 24px, 0 16px, 16px 16px, 16px 0) !important;
	}

	.crop-moveable .moveable-control.moveable-se::before {
		clip-path: polygon(22px 0, 22px 22px, 0 22px, 0 16px, 16px 16px, 16px 0) !important;
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
