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
import { useEffect, useRef } from 'react';

/**
 * Internal dependencies
 */
import { useFont } from '../../app';
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
import { useTransformHandler } from '../../components/transform';
import {
  draftMarkupToContent,
  getHighlightLineheight,
  generateParagraphTextStyle,
} from './util';

const HighlightElement = styled.p`
  ${elementFillContent}
  ${elementWithFont}
  ${elementWithFontColor}
  ${elementWithTextParagraphStyle}
  line-height: ${({ lineHeight, verticalPadding }) =>
    getHighlightLineheight(lineHeight, verticalPadding)};
  margin: 0;
  padding: 0;
`;

const MarginedElement = styled.span`
  position: relative;
  display: inline-block;
  top: 0;
  margin: ${({ horizontalPadding, horizontalBuffer }) =>
    `0 ${horizontalPadding + horizontalBuffer}px`};
  left: ${({ horizontalPadding, horizontalBuffer }) =>
    `-${horizontalPadding + horizontalBuffer}px`};
`;

const Span = styled.span`
  ${elementWithBackgroundColor}
  ${elementWithTextParagraphStyle}

  border-radius: 3px;
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
  ${elementWithBackgroundColor}
  ${elementWithFontColor}
  ${elementWithTextParagraphStyle}
`;

function TextDisplay({
  element: {
    id,
    bold,
    content,
    color,
    backgroundColor,
    backgroundTextMode,
    ...rest
  },
}) {
  const ref = useRef(null);

  const {
    state: {
      pageSize: { width: pageWidth },
    },
    actions: { dataToEditorY, dataToEditorX },
  } = useUnits();

  const props = {
    color,
    backgroundColor,
    backgroundTextMode,
    ...generateParagraphTextStyle(rest, dataToEditorX, dataToEditorY),
    horizontalBuffer: 0.01 * pageWidth,
    horizontalPadding: dataToEditorX(rest.padding?.horizontal || 0),
    verticalPadding: dataToEditorX(rest.padding?.vertical || 0),
  };
  const {
    actions: { maybeEnqueueFontStyle },
  } = useFont();

  const { fontFamily } = rest;
  useEffect(() => {
    maybeEnqueueFontStyle(fontFamily);
  }, [fontFamily, maybeEnqueueFontStyle]);

  useTransformHandler(id, (transform) => {
    const target = ref.current;
    const updatedFontSize = transform?.updates?.fontSize;
    target.style.fontSize = updatedFontSize
      ? `${dataToEditorY(updatedFontSize)}px`
      : '';
  });

  if (backgroundTextMode === BACKGROUND_TEXT_MODE.HIGHLIGHT) {
    return (
      <>
        <HighlightElement ref={ref} {...props}>
          <MarginedElement {...props}>
            <BackgroundSpan
              {...props}
              dangerouslySetInnerHTML={{
                __html: draftMarkupToContent(content, bold),
              }}
            />
          </MarginedElement>
        </HighlightElement>
        <HighlightElement {...props}>
          <MarginedElement {...props}>
            <ForegroundSpan
              {...props}
              dangerouslySetInnerHTML={{
                __html: draftMarkupToContent(content, bold),
              }}
            />
          </MarginedElement>
        </HighlightElement>
      </>
    );
  }

  return (
    <FillElement
      ref={ref}
      dangerouslySetInnerHTML={{
        __html: draftMarkupToContent(content, bold),
      }}
      {...props}
    />
  );
}

TextDisplay.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
};

export default TextDisplay;
