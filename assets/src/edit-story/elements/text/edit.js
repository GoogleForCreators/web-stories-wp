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
import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from '@wordpress/element';

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
} from '../shared';
import StoryPropTypes from '../../types';
import calcRotatedResizeOffset from '../../utils/calcRotatedResizeOffset';
import hexToRGBA from '../../utils/hexToRGBA';
import { getFilteredState, getHandleKeyCommand } from './util';

// Wrapper bounds the text editor within the element bounds. The resize
// logic updates the height of this element to show the new height based
// on the content and properties.
const Wrapper = styled.div`
  ${elementFillContent}

  &::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: 1px solid ${({ theme }) => theme.colors.mg.v1}70;
    pointer-events: none;
  }
`;

// TextBox defines all text display properties and is used for measuring
// of text height. This element has an unbounded height (bottom) so that
// it can be used for height measurement.
const TextBox = styled.div`
	${elementWithFont}
	${elementWithStyle}
	${elementWithBackgroundColor}
	${elementWithFontColor}

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

function TextEdit({
  element: {
    id,
    content,
    color,
    backgroundColor,
    backgroundOpacity,
    fontFamily,
    fontFallback,
    fontSize,
    fontWeight,
    fontStyle,
    letterSpacing,
    lineHeight,
    padding,
    textAlign,
    textDecoration,
  },
  box: { x, y, height, rotationAngle },
}) {
  const {
    actions: { dataToEditorY, editorToDataX, editorToDataY },
  } = useUnits();
  const textProps = {
    color,
    backgroundColor: backgroundOpacity
      ? hexToRGBA(backgroundColor, backgroundOpacity)
      : backgroundColor,
    fontFamily,
    fontFallback,
    fontStyle,
    fontSize: dataToEditorY(fontSize),
    fontWeight,
    textAlign,
    letterSpacing,
    lineHeight,
    padding,
    textDecoration,
  };
  const wrapperRef = useRef(null);
  const textBoxRef = useRef(null);
  const editorRef = useRef(null);
  const {
    actions: { maybeEnqueueFontStyle },
  } = useFont();
  const {
    actions: { updateElementById },
  } = useStory();
  const {
    state: { editingElementState },
  } = useCanvas();
  const setProperties = useCallback(
    (properties) => updateElementById({ elementId: id, properties }),
    [id, updateElementById]
  );

  const { offset, clearContent } = editingElementState || {};
  // To clear content, we can't just use createEmpty() or even pure white-space.
  // The editor needs some content to insert the first character in,
  // so we use a non-breaking space instead and trim it on save if still present.
  const contentWithBreaks = (content || '')
    .split('\n')
    .map((s) => `<p>${s}</p>`)
    .join('');
  const EMPTY_VALUE = '\u00A0';
  const initialState = clearContent
    ? EditorState.createWithContent(stateFromHTML(EMPTY_VALUE))
    : EditorState.createWithContent(stateFromHTML(contentWithBreaks));
  const [editorState, setEditorState] = useState(initialState);
  const mustAddOffset = useRef(offset ? 2 : 0);
  const editorHeightRef = useRef(0);

  // This is to allow the finalizing useEffect to *not* depend on editorState,
  // as would otherwise be a lint error.
  const lastKnownState = useRef(null);

  // This filters out illegal content (see `getFilteredState`)
  // on paste and updates state accordingly.
  // Furthermore it also sets initial selection if relevant.
  const updateEditorState = useCallback(
    (newEditorState) => {
      const wrapper = wrapperRef.current;
      const textBox = textBoxRef.current;
      let filteredState = getFilteredState(newEditorState, editorState);
      if (mustAddOffset.current) {
        // For some reason forced selection only sticks the second time around?
        // Several other checks have been attempted here without success.
        // Optimize at your own perril!
        mustAddOffset.current--;
        const key = filteredState
          .getCurrentContent()
          .getFirstBlock()
          .getKey();
        const selectionState = new SelectionState({
          anchorKey: key,
          anchorOffset: offset,
        });
        filteredState = EditorState.forceSelection(
          filteredState,
          selectionState
        );
      }
      lastKnownState.current = filteredState.getCurrentContent();
      editorHeightRef.current = textBox.offsetHeight;
      setEditorState(filteredState);
      wrapper.style.height = `${editorHeightRef.current}px`;
    },
    [editorState, offset]
  );

  // Handle basic key commands such as bold, italic and underscore.
  const handleKeyCommand = getHandleKeyCommand(updateEditorState);

  // Make sure to allow the user to click in the text box while working on the text.
  const onClick = (evt) => {
    const editor = editorRef.current;
    // Refocus the editor if the container outside it is clicked.
    if (!editor.editorContainer.contains(evt.target)) {
      editor.focus();
    }
    evt.stopPropagation();
  };

  // Finally update content for element on unmount.
  useEffect(
    () => () => {
      const newState = lastKnownState.current;
      const newHeight = editorHeightRef.current;
      wrapperRef.current.style.height = '';
      if (newState) {
        // Remember to trim any trailing non-breaking space.
        const properties = {
          content: stateToHTML(lastKnownState.current, {
            defaultBlockTag: null,
          }).replace(/&nbsp;$/, ''),
        };
        // Recalculate the new height and offset.
        if (newHeight) {
          const [dx, dy] = calcRotatedResizeOffset(
            rotationAngle,
            0,
            0,
            0,
            newHeight - height
          );
          properties.height = editorToDataY(newHeight);
          properties.x = editorToDataX(x + dx);
          properties.y = editorToDataY(y + dy);
        }
        setProperties(properties);
      }
    },
    [setProperties, x, y, height, rotationAngle, editorToDataY, editorToDataX]
  );

  // Set focus when initially rendered
  useLayoutEffect(() => {
    editorRef.current.focus();
  }, []);

  useEffect(() => {
    maybeEnqueueFontStyle(fontFamily);
  }, [fontFamily, maybeEnqueueFontStyle]);

  return (
    <Wrapper ref={wrapperRef} onClick={onClick}>
      <TextBox ref={textBoxRef} {...textProps}>
        <Editor
          ref={editorRef}
          onChange={updateEditorState}
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
        />
      </TextBox>
    </Wrapper>
  );
}

TextEdit.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default TextEdit;
