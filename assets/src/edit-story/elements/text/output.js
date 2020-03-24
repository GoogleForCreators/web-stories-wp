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
import generatePatternStyles from '../../utils/generatePatternStyles';
import { dataToEditorX, dataToEditorY } from '../../units';
import { draftMarkupToContent, generateFontFamily } from './util';

/**
 * Returns AMP HTML for saving into post content for displaying in the FE.
 */
function TextOutput({
  element: {
    bold,
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
    textDecoration,
  },
  box: { width },
}) {
  const horizontalPadding = dataToEditorX(padding.horizontal, width);
  // The padding % is taken based on width, thus using X and width for vertical, too.
  const verticalPadding = dataToEditorX(padding.vertical, width);
  const style = {
    fontSize: `${dataToEditorY(fontSize, 100)}%`,
    fontStyle: fontStyle ? fontStyle : null,
    fontFamily: generateFontFamily(fontFamily, fontFallback),
    fontWeight: fontWeight ? fontWeight : null,
    lineHeight,
    letterSpacing: letterSpacing ? letterSpacing + 'em' : '0',
    padding: padding ? `${verticalPadding}% ${horizontalPadding}%` : '0',
    textAlign: textAlign ? textAlign : null,
    textDecoration,
    whiteSpace: 'pre-wrap',
    ...generatePatternStyles(backgroundColor),
    ...generatePatternStyles(color, 'color'),
  };

  return (
    <p
      className="fill"
      style={style}
      dangerouslySetInnerHTML={{ __html: draftMarkupToContent(content, bold) }}
    />
  );
}

TextOutput.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default TextOutput;
