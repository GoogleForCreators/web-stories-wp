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
import { Editor, EditorState } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';
import {
  useMemo,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';

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
  elementWithTextParagraphStyle,
} from '../shared';
import StoryPropTypes from '../../types';
import { BACKGROUND_TEXT_MODE } from '../../constants';
import useFocusOut from '../../utils/useFocusOut';
import useUnmount from '../../utils/useUnmount';
import createSolid from '../../utils/createSolid';
import calcRotatedResizeOffset from '../../utils/calcRotatedResizeOffset';
import {
  draftMarkupToContent,
  getFilteredState,
  getHandleKeyCommand,
  getSelectionForAll,
  getSelectionForOffset,
  generateParagraphTextStyle,
  getHighlightLineheight,
} from './util';

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
  ${elementWithTextParagraphStyle}
  ${elementWithBackgroundColor}
  ${elementWithFontColor}

  opacity: ${({ opacity }) => (opacity ? opacity / 100 : null)};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

function TextEdit({
  element: {
    id,
    bold,
    content,
    color,
    backgroundColor,
    backgroundTextMode,
    opacity,
    height: elementHeight,
    ...rest
  },
  box: { x, y, height, rotationAngle },
}) {
  const { font } = rest;

  const {
    actions: { dataToEditorX, dataToEditorY, editorToDataX, editorToDataY },
  } = useUnits();
  const textProps = {
    ...generateParagraphTextStyle(rest, dataToEditorX, dataToEditorY),
    color,
    font,
    backgroundColor,
    opacity,
    ...(backgroundTextMode === BACKGROUND_TEXT_MODE.HIGHLIGHT && {
      lineHeight: getHighlightLineheight(
        rest.lineHeight,
        dataToEditorX(rest.padding?.vertical || 0)
      ),
      color: createSolid(0, 0, 0),
      backgroundColor: createSolid(255, 255, 255),
    }),
    ...(backgroundTextMode === BACKGROUND_TEXT_MODE.NONE && {
      backgroundColor: null,
    }),
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

  const { offset, clearContent, selectAll } = editingElementState || {};
  const initialState = useMemo(() => {
    const contentWithBreaks = (content || '')
      // Re-insert manual line-breaks for empty lines
      .replace(/\n(?=\n)/g, '\n<br />')
      .split('\n')
      .map((s) => {
        return `<p>${draftMarkupToContent(s, bold)}</p>`;
      })
      .join('');
    let state = EditorState.createWithContent(stateFromHTML(contentWithBreaks));
    if (clearContent) {
      // If `clearContent` is specified, push the update to clear content so that
      // it can be undone.
      state = EditorState.push(state, stateFromHTML(''), 'remove-range');
    }
    let selection;
    if (selectAll) {
      selection = getSelectionForAll(state.getCurrentContent());
    } else if (offset) {
      selection = getSelectionForOffset(state.getCurrentContent(), offset);
    }
    if (selection) {
      state = EditorState.forceSelection(state, selection);
    }
    return state;
  }, [content, clearContent, selectAll, offset, bold]);
  const [editorState, setEditorState] = useState(initialState);
  const editorHeightRef = useRef(0);

  // This is to allow the finalizing useEffect to *not* depend on editorState,
  // as would otherwise be a lint error.
  const lastKnownState = useRef(null);

  // This filters out illegal content (see `getFilteredState`)
  // on paste and updates state accordingly.
  // Furthermore it also sets initial selection if relevant.
  const updateEditorState = useCallback(
    (newEditorState) => {
      const filteredState = getFilteredState(newEditorState, editorState);
      lastKnownState.current = filteredState.getCurrentContent();
      setEditorState(filteredState);
    },
    [editorState]
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

  const updateContent = useCallback(() => {
    const newState = lastKnownState.current;
    const newHeight = editorHeightRef.current;
    wrapperRef.current.style.height = '';
    if (newState) {
      // Remove manual line breaks and remember to trim any trailing non-breaking space.
      const properties = {
        content: stateToHTML(lastKnownState.current, {
          defaultBlockTag: null,
        })
          .replace(/<br ?\/?>/g, '')
          .replace(/&nbsp;$/, ''),
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
  }, [
    editorToDataX,
    editorToDataY,
    height,
    rotationAngle,
    setProperties,
    x,
    y,
  ]);

  // Update content for element on focus out.
  useFocusOut(textBoxRef, updateContent, [updateContent]);

  // Update content for element on unmount.
  useUnmount(updateContent);

  // Set focus when initially rendered.
  useLayoutEffect(() => {
    editorRef.current.focus();
  }, []);

  // Remeasure the height on each content update.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const textBox = textBoxRef.current;
    editorHeightRef.current = textBox.offsetHeight;
    wrapper.style.height = `${editorHeightRef.current}px`;
  }, [editorState, elementHeight]);

  useEffect(() => {
    maybeEnqueueFontStyle(font);
  }, [font, maybeEnqueueFontStyle]);

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
