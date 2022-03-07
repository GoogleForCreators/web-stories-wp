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
import usePageSnapshot from './usePageSnapshot';
import PageCanvasCacheValidator from './pageCanvasCacheValidator';
import getPageWithoutSelection from './getPageWithoutSelection';

/**
 * @typedef {import('../../../types').Page} Page
 */

function PageCanvasProvider({ children }) {
  const queueIdleTask = useIdleQueue();
  const [pageCanvasMap, actions] = usePageCanvasMap();
  const { getSnapshotCanvas, setSnapshot } = usePageSnapshot();
  const pageIds = useStory(({ state }) => state.pages.map(({ id }) => id));
  const { currentPage, singleElementSelection } = useStory(({ state }) => ({
    singleElementSelection:
      state.selectedElementIds?.length === 1
        ? state.selectedElementIds
        : STABLE_ARRAY,
    currentPage: state.currentPage,
  }));

  // sync values to a ref so callbacks don't cause re-renders
  // on consuming components
  const values = {
    currentPageValue: currentPage,
    pageCanvasMapValue: pageCanvasMap,
    singleElementSelectionValue: singleElementSelection,
  };
  const valuesRef = useRef(values);
  valuesRef.current = values;

  /**
   * makes a request to the idleCallback queue to generate a canvas
   * for a given story page.
   *
   * @param {[string, Page]} PageTuple - a tuple containing a uid for the requested generation task & the page to generate a canvas from
   * @return {Function} a cleanup function to clear the requested canvas generation
   */
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

  /**
   * Small wrapper around `generateDefferedPageCanvas()` that just passes in the
   * current page.
   *
   * @return {void}
   */
  const generateDefferedCurrentPageCanvas = useCallback(() => {
    const { currentPageValue, pageCanvasMapValue } = valuesRef.current;
    const canvas = pageCanvasMapValue[currentPageValue.id];
    if (!canvas) {
      generateDefferedPageCanvas([currentPageValue.id, currentPageValue]);
    }
  }, [generateDefferedPageCanvas]);

  /**
   * Gets or creates a canvas from the page and excludes
   * the current selection from the generated canvas.
   *
   * @return {HTMLCanvasElement} generated canvas
   */
  const getSelectionExclusionCanvas = useCallback(
    async (page, selection) => {
      const pageWithoutSelection = getPageWithoutSelection(page, selection);
      let canvas = getSnapshotCanvas(pageWithoutSelection);
      if (!canvas) {
        // Generate the page canvas with the excluded elements if we don't already
        // have a valid canvas in the cache.
        canvas = await storyPageToCanvas(pageWithoutSelection, {});
        setSnapshot({
          page: pageWithoutSelection,
          canvas,
        });
      }
      return canvas;
    },
    [setSnapshot, getSnapshotCanvas]
  );

  /**
   * Gets or creates a generated canvas from the current story page.
   *
   * @return {HTMLCanvasElement} generated canvas
   */
  const getCanvas = useCallback(
    async (page) => {
      const { pageCanvasMapValue } = valuesRef.current;

      let canvas = pageCanvasMapValue[page.id];
      if (!canvas) {
        canvas = await storyPageToCanvas(page, {});
        actions.setPageCanvas({ pageId: page.id, canvas });
      }
      return canvas;
    },
    [actions]
  );

  /**
   * Given an element, returns accessible text colors relative
   * to the current page
   *
   * @param {} story element
   * @return {Object} Returns object consisting of color and backgroundColor in case relevant.
   */
  const calculateAccessibleTextColors = useCallback(
    async (element) => {
      const { currentPageValue, singleElementSelectionValue } =
        valuesRef.current;

      let canvas;
      if (singleElementSelectionValue.includes(element.id)) {
        canvas = await getSelectionExclusionCanvas(
          currentPageValue,
          singleElementSelectionValue
        );
      } else {
        canvas = await getCanvas(currentPageValue);
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
          generateDefferedPageCanvas,
          generateDefferedCurrentPageCanvas,
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
