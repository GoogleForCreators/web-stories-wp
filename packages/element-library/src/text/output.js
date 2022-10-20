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
import { useMemo } from '@googleforcreators/react';
import {
  createSolid,
  generatePatternStyles,
} from '@googleforcreators/patterns';
import {
  dataToEditorX,
  dataToEditorY,
  dataToFontSizeY as dataToFontSize,
} from '@googleforcreators/units';
import classnames from 'classnames';
import {
  StoryPropTypes,
  BACKGROUND_TEXT_MODE,
} from '@googleforcreators/elements';
import { getHTMLFormatters } from '@googleforcreators/rich-text';

/**
 * Internal dependencies
 */
import {
  generateParagraphTextStyle,
  getHighlightLineheight,
  calcFontMetrics,
} from './util';

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
  element,
  dataToStyleX,
  dataToStyleY,
  dataToFontSizeY,
  dataToPaddingX,
  dataToPaddingY,
  className,
  elementFontData,
}) {
  const {
    content: rawContent,
    backgroundColor,
    backgroundTextMode,
    padding,
    borderRadius,
    tagName: TagName = 'p',
    ...rest
  } = element;
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
    vertical: padding.vertical ? dataToPaddingY(padding.vertical) : 0,
    horizontal: padding.horizontal ? dataToPaddingX(padding.horizontal) : 0,
  };

  const hasPadding = paddingStyles.vertical || paddingStyles.horizontal;
  const paddingStyle = hasPadding
    ? `${paddingStyles.vertical} ${paddingStyles.horizontal}`
    : 0;

  const bgColor =
    backgroundTextMode !== BACKGROUND_TEXT_MODE.NONE
      ? generatePatternStyles(backgroundColor)
      : undefined;

  const {
    dataToEditorY: _dataToEditorY,
    font: _font,
    ...styles
  } = generateParagraphTextStyle(
    rest,
    dataToStyleX,
    dataToStyleY,
    dataToFontSizeY,
    { ...element, font: elementFontData },
    dataToPaddingY
  );
  const fillStyle = {
    ...styles,
    color: '#000000',
    // Overrides styles.padding.
    padding: paddingStyle,
  };

  const unitlessPaddingVertical = padding.vertical
    ? parseFloat(dataToStyleY(padding.vertical))
    : 0;
  const unitlessFontSize = parseFloat(dataToStyleY(rest.fontSize));

  const lineHeight = getHighlightLineheight(
    rest.lineHeight,
    unitlessPaddingVertical / unitlessFontSize,
    'em'
  );

  const highlightStyle = {
    ...fillStyle,
    ...bgColor,
    margin: 0,
    padding: 0,
    background: 'none',
    lineHeight,
    overflowWrap: 'break-word',
  };

  const highlightCloneStyle = {
    ...highlightStyle,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  };

  const marginStyle = () => {
    const { marginOffset } = calcFontMetrics({
      ...element,
      font: elementFontData,
    });
    return {
      display: 'block',
      position: 'relative',
      left: 0,
      top: '0',
      margin: `${dataToPaddingY(-marginOffset / 2)} 0`,
      /* stylelint-disable-next-line */
      WebkitBoxDecorationBreak: 'clone',
      boxDecorationBreak: 'clone',
    };
  };

  const textStyle = {
    ...bgColor,
    /* stylelint-disable-next-line */
    WebkitBoxDecorationBreak: 'clone',
    boxDecorationBreak: 'clone',
    position: 'relative',
    padding: paddingStyle,
    textAlign: styles.textAlign,
    borderRadius: `${borderRadius?.topLeft || 0}px ${
      borderRadius?.topRight || 0
    }px ${borderRadius?.bottomRight || 0}px ${borderRadius?.bottomLeft || 0}px`,
  };

  const backgroundTextStyle = {
    ...textStyle,
    color: 'transparent',
  };

  const foregroundTextStyle = {
    ...textStyle,
    background: 'none',
  };

  const content = rawContent.replace(/\n$/, '\n\n');

  // Setting the text color of the entire block to black essentially removes all inline
  // color styling allowing us to apply transparent to all of them.
  const contentWithoutColor = useMemo(
    () => getHTMLFormatters().setColor(content, createSolid(0, 0, 0)),
    [content]
  );

  className = classnames(className, 'text-wrapper');
  if (backgroundTextMode === BACKGROUND_TEXT_MODE.HIGHLIGHT) {
    return (
      <>
        <TagName className={className} style={highlightStyle}>
          <span style={marginStyle()}>
            <span
              style={backgroundTextStyle}
              dangerouslySetInnerHTML={{
                __html: contentWithoutColor,
              }}
            />
          </span>
        </TagName>
        <TagName
          className={className}
          style={highlightCloneStyle}
          aria-hidden="true"
        >
          <span style={marginStyle()}>
            <span
              style={foregroundTextStyle}
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          </span>
        </TagName>
      </>
    );
  }
  return (
    <TagName className={className} style={fillStyle}>
      <span dangerouslySetInnerHTML={{ __html: content }} />
    </TagName>
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
  elementFontData: PropTypes.object,
};

/**
 * Returns AMP HTML for saving into post content for displaying in the FE.
 *
 * @param {Object<*>} props Props.
 * @return {*} Rendered component.
 */
function TextOutput({ element, elementFontData }) {
  const { width } = element;
  {
    /* @todo modify how we pass elementFontData -- added for debug */
  }
  return (
    <TextOutputWithUnits
      element={element}
      elementFontData={elementFontData}
      className="fill"
      dataToStyleX={(x) => `${dataToEditorX(x, 100)}%`}
      dataToStyleY={(y) => `${dataToEditorY(y, 100)}%`}
      dataToFontSizeY={(y) => `${dataToFontSize(y, 100)}em`}
      // Both vertical and horizontal paddings are calculated in % relative to
      // the box's width per CSS rules.
      dataToPaddingX={(x) => `${(x / width) * 100}%`}
      dataToPaddingY={(y) => `${(y / width) * 100}%`}
    />
  );
}

TextOutput.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
  elementFontData: PropTypes.object,
};

export default TextOutput;
