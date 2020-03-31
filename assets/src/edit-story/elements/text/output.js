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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import generatePatternStyles from '../../utils/generatePatternStyles';
import { dataToEditorX, dataToEditorY } from '../../units';
import { BACKGROUND_TEXT_MODE } from '../../constants';
import {
  draftMarkupToContent,
  generateParagraphTextStyle,
  getHighlightLineheight,
} from './util';

/**
 * Renders DOM for the text output based on the provided unit converters.
 */
export function TextOutputWithUnits({
  element: {
    bold,
    content,
    color,
    backgroundColor,
    backgroundTextMode,
    padding,
    ...rest
  },
  dataToStyleX,
  dataToStyleY,
  dataToFontSizeY,
  className,
}) {
  if (!dataToFontSizeY) {
    dataToFontSizeY = dataToStyleY;
  }
  const { width } = rest;
  const paddingStyles = {
    vertical: `${(padding.vertical / width) * 100}%`,
    horizontal: `${(padding.horizontal / width) * 100}%`,
  };
  const fillStyle = {
    ...generateParagraphTextStyle(rest, dataToStyleX, dataToStyleY, dataToFontSizeY),
    ...generatePatternStyles(backgroundColor),
    ...generatePatternStyles(color, 'color'),
    padding: `${paddingStyles.vertical} ${paddingStyles.horizontal}`,
  };

  const bgColor =
    backgroundTextMode !== BACKGROUND_TEXT_MODE.NONE
      ? generatePatternStyles(backgroundColor)
      : undefined;

  const unitlessPaddingVertical = parseFloat(dataToStyleY(padding.vertical));
  const unitlessFontSize = parseFloat(dataToStyleY(rest.fontSize));

  const lineHeight = getHighlightLineheight(
    rest.lineHeight,
    unitlessPaddingVertical / unitlessFontSize,
    'em'
  );

  const highlightStyle = {
    ...fillStyle,
    margin: 0,
    padding: 0,
    background: 'none',
    lineHeight,
  };

  const highlightCloneStyle = {
    ...highlightStyle,
    position: 'absolute',
    top: 0,
  };

  const marginStyle = {
    display: 'inline-block',
    position: 'relative',
    // Disable reason: style lint can't figure out an interpolated calc
    // stylelint-disable function-calc-no-invalid
    margin: `0 calc(${paddingStyles.horizontal} + 2%)`,
    left: `calc(-${paddingStyles.horizontal} - 2%)`,
    // stylelint-enable function-calc-no-invalid
    top: '0',
  };

  const textStyle = {
    ...bgColor,
    /* stylelint-disable */
    WebkitBoxDecorationBreak: 'clone',
    /* stylelint-enable */
    boxDecorationBreak: 'clone',
    borderRadius: '3px',
    position: 'relative',
    padding: `${paddingStyles.vertical} ${paddingStyles.horizontal}`,
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
        <p className={className} style={highlightStyle}>
          <span style={marginStyle}>
            <span
              style={backgroundTextStyle}
              dangerouslySetInnerHTML={{
                __html: draftMarkupToContent(content, bold),
              }}
            />
          </span>
        </p>
        <p className={className} style={highlightCloneStyle} aria-hidden="true">
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
      className={className}
      style={fillStyle}
      dangerouslySetInnerHTML={{ __html: draftMarkupToContent(content, bold) }}
    />
  );
}

TextOutputWithUnits.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
  dataToStyleX: PropTypes.func.isRequired,
  dataToStyleY: PropTypes.func.isRequired,
  dataToFontSizeY: PropTypes.func,
  className: PropTypes.string,
};

/**
 * Returns AMP HTML for saving into post content for displaying in the FE.
 */
function TextOutput({ element }) {
  return (
    <TextOutputWithUnits
      element={element}
      className="fill"
      dataToStyleX={(x) => `${dataToEditorX(x, 100)}%`}
      dataToStyleY={(y) => `${dataToEditorY(y, 100)}%`}
      dataToFontSizeY={(y) => `${dataToEditorY(y, 100) / 10}em`}
    />
  );
}

TextOutput.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
};

export default TextOutput;
