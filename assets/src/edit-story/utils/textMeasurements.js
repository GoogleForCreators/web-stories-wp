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
import { PAGE_HEIGHT } from '../constants';

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
    lineHeight: lineHeight || 'normal',
    letterSpacing: `${letterSpacing ? letterSpacing + 'em' : null}`,
    textAlign,
    padding: `${padding ? padding : '0'}%`,
  });
  measurerNode.innerHTML = content;
  return measurerNode;
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
