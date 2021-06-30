/*
 * Copyright 2021 Google LLC
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
import { useCallback, useMemo } from 'react';
import * as htmlToImage from 'html-to-image';
import { getBox } from '@web-stories-wp/units';

/**
 * Internal dependencies
 */
import useLibrary from '../components/library/useLibrary';
import { useCanvas, useLayout, useStory } from '../app';
import { ZOOM_SETTING } from '../constants';
import { getAccessibleTextColorsFromPixels } from './contrastUtils';
import { calculateTextHeight } from './textMeasurements';

function usePageAsCanvas() {
  const { pageCanvasData, setPageCanvasData } = useLibrary((state) => ({
    pageCanvasData: state.state.pageCanvasData,
    setPageCanvasData: state.actions.setPageCanvasData,
  }));
  const { fullbleedContainer } = useCanvas((state) => ({
    fullbleedContainer: state.state.fullbleedContainer,
  }));
  const { currentPage } = useStory(({ state }) => {
    return {
      currentPage: state.currentPage,
    };
  });
  const { zoomSetting, setZoomSetting } = useLayout(
    ({ state: { zoomSetting }, actions: { setZoomSetting } }) => ({
      zoomSetting,
      setZoomSetting,
    })
  );

  const pageHash = useMemo(() => {
    const jsonStr = JSON.stringify(currentPage);
    return window.btoa(unescape(encodeURIComponent(jsonStr)));
  }, [currentPage]);

  const hasPageHashChanged = useCallback(() => {
    return pageHash !== pageCanvasData.currentPage;
  }, [pageHash, pageCanvasData]);

  const generateCanvasFromPage = useCallback(
    (callback, resetZoom = false) => {
      // If we're not resetting the zoom and we're zoomed in, skip pre-generation of the canvas.
      // We'll be resetting the zoom later when inserting any element so it would be not useful.
      if (!resetZoom && zoomSetting !== ZOOM_SETTING.FIT) {
        return;
      }
      if (
        !pageCanvasData ||
        hasPageHashChanged(currentPage, pageCanvasData.currentPage)
      ) {
        if (resetZoom) {
          // If we're inserting an element, we need to reset zoom, too.
          setZoomSetting(ZOOM_SETTING.FIT);
        }
        // Wait one tick for the zoom to settle in.
        setTimeout(() => {
          htmlToImage
            .toCanvas(fullbleedContainer, {
              fontEmbedCss: '',
            })
            .then((canvas) => {
              if (callback) {
                callback(canvas);
              } else {
                setPageCanvasData({
                  canvas,
                  currentPage: pageHash,
                });
              }
            });
        });
      }
    },
    [
      currentPage,
      fullbleedContainer,
      pageCanvasData,
      setPageCanvasData,
      setZoomSetting,
      zoomSetting,
      hasPageHashChanged,
      pageHash,
    ]
  );

  const calculateAccessibleTextColors = useCallback(
    (atts, callback) => {
      const contrastCalculation = (canvas) => {
        const ctx = canvas.getContext('2d');
        const calcHeight = calculateTextHeight(atts, atts.width);
        const box = getBox(
          { ...atts, height: atts.height ? atts.height : calcHeight },
          canvas.width,
          canvas.height
        );
        const { x, y, width, height } = box;
        const pixelData = ctx.getImageData(x, y, width, height).data;
        const { fontSize } = atts;
        callback(getAccessibleTextColorsFromPixels(pixelData, fontSize));
      };
      if (
        pageCanvasData &&
        !hasPageHashChanged(currentPage, pageCanvasData.currentPage)
      ) {
        contrastCalculation(pageCanvasData.canvas);
      } else {
        generateCanvasFromPage(contrastCalculation, true /* reset zoom */);
      }
      return null;
    },
    [currentPage, generateCanvasFromPage, pageCanvasData, hasPageHashChanged]
  );

  return {
    calculateAccessibleTextColors,
    generateCanvasFromPage,
  };
}

export default usePageAsCanvas;
