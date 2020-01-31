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
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { InputGroup } from '../form';
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';

function RotationPanel( { selectedElements, onSetProperties } ) {
	const rotationAngle = getCommonValue( selectedElements, 'rotationAngle' );
	const isFill = getCommonValue( selectedElements, 'isFill' );
	const [ state, setState ] = useState( { rotationAngle } );
	useEffect( () => {
		setState( { rotationAngle } );
	}, [ rotationAngle ] );
	const handleSubmit = ( evt ) => {
		onSetProperties( state );
		evt.preventDefault();
	};
	return (
		<SimplePanel name="rotation" title={ __( 'Rotation', 'web-stories' ) } onSubmit={ handleSubmit }>
			<InputGroup
				label={ __( 'Rotation angle', 'web-stories' ) }
				value={ state.rotationAngle }
				isMultiple={ rotationAngle === '' }
				onChange={ ( value ) => setState( { ...state, rotationAngle: isNaN( value ) || value === '' ? '' : parseFloat( value ) } ) }
				postfix={ _x( 'deg', 'Degrees, 0 - 360. ', 'web-stories' ) }
				disabled={ isFill }
			/>
		</SimplePanel>
	);
}

RotationPanel.propTypes = {
	selectedElements: PropTypes.array.isRequired,
	onSetProperties: PropTypes.func.isRequired,
};

export default RotationPanel;
