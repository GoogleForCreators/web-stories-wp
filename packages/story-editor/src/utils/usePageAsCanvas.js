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
import { useCallback, useMemo } from '@web-stories-wp/react';
import { FULLBLEED_RATIO, getBox, PAGE_RATIO } from '@web-stories-wp/units';

/**
 * Internal dependencies
 */
import { useCanvas, useLayout, useStory } from '../app';
import { ZOOM_SETTING } from '../constants';
import { getAccessibleTextColorsFromPixels } from './contrastUtils';
import { calculateTextHeight } from './textMeasurements';

function usePageAsCanvas() {
  const {
    pageCanvasData,
    setPageCanvasData,
    pageCanvasPromise,
    setPageCanvasPromise,
    fullbleedContainer,
  } = useCanvas((state) => ({
    pageCanvasData: state.state.pageCanvasData,
    pageCanvasPromise: state.state.pageCanvasPromise,
    setPageCanvasData: state.actions.setPageCanvasData,
    setPageCanvasPromise: state.actions.setPageCanvasPromise,
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
    return JSON.stringify(currentPage);
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
        const onCompletion = (canvas) => {
          if (callback) {
            callback(canvas);
          } else {
            setPageCanvasData({
              canvas,
              currentPage: pageHash,
            });
          }
          setPageCanvasPromise(null);
        };
        const onFail = () => {
          resetZoom && callback();
          setPageCanvasPromise(null);
        };
        // If we haven't started the generation yet, create a promise.
        if (!pageCanvasPromise && fullbleedContainer) {
          import(/* webpackChunkName: "chunk-html-to-image" */ 'html-to-image')
            .then((htmlToImage) => {
              const promise = htmlToImage.toCanvas(fullbleedContainer, {
                fontEmbedCss: '',
                pixelRatio: 1,
              });
              setPageCanvasPromise(promise);
              promise.then(onCompletion).catch(onFail);
            })
            .catch(() => {});
        } else if (resetZoom) {
          // If we already have a promise and we're resetting zoom, we're inserting an element.
          // This means that the callback might have changed and we need to handle the promise again.
          // Wait one tick for the zoom to settle in.
          setTimeout(() => {
            pageCanvasPromise.then(onCompletion).catch(() => onFail());
          });
        }
      }
    },
    [
      currentPage,
      fullbleedContainer,
      pageCanvasData,
      pageCanvasPromise,
      setPageCanvasPromise,
      setPageCanvasData,
      setZoomSetting,
      zoomSetting,
      hasPageHashChanged,
      pageHash,
    ]
  );

  const calculateAccessibleTextColors = useCallback(
    (atts, isInserting = true, skipCanvasGeneration = false) => {
      return new Promise((resolve) => {
        // If we're calculating the color without actually inserting the element and in zoomed mode, skip.
        // We'll always insert the element in FIT mode, calculating it in other modes would be useless.
        if (!isInserting && zoomSetting !== ZOOM_SETTING.FIT) {
          resolve(null);
        }
        const contrastCalculation = (canvas) => {
          try {
            const ctx = canvas.getContext('2d');
            // The canvas does not consider danger zone as y = 0, so we need to adjust that.
            const safeZoneDiff =
              (canvas.width / FULLBLEED_RATIO - canvas.width / PAGE_RATIO) / 2;
            const box = getBox(
              {
                ...atts,
                height: atts.height
                  ? atts.height
                  : calculateTextHeight(atts, atts.width),
              },
              canvas.width,
              canvas.height - 2 * safeZoneDiff
            );
            const { x, y: origY, width, height } = box;
            const y = origY + safeZoneDiff;
            const pixelData = ctx.getImageData(x, y, width, height).data;
            const { fontSize } = atts;
            resolve(getAccessibleTextColorsFromPixels(pixelData, fontSize));
          } catch (e) {
            // Fall back to default color if failing to get image data.
            resolve({ color: null });
          }
        };
        // If we have data and nothing has changed or we can skip the canvas update, just calculate the contrast.
        // Skipping is used when preset are placed under each other consecutively, the same image can be used then.
        if (
          pageCanvasData &&
          (!hasPageHashChanged(currentPage, pageCanvasData.currentPage) ||
            skipCanvasGeneration)
        ) {
          contrastCalculation(pageCanvasData.canvas);
        } else {
          generateCanvasFromPage(contrastCalculation, isInserting);
        }
      });
    },
    [
      currentPage,
      generateCanvasFromPage,
      pageCanvasData,
      hasPageHashChanged,
      zoomSetting,
    ]
  );

  return {
    calculateAccessibleTextColors,
    generateCanvasFromPage,
  };
}

export default usePageAsCanvas;
