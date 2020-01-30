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

/**
 * WordPress dependencies
 */
import {useEffect} from '@wordpress/element';

/**
 * Internal dependencies
 */
import {useFont} from '../../app';
import {useUnits} from '../../units';
import {
  ElementFillContent,
  ElementWithFont,
  ElementWithBackgroundColor,
  ElementWithFontColor,
  ElementWithStyle,
} from '../shared';
import StoryPropTypes from '../../types';
import {generateFontFamily} from './util';

const Element = styled.p`
  margin: 0;
  ${ElementFillContent}
  ${ElementWithFont}
  ${ElementWithBackgroundColor}
  ${ElementWithFontColor}
  ${ElementWithStyle}
`;

function TextDisplay({
  element: {
    content,
    color,
    backgroundColor,
    fontFamily,
    fontFallback,
    fontSize,
    fontWeight,
    fontStyle,
    letterSpacing,
    lineHeight,
    padding,
    textAlign,
  },
}) {
  const {
    actions: {dataToEditorY},
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
    padding,
    textAlign,
  };
  const {
    actions: {maybeEnqueueFontStyle},
  } = useFont();

  useEffect(() => {
    maybeEnqueueFontStyle(fontFamily);
  }, [fontFamily, maybeEnqueueFontStyle]);

  return <Element dangerouslySetInnerHTML={{__html: content}} {...props} />;
}

TextDisplay.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
};

export default TextDisplay;
