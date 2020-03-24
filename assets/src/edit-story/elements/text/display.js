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
  elementWithStyle,
} from '../shared';
import StoryPropTypes from '../../types';
import { useTransformHandler } from '../../components/transform';
import { draftMarkupToContent, generateFontFamily } from './util';

const HighlightElement = styled.p`
	${elementFillContent}
	${elementWithFont}
	${elementWithStyle}
  ${elementWithFontColor}
  margin: 0;

  span {
    ${elementWithBackgroundColor}
    border-radius: 3px;
    box-decoration-break: clone;
    position: relative;
  }
`;

const FillElement = styled.p`
	margin: 0;
	${elementFillContent}
	${elementWithFont}
	${elementWithBackgroundColor}
	${elementWithFontColor}
	${elementWithStyle}
`;

function TextDisplay({
  element: {
    id,
    bold,
    content,
    color,
    backgroundColor,
    backgroundType,
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
}) {
  const ref = useRef(null);

  const {
    actions: { dataToEditorY, dataToEditorX },
  } = useUnits();

  const props = {
    color,
    backgroundColor,
    fontFamily: generateFontFamily(fontFamily, fontFallback),
    fontFallback,
    fontStyle,
    fontSize: dataToEditorY(fontSize),
    fontWeight,
    letterSpacing,
    lineHeight,
    padding: {
      horizontal: dataToEditorX(padding.horizontal),
      vertical: dataToEditorY(padding.vertical),
    },
    textAlign,
    textDecoration,
  };
  const {
    actions: { maybeEnqueueFontStyle },
  } = useFont();

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

  if (backgroundType === 'highlight') {
    return (
      <HighlightElement ref={ref} {...props}>
        <span
          dangerouslySetInnerHTML={{
            __html: draftMarkupToContent(content, bold),
          }}
        />
      </HighlightElement>
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
