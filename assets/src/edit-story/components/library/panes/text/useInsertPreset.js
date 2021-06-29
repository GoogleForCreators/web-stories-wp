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

/**
 * Internal dependencies
 */
import getInsertedElementSize from '../../../../utils/getInsertedElementSize';
import useLibrary from '../../useLibrary';
import { useHistory, useStory } from '../../../../app';
import { getHTMLFormatters } from '../../../richText/htmlManipulation';
import { getAccessibleTextColorsFromPixels } from '../../../../utils/contrastUtils';
import { BACKGROUND_TEXT_MODE } from '../../../../constants';
import { applyHiddenPadding } from '../../../panels/design/textBox/utils';
import useGenerateCanvasFromPage from '../../../../utils/useGenerateCanvasFromPage';
import { hasPageHashChanged } from './utils';

const POSITION_MARGIN = dataFontEm(1);
const TYPE = 'text';

function useInsertPreset() {
  const { insertElement, pageCanvasData } = useLibrary((state) => ({
    pageCanvasData: state.state.pageCanvasData,
    insertElement: state.actions.insertElement,
  }));
  const {
    state: { versionNumber },
  } = useHistory();

  const { currentPage } = useStory(({ state }) => {
    return {
      currentPage: state.currentPage,
    };
  });

  const htmlFormatters = getHTMLFormatters();
  const { setColor } = htmlFormatters;

  const [autoColor, setAutoColor] = useState(null);
  const [presetAtts, setPresetAtts] = useState(null);

  const lastPreset = useRef(null);
  const generateCanvasFromPage = useGenerateCanvasFromPage();

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

  const calculateColors = useCallback(
    (atts) => {
      const contrastCalculation = (canvas) => {
        const ctx = canvas.getContext('2d');
        // @todo Get the correct height based on font size / line-height, etc.
        const box = getBox(
          { ...atts, height: atts.height ? atts.height : 41 },
          canvas.width,
          canvas.height
        );
        const { x, y, width, height } = box;
        const pixelData = ctx.getImageData(x, y, width, height).data;
        const { fontSize } = atts;
        setAutoColor(getAccessibleTextColorsFromPixels(pixelData, fontSize));
      };
      if (
        pageCanvasData &&
        !hasPageHashChanged(currentPage, pageCanvasData.currentPage)
      ) {
        contrastCalculation(pageCanvasData.canvas);
      } else {
        generateCanvasFromPage(contrastCalculation);
      }
      return null;
    },
    [pageCanvasData, currentPage, generateCanvasFromPage]
  );

  // Once the colors have been detected, we'll insert the element.
  useEffect(() => {
    if (autoColor && presetAtts) {
      // Add all the necessary props in case of color / highlight.
      const { content } = presetAtts;
      const { color, backgroundColor } = autoColor;
      const highlightProps = backgroundColor
        ? {
            backgroundColor: { color: backgroundColor },
            backgroundTextMode: BACKGROUND_TEXT_MODE.HIGHLIGHT,
            padding: applyHiddenPadding(presetAtts),
          }
        : null;
      const addedElement = insertElement(TYPE, {
        ...presetAtts,
        content: setColor(content, { color }),
        ...highlightProps,
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
      calculateColors({ ...element, ...atts });
    },
    [getPosition, calculateColors]
  );
  return insertPreset;
}

export default useInsertPreset;
