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
import { text, boolean } from '@storybook/addon-knobs';
import { useState, useCallback, useEffect } from 'react';

/**
 * Internal dependencies
 */
import ColorPicker from '../';

export default {
	title: 'Components/Color Picker',
	component: ColorPicker,
};

export const _default = () => {
	const initialColor = text( 'Initial Color', '#4891fc' );
	const gradients = boolean( 'With Gradients', true );

	const [ color, setColor ] = useState( { hex: initialColor } );

	useEffect( () => {
		setColor( { hex: initialColor } );
	}, [ initialColor ] );

	const onChange = useCallback( ( newColor ) => {
		setColor( newColor );
	}, [ setColor ] );

	return (
		<ColorPicker
			color={ color }
			onChange={ onChange }
			gradients={ gradients }
		/>
	);
};
