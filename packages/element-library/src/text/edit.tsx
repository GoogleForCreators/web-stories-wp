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
import { generatePatternStyles, type Solid } from '@googleforcreators/patterns';
import {
  useUnits,
  calcRotatedResizeOffset,
  type ElementBox,
} from '@googleforcreators/units';
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
import { shouldDisplayBorder } from '@googleforcreators/masks';
import {
  BACKGROUND_TEXT_MODE,
  type Border,
  type FontFamily,
  type FontStyle,
  type FontWeight,
  type TextElement,
  type TextElementFont,
  type EditProps,
} from '@googleforcreators/elements';
import type { MouseEventHandler } from 'react';

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
  getHighlightLineHeight,
} from './util';

interface WrapperProps {
  element: TextElement;
  backgroundColor: Solid | null;
  verticalPadding: number;
  whiteSpace?: string;
  overflowWrap?: string;
  wordBreak?: string;
  margin?: string;
  fontFamily?: FontFamily;
  fontSize: number;
  font: TextElementFont;
  lineHeight?: number | string;
  textAlign?: string;
  padding?: number | string;
  opacity?: number;
  highlightColor?: Solid;
}

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
const TextBox = styled.div<WrapperProps>`
  ${elementWithFont}
  ${elementWithTextParagraphStyle}
  opacity: ${({ opacity }) =>
    typeof opacity !== 'undefined' ? opacity / 100 : null};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

const TextBoxPadded = styled(TextBox)<{ verticalPadding: number }>(
  ({ verticalPadding }) => ({
    width: `calc(100% - ${verticalPadding}px)`,
  })
);

const EditTextBox = styled(TextBox)<{
  $hasHighlightBackgroundTextMode: boolean;
}>(
  ({ $hasHighlightBackgroundTextMode }) =>
    $hasHighlightBackgroundTextMode && {
      paddingTop: 0,
      paddingBottom: 0,
    }
);

const Highlight = styled.span<
  WrapperProps & { dataToEditorY: (prop: number) => string | number }
>`
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
  overflow: hidden;
  ${elementWithBorder}
`;

function TextEdit({
  element,
  box: { x, y, width, height, rotationAngle },
  editWrapper,
  onResize,
  updateElementById,
  deleteSelectedElements,
  maybeEnqueueFontStyle,
}: EditProps<TextElement>) {
  const {
    id,
    content,
    backgroundColor,
    backgroundTextMode,
    border = {},
    borderRadius,
    opacity,
    height: elementHeight,
    ...rest
  } = element;
  const { font } = rest;
  const { top = 0, bottom = 0, left = 0, right = 0 } = (border || {}) as Border;
  const fontFaceSetConfigs = useMemo(() => {
    const htmlInfo = getHTMLInfo(content);
    return {
      fontStyle: htmlInfo.isItalic ? 'italic' : ('normal' as FontStyle),
      fontWeight: htmlInfo.fontWeight as FontWeight,
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
      lineHeight: getHighlightLineHeight(
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
    (properties: Partial<TextElement>) =>
      updateElementById({ elementId: id, properties }),
    [id, updateElementById]
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const highlightBgRef = useRef<HTMLDivElement>(null);
  const textBoxRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const boxRef =
    useRef<Pick<ElementBox, 'x' | 'y' | 'height' | 'rotationAngle'>>();
  const contentRef = useRef<string | null>();
  const editorHeightRef = useRef<number>(0);
  const outsideBorderRef = useRef<HTMLDivElement>(null);

  // x, y, height, rotationAngle changes should not update the content while in edit mode.
  // updateContent should be only called on unmount.
  useEffect(() => {
    boxRef.current = { x, y, height, rotationAngle };
  }, [x, y, height, rotationAngle]);

  // Make sure to allow the user to click in the text box while working on the text.
  const onClick: MouseEventHandler<HTMLDivElement> = (evt) => {
    const editor = editorRef.current;
    editor?.focus();
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
      const properties: Partial<TextElement> = { content: contentRef.current };
      // Recalculate the new height and offset.
      // boxRef includes adjustment for the border, let's take the border values out for element updating.
      if (newHeight) {
        properties.height = editorToDataY(newHeight);
        if (boxRef.current) {
          const [dx, dy] = calcRotatedResizeOffset(
            boxRef.current.rotationAngle,
            -left,
            -right,
            -top,
            Math.round(newHeight - (boxRef.current.height - top))
          );
          properties.x = editorToDataX(boxRef.current.x + dx);
          properties.y = editorToDataY(boxRef.current.y + dy);
        }
      }
      setProperties(properties);
    }
  }, [editorToDataX, editorToDataY, setProperties, top, left, right]);

  // Update content or delete the whole element (if empty) on unmount.
  const handleUnmount = useCallback(() => {
    if (contentRef.current) {
      updateContent();
    } else {
      deleteSelectedElements();
    }
  }, [updateContent, deleteSelectedElements]);
  useUnmount(handleUnmount);

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
    if (wrapper) {
      wrapper.style.height = `${editorHeightRef.current}px`;
    }
    if (textBox) {
      editorHeightRef.current =
        textBox.offsetHeight - dataToEditorY(marginOffset);
      textBox.style.margin = '';
    }
    if (editWrapper) {
      if (boxRef.current) {
        // We need to consider the potential border, too, and remove/add it to the content height.
        const [dx, dy] = calcRotatedResizeOffset(
          boxRef.current.rotationAngle,
          0,
          0,
          0,
          editorHeightRef.current - (boxRef.current.height - top - bottom)
        );
        editWrapper.style.height = `${editorHeightRef.current + top + bottom}px`;
        editWrapper.style.left = `${boxRef.current.x + dx}px`;
        editWrapper.style.top = `${boxRef.current.y + dy}px`;
      }
      onResize && onResize();
    }
  }, [dataToEditorY, editWrapper, element, onResize, top, bottom]);
  // Invoke on each content update.
  const handleUpdate = useCallback(
    (newContent: string | null) => {
      contentRef.current = newContent;
      handleResize();
    },
    [handleResize]
  );
  // Also invoke if the raw element height ever changes
  useEffect(handleResize, [elementHeight, handleResize]);

  useEffect(() => {
    void maybeEnqueueFontStyle([
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
    const updatedFontSize = transform?.updates?.fontSize as number;
    if (target) {
      target.style.fontSize = updatedFontSize
        ? `${dataToEditorY(updatedFontSize)}px`
        : '';
    }
    if (highlight) {
      const updatedMargin = transform?.updates?.marginOffset as number;
      highlight.style.margin = `${dataToEditorY(-updatedMargin) / 2}px 0`;
      if (target) {
        highlight.style.fontSize = target.style.fontSize;
        target.style.margin = `${dataToEditorY(-updatedMargin) / 2}px 0`;
      }
    }

    if (wrapper) {
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
    $backgroundColor: wrapperBackgroundColor,
  };

  return (
    <OutsideBorder
      ref={outsideBorderRef}
      border={border as Border}
      borderRadius={borderRadius}
      width={width}
      height={height}
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
              dangerouslySetInnerHTML={{ __html: editorContent }}
              {...textProps}
            />
          </TextBoxPadded>
        )}
        <EditTextBox
          $hasHighlightBackgroundTextMode={hasHighlightBackgroundTextMode}
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

export default TextEdit;
