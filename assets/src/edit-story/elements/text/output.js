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
import { BACKGROUND_TEXT_MODE } from '../../constants';
import { draftMarkupToContent, generateFontFamily } from './util';

/**
 * Returns AMP HTML for saving into post content for displaying in the FE.
 */
function TextOutput({
  element: {
    bold,
    content,
    color,
    backgroundTextMode,
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
  const bgColor =
    backgroundTextMode !== BACKGROUND_TEXT_MODE.NONE
      ? generatePatternStyles(backgroundColor)
      : undefined;

  const fillStyle = {
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
    ...bgColor,
    ...generatePatternStyles(color, 'color'),
  };

  const highlightStyle = {
    ...fillStyle,
    margin: 0,
    padding: 0,
    background: 'none',
    // Disable reason: style lint can't figure out an interpolated calc
    // stylelint-disable function-calc-no-invalid
    lineHeight: `calc(
        ${lineHeight}em
        ${`${padding.vertical > 0 ? ' + ' : ' - '}${
          2 * dataToEditorY(padding.vertical, 16)
        }em`}
    )`,
    // stylelint-enable function-calc-no-invalid
  };

  const marginStyle = {
    display: 'inline-block',
    margin: `${verticalPadding}% ${horizontalPadding + 4}%`,
    position: 'relative',
    left: `-${horizontalPadding + 4}%`,
    top: '1px',
  };

  const textStyle = {
    ...bgColor,
    /* stylelint-disable */
    WebkitBoxDecorationBreak: 'clone',
    /* stylelint-enable */
    boxDecorationBreak: 'clone',
    borderRadius: '3px',
    position: 'relative',
    padding: padding ? `${verticalPadding}% ${horizontalPadding}%` : '0',
  };

  const backgroundTextStyle = {
    ...textStyle,
    color: 'transparent',
  };

  const foregroundTextStyle = {
    ...textStyle,
    background: 'none',
  };

  if (backgroundTextMode === BACKGROUND_TEXT_MODE.HIGHLIGHT) {
    return (
      <>
        <p className="fill original" style={highlightStyle}>
          <span style={marginStyle}>
            <span
              style={backgroundTextStyle}
              dangerouslySetInnerHTML={{
                __html: draftMarkupToContent(content, bold),
              }}
            />
          </span>
        </p>
        <p className="fill clone" style={highlightStyle}>
          <span style={marginStyle}>
            <span
              style={foregroundTextStyle}
              dangerouslySetInnerHTML={{
                __html: draftMarkupToContent(content, bold),
              }}
            />
          </span>
        </p>
      </>
    );
  }

  return (
    <p
      className="fill"
      style={fillStyle}
      dangerouslySetInnerHTML={{ __html: draftMarkupToContent(content, bold) }}
    />
  );
}

TextOutput.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default TextOutput;
