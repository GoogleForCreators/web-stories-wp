/*
 * Copyright 2022 Google LLC
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
import PropTypes from 'prop-types';
import {
  useCallback,
  useReducer,
  useEffect,
  useRef,
} from '@googleforcreators/react';
import { FULLBLEED_RATIO, getBox, PAGE_RATIO } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import objectWithout from '../../utils/objectWithout';
import {
  requestIdleCallback,
  cancelIdleCallback,
} from '../../utils/idleCallback';
import storyPageToCanvas from '../../utils/storyPageToCanvas';
import { getAccessibleTextColorsFromPixels } from '../../utils/contrastUtils';
import { calculateTextHeight } from '../../utils/textMeasurements';
import { useStory } from '../story';
import Context from './context';

function getPixelDataFromCanvas(canvas, atts) {
  const ctx = canvas.getContext('2d');
  // The canvas does not consider danger zone as y = 0, so we need to adjust that.
  const safeZoneDiff =
    (canvas.width / FULLBLEED_RATIO - canvas.width / PAGE_RATIO) / 2;
  const box = getBox(
    {
      ...atts,
      height: atts.height ? atts.height : calculateTextHeight(atts, atts.width),
    },
    canvas.width,
    canvas.height - 2 * safeZoneDiff
  );
  const { x, y: origY, width, height } = box;
  const y = origY + safeZoneDiff;
  const pixelData = ctx.getImageData(x, y, width, height).data;
  return pixelData;
}

const INITIAL_STATE = {};

const reducer = (map, action) => {
  switch (action.type) {
    case 'SET_PAGE_CANVAS': {
      const { pageId, canvas } = action.payload;
      return {
        ...map,
        [pageId]: canvas,
      };
    }
    case 'RESET_PAGE_CANVAS': {
      const { pageId } = action.payload;
      return {
        ...map,
        [pageId]: 'idle',
      };
    }
    default:
      return map;
  }
};

function PageCanvasProvider({ children }) {
  const idleCallbackIdRef = useRef(null);
  const [pageCanvasMap, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { currentPage } = useStory(({ state }) => ({
    currentPage: state.currentPage,
  }));

  const currentPageRef = useRef(currentPage);
  currentPageRef.current = currentPage;
  const currentPageCanvas = pageCanvasMap[currentPageRef.current.id];
  const getCurrentPageCanvas = useCallback(async () => {
    if (currentPageCanvas) {
      return currentPageCanvas;
    }
    cancelIdleCallback(idleCallbackIdRef.current);
    const canvas = await storyPageToCanvas(currentPageRef.current);
    dispatch({
      type: 'SET_PAGE_CANVAS',
      payload: { pageId: currentPageRef.current.id, canvas },
    });
    return canvas;
  }, [currentPageCanvas]);

  const calculateAccessibleTextColors = useCallback(
    async (atts) => {
      const canvas = await getCurrentPageCanvas();
      const pixelData = getPixelDataFromCanvas(canvas, atts);
      const { fontSize } = atts;
      const accessibleTextColors = await getAccessibleTextColorsFromPixels(
        pixelData,
        fontSize
      );
      return accessibleTextColors;
    },
    [getCurrentPageCanvas]
  );

  // When the current page updates, its generated canvas
  // is no longer valid & we need to generate a new one
  useEffect(() => {
    dispatch({
      type: 'RESET_PAGE_CANVAS',
      payload: { pageId: currentPage.id },
    });

    cancelIdleCallback(idleCallbackIdRef.current);
    idleCallbackIdRef.current = requestIdleCallback(async () => {
      const canvas = await storyPageToCanvas(currentPage);
      dispatch({
        type: 'SET_PAGE_CANVAS',
        payload: { pageId: currentPage.id, canvas },
      });
    });
  }, [currentPage]);

  return (
    <Context.Provider
      value={{
        state: {
          pageCanvasMap,
        },
        actions: {
          calculateAccessibleTextColors,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}

PageCanvasProvider.propTypes = {
  children: PropTypes.node,
};

export default PageCanvasProvider;
