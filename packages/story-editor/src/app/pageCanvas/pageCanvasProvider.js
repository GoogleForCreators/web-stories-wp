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
import { useCallback, useRef } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import storyPageToCanvas from '../../utils/storyPageToCanvas';
import { getAccessibleTextColorsFromPixels } from '../../utils/contrastUtils';
import useIdleQueue from '../../utils/useIdleTaskQueue';
import { useStory } from '../story';
import { STABLE_ARRAY } from '../../constants';
import Context from './context';
import getPixelDataFromCanvas from './getPixelDataFromCanvas';
import usePageCanvasMap from './usePageCanvasMap';
import PageCanvasCacheValidator from './pageCanvasCacheValidator';
import pageWithoutSelection from './pageWithoutSelection';

function PageCanvasProvider({ children }) {
  const queueIdleTask = useIdleQueue();
  const [pageCanvasMap, actions] = usePageCanvasMap();
  const pageIds = useStory(({ state }) => state.pages.map(({ id }) => id));
  const { currentPage, singleElementSelection } = useStory(({ state }) => ({
    singleElementSelection:
      state.selectedElementIds?.length === 1
        ? state.selectedElementIds
        : STABLE_ARRAY,
    currentPage: state.currentPage,
  }));

  const stateRefValue = {
    currentPageValue: currentPage,
    pageCanvasMapValue: pageCanvasMap,
    singleElementSelectionValue: singleElementSelection,
  };
  const stateRef = useRef(stateRefValue);
  stateRef.current = stateRefValue;

  const generateDefferedPageCanvas = useCallback(
    ([taskId, page]) => {
      const cancelIdleTask = queueIdleTask([
        taskId,
        async () => {
          const canvas = await storyPageToCanvas(page, {});
          actions.setPageCanvas({ pageId: page.id, canvas });
        },
      ]);
      return cancelIdleTask;
    },
    [queueIdleTask, actions]
  );

  const getSelectionExclusionCanvas = useCallback(async () => {
    const { currentPageValue, singleElementSelectionValue } = stateRef.current;
    const page = pageWithoutSelection(
      currentPageValue,
      singleElementSelectionValue
    );
    const canvas = await storyPageToCanvas(page, {});
    return canvas;
  }, []);

  const getCanvas = useCallback(async () => {
    const { currentPageValue, pageCanvasMapValue } = stateRef.current;

    let canvas = pageCanvasMapValue[currentPageValue.id];
    if (!canvas) {
      canvas = await storyPageToCanvas(currentPageValue, {});
      actions.setPageCanvas({ pageId: currentPageValue.id, canvas });
    }
    return canvas;
  }, [actions]);

  const calculateAccessibleTextColors = useCallback(
    async (element) => {
      const { singleElementSelectionValue } = stateRef.current;

      let canvas;
      if (singleElementSelectionValue.includes(element.id)) {
        canvas = await getSelectionExclusionCanvas();
      } else {
        canvas = await getCanvas();
      }

      const { fontSize } = element;
      const pixelData = getPixelDataFromCanvas(canvas, element);
      const accessibleTextColors = getAccessibleTextColorsFromPixels(
        pixelData,
        fontSize
      );

      return accessibleTextColors;
    },
    [getSelectionExclusionCanvas, getCanvas]
  );

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
      {pageIds.map((pageId) => (
        <PageCanvasCacheValidator
          key={pageId}
          pageId={pageId}
          clearPageCanvasCache={actions.clearPageCanvas}
        />
      ))}
      {children}
    </Context.Provider>
  );
}

PageCanvasProvider.propTypes = {
  children: PropTypes.node,
};

export default PageCanvasProvider;
