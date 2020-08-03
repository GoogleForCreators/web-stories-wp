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
	.crop-movable .moveable-control {
		background: #000 !important;
		border-radius: 0 !important;
		border: none !important;
		box-sizing: border-box !important;
		box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
	}

	.crop-movable .moveable-control.moveable-n,
	.crop-movable .moveable-control.moveable-s,
	.crop-movable .moveable-control.moveable-e,
	.crop-movable .moveable-control.moveable-w {
		border: 1px solid #fff !important;
	}

	.crop-movable .moveable-control.moveable-n,
	.crop-movable .moveable-control.moveable-s {
		width: 16px !important;
		height: 4px !important;
		margin-left: -8px !important;
		margin-top: -1px !important;
	}

	.crop-movable .moveable-control.moveable-e,
	.crop-movable .moveable-control.moveable-w {
		width: 4px !important;
		height: 16px !important;
		margin-left: -1px !important;
		margin-top: -8px !important;
	}

	.crop-movable .moveable-control.moveable-nw,
	.crop-movable .moveable-control.moveable-ne,
	.crop-movable .moveable-control.moveable-sw,
	.crop-movable .moveable-control.moveable-se {
		width: 16px !important;
		height: 16px !important;
		background: #fff !important;
		position: absolute !important;
	}

	.crop-movable .moveable-control.moveable-nw::before,
	.crop-movable .moveable-control.moveable-ne::before,
	.crop-movable .moveable-control.moveable-sw::before,
	.crop-movable .moveable-control.moveable-se::before {
		content: "" !important;
		width: 16px !important;
		height: 16px !important;
		display: block !important;
		position: absolute !important;
		inset: 1px !important;
		background: #000 !important;
	}

	.crop-movable .moveable-control.moveable-nw,
	.crop-movable .moveable-control.moveable-ne {
		margin-top: -2px !important;
	}

	.crop-movable .moveable-control.moveable-sw,
	.crop-movable .moveable-control.moveable-se {
		margin-top: -14px !important;
	}

	.crop-movable .moveable-control.moveable-nw,
	.crop-movable .moveable-control.moveable-sw {
		margin-left: -2px !important;
	}

	.crop-movable .moveable-control.moveable-ne,
	.crop-movable .moveable-control.moveable-se {
		margin-left: -14px !important;
	}

	.crop-movable .moveable-control.moveable-nw {
		transform-origin: 2px 2px !important;
		clip-path: polygon(0 0, 16px 0, 16px 4px, 4px 4px, 4px 16px, 0 16px) !important;
	}

	.crop-movable .moveable-control.moveable-nw::before {
		clip-path: polygon(0 0, 14px 0, 14px 2px, 2px 2px, 2px 14px, 0 14px) !important;
		top: 1px;
		left: 1px;
	}

	.crop-movable .moveable-control.moveable-ne {
		transform-origin: 14px 2px !important;
		clip-path: polygon(0 0, 16px 0, 16px 16px, 12px 16px, 12px 4px, 0 4px) !important;
	}

	.crop-movable .moveable-control.moveable-ne::before {
		clip-path: polygon(0 0, 14px 0, 14px 14px, 12px 14px, 12px 2px, 0 2px) !important;
		top: 1px;
		right: -1px;
	}

	.crop-movable .moveable-control.moveable-sw {
		transform-origin: 2px 14px !important;
		clip-path: polygon(0 0, 0 16px, 16px 16px, 16px 12px, 4px 12px, 4px 0) !important;
	}

	.crop-movable .moveable-control.moveable-sw::before {
		clip-path: polygon(0 0, 0 14px, 14px 14px, 14px 12px, 2px 12px, 2px 0) !important;
		bottom: -1px;
		left: 1px;
	}

	.crop-movable .moveable-control.moveable-se {
		transform-origin: 14px 14px !important;
		clip-path: polygon(16px 0, 16px 16px, 0 16px, 0 12px, 12px 12px, 12px 0) !important;
	}

	.crop-movable .moveable-control.moveable-se::before {
		clip-path: polygon(14px 0, 14px 14px, 0 14px, 0 12px, 12px 12px, 12px 0) !important;
		bottom: -1px;
		right: -1px;
	}

	.crop-movable .moveable-direction.moveable-line {
		background: #1A73E8 !important;
		width: 2px;
		height: 2px;
		pointer-events: none;
	}
`;
