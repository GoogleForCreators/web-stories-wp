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
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useStory, useFont, useTransform } from '../../app';
import RichTextEditor from '../../components/richText/editor';
import { getHTMLInfo } from '../../components/richText/htmlManipulation';
import { useUnits } from '../../units';
import {
  elementFillContent,
  elementWithFont,
  elementWithTextParagraphStyle,
  elementWithBackgroundColor,
} from '../shared';
import StoryPropTypes from '../../types';
import { BACKGROUND_TEXT_MODE } from '../../constants';
import useUnmount from '../../utils/useUnmount';
import stripHTML from '../../utils/stripHTML';
import calcRotatedResizeOffset from '../../utils/calcRotatedResizeOffset';
import generatePatternStyles from '../../utils/generatePatternStyles';
import useRichText from '../../components/richText/useRichText';
import { useTransformHandler } from '../../components/transform';
import {
  calcFontMetrics,
  generateParagraphTextStyle,
  getHighlightLineheight,
} from './util';

// Wrapper bounds the text editor within the element bounds. The resize
// logic updates the height of this element to show the new height based
// on the content and properties.
const Wrapper = styled.div`
  ${elementFillContent}
  ${elementWithBackgroundColor}

  span[data-text="true"] {
    padding: ${({ textPadding }) => textPadding};
  }
  span {
    box-decoration-break: clone;
    box-decoration-break: clone;
  }
`;

// TextBox defines all text display properties and is used for measuring
// of text height. This element has an unbounded height (bottom) so that
// it can be used for height measurement.
const TextBox = styled.div`
  ${elementWithFont}
  ${elementWithTextParagraphStyle}

  opacity: ${({ opacity }) =>
    typeof opacity !== 'undefined' ? opacity / 100 : null};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

const Highlight = styled.span`
  ${({ highlightColor }) => generatePatternStyles(highlightColor)};
  color: transparent !important;
  * {
    color: transparent !important;
  }
  padding: ${({ padding }) => padding};
