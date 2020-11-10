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
import { useEffect, useRef, useMemo } from 'react';

/**
 * Internal dependencies
 */
import { useFont } from '../../app';
import { useUnits } from '../../units';
import {
  elementFillContent,
  elementWithFont,
  elementWithBackgroundColor,
  elementWithTextParagraphStyle,
  elementWithBorderRadius,
  elementWithOutsideBorder,
} from '../shared';
import StoryPropTypes from '../../types';
import { BACKGROUND_TEXT_MODE } from '../../constants';
import { useTransformHandler } from '../../components/transform';
import {
  getHTMLFormatters,
  getHTMLInfo,
} from '../../components/richText/htmlManipulation';
import createSolid from '../../utils/createSolid';
import stripHTML from '../../utils/stripHTML';
import { isOutsideBorder } from '../../components/elementBorder/utils';
import {
  getHighlightLineheight,
  generateParagraphTextStyle,
  calcFontMetrics,
} from './util';

const OutsideBorder = styled.div`
  ${elementWithOutsideBorder}
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
  color: transparent;
`;

const ForegroundSpan = styled(Span)`
  background: none;
`;

const FillElement = styled.p`
  margin: 0;
  ${elementFillContent}
  ${elementWithFont}
  ${elementWithTextParagraphStyle}
`;

const Background = styled.div`
  ${elementWithBackgroundColor}
  ${elementFillContent}
  ${elementWithBorderRadius}
  ${elementWithOutsideBorder}
  margin: 0;
`;

function TextDisplay({
  element,
  element: { id, content, backgroundColor, backgroundTextMode, ...rest },
}) {
  const ref = useRef(null);
  const outerBorderRef = useRef(null);

  const { dataToEditorX, dataToEditorY } = useUnits((state) => ({
    dataToEditorX: state.actions.dataToEditorX,
    dataToEditorY: state.actions.dataToEditorY,
  }));

  const { border, borderRadius, font } = rest;
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
      dataToEditorX,
      dataToEditorY,
      undefined,
      element
    ),
    horizontalPadding: dataToEditorX(rest.padding?.horizontal || 0),
    verticalPadding: dataToEditorX(rest.padding?.vertical || 0),
  };
  const {
    actions: { maybeEnqueueFontStyle },
  } = useFont();
  useEffect(() => {
    maybeEnqueueFontStyle([{ ...fontFaceSetConfigs, font }]);
  }, [font, fontFaceSetConfigs, maybeEnqueueFontStyle]);

  useTransformHandler(id, (transform) => {
    const target = ref.current;
    const updatedFontSize = transform?.updates?.fontSize;
    target.style.fontSize = updatedFontSize
      ? `${dataToEditorY(updatedFontSize)}px`
      : '';
    const updatedMargin = transform?.updates?.marginOffset;
    target.style.margin = updatedMargin
      ? `${dataToEditorY(-updatedMargin) / 2}px 0`
      : '';

    if (outerBorderRef.current) {
      if (transform) {
        const { resize } = transform;
        if (resize && resize[0] !== 0 && resize[1] !== 0) {
          const [width, height] = resize;
          if (isOutsideBorder(border)) {
            outerBorderRef.current.style.width =
              width + border.left + border.right + 'px';
            outerBorderRef.current.style.height =
              height + border.top + border.bottom + 'px';
          }
        }
      }
    }
  });

  // Setting the text color of the entire block to black essentially removes all inline
  // color styling allowing us to apply transparent to all of them.
  const contentWithoutColor = useMemo(
    () => getHTMLFormatters().setColor(content, createSolid(0, 0, 0)),
    [content]
  );

  if (backgroundTextMode === BACKGROUND_TEXT_MODE.HIGHLIGHT) {
    // We need a separate outside border wrapper for outside border
    // since the highlight wrapper uses negative margin to position the content.
    // This, however, would shift the border incorrectly.
    return (
      <OutsideBorder
        ref={outerBorderRef}
        border={border}
        borderRadius={borderRadius}
      >
        <HighlightWrapperElement ref={ref} {...props}>
          <HighlightElement {...props}>
            <MarginedElement {...props}>
              <BackgroundSpan
                {...props}
                dangerouslySetInnerHTML={{
                  __html: contentWithoutColor,
                }}
              />
            </MarginedElement>
          </HighlightElement>
          <HighlightElement {...props}>
            <MarginedElement {...props}>
              <ForegroundSpan
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
      ref={outerBorderRef}
      backgroundColor={
        backgroundTextMode === BACKGROUND_TEXT_MODE.FILL && backgroundColor
      }
      borderRadius={borderRadius}
      border={border}
    >
      <FillElement
        ref={ref}
        dangerouslySetInnerHTML={{
          __html: content,
        }}
        {...props}
      />
    </Background>
  );
}

TextDisplay.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default TextDisplay;
