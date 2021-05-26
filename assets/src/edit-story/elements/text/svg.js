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
import {
  elementFillContent,
  elementWithFont,
  elementWithBackgroundColor,
  elementWithTextParagraphStyle,
  elementWithBorder,
  elementWithHighlightBorderRadius,
} from '../shared';
import StoryPropTypes from '../../types';
import { BACKGROUND_TEXT_MODE } from '../../constants';
import {
  getHTMLFormatters,
  getHTMLInfo,
} from '../../components/richText/htmlManipulation';
import createSolid from '../../utils/createSolid';
import stripHTML from '../../utils/stripHTML';
import { getResponsiveBorder } from '../../utils/elementBorder';
import {
  getHighlightLineheight,
  generateParagraphTextStyle,
  calcFontMetrics,
} from './util';

const OutsideBorder = styled.g`
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
const HighlightElement = styled.div`
  font-size: inherit;
  line-height: inherit;
  margin: 0;
  position: absolute;
  width: ${({ verticalPadding }) => `calc(100% - ${verticalPadding}px)`};
`;

const MarginedElement = styled.div`
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

const FillElement = styled.div`
  margin: 0;
  ${elementFillContent}
  ${elementWithFont}
  ${elementWithTextParagraphStyle}
  position: static;
`;

const Background = styled.div`
  ${elementWithBackgroundColor}
  ${elementFillContent}
  ${elementWithBorder}
  margin: 0;
  position: static;
`;

function TextSVG({
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
  box,
}) {
  const ref = useRef(null);
  const outerBorderRef = useRef(null);
  const bgRef = useRef(null);
  const fgRef = useRef(null);

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
    marginOffset,
    ...(backgroundTextMode === BACKGROUND_TEXT_MODE.NONE
      ? {}
      : { backgroundColor }),
    ...generateParagraphTextStyle(
      rest,
      (x) => x,
      (y) => y,
      undefined,
      element
    ),
    horizontalPadding: rest.padding?.horizontal || 0,
    verticalPadding: rest.padding?.vertical || 0,
  };

  const foProps = {
    width: box.width,
    height: box.height,
  };

  const {
    actions: { maybeEnqueueFontStyle },
  } = useFont();
  useEffect(() => {
    maybeEnqueueFontStyle([{ ...fontFaceSetConfigs, font }]);
  }, [font, fontFaceSetConfigs, maybeEnqueueFontStyle]);

  const isHighLight = backgroundTextMode === BACKGROUND_TEXT_MODE.HIGHLIGHT;

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
      <foreignObject {...foProps}>
        <OutsideBorder
          ref={outerBorderRef}
          border={getResponsiveBorder(border)}
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
      </foreignObject>
    );
  }

  return (
    <foreignObject {...foProps}>
      <Background
        ref={bgRef}
        backgroundColor={
          backgroundTextMode === BACKGROUND_TEXT_MODE.FILL && backgroundColor
        }
        borderRadius={borderRadius}
        border={getResponsiveBorder(border)}
        width={elementWidth}
        height={elementHeight}
      >
        <FillElement
          ref={fgRef}
          dangerouslySetInnerHTML={{
            __html: content,
          }}
          {...props}
        />
      </Background>
    </foreignObject>
  );
}

TextSVG.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default TextSVG;
