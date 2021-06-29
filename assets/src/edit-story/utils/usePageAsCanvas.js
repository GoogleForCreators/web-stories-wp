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
import { useCallback } from 'react';
import * as htmlToImage from 'html-to-image';

/**
 * Internal dependencies
 */
import {
  getPageHash,
  hasPageHashChanged,
} from '../components/library/panes/text/utils';

import useLibrary from '../components/library/useLibrary';
import { useCanvas, useStory } from '../app';

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

  const generateCanvasFromPage = useCallback(
    (callback) => {
      if (
        !pageCanvasData ||
        hasPageHashChanged(currentPage, pageCanvasData.currentPage)
      ) {
        // @todo Create util.
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
                currentPage: getPageHash(currentPage),
              });
            }
          });
      }
    },
    [currentPage, fullbleedContainer, pageCanvasData, setPageCanvasData]
  );
  return {
    generateCanvasFromPage,
  };
}

export default usePageAsCanvas;
