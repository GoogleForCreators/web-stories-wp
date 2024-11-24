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
import {
  createSolid,
  generatePatternStyles,
  isPatternEqual,
  getColorFromGradientStyle,
  type Gradient,
  type Pattern,
  DEFAULT_GRADIENT,
} from '@googleforcreators/patterns';
import type { EditorState, DraftInlineStyle } from 'draft-js';
import type { CSSProperties } from 'react';

/**
 * Internal dependencies
 */
import { NONE, MULTIPLE_VALUE, GRADIENT_COLOR } from '../customConstants';
import {
  togglePrefixStyle,
  getPrefixStylesInSelection,
} from '../styleManipulation';
import {
  isStyle,
  styleToGradientColor as styleToColor,
  gradientColorToStyle as colorToStyle,
} from './util';

function elementToStyle(element: HTMLElement): string | null {
  const isSpan = element.tagName.toLowerCase() === 'span';
  const rawBackground = element.style.backgroundImage;
  const hasBackground = Boolean(rawBackground);

  if (isSpan && hasBackground) {
    const gradient = getColorFromGradientStyle(rawBackground);
    return colorToStyle(gradient);
  }

  return null;
}

function stylesToCSS(styles: DraftInlineStyle): null | CSSProperties {
  const colorStyle = styles.find((someStyle) =>
    isStyle(someStyle, GRADIENT_COLOR)
  );

  if (!colorStyle) {
    return null;
  }

  let color: Pattern;
  try {
    color = styleToColor(colorStyle);
  } catch (e) {
    return null;
  }

  const { backgroundImage } = generatePatternStyles(color);

  return {
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundImage,
    backgroundClip: 'text',
  };
}

function getColor(editorState: EditorState): Pattern | '((MULTIPLE))' {
  const styles = getPrefixStylesInSelection(editorState, GRADIENT_COLOR);
  if (styles.length > 1) {
    return MULTIPLE_VALUE;
  }
  const colorStyle = styles[0];
  if (colorStyle === NONE) {
    return createSolid(0, 0, 0);
  }
  return styleToColor(colorStyle);
}

function setColor(editorState: EditorState, color: Gradient) {
  const isBlack = isPatternEqual(DEFAULT_GRADIENT, color);
  const shouldSetStyle = () => !isBlack;
  const getStyleToSet = () => colorToStyle(color);
  return togglePrefixStyle(
    editorState,
    GRADIENT_COLOR,
    shouldSetStyle,
    getStyleToSet
  );
}

const formatter = {
  elementToStyle,
  stylesToCSS,
  autoFocus: false,
  getters: {
    gradientColor: getColor,
  },
  setters: {
    setGradientColor: setColor,
  },
};

export default formatter;
