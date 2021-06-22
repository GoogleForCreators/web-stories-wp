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
import { useCallback, useEffect, useRef, useState } from 'react';
import { dataFontEm, PAGE_HEIGHT, getBox } from '@web-stories-wp/units';
import * as htmlToImage from 'html-to-image';

/**
 * Internal dependencies
 */
import getInsertedElementSize from '../../../../utils/getInsertedElementSize';
import useLibrary from '../../useLibrary';
import { useHistory, useCanvas } from '../../../../app';
import { getHTMLFormatters } from '../../../richText/htmlManipulation';

const POSITION_MARGIN = dataFontEm(1);
const TYPE = 'text';

function useInsertPreset() {
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));
  const {
    state: { versionNumber },
  } = useHistory();

  const { fullbleedContainer } = useCanvas((state) => ({
    fullbleedContainer: state.state.fullbleedContainer,
  }));

  const htmlFormatters = getHTMLFormatters();
  const { setColor } = htmlFormatters;

  const [autoColor, setAutoColor] = useState(null);
  const [presetAtts, setPresetAtts] = useState(null);

  const lastPreset = useRef(null);

  useEffect(() => {
    // Version number change is happening due to adding a preset.
    // If we have set the last element but not the history version number yet,
    // Set the version number that was the result of adding the preset.
    if (lastPreset.current?.element && !lastPreset.current.versionNumber) {
      lastPreset.current.versionNumber = versionNumber;
    } else if (lastPreset.current?.versionNumber) {
      // If the version number changes meanwhile and we already have it set
      // something else changed meanwhile so clear the lastPreset, too.
      lastPreset.current = null;
    }
  }, [versionNumber]);

  const getPosition = useCallback((element) => {
    const { y } = element;
    if (!lastPreset.current) {
      return y;
    }
    const {
      element: { height: lastHeight, y: lastY },
    } = lastPreset.current;
    let positionedY = lastY + lastHeight + POSITION_MARGIN;
    // Let's get the width/height of the element about to be inserted.
    const { width, height } = getInsertedElementSize(
      TYPE,
      element.width,
      element.height,
      {
        ...element,
        y: positionedY,
      }
    );
    // If the element is going out of page, use the default position.
    if (positionedY + height >= PAGE_HEIGHT) {
      positionedY = y;
    }
    return {
      width,
      height,
      y: positionedY,
    };
  }, []);

  const getInsertionColors = useCallback(
    (atts) => {
      console.log(atts);
      htmlToImage.toCanvas(fullbleedContainer).then((canvas) => {
        const ctx = canvas.getContext('2d');
        const box = getBox(
          { ...atts, height: atts.height ? atts.height : 41 },
          canvas.width,
          canvas.height
        );
        const { x, y, width, height } = box;
        const pixelData = ctx.getImageData(x, y, width, height).data;
        setAutoColor(sampleColors(pixelData));
      });
      return null;
    },
    [fullbleedContainer]
  );

  useEffect(() => {
    if (autoColor && presetAtts) {
      const { content } = presetAtts;
      const test = setColor(content, { color: autoColor });
      const addedElement = insertElement(TYPE, {
        ...presetAtts,
        content: setColor(content, { color: autoColor }),
      });
      lastPreset.current = {
        versionNumber: null,
        element: addedElement,
      };
      setAutoColor(null);
      setPresetAtts(null);
    }
  }, [autoColor, presetAtts, insertElement, setColor]);

  const insertPreset = useCallback(
    (element) => {
      const atts = getPosition(element);
      setPresetAtts({
        ...element,
        ...atts,
      });
      getInsertionColors({ ...element, ...atts });
    },
    [getPosition, getInsertionColors]
  );
  return insertPreset;
}

// constants (mess with these)
const REQUIRED_CONTRAST = 3;
const OK_CONTRAST = 1.5;

// global helper functions
function calculateContrast(rgb1, rgb2) {
  const luminance = (r, g, b) => {
    const a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function sampleColors(pixelData) {
  const white = [255, 255, 255, 255];
  const black = [0, 0, 0, 255];
  const colors = [];
  for (let i = 0; i < pixelData.length; i += 4) {
    colors.push([
      pixelData[i],
      pixelData[i + 1],
      pixelData[i + 2],
      pixelData[i + 3],
    ]);
  }

  const contrasts = colors.map((c) => calculateContrast(white, c));
  const contrastIsGreat = !contrasts.some((ct) => ct < REQUIRED_CONTRAST);
  const contrastIsOK = !contrasts.some((ct) => ct < OK_CONTRAST);

  if (contrastIsGreat || contrastIsOK) {
    console.log('contrast is ok/great with white font color');
    return {
      r: 255,
      g: 255,
      b: 255,
      a: 1,
    };
  }

  /*if(contrastIsOK && DEBUG.FROSTED_EFFECT && !elem.dataset.nofrost) {
    elem.classList.remove('highlight');
    elem.classList.add('frosted');
    elem.style.color = '#fff';

    if(DEBUG.PROFILING)
      console.timeEnd("sample colors took");
    return;
  }*/

  // try black (or alternative, dark color)..
  const altContrasts = colors.map((c) => calculateContrast(black, c));
  const altContrastIsGreat = !altContrasts.some((ct) => ct < REQUIRED_CONTRAST);
  const altContrastIsOK = !contrasts.some((ct) => ct < OK_CONTRAST);

  if (altContrastIsGreat) {
    console.log('great with black color');
  } else {
    console.log('is OK with black?', contrastIsOK);
  }

  // Return just default black otherwise.
  return {
    r: 0,
    g: 0,
    b: 0,
    a: 1,
  };

  // if no dark or light text color worked, we have an uneven background,
  // an need to apply a text highlight
  /*elem.classList.add('highlight');
  elem.classList.remove('frosted');
  const darkHighlightWorksBetter =
    contrasts.reduce((a, c) => a + c, 0) <
    altContrasts.reduce((a, c) => a + c, 0);

  if (darkHighlightWorksBetter) {
    //console.log('contrast is great with dark highlight');
    elem.style.setProperty('--theme-color', `rgb(${THEME_COLOR_BG[0]},${THEME_COLOR_BG[1]},${THEME_COLOR_BG[2]})`);
    elem.style.color = '#fff';
  } else {
    //console.log('contrast is great with white highlight');
    elem.style.setProperty('--theme-color', '#fff');
    elem.style.color = `rgb(${black[0]},${black[1]},${black[2]})`;
  }*/
}

export default useInsertPreset;
