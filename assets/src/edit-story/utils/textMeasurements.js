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
import { PAGE_HEIGHT, BACKGROUND_TEXT_MODE } from '../constants';

let measurerNode = null;

export function calculateTextHeight(element, width) {
  const measurer = getOrCreateMeasurer(element);
  setStyles(measurer, { width: `${width}px`, height: null });
  return measurer.offsetHeight;
}

export function calculateFitTextFontSize(element, width, height) {
  const measurer = getOrCreateMeasurer(element);
  setStyles(measurer, { width: `${width}px`, height: null, fontSize: null });

  // Binomial search for the best font size.
  let minFontSize = 1;
  let maxFontSize = PAGE_HEIGHT;
  while (maxFontSize - minFontSize > 1) {
    const mid = (minFontSize + maxFontSize) / 2;
    setStyles(measurer, { fontSize: `${mid}px` });
    const currentHeight = measurer.offsetHeight;
    if (currentHeight > height) {
      maxFontSize = mid;
    } else {
      minFontSize = mid;
    }
  }

  return minFontSize;
}

function getOrCreateMeasurer({
  backgroundTextMode,
  content,
  fontFamily,
  fontStyle,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
  textAlign,
  padding,
}) {
  if (!measurerNode) {
    measurerNode = document.createElement('div');
    measurerNode.id = '__web-stories-text-measurer';
    setStyles(measurerNode, {
      visibility: 'hidden',
      position: 'fixed',
      contain: 'layout paint',
      top: '-9999px',
      left: '-9999px',
      zIndex: -1,
    });
    document.body.appendChild(measurerNode);
  }
  setStyles(measurerNode, {
    whiteSpace: 'pre-wrap',
    fontFamily,
    fontStyle,
    fontWeight,
    fontSize: `${fontSize}px`,
    lineHeight: getLineHeight({ lineHeight, backgroundTextMode, padding }),
    letterSpacing: letterSpacing ? letterSpacing + 'em' : '0',
    textAlign,
    padding: padding ? `${padding.vertical}px ${padding.horizontal}px` : '0px',
  });
  measurerNode.innerHTML = content;
  return measurerNode;
}

function getLineHeight({
  lineHeight,
  backgroundTextMode,
  padding: { vertical },
}) {
  if (backgroundTextMode === BACKGROUND_TEXT_MODE.HIGHLIGHT) {
    return `calc(
      1em
        ${`${lineHeight > 0 ? ' + ' : ' - '}${Math.abs(lineHeight)}em`}
        ${`${vertical > 0 ? ' + ' : ' - '}${2 * Math.abs(vertical)}px`}
    )`;
  }
  if (lineHeight) {
    return lineHeight;
  }
  return 'normal';
}

function setStyles(node, styles) {
  for (const k in styles) {
    if (Object.prototype.hasOwnProperty.call(styles, k)) {
      const v = styles[k];
      if (v === null) {
        node.style[k] = '';
      } else {
        node.style[k] = v;
      }
    }
  }
}
