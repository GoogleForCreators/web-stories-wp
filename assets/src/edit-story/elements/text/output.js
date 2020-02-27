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
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import { dataToEditorY } from '../../units';
import { generateFontFamily, getTransformFlip } from './util';

/**
 * Returns AMP HTML for saving into post content for displaying in the FE.
 */
function TextOutput({
  element: {
    content,
    color,
    backgroundColor,
    flip,
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
  const style = {
    fontSize: `${dataToEditorY(fontSize, 100)}%`,
    fontStyle: fontStyle ? fontStyle : null,
    fontFamily: generateFontFamily(fontFamily, fontFallback),
    fontWeight: fontWeight ? fontWeight : null,
    background: backgroundColor,
    color,
    lineHeight,
    letterSpacing: letterSpacing ? letterSpacing + 'em' : null,
    padding: padding ? padding + '%' : null,
    transform: getTransformFlip(flip),
    textAlign: textAlign ? textAlign : null,
    whiteSpace: 'pre-wrap',
  };

  return (
    <p
      className="fill"
      style={style}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

TextOutput.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
};

export default TextOutput;
