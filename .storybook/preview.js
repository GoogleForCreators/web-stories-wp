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
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { addDecorator, addParameters } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

/**
 * Internal dependencies
 */
import theme, { GlobalStyle } from '../assets/src/edit-story/theme';

// @todo: Find better way to mock these.
const wp = {};
window.wp = window.wp || wp;
window.wp.media = {
	controller: {
		Library: {
			prototype: {
				defaults: {},
			},
		},
	},
};

const { ipad, ipad10p, ipad12p } = INITIAL_VIEWPORTS;

addParameters( {
	viewport: {
		viewports: {
			ipad,
			ipad10p,
			ipad12p,
		},
	},
} );

addDecorator( withA11y );
addDecorator( withKnobs );

addDecorator( ( story ) => (
	<ThemeProvider theme={ theme }>
		<GlobalStyle />
		{ story() }
	</ThemeProvider>
) );
