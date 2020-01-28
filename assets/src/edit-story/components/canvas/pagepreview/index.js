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
 * Internal dependencies
 */
import useStory from '../../../app/story/useStory';
import { getDefinitionForType } from '../../../elements';
import { PAGE_WIDTH } from '../../../constants';

const PAGE_THUMB_OUTLINE = 2;

const Page = styled.button`
	padding: 0;
	margin: 0;
	border: none;
	outline: ${ PAGE_THUMB_OUTLINE }px solid ${ ( { isActive, theme } ) => isActive ? theme.colors.selection : theme.colors.bg.v1 };
	height: ${ ( { height } ) => height }px;
	width: ${ ( { width } ) => width }px;
	background-color: ${ ( { theme } ) => theme.colors.mg.v1 };
	flex: none;
	transition: width .2s ease, height .2s ease;

	&:focus,
	&:hover {
		outline: ${ PAGE_THUMB_OUTLINE }px solid ${ ( { theme } ) => theme.colors.selection };
	}
`;

const PreviewWrapper = styled.div`
	height: 100%;
	position: relative;
	overflow: hidden;
`;

function PagePreview( { index, forwardedRef, ...props } ) {
	const { state: { pages } } = useStory();
	const page = pages[ index ];
	const { width } = props;
	// This is used for font size only, the rest is responsive.
	const sizeMultiplier = ( width - PAGE_THUMB_OUTLINE ) / PAGE_WIDTH;
	return (
		<Page { ...props } ref={ forwardedRef } >
			<PreviewWrapper>
				{ page.elements.map( ( { type, ...rest } ) => {
					const { id: elId } = rest;
					const isBackground = page.backgroundElementId === elId;
					// eslint-disable-next-line @wordpress/no-unused-vars-before-return
					const { Preview } = getDefinitionForType( type );
					return <Preview isBackground={ isBackground } previewSizeMultiplier={ sizeMultiplier } key={ 'element-' + elId } { ...rest } />;
				} ) }
			</PreviewWrapper>
		</Page>
	);
}

PagePreview.propTypes = {
	index: PropTypes.number.isRequired,
	forwardedRef: PropTypes.func,
	width: PropTypes.number.isRequired,
};

export default PagePreview;
