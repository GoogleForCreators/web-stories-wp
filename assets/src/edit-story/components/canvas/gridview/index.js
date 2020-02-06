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
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app/story';
import DraggablePage from '../draggablePage';
import RangeInput from '../../rangeInput';
import { ReactComponent as RectangleIcon } from './rectangle.svg'

const PAGE_WIDTH = 90;
const PAGE_HEIGHT = 160;

const GRID_GAP = 20;

const Wrapper = styled.div`
	position: relative;
	display: grid;
	grid-template-columns: ${ ( { scale } ) => `repeat(auto-fit, minmax(${ scale * PAGE_WIDTH }px, max-content))` };
	grid-gap: ${ GRID_GAP }px;
	justify-content: center;
	justify-items: center;
	align-items: center;
`;

const RangeInputWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	max-width: 430px;
	margin: 0 auto 75px auto;
`;

const Rectangle = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 32px;
	color: ${ ( { theme } ) => theme.colors.fg.v1 };
	${ ( { isLarge } ) => isLarge ? 'margin-left' : 'margin-right' }: 20px;

	svg {
		width: ${ ( { isLarge } ) => isLarge ? '20px' : '12px' };
		height: auto;
		shape-rendering: crispEdges; /* prevents issues with anti-aliasing */
	}
`;

function RangeControl( { value, onChange } ) {
	return (
		<RangeInputWrapper>
			<Rectangle>
				<RectangleIcon />
			</Rectangle>
			<RangeInput
				min="1"
				max="3"
				step="1"
				value={ value }
				onChange={ ( evt ) => onChange( Number( evt.target.value ) ) }
				thumbSize={ 24 }
			/>
			<Rectangle isLarge>
				<RectangleIcon />
			</Rectangle>
		</RangeInputWrapper>
	);
}

RangeControl.propTypes = {
	value: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired,
};

function GridView() {
	const { state: { pages, currentPageIndex } } = useStory();
	const [ zoomLevel, setZoomLevel ] = useState( 2 );

	return (
		<>
			<RangeControl
				value={ zoomLevel }
				onChange={ setZoomLevel }
			/>
			<Wrapper scale={ zoomLevel }>
				{ pages.map( ( page, index ) => {
					const isCurrentPage = index === currentPageIndex;

					return (
						<DraggablePage
							key={ index }
							ariaLabel={ isCurrentPage ?
								sprintf( __( 'Page %s (current page)', 'web-stories' ), index + 1 ) :
								sprintf( __( 'Page %s', 'web-stories' ), index + 1 )
							}
							isActive={ isCurrentPage }
							pageIndex={ index }
							width={ zoomLevel * PAGE_WIDTH }
							height={ zoomLevel * PAGE_HEIGHT }
							dragIndicatorOffset={ GRID_GAP / 2 }
						/>
					);
				} ) }
			</Wrapper>
		</>
	);
}

export default GridView;