`;

function TextEdit({
  element,
  box: { x, y, height, rotationAngle },
  editWrapper,
  onResize,
}) {
  const {
    id,
    content,
    backgroundColor,
    backgroundTextMode,
    opacity,
    height: elementHeight,
    ...rest
  } = element;
  const { font } = rest;
  const fontFaceSetConfigs = useMemo(() => {
    const htmlInfo = getHTMLInfo(content);
    return {
      fontStyle: htmlInfo.isItalic ? 'italic' : 'normal',
      fontWeight: htmlInfo.fontWeight,
      content: stripHTML(content),
    };
  }, [content]);

  const {
    dataToEditorX,
    dataToEditorY,
    editorToDataX,
    editorToDataY,
  } = useUnits(
    ({
      actions: { dataToEditorX, dataToEditorY, editorToDataX, editorToDataY },
    }) => ({
      dataToEditorX,
      dataToEditorY,
      editorToDataX,
      editorToDataY,
    })
  );

  const textProps = {
    ...generateParagraphTextStyle(
      rest,
      dataToEditorX,
      dataToEditorY,
      undefined,
      element
    ),
    font,
    element,
    backgroundColor,
    opacity,
    ...(backgroundTextMode === BACKGROUND_TEXT_MODE.HIGHLIGHT && {
      lineHeight: getHighlightLineheight(
        rest.lineHeight,
        dataToEditorX(rest.padding?.vertical || 0)
      ),
      backgroundColor: null,
      highlightColor: backgroundColor,
    }),
    ...(backgroundTextMode === BACKGROUND_TEXT_MODE.NONE && {
      backgroundColor: null,
    }),
  };
  const {
    actions: { maybeEnqueueFontStyle },
  } = useFont();
  const { updateElementById } = useStory((state) => ({
    updateElementById: state.actions.updateElementById,
  }));

  const { isAnythingTransforming } = useTransform((state) => ({
    isAnythingTransforming: state.state.isAnythingTransforming,
  }));

  const setProperties = useCallback(
    (properties) => updateElementById({ elementId: id, properties }),
    [id, updateElementById]
  );

  const wrapperRef = useRef(null);
  const highlightRef = useRef(null);
  const textBoxRef = useRef(null);
  const editorRef = useRef(null);
  const boxRef = useRef();
  const contentRef = useRef();
  const editorHeightRef = useRef(0);

  // x, y, height, rotationAngle changes should not update the content while in edit mode.
  // updateContent should be only called on unmount.
  useEffect(() => {
    boxRef.current = { x, y, height, rotationAngle };
  }, [x, y, height, rotationAngle]);

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
          boxRef.current.rotationAngle,
          0,
          0,
          0,
          newHeight - boxRef.current.height
        );
        properties.height = editorToDataY(newHeight);
        properties.x = editorToDataX(boxRef.current.x + dx);
        properties.y = editorToDataY(boxRef.current.y + dy);
      }
      setProperties(properties);
    }
  }, [editorToDataX, editorToDataY, setProperties]);

  // Update content for element on unmount.
  useUnmount(updateContent);

  useEffect(() => {
    // If there are any moveable actions happening, let's update the content
    // Otherwise the font size and measures will not be correct.
    if (isAnythingTransforming) {
      updateContent();
    }
  }, [isAnythingTransforming, updateContent]);

  // A function to remeasure height
  const handleResize = useCallback(() => {
    const wrapper = wrapperRef.current;
    const textBox = textBoxRef.current;
    const { marginOffset } = calcFontMetrics(element);
    editorHeightRef.current =
      textBox.offsetHeight - dataToEditorY(marginOffset);
    wrapper.style.height = `${editorHeightRef.current}px`;
    textBox.style.margin = '';
    if (editWrapper) {
      const [dx, dy] = calcRotatedResizeOffset(
        boxRef.current.rotationAngle,
        0,
        0,
        0,
        editorHeightRef.current - boxRef.current.height
      );
      editWrapper.style.height = `${editorHeightRef.current}px`;
      editWrapper.style.left = `${boxRef.current.x + dx}px`;
      editWrapper.style.top = `${boxRef.current.y + dy}px`;
      onResize && onResize();
    }
  }, [dataToEditorY, editWrapper, element, onResize]);
  // Invoke on each content update.
  const handleUpdate = useCallback(
    (newContent) => {
      contentRef.current = newContent;
      handleResize();
    },
    [handleResize]
  );
  // Also invoke if the raw element height ever changes
  useEffect(handleResize, [elementHeight, handleResize]);

  useEffect(() => {
    maybeEnqueueFontStyle([
      {
        ...fontFaceSetConfigs,
        font,
      },
    ]);
  }, [font, fontFaceSetConfigs, maybeEnqueueFontStyle]);

  useTransformHandler(id, (transform) => {
    const target = textBoxRef.current;
    const wrapper = wrapperRef.current;
    const highlight = highlightRef.current;
    const updatedFontSize = transform?.updates?.fontSize;
    target.style.fontSize = updatedFontSize
      ? `${dataToEditorY(updatedFontSize)}px`
      : '';
    if (highlight) {
      const updatedMargin = transform?.updates?.marginOffset;
      highlight.style.fontSize = target.style.fontSize;
      highlight.style.margin = `${dataToEditorY(-updatedMargin) / 2}px 0`;
      target.style.margin = `${dataToEditorY(-updatedMargin) / 2}px 0`;
    }

    if (transform === null) {
      wrapper.style.width = '';
      wrapper.style.height = '';
    } else {
      const { resize } = transform;
      if (resize && resize[0] !== 0 && resize[1] !== 0) {
        wrapper.style.width = `${resize[0]}px`;
        wrapper.style.height = `${resize[1]}px`;
      }
    }
  });

  const {
    state: { editorState },
    actions: { getContentFromState },
  } = useRichText();

  const editorContent = editorState && getContentFromState(editorState);
  const wrapperBackgroundColor =
    backgroundTextMode === BACKGROUND_TEXT_MODE.FILL && backgroundColor;

  return (
    <Wrapper
      ref={wrapperRef}
      onClick={onClick}
      data-testid="textEditor"
      backgroundColor={wrapperBackgroundColor}
      textPadding={textProps.padding}
    >
      {editorContent && backgroundTextMode === BACKGROUND_TEXT_MODE.HIGHLIGHT && (
        <TextBox ref={highlightRef} {...textProps} padding={null}>
          <Highlight
            dangerouslySetInnerHTML={{ __html: editorContent }}
            {...textProps}
          />
        </TextBox>
      )}
      <TextBox
        className="syncMargin"
        ref={textBoxRef}
        {...textProps}
        padding={null}
      >
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
  onResize: PropTypes.func,
  editWrapper: PropTypes.object,
};

export default TextEdit;
