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
import { renderToStaticMarkup } from '@googleforcreators/react';
import { dataPixels, PAGE_HEIGHT } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import { TextOutputWithUnits } from '../text/output';
import { calcFontMetrics } from '../text/util';

const MEASURER_STYLES = {
  boxSizing: 'border-box',
  visibility: 'hidden',
  position: 'fixed',
  contain: 'layout paint',
  top: '-9999px',
  left: '-9999px',
  zIndex: -1,
  overflowWrap: 'break-word',
  ...(false && {
    // For debugging purposes - this will show the output render on screen
    background: 'red',
    visibility: 'visible',
    top: '99px',
    left: '99px',
    zIndex: 10000,
  }),
};

const MEASURER_PROPS = {
  dataToStyleX: (x) => `${x}px`,
  dataToStyleY: (y) => `${y}px`,
};

const MEASURER_NODE = '__WEB_STORIES_MEASURER__';
const LAST_ELEMENT = '__WEB_STORIES_LASTEL__';

export function calculateTextHeight(element, width) {
  const measurer = getOrCreateMeasurer(element);
  setStyles(measurer, { width: `${width}px`, height: null });
  return measurer.parentNode.offsetHeight;
}

export function calculateFitTextFontSize(element, width, height) {
  const measurer = getOrCreateMeasurer(element);
  setStyles(measurer, { width: `${width}px`, height: null, fontSize: null });

  // Binomial search for the best font size.
  let minFontSize = 1;
  let maxFontSize = PAGE_HEIGHT;
  let margin;
  while (maxFontSize - minFontSize > 1) {
    const mid = dataPixels((minFontSize + maxFontSize) / 2);
    const { marginOffset } = calcFontMetrics({ ...element, fontSize: mid });
    margin = marginOffset;
    setStyles(measurer, {
      fontSize: `${mid}px`,
      margin: `${-marginOffset / 2}px 0`,
    });
    const currentHeight = measurer.offsetHeight;
    if (currentHeight - marginOffset > height) {
      maxFontSize = mid;
    } else {
      minFontSize = mid;
    }
  }
  // This is for keeping the debug window in sync
  setStyles(measurer, {
    fontSize: `${minFontSize}px`,
    margin: `${-margin / 2}px 0`,
  });
  return { fontSize: minFontSize, marginOffset: margin };
}

function getOrCreateMeasurer(element) {
  let measurerNode =
    typeof document !== 'undefined' ? document.body[MEASURER_NODE] : null;
  if (!measurerNode) {
    measurerNode = document.createElement('div');
    measurerNode.id = '__web-stories-text-measurer';
    measurerNode.className = 'web-stories-content';
    setStyles(measurerNode, MEASURER_STYLES);
    document.body.appendChild(measurerNode);
    document.body[MEASURER_NODE] = measurerNode;
  }
  // Very unfortunately `ReactDOM.render()` is not synchoronous. Thus, we
  // have to use `renderToStaticMarkup()` markup instead and do manual
  // diffing.
  if (changed(measurerNode, element)) {
    measurerNode.innerHTML = renderToStaticMarkup(
      <TextOutputWithUnits element={element} {...MEASURER_PROPS} />,
      measurerNode
    );
  }
  return measurerNode.firstElementChild;
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

function changed(node, element) {
  const lastElement = node[LAST_ELEMENT];
  node[LAST_ELEMENT] = element;
  if (!node.firstElementChild || !lastElement) {
    return true;
  }
  return lastElement !== element;
}
