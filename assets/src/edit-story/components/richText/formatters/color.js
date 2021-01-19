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
import { getHexFromSolid, getSolidFromHex } from '../../../utils/patternUtils';
import isPatternEqual from '../../../utils/isPatternEqual';
import createSolidFromString from '../../../utils/createSolidFromString';
import createSolid from '../../../utils/createSolid';
import generatePatternStyles from '../../../utils/generatePatternStyles';
import { MULTIPLE_VALUE } from '../../../constants';
import { NONE, COLOR } from '../customConstants';
import {
  togglePrefixStyle,
  getPrefixStylesInSelection,
} from '../styleManipulation';
import { isStyle, getVariable } from './util';

/*
 * Color uses PREFIX-XXXXXXXX where XXXXXXXX is the 8 digit
 * hex represenation of the RGBA color.
 */
const styleToColor = (style) => getSolidFromHex(getVariable(style, COLOR));

const colorToStyle = (color) => `${COLOR}-${getHexFromSolid(color)}`;

function elementToStyle(element) {
  const isSpan = element.tagName.toLowerCase() === 'span';
  const rawColor = element.style.color;
  const hasColor = Boolean(rawColor);
  if (isSpan && hasColor) {
    const solid = createSolidFromString(rawColor);
    return colorToStyle(solid);
  }

  return null;
}

function stylesToCSS(styles) {
  const style = styles.find((someStyle) => isStyle(someStyle, COLOR));
  if (!style) {
    return null;
  }
  let color;
  try {
    color = styleToColor(style);
  } catch (e) {
    return null;
  }

  return generatePatternStyles(color, 'color');
}

function getColor(editorState) {
  const styles = getPrefixStylesInSelection(editorState, COLOR);
  if (styles.length > 1) {
    return MULTIPLE_VALUE;
  }
  const colorStyle = styles[0];
  if (colorStyle === NONE) {
    return createSolid(0, 0, 0);
  }
  return styleToColor(colorStyle);
}

function setColor(editorState, color) {
  // opaque black is default, and isn't necessary to set
  const isBlack = isPatternEqual(createSolid(0, 0, 0), color);
  const shouldSetStyle = () => !isBlack;

  // the style util manages conversion
  const getStyleToSet = () => colorToStyle(color);

  return togglePrefixStyle(editorState, COLOR, shouldSetStyle, getStyleToSet);
}

const formatter = {
  elementToStyle,
  stylesToCSS,
  autoFocus: false,
  getters: {
    color: getColor,
  },
  setters: {
    setColor,
  },
};

export default formatter;
