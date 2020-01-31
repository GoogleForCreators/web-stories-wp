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
import { css } from 'styled-components';

export const VideoWithScale = css`
	width: ${ ( { width } ) => `${ width }px` };
	height: ${ ( { height } ) => `${ height }px` };
`;

export const getBackgroundStyle = () => {
	return {
		minWidth: '100%',
		minHeight: '100%',
		width: 'auto',
		height: 'auto',
		maxWidth: 'initial',
	};
};

export function getFocalFromOffset( side, videoSide, offset ) {
	return ( offset + ( side * 0.5 ) ) / videoSide * 100;
}

export function getVideoProps( width, height, scale, focalX, focalY, videoRatio ) {
	const ratio = height / width;
	scale = Math.max( scale || 100, 100 );
	focalX = typeof focalX === 'number' ? focalX : 50;
	focalY = typeof focalY === 'number' ? focalY : 50;
	const videoWidth = ( videoRatio <= ratio ? width : height * videoRatio ) * scale * 0.01;
	const videoHeight = ( videoRatio <= ratio ? width / videoRatio : height ) * scale * 0.01;
	const offsetX = Math.max( 0, Math.min( ( videoWidth * focalX * 0.01 ) - ( width * 0.5 ), videoWidth - width ) );
	const offsetY = Math.max( 0, Math.min( ( videoHeight * focalY * 0.01 ) - ( height * 0.5 ), videoHeight - height ) );
	return {
		width: videoWidth,
		height: videoHeight,
		offsetX,
		offsetY,
		scale,
		focalX,
		focalY,
	};
}
