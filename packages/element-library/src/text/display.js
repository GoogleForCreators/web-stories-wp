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
import { useEffect, useRef, useMemo } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { createSolid } from '@googleforcreators/patterns';
import { useUnits } from '@googleforcreators/units';
import { useTransformHandler } from '@googleforcreators/transform';
import { getHTMLFormatters, getHTMLInfo } from '@googleforcreators/rich-text';
import { stripHTML } from '@googleforcreators/dom';
import {
  getResponsiveBorder,
  shouldDisplayBorder,
} from '@googleforcreators/masks';
import {
  StoryPropTypes,
  BACKGROUND_TEXT_MODE,
} from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import {
  elementFillContent,
  elementWithFont,
  elementWithBackgroundColor,
  elementWithTextParagraphStyle,
  elementWithBorder,
  elementWithHighlightBorderRadius,
  useColorTransformHandler,
} from '../shared';
import {
  getHighlightLineheight,
  generateParagraphTextStyle,
  calcFontMetrics,
  generateFontFamily,
} from './util';

const OutsideBorder = styled.div`
  ${elementWithBorder}
`;
const HighlightWrapperElement = styled.div`
  ${elementFillContent}
  ${elementWithFont}
  ${elementWithTextParagraphStyle}
  line-height: ${({ lineHeight, verticalPadding }) =>
    getHighlightLineheight(lineHeight, verticalPadding)};
  padding: 0;
`;
const HighlightElement = styled.p`
  font-size: inherit;
  line-height: inherit;
  margin: 0;
  position: absolute;
  width: ${({ verticalPadding }) => `calc(100% - ${verticalPadding}px)`};
`;

const MarginedElement = styled.span`
  position: relative;
  display: block;
  top: 0;
  left: 0;
`;

const Span = styled.span`
  ${elementWithBackgroundColor}
  ${elementWithTextParagraphStyle}

  box-decoration-break: clone;
  position: relative;
`;

const BackgroundSpan = styled(Span)`
  ${elementWithHighlightBorderRadius}
  color: transparent;
`;

const ForegroundSpan = styled(Span)`
  background: none;
`;

// Using attributes to avoid creation of hundreds of classes by styled components for previewMode.
const FillElement = styled.p.attrs(
  ({
    theme,
    previewMode,
    fontStyle,
    fontSize,
    fontWeight,
    font,
    marginOffset,
    padding,
    lineHeight,
    textAlign,
    dataToEditorY,
  }) => {
    return previewMode
      ? {
          style: {
            zIndex: 1,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            letterSpacing: 'normal',
            color: theme.colors.standard.black,
            fontStyle,
            fontSize: `${fontSize}px`,
            fontWeight,
            fontFamily: generateFontFamily(font),
            margin: `${-dataToEditorY(marginOffset / 2)}px 0`,
            padding: padding || 0,
            lineHeight,
            textAlign,
          },
        }
      : {};
  }
)`
  margin: 0;
  ${elementFillContent}
  ${({ previewMode }) => !previewMode && elementWithFont}
  ${({ previewMode }) => !previewMode && elementWithTextParagraphStyle}
`;

const Background = styled.div`
  ${elementWithBackgroundColor}
  ${elementFillContent}
  ${elementWithBorder}
  margin: 0;
`;

