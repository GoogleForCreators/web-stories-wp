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
  useUnmount,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { generatePatternStyles } from '@googleforcreators/patterns';
import { useUnits, calcRotatedResizeOffset } from '@googleforcreators/units';
import {
  useTransformHandler,
  useTransform,
} from '@googleforcreators/transform';
import {
  RichTextEditor,
  getHTMLInfo,
  useRichText,
} from '@googleforcreators/rich-text';
import { stripHTML } from '@googleforcreators/dom';
import { BACKGROUND_TEXT_MODE } from '@googleforcreators/design-system';
import {
  getBorderPositionCSS,
  shouldDisplayBorder,
} from '@googleforcreators/masks';
import { StoryPropTypes } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import {
  elementFillContent,
  elementWithFont,
  elementWithTextParagraphStyle,
  elementWithBackgroundColor,
  elementWithBorder,
  elementWithHighlightBorderRadius,
} from '../shared';
import useCSSVarColorTransformHandler from '../shared/useCSSVarColorTransformHandler';
import useColorTransformHandler from '../shared/useColorTransformHandler';
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

  --faux-selection-color: inherit;

  span {
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

const TextBoxPadded = styled(TextBox)(({ verticalPadding }) => ({
  width: `calc(100% - ${verticalPadding}px)`,
}));

const EditTextBox = styled(TextBox)(
  ({ hasHighlightBackgroundTextMode }) =>
    hasHighlightBackgroundTextMode && {
      paddingTop: 0,
      paddingBottom: 0,
    }
);

const Highlight = styled.span`
  ${elementWithHighlightBorderRadius}
  ${({ highlightColor }) => generatePatternStyles(highlightColor)};
  color: transparent !important;
  * {
    color: transparent !important;
  }
  padding: ${({ padding }) => padding};
  width: ${({ verticalPadding }) => `calc(100% - ${verticalPadding}px)`};
`;

const OutsideBorder = styled.div`
  ${elementWithBorder}
  ${({ border }) => border && getBorderPositionCSS(border)}
  overflow: hidden;
`;

function TextEdit({
  element,
  box: { x, y, height, rotationAngle },
  editWrapper,
  onResize,
  updateElementById,
  maybeEnqueueFontStyle,
}) {
  const {
    id,
    content,
    backgroundColor,
    backgroundTextMode,
    border,
    borderRadius,
    opacity,
    height: elementHeight,
    ...rest
  } = element;
  const { font, width: elementWidth } = rest;
  const fontFaceSetConfigs = useMemo(() => {
    const htmlInfo = getHTMLInfo(content);
    return {
      fontStyle: htmlInfo.isItalic ? 'italic' : 'normal',
      fontWeight: htmlInfo.fontWeight,
      content: stripHTML(content),
    };
  }, [content]);

  const { dataToEditorX, dataToEditorY, editorToDataX, editorToDataY } =
    useUnits(
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
      (styleX) => `${dataToEditorX(styleX)}px`,
      (styleY) => `${dataToEditorY(styleY)}px`,
      dataToEditorY,
      element
    ),
    font,
    element,
    backgroundColor,
    opacity,
    verticalPadding: dataToEditorX(rest.padding?.vertical || 0),
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

  const { padding: _, ...highlightTextProps } = textProps;

  const { isAnythingTransforming } = useTransform((state) => ({
    isAnythingTransforming: state.state.isAnythingTransforming,
  }));

  const setProperties = useCallback(
    (properties) => updateElementById({ elementId: id, properties }),
    [id, updateElementById]
  );

  const wrapperRef = useRef(null);
  const highlightRef = useRef(null);
  const highlightBgRef = useRef(null);
  const textBoxRef = useRef(null);
  const editorRef = useRef(null);
  const boxRef = useRef();
  const contentRef = useRef();
  const editorHeightRef = useRef(0);
  const outsideBorderRef = useRef(null);

  // x, y, height, rotationAngle changes should not update the content while in edit mode.
  // updateContent should be only called on unmount.
  useEffect(() => {
    boxRef.current = { x, y, height, rotationAngle };
  }, [x, y, height, rotationAngle]);

  // Make sure to allow the user to click in the text box while working on the text.
  const onClick = (evt) => {
    const editor = editorRef.current;
    editor.focus();
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
    if (wrapperRef.current) {
      wrapperRef.current.style.height = '';
    }
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

  const hasHighlightBackgroundTextMode =
    backgroundTextMode === BACKGROUND_TEXT_MODE.HIGHLIGHT;

  // For instant color change on selection.
  useCSSVarColorTransformHandler({
    id,
    targetRef: wrapperRef,
    cssVar: '--faux-selection-color',
    expectedStyle: 'color',
  });

  const backgroundRef = hasHighlightBackgroundTextMode
    ? highlightBgRef
    : wrapperRef;
  useColorTransformHandler({
    id,
    targetRef: backgroundRef,
    expectedStyle: 'background',
  });

  // Inner and center color are handled separately, add transform for outside border if relevant.
  useColorTransformHandler({
    id,
    targetRef: shouldDisplayBorder(element) ? outsideBorderRef : null,
    expectedStyle: 'border-color',
  });

  const {
    state: { editorState },
    actions: { getContentFromState },
  } = useRichText();

  const editorContent = editorState && getContentFromState(editorState);
  const wrapperBackgroundColor =
    backgroundTextMode === BACKGROUND_TEXT_MODE.FILL && backgroundColor;

  const wrapperProps = {
    backgroundColor: wrapperBackgroundColor,
  };

  return (
    <OutsideBorder
      ref={outsideBorderRef}
      border={border}
      borderRadius={borderRadius}
      width={elementWidth}
      height={elementHeight}
    >
      {/* eslint-disable-next-line styled-components-a11y/click-events-have-key-events, styled-components-a11y/no-static-element-interactions -- Needed here to ensure the editor keeps focus, e.g. after setting inline colour. */}
      <Wrapper
        ref={wrapperRef}
        onClick={onClick}
        data-testid="textEditor"
        {...wrapperProps}
      >
        {editorContent && hasHighlightBackgroundTextMode && (
          <TextBoxPadded ref={highlightRef} {...highlightTextProps}>
            <Highlight
              ref={highlightBgRef}
              borderRadius={borderRadius}
              dataToEditorY={dataToEditorY}
              dangerouslySetInnerHTML={{ __html: editorContent }}
              {...textProps}
            />
          </TextBoxPadded>
        )}
        <EditTextBox
          hasHighlightBackgroundTextMode={hasHighlightBackgroundTextMode}
          className="syncMargin"
          ref={textBoxRef}
          {...textProps}
        >
          <RichTextEditor
            ref={editorRef}
            content={content}
            onChange={handleUpdate}
          />
        </EditTextBox>
      </Wrapper>
    </OutsideBorder>
  );
}

TextEdit.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
  box: StoryPropTypes.box.isRequired,
  onResize: PropTypes.func,
  editWrapper: PropTypes.object,
  updateElementById: PropTypes.func,
  maybeEnqueueFontStyle: PropTypes.func,
};

export default TextEdit;
