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
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { PAGE_NAV_BUTTON_WIDTH } from '../../../constants';
import { useStory } from '../../../app';
import { LeftArrow, RightArrow } from '../../button';

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: ${ ( { isNext } ) => isNext ? 'flex-end' : 'flex-start' };
	height: 100%;
	color:  ${ ( { theme } ) => theme.colors.fg.v1 };
`;

function PageNav( { isNext } ) {
	const { state: { pages, currentPageIndex }, actions: { setCurrentPage } } = useStory();
	const handleClick = useCallback( () => {
		const newPage = isNext ? pages[ currentPageIndex + 1 ] : pages[ currentPageIndex - 1 ];
		if ( newPage ) {
			setCurrentPage( { pageId: newPage.id } );
		}
	}, [ setCurrentPage, currentPageIndex, isNext, pages ] );
	const displayNav = ( isNext && currentPageIndex < pages.length - 1 ) || ( ! isNext && currentPageIndex > 0 );
	const buttonProps = {
		isDisabled: ! displayNav,
		isHidden: ! displayNav,
		'aria-label': isNext ? __( 'Next Page', 'web-stories' ) : __( 'Previous Page', 'web-stories' ),
		onClick: handleClick,
		width: PAGE_NAV_BUTTON_WIDTH,
		height: 40,
	};
	return (
		<Wrapper isNext={ isNext }>
			{ isNext ? <RightArrow { ...buttonProps } /> : <LeftArrow { ...buttonProps } /> }
		</Wrapper>
	);
}

PageNav.propTypes = {
	isNext: PropTypes.bool,
};

PageNav.defaultProps = {
	isNext: true,
};

export default PageNav;