function TextDisplay({
  element,
  element: {
    id,
    content,
    backgroundColor,
    backgroundTextMode,
    border,
    borderRadius,
    ...rest
  },
  previewMode,
  maybeEnqueueFontStyle,
}) {
  const ref = useRef(null);
  const outerBorderRef = useRef(null);
  const bgRef = useRef(null);
  const fgRef = useRef(null);

  const { dataToEditorX, dataToEditorY } = useUnits((state) => ({
    dataToEditorX: state.actions.dataToEditorX,
    dataToEditorY: state.actions.dataToEditorY,
  }));

  const { font, width: elementWidth, height: elementHeight } = rest;
  const fontFaceSetConfigs = useMemo(() => {
    const htmlInfo = getHTMLInfo(content);
    return {
      fontStyle: htmlInfo.isItalic ? 'italic' : 'normal',
      fontWeight: htmlInfo.fontWeight,
      content: stripHTML(content),
    };
  }, [content]);

  const { marginOffset } = calcFontMetrics(element);
  const props = {
    font,
    element,
    marginOffset: dataToEditorY(marginOffset),
    ...(backgroundTextMode === BACKGROUND_TEXT_MODE.NONE
      ? {}
      : { backgroundColor }),
    ...generateParagraphTextStyle(
      rest,
      (x) => `${dataToEditorX(x)}px`,
      (y) => `${dataToEditorY(y)}px`,
      dataToEditorY,
      element
    ),
    horizontalPadding: dataToEditorX(rest.padding?.horizontal || 0),
    verticalPadding: dataToEditorX(rest.padding?.vertical || 0),
  };
  useEffect(() => {
    maybeEnqueueFontStyle([{ ...fontFaceSetConfigs, font }]);
  }, [font, fontFaceSetConfigs, maybeEnqueueFontStyle]);

  const isHighLight = backgroundTextMode === BACKGROUND_TEXT_MODE.HIGHLIGHT;
  const refWithBorder = isHighLight ? outerBorderRef : bgRef;

  useTransformHandler(id, (transform) => {
    // Ref is set in case of high-light mode only, use the fgRef if that's missing.
    const target = ref?.current || fgRef.current;
    if (!target) {
      return;
    }
    const updatedFontSize = transform?.updates?.fontSize;
    target.style.fontSize = updatedFontSize
      ? `${dataToEditorY(updatedFontSize)}px`
      : '';
    const updatedMargin = transform?.updates?.marginOffset;
    target.style.margin = updatedMargin
      ? `${dataToEditorY(-updatedMargin) / 2}px 0`
      : '';

    if (outerBorderRef.current || bgRef.current) {
      // Depending on the background mode, choose the element that has border assigned to it.
      if (transform) {
        const { resize } = transform;
        if (resize && resize[0] !== 0 && resize[1] !== 0) {
          const [width, height] = resize;
          if (shouldDisplayBorder(element)) {
            refWithBorder.current.style.width =
              width + border.left + border.right + 'px';
            refWithBorder.current.style.height =
              height + border.top + border.bottom + 'px';
          }
        }
      }
    }
  });

  useColorTransformHandler({
    id,
    targetRef: bgRef,
    expectedStyle: 'background',
  });
  useColorTransformHandler({ id, targetRef: fgRef, expectedStyle: 'color' });
  useColorTransformHandler({
    id,
    targetRef: refWithBorder,
    expectedStyle: 'border-color',
  });

  // Setting the text color of the entire block to black essentially removes all inline
  // color styling allowing us to apply transparent to all of them.
  const contentWithoutColor = useMemo(
    () => getHTMLFormatters().setColor(content, createSolid(0, 0, 0)),
    [content]
  );

  if (isHighLight) {
    // We need a separate outside border wrapper for outside border
    // since the highlight wrapper uses negative margin to position the content.
    // This, however, would shift the border incorrectly.
    return (
      <OutsideBorder
        ref={outerBorderRef}
        border={getResponsiveBorder(border, previewMode, dataToEditorX)}
        borderRadius={borderRadius}
        width={elementWidth}
        height={elementHeight}
      >
        <HighlightWrapperElement ref={ref} {...props}>
          <HighlightElement {...props}>
            <MarginedElement {...props}>
              <BackgroundSpan
                ref={bgRef}
                {...props}
                borderRadius={borderRadius}
                dataToEditorY={dataToEditorY}
                dangerouslySetInnerHTML={{
                  __html: contentWithoutColor,
                }}
              />
            </MarginedElement>
          </HighlightElement>
          <HighlightElement {...props}>
            <MarginedElement {...props}>
              <ForegroundSpan
                ref={fgRef}
                {...props}
                dangerouslySetInnerHTML={{
                  __html: content,
                }}
              />
            </MarginedElement>
          </HighlightElement>
        </HighlightWrapperElement>
      </OutsideBorder>
    );
  }

  return (
    <Background
      ref={bgRef}
      backgroundColor={
        backgroundTextMode === BACKGROUND_TEXT_MODE.FILL && backgroundColor
      }
      borderRadius={borderRadius}
      border={getResponsiveBorder(border, previewMode, dataToEditorX)}
      width={elementWidth}
      height={elementHeight}
    >
      <FillElement
        ref={fgRef}
        dangerouslySetInnerHTML={{
          __html: content,
        }}
        previewMode={previewMode}
        {...props}
      />
    </Background>
  );
}

TextDisplay.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
  box: StoryPropTypes.box.isRequired,
  previewMode: PropTypes.bool,
  maybeEnqueueFontStyle: PropTypes.func,
};

export default TextDisplay;
