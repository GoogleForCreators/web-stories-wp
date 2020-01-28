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
import useStory from '../app/story/useStory';
import { Panel, Title, InputGroup, ActionButton } from './shared';

// @todo Only display if one element selected.
function BackgroundPanel( { selectedElements, onSetProperties } ) {
	// Remove background: check if is background.
	const { state: { currentPage }, actions: { setBackgroundElement } } = useStory();
	const { id, overlay, opacity } = selectedElements[ 0 ];
	const isBackground = currentPage.backgroundElementId === id;

	// To add: Remove as background; Opacity; Overlay

	const [ state, setState ] = useState( { isBackground, opacity, overlay } );
	useEffect( () => {
		setState( { isBackground } );
	}, [ isBackground ] );
	const handleClick = ( ) => {
		const newState = { isBackground: ! state.isBackground, opacity: 100, overlay: null };
		setState( newState );
		const backgroundId = state.isBackground ? selectedElements[ 0 ].id : null;
		setBackgroundElement( { elementId: backgroundId } );
		onSetProperties( newState );
	};
	return (
		<Panel onSubmit={ ( event ) => event.preventDefault() }>
			<Title>
				{ __( 'Background', 'amp' ) }
			</Title>
			<ActionButton onClick={ handleClick }>
				{ state.isBackground ? __( 'Remove as Background', 'amp' ) : __( 'Set as background', 'amp' ) }
			</ActionButton>
		</Panel>
	);
}

BackgroundPanel.propTypes = {
	selectedElements: PropTypes.array.isRequired,
	onSetProperties: PropTypes.func.isRequired,
};

export default BackgroundPanel;
