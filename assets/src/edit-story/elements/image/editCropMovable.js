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
import { useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Movable from '../../components/movable';
import { useUnits } from '../../units';
import { getFocalFromOffset } from './../shared';

function EditCropMovable( {
	setProperties, cropBox, croppedImage,
	x, y,
	offsetX, offsetY, imgWidth, imgHeight,
} ) {
	const { actions: { editorToDataX, editorToDataY } } = useUnits();

	const moveableRef = useRef();
	const cropRef = useRef( [ 0, 0, 0, 0 ] );

	// Refresh moveables to ensure that the selection rect is always correct.
	useEffect( () => {
		moveableRef.current.updateRect();
	} );

	return (
		<Movable
			ref={ moveableRef }
			className="crop-movable"
			targets={ cropBox }

			origin={ false }
			resizable={ true }
			onResize={ ( { width: resizeWidth, height: resizeHeight, delta, drag } ) => {
				const [ tx, ty ] = [ drag.beforeTranslate[ 0 ], drag.beforeTranslate[ 1 ] ];
				cropBox.style.transform = `translate(${ tx }px, ${ ty }px)`;
				croppedImage.style.transform = `translate(${ -tx }px, ${ -ty }px)`;
				if ( delta[ 0 ] ) {
					cropBox.style.width = `${ resizeWidth }px`;
				}
				if ( delta[ 1 ] ) {
					cropBox.style.height = `${ resizeHeight }px`;
				}
				cropRef.current = [ tx, ty, resizeWidth, resizeHeight ];
			} }
			onResizeEnd={ () => {
				cropBox.style.transform = '';
				croppedImage.style.transform = '';
				cropBox.style.width = '';
				cropBox.style.height = '';
				const [ tx, ty, resizeWidth, resizeHeight ] = cropRef.current;
				cropRef.current = [ 0, 0, 0, 0 ];
				if ( resizeWidth === 0 || resizeHeight === 0 ) {
					return;
				}
				const resizeScale = Math.min( imgWidth / resizeWidth, imgHeight / resizeHeight ) * 100;
				const resizeFocalX = getFocalFromOffset( resizeWidth, imgWidth, offsetX + tx );
				const resizeFocalY = getFocalFromOffset( resizeHeight, imgHeight, offsetY + ty );
				setProperties( {
					x: editorToDataX( x + tx ),
					y: editorToDataY( y + ty ),
					width: editorToDataX( resizeWidth ),
					height: editorToDataY( resizeHeight ),
					scale: resizeScale,
					focalX: resizeFocalX,
					focalY: resizeFocalY,
				} );
			} }

			snappable={ true }
			// todo@: it looks like resizing bounds are not supported.
			verticalGuidelines={ [
				x - offsetX,
				x - offsetX + imgWidth,
			] }
			horizontalGuidelines={ [
				y - offsetY,
				y - offsetY + imgHeight,
			] }
		/>
	);
}

EditCropMovable.propTypes = {
	setProperties: PropTypes.func.isRequired,
	cropBox: PropTypes.object.isRequired,
	croppedImage: PropTypes.object.isRequired,
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	offsetX: PropTypes.number.isRequired,
	offsetY: PropTypes.number.isRequired,
	imgWidth: PropTypes.number.isRequired,
	imgHeight: PropTypes.number.isRequired,
};

export default EditCropMovable;
