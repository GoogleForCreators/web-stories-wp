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
import ResizeObserver from 'resize-observer-polyfill';

/**
 * WordPress dependencies
 */
import { useLayoutEffect, useRef, useState, useCallback } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { LeftArrow, RightArrow, GridView as GridViewButton } from '../../button';
import Modal from '../../modal';
import GridView from '../gridview';
import DraggablePage from '../draggablePage';

// @todo: Make responsive. Blocked on the header reimplementation and
// responsive "page" size.
const PAGE_HEIGHT = 50;
const PAGE_WIDTH = PAGE_HEIGHT * 9 / 16;

const Wrapper = styled.div`
	position: relative;
	display: grid;
	grid: "left-navigation carousel right-navigation" auto / 53px 1fr 53px;
	background-color: ${ ( { theme } ) => theme.colors.bg.v1 };
	color:  ${ ( { theme } ) => theme.colors.fg.v1 };
	width: 100%;
	height: 100%;
`;

const Area = styled.div`
	grid-area: ${ ( { area } ) => area };
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 16px 0 24px;
`;

const List = styled( Area )`
	flex-direction: row;
	align-items: flex-start;
	justify-content: ${ ( { hasHorizontalOverflow } ) => hasHorizontalOverflow ? 'flex-start' : 'center' };
	overflow-x: ${ ( { hasHorizontalOverflow } ) => hasHorizontalOverflow ? 'scroll' : 'hidden' };
`;

const StyledGridViewButton = styled( GridViewButton )`
	position: absolute;
	bottom: 24px;
`;

function Carousel() {
	const { state: { pages, currentPageIndex, currentPageId }, actions: { setCurrentPage } } = useStory();
	const [ hasHorizontalOverflow, setHasHorizontalOverflow ] = useState( false );
	const [ scrollPercentage, setScrollPercentage ] = useState( 0 );
	const [ isGridViewOpen, setIsGridViewOpen ] = useState( false );
	const listRef = useRef();
	const pageRefs = useRef( [] );

	const openModal = useCallback( () => setIsGridViewOpen( true ), [ setIsGridViewOpen ] );
	const closeModal = useCallback( () => setIsGridViewOpen( false ), [ setIsGridViewOpen ] );

	useLayoutEffect( () => {
		const observer = new ResizeObserver( ( entries ) => {
			for ( const entry of entries ) {
				const offsetWidth = entry.contentBoxSize ? entry.contentBoxSize.inlineSize : entry.contentRect.width;
				setHasHorizontalOverflow( Math.ceil( listRef.current.scrollWidth ) > Math.ceil( offsetWidth ) );

				const max = listRef.current.scrollWidth - offsetWidth;
				setScrollPercentage( listRef.current.scrollLeft / max );
			}
		} );

		observer.observe( listRef.current );

		return () => observer.disconnect();
	}, [ pages.length ] );

	useLayoutEffect( () => {
		if ( hasHorizontalOverflow ) {
			const currentPageRef = pageRefs.current[ currentPageId ];

			if ( ! currentPageRef || ! currentPageRef.scrollIntoView ) {
				return;
			}

			currentPageRef.scrollIntoView( {
				inline: 'center',
				behavior: 'smooth',
			} );
		}
	}, [ currentPageId, hasHorizontalOverflow, pageRefs ] );

	useLayoutEffect( () => {
		const listElement = listRef.current;

		const handleScroll = () => {
			const max = listElement.scrollWidth - listElement.offsetWidth;
			setScrollPercentage( listElement.scrollLeft / max );
		};

		listElement.addEventListener( 'scroll', handleScroll, { passive: true } );

		return () => {
			listElement.removeEventListener( 'scroll', handleScroll );
		};
	}, [ hasHorizontalOverflow ] );

	const handleClickPage = ( page ) => () => setCurrentPage( { pageId: page.id } );

	const scrollBy = useCallback( ( offset ) => {
		if ( ! listRef.current.scrollBy ) {
			listRef.current.scrollLeft += offset;
			return;
		}

		listRef.current.scrollBy( {
			left: offset,
			behavior: 'smooth',
		} );
	}, [ listRef ] );

	const isAtBeginningOfList = 0 === scrollPercentage;
	const isAtEndOfList = 1 === scrollPercentage;

	return (
		<>
			<Wrapper>
				<Area area="left-navigation">
					<LeftArrow
						isHidden={ ! hasHorizontalOverflow || isAtBeginningOfList }
						onClick={ () => scrollBy( -( 2 * PAGE_WIDTH ) ) }
						width="24"
						height="24"
						aria-label={ __( 'Scroll Left', 'web-stories' ) }
					/>
				</Area>
				<List area="carousel" ref={ listRef } hasHorizontalOverflow={ hasHorizontalOverflow }>
					{ pages.map( ( page, index ) => {
						const isCurrentPage = index === currentPageIndex;

						return (
							<DraggablePage
								key={ index }
								onClick={ handleClickPage( page ) }
								ariaLabel={ isCurrentPage ?
									sprintf( __( 'Page %s (current page)', 'web-stories' ), index + 1 ) :
									sprintf( __( 'Go to page %s', 'web-stories' ), index + 1 )
								}
								isActive={ isCurrentPage }
								pageIndex={ index }
								ref={ ( el ) => {
									pageRefs.current[ page.id ] = el;
								} }
								width={ PAGE_WIDTH }
								height={ PAGE_HEIGHT }
							/>
						);
					} ) }
				</List>
				<Area area="right-navigation">
					<RightArrow
						isHidden={ ! hasHorizontalOverflow || isAtEndOfList }
						onClick={ () => scrollBy( ( 2 * PAGE_WIDTH ) ) }
						width="24"
						height="24"
						aria-label={ __( 'Scroll Right', 'web-stories' ) }
					/>
					<StyledGridViewButton
						width="24"
						height="24"
						onClick={ openModal }
						aria-label={ __( 'Grid View', 'web-stories' ) }
					/>
				</Area>
			</Wrapper>
			<Modal
				isOpen={ isGridViewOpen }
				onRequestClose={ closeModal }
				contentLabel={ __( 'Grid View', 'web-stories' ) }
				closeButtonLabel={ __( 'Back', 'web-stories' ) }
			>
				<GridView />
			</Modal>
		</>
	);
}

export default Carousel;
