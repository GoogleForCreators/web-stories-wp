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
import { useMemo } from 'react';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import generatePatternStyles from '../../utils/generatePatternStyles';
import { getHTMLFormatters } from '../../components/richText/htmlManipulation';
import createSolid from '../../utils/createSolid';
import { dataToEditorX, dataToEditorY } from '../../units';
import { BACKGROUND_TEXT_MODE } from '../../constants';
import { generateParagraphTextStyle, getHighlightLineheight } from './util';

/**
 * Renders DOM for the text output based on the provided unit converters.
 *
 * @param {Object<*>} props Component props.
 * @param {Object<*>} props.element Story element.
 * @param {Function} props.dataToStyleX dataToStyleX function.
 * @param {Function} props.dataToStyleY dataToStyleY function.
 * @param {Function} props.dataToFontSizeY dataToFontSizeY function. Falls back to dataToStyleY if not provided.
 * @param {Function} props.dataToPaddingX dataToPaddingX function. Falls back to dataToStyleX if not provided.
 * @param {Function} props.dataToPaddingY dataToPaddingY function. Falls back to dataToStyleX if not provided.
 * @param {string} props.className Class name.
 * @return {*} Rendered component.
 */
export function TextOutputWithUnits({
  element: { content, backgroundColor, backgroundTextMode, padding, ...rest },
  dataToStyleX,
  dataToStyleY,
  dataToFontSizeY,
  dataToPaddingX,
  dataToPaddingY,
  className,
}) {
  if (!dataToFontSizeY) {
    dataToFontSizeY = dataToStyleY;
  }
  if (!dataToPaddingX) {
    dataToPaddingX = dataToStyleX;
  }
  if (!dataToPaddingY) {
    dataToPaddingY = dataToStyleY;
  }
  const paddingStyles = {
    vertical: dataToPaddingY(padding.vertical),
    horizontal: dataToPaddingX(padding.horizontal),
  };

  const bgColor =
    backgroundTextMode !== BACKGROUND_TEXT_MODE.NONE
      ? generatePatternStyles(backgroundColor)
      : undefined;

  const fillStyle = {
    ...generateParagraphTextStyle(
      rest,
      dataToStyleX,
      dataToStyleY,
      dataToFontSizeY
    ),
    ...bgColor,
    color: '#000000',
    padding: `${paddingStyles.vertical} ${paddingStyles.horizontal}`,
    overflowWrap: 'anywhere',
  };

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
    overflowWrap: 'anywhere',
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

  // Setting the text color of the entire block to black essentially removes all inline
  // color styling allowing us to apply transparent to all of them.
  const contentWithoutColor = useMemo(
    () => getHTMLFormatters().setColor(content, createSolid(0, 0, 0)),
    [content]
  );

  if (backgroundTextMode === BACKGROUND_TEXT_MODE.HIGHLIGHT) {
    return (
      <>
        <p className={className} style={highlightStyle}>
          <span style={marginStyle}>
            <span
              style={backgroundTextStyle}
              dangerouslySetInnerHTML={{
                __html: contentWithoutColor,
              }}
            />
          </span>
        </p>
        <p className={className} style={highlightCloneStyle} aria-hidden="true">
          <span style={marginStyle}>
            <span
              style={foregroundTextStyle}
              dangerouslySetInnerHTML={{
                __html: content,
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
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

TextOutputWithUnits.propTypes = {
  element: StoryPropTypes.textContent.isRequired,
  dataToStyleX: PropTypes.func.isRequired,
  dataToStyleY: PropTypes.func.isRequired,
  dataToFontSizeY: PropTypes.func,
  dataToPaddingX: PropTypes.func,
  dataToPaddingY: PropTypes.func,
  className: PropTypes.string,
};

/**
 * Returns AMP HTML for saving into post content for displaying in the FE.
 *
 * @param {Object<*>} props Props.
 * @return {*} Rendered component.
 */
function TextOutput({ element }) {
  const { width } = element;
  return (
    <TextOutputWithUnits
      element={element}
      className="fill"
      dataToStyleX={(x) => `${dataToEditorX(x, 100)}%`}
      dataToStyleY={(y) => `${dataToEditorY(y, 100)}%`}
      dataToFontSizeY={(y) => `${(dataToEditorY(y, 100) / 10).toFixed(6)}em`}
      // Both vertical and horizontal paddings are calculated in % relative to
      // the box's width per CSS rules.
      dataToPaddingX={(x) => `${(x / width) * 100}%`}
      dataToPaddingY={(y) => `${(y / width) * 100}%`}
    />
  );
}

TextOutput.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
};

export default TextOutput;
