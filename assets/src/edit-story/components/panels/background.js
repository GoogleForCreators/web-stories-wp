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
import useStory from '../../app/story/useStory';
import { ActionButton } from '../button';
import { SimplePanel } from './panel';

function BackgroundPanel( { selectedElements, onSetProperties } ) {
	// Remove background: check if is background.
	const { actions: { setBackgroundElement } } = useStory();
	const { overlay, opacity, isBackground } = selectedElements[ 0 ];

	// To add: Remove as background; Opacity; Overlay

	const [ state, setState ] = useState( { isBackground, opacity, overlay } );
	useEffect( () => {
		setState( { isBackground } );
	}, [ isBackground ] );
	const handleClick = ( ) => {
		const newIsBackground = ! state.isBackground;
		const newState = { isBackground: newIsBackground, opacity: 100, overlay: null };
		setState( newState );
		const backgroundId = newIsBackground ? selectedElements[ 0 ].id : null;
		setBackgroundElement( { elementId: backgroundId } );
		onSetProperties( newState );
	};
	return (
		<SimplePanel name="position" title={ __( 'Background', 'amp' ) }>
			<ActionButton onClick={ handleClick }>
				{ state.isBackground ? __( 'Remove as Background', 'amp' ) : __( 'Set as background', 'amp' ) }
			</ActionButton>
		</SimplePanel>
	);
}

BackgroundPanel.propTypes = {
	selectedElements: PropTypes.array.isRequired,
	onSetProperties: PropTypes.func.isRequired,
};

export default BackgroundPanel;
