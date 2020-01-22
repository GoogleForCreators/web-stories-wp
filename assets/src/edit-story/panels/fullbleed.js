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
import { ActionButton, Panel, Title, getCommonValue } from './shared';

function FullbleedPanel( { selectedElements, onSetProperties } ) {
	// The x/y/w/h/r are kept unchanged so that toggling fullbleed will return
	// the element to the previous non-fullbleed position/size.
	const isFullbleed = getCommonValue( selectedElements, 'isFullbleed' );
	const [ state, setState ] = useState( { isFullbleed } );
	useEffect( () => {
		setState( { isFullbleed } );
	}, [ isFullbleed ] );
	const handleClick = ( ) => {
		const newState = { isFullbleed: ! state.isFullbleed };
		setState( newState );
		onSetProperties( newState );
	};
	return (
		<Panel onSubmit={ ( event ) => event.preventDefault() }>
			<Title>
				{ __( 'Fullbleed', 'web-stories' ) }
			</Title>
			<ActionButton onClick={ handleClick }>
				{ state.isFullbleed ? __( 'Unset as fullbleed', 'web-stories' ) : __( 'Set as fullbleed', 'web-stories' ) }
			</ActionButton>
		</Panel>
	);
}

FullbleedPanel.propTypes = {
	selectedElements: PropTypes.array.isRequired,
	onSetProperties: PropTypes.func.isRequired,
};

export default FullbleedPanel;
