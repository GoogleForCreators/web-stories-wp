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
import { useEffect, useLayoutEffect, useRef, useCallback } from 'react';

/**
 * Internal dependencies
 */
import { useStory, useFont } from '../../app';
import RichTextEditor from '../../components/richText/editor';
import { useUnits } from '../../units';
import {
  elementFillContent,
  elementWithFont,
  elementWithBackgroundColor,
  elementWithTextParagraphStyle,
} from '../shared';
import StoryPropTypes from '../../types';
import { BACKGROUND_TEXT_MODE } from '../../constants';
import useUnmount from '../../utils/useUnmount';
import createSolid from '../../utils/createSolid';
import calcRotatedResizeOffset from '../../utils/calcRotatedResizeOffset';
import { generateParagraphTextStyle, getHighlightLineheight } from './util';

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

  opacity: ${({ opacity }) => (opacity ? opacity / 100 : null)};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

function TextEdit({
  element: {
    id,
    content,
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
    font,
    backgroundColor,
    opacity,
    ...(backgroundTextMode === BACKGROUND_TEXT_MODE.HIGHLIGHT && {
      lineHeight: getHighlightLineheight(
        rest.lineHeight,
        dataToEditorX(rest.padding?.vertical || 0)
      ),
      backgroundColor: createSolid(255, 255, 255),
    }),
    ...(backgroundTextMode === BACKGROUND_TEXT_MODE.NONE && {
      backgroundColor: null,
    }),
  };
  const {
    actions: { maybeEnqueueFontStyle },
  } = useFont();
  const {
    actions: { updateElementById },
  } = useStory();

  const setProperties = useCallback(
    (properties) => updateElementById({ elementId: id, properties }),
    [id, updateElementById]
  );

  const wrapperRef = useRef(null);
  const textBoxRef = useRef(null);
  const editorRef = useRef(null);
  const contentRef = useRef();
  const editorHeightRef = useRef(0);

  // Make sure to allow the user to click in the text box while working on the text.
  const onClick = (evt) => {
    const editor = editorRef.current;
    // Refocus the editor if the container outside it is clicked.
    if (!editor.getNode().contains(evt.target)) {
      editor.focus();
    }
    evt.stopPropagation();
  };

  // Set focus when initially rendered.
  useLayoutEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  const updateContent = useCallback(() => {
    const newHeight = editorHeightRef.current;
    wrapperRef.current.style.height = '';
    if (contentRef.current) {
      // Remove manual line breaks and remember to trim any trailing non-breaking space.
      const properties = { content: contentRef.current };
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

  // Update content for element on unmount.
  useUnmount(updateContent);

  // A function to remeasure height
  const handleResize = useCallback(() => {
    const wrapper = wrapperRef.current;
    const textBox = textBoxRef.current;
    editorHeightRef.current = textBox.offsetHeight;
    wrapper.style.height = `${editorHeightRef.current}px`;
  }, []);
  // Invoke on each content update.
  const handleUpdate = useCallback(
    (newContent) => {
      contentRef.current = newContent;
      handleResize();
    },
    [handleResize]
  );
  // Also invoke if the raw element height ever changes
  useEffect(handleResize, [elementHeight]);

  useEffect(() => {
    maybeEnqueueFontStyle(font);
  }, [font, maybeEnqueueFontStyle]);

  return (
    <Wrapper ref={wrapperRef} onClick={onClick}>
      <TextBox ref={textBoxRef} {...textProps}>
        <RichTextEditor
          ref={editorRef}
          content={content}
          onChange={handleUpdate}
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
