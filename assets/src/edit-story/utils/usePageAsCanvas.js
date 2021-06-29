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
import { useCanvas, useStory } from '../app';
import { getAccessibleTextColorsFromPixels } from './contrastUtils';

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

  const pageHash = useMemo(() => {
    const jsonStr = JSON.stringify(currentPage);
    return window.btoa(unescape(encodeURIComponent(jsonStr)));
  }, [currentPage]);

  const hasPageHashChanged = useCallback(() => {
    return pageHash !== pageCanvasData.currentPage;
  }, [pageHash, pageCanvasData]);

  const generateCanvasFromPage = useCallback(
    (callback) => {
      if (
        !pageCanvasData ||
        hasPageHashChanged(currentPage, pageCanvasData.currentPage)
      ) {
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
      }
    },
    [
      currentPage,
      fullbleedContainer,
      pageCanvasData,
      setPageCanvasData,
      hasPageHashChanged,
      pageHash,
    ]
  );

  const calculateAccessibleTextColors = useCallback(
    (atts, callback) => {
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
        callback(getAccessibleTextColorsFromPixels(pixelData, fontSize));
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
    [currentPage, generateCanvasFromPage, pageCanvasData, hasPageHashChanged]
  );

  return {
    calculateAccessibleTextColors,
    generateCanvasFromPage,
  };
}

export default usePageAsCanvas;
