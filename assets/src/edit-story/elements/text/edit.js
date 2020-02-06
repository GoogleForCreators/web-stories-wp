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
import { Editor, EditorState, SelectionState } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';

/**
 * WordPress dependencies
 */
import { useState, useEffect, useLayoutEffect, useRef, useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useStory, useFont } from '../../app';
import { useCanvas } from '../../components/canvas';
import { useUnits } from '../../units';
import {
	elementFillContent,
	elementWithFont,
	elementWithBackgroundColor,
	elementWithFontColor,
	elementWithStyle,
} from '../utils/css';
import StoryPropTypes from '../../types';
import { getFilteredState, getHandleKeyCommand } from './util';

const Element = styled.div`
	margin: 0;
	${ elementFillContent }
	${ elementWithFont }
	${ elementWithStyle }
	${ elementWithBackgroundColor }
	${ elementWithFontColor }

	&::after {
		content: '';
		display: block;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		border: 1px solid ${ ( { theme } ) => theme.colors.mg.v1 }70;
		pointer-events: none;
	}
`;

function TextEdit( {
	element: {
		id,
		content,
		color,
		backgroundColor,
		fontFamily,
		fontFallback,
		fontSize,
		fontWeight,
		fontStyle,
		letterSpacing,
		lineHeight,
		padding,
		textAlign,
	},
	box: {
		width,
		height,
	},
} ) {
	const { actions: { dataToEditorY } } = useUnits();
	const props = {
		color,
		backgroundColor,
		fontFamily,
		fontFallback,
		fontStyle,
		fontSize: dataToEditorY( fontSize ),
		fontWeight,
		textAlign,
		letterSpacing,
		lineHeight,
		padding,
		width,
		height,
	};
	const editorRef = useRef( null );
	const { actions: { maybeEnqueueFontStyle } } = useFont();
	const { actions: { updateElementById } } = useStory();
	const { state: { editingElementState } } = useCanvas();
	const { offset, clearContent } = editingElementState || {};
	// To clear content, we can't just use createEmpty() or even pure white-space.
	// The editor needs some content to insert the first character in,
	// so we use a non-breaking space instead and trim it on save if still present.
	const EMPTY_VALUE = '\u00A0';
	const initialState = (
		clearContent ?
			EditorState.createWithContent( stateFromHTML( EMPTY_VALUE ) ) :
			EditorState.createWithContent( stateFromHTML( content ) )
	);
	const [ editorState, setEditorState ] = useState( initialState );
	const mustAddOffset = useRef( offset ? 2 : 0 );

	// This is to allow the finalizing useEffect to *not* depend on editorState,
	// as would otherwise be a lint error.
	const lastKnownState = useRef( null );

	// This filters out illegal content (see `getFilteredState`)
	// on paste and updates state accordingly.
	// Furthermore it also sets initial selection if relevant.
	const updateEditorState = useCallback( ( newEditorState ) => {
		let filteredState = getFilteredState( newEditorState, editorState );
		if ( mustAddOffset.current ) {
			// For some reason forced selection only sticks the second time around?
			// Several other checks have been attempted here without success.
			// Optimize at your own perril!
			mustAddOffset.current--;
			const key = filteredState.getCurrentContent().getFirstBlock().getKey();
			const selectionState = new SelectionState( { anchorKey: key, anchorOffset: offset } );
			filteredState = EditorState.forceSelection( filteredState, selectionState );
		}
		lastKnownState.current = filteredState.getCurrentContent();
		setEditorState( filteredState );
	}, [ editorState, offset ] );

	// Finally update content for element on unmount.
	useEffect( () => () => {
		if ( lastKnownState.current ) {
			// Remember to trim any trailing non-breaking space.
			const properties = {
				content: stateToHTML( lastKnownState.current, { defaultBlockTag: null } )
					.replace( /&nbsp;$/, '' ),
			};
			updateElementById( { elementId: id, properties } );
		}
	}, [ id, updateElementById ] );

	// Make sure to allow the user to click in the text box while working on the text.
	const onClick = ( evt ) => {
		const editor = editorRef.current;
		// Refocus the editor if the container outside it is clicked.
		if ( ! editor.editorContainer.contains( evt.target ) ) {
			editor.focus();
		}
		evt.stopPropagation();
	};

	// Handle basic key commands such as bold, italic and underscore.
	const handleKeyCommand = getHandleKeyCommand( setEditorState );

	// Set focus when initially rendered
	useLayoutEffect( () => {
		editorRef.current.focus();
	}, [] );

	useEffect( () => {
		maybeEnqueueFontStyle( fontFamily );
	}, [ fontFamily, maybeEnqueueFontStyle ] );

	return (
		<Element { ...props } onClick={ onClick }>
			<Editor
				ref={ editorRef }
				onChange={ updateEditorState }
				editorState={ editorState }
				handleKeyCommand={ handleKeyCommand }
			/>
		</Element>
	);
}

TextEdit.propTypes = {
	element: StoryPropTypes.elements.text.isRequired,
	box: StoryPropTypes.box.isRequired,
};

export default TextEdit;
