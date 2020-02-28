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
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { useEffect, useRef } from '@wordpress/element';

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
import { generateFontFamily } from './util';

const Element = styled.p`
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
    backgroundOpacity,
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
    textOpacity,
  },
}) {
  const ref = useRef(null);

  const {
    actions: { dataToEditorY },
  } = useUnits();
  const props = {
    color: textOpacity ? rgba(color, textOpacity / 100) : color,
    backgroundColor: backgroundOpacity
      ? rgba(backgroundColor, backgroundOpacity / 100)
      : backgroundColor,
    fontFamily: generateFontFamily(fontFamily, fontFallback),
    fontFallback,
    fontStyle,
    fontSize: dataToEditorY(fontSize),
    fontWeight,
    letterSpacing,
    lineHeight,
    padding,
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

  // @todo This logic is temporary and will change with selecting part + marking bold.
  if (bold) {
    content = `<strong>${content}</strong>`;
  }

  return (
    <Element
      ref={ref}
      dangerouslySetInnerHTML={{ __html: content }}
      {...props}
    />
  );
}

TextDisplay.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
};

export default TextDisplay;
