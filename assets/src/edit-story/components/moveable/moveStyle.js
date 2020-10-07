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
	.default-moveable .moveable-control,
	.default-moveable .moveable-line.moveable-rotation-line .moveable-control {
		background: ${({ theme }) => theme.colors.accent.primary} !important;
		border: 2px solid #fff !important;
		margin-left: -6px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
	}

	.default-moveable.type-text .moveable-direction.moveable-n, .default-moveable.type-text .moveable-direction.moveable-s {
		pointer-events: none;
	}
	.default-moveable .moveable-control.moveable-n {
		display: none !important;
	}

  .default-moveable .moveable-line {
    background: ${({ theme }) => theme.colors.callout} !important;
  }

	.default-moveable .moveable-control.moveable-s,
	.default-moveable .moveable-control.moveable-e,
	.default-moveable .moveable-control.moveable-w {
		border-radius: 8px;
	}

	.default-moveable .moveable-control.moveable-s {
		height: 8px !important;
		width: 16px !important;
		margin-top: -2px !important;
	}

	.default-moveable .moveable-control.moveable-e {
		height: 16px !important;
		width: 8px !important;
		margin-left: -4px !important;
	}

	.default-moveable .moveable-control.moveable-w {
		height: 16px !important;
		width: 8px !important;
		margin-left: -4px !important;
	}

	.default-moveable.moveable-control-box .moveable-line.moveable-direction {
		background: #4285f4 !important;
		width: 2px;
		height: 2px;
	}

	.default-moveable.moveable-control-box .moveable-line.moveable-rotation-line {
		background: #4285f4 !important;
		width: 1px;
		top: -16px;
		height: 16px;
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
`;
