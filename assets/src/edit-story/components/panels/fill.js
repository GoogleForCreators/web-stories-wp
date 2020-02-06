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
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ActionButton } from '../button';
import getCommonValue from './utils/getCommonValue';
import { SimplePanel } from './panel';

function FillPanel( { selectedElements, onSetProperties } ) {
	// The x/y/w/h/r are kept unchanged so that toggling fill will return
	// the element to the previous non-fill position/size.
	const isFill = getCommonValue( selectedElements, 'isFill' );
	const [ state, setState ] = useState( { isFill } );
	useEffect( () => {
		setState( { isFill } );
	}, [ isFill ] );
	const handleClick = ( ) => {
		const newState = { isFill: ! state.isFill };
		setState( newState );
		onSetProperties( newState );
	};
	return (
		<SimplePanel name="fill" title={ __( 'Fill', 'web-stories' ) }>
			<ActionButton onClick={ handleClick }>
				{ state.isFill ? __( 'Unset as fill', 'web-stories' ) : __( 'Set as fill', 'web-stories' ) }
			</ActionButton>
		</SimplePanel>
	);
}

FillPanel.propTypes = {
	selectedElements: PropTypes.array.isRequired,
	onSetProperties: PropTypes.func.isRequired,
};

export default FillPanel;
