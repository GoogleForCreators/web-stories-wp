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
import { useCallback, useRef } from '@googleforcreators/react';
import type { PropsWithChildren } from 'react';
import type { Page, TextElement } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { getAccessibleTextColorsFromPixels } from '../../utils/contrastUtils';
import useIdleQueue from '../../utils/useIdleTaskQueue';
import { useStory } from '../story';
import { STABLE_ARRAY } from '../../constants';
import storyPageToCanvas from './utils/storyPageToCanvas';
import Context from './context';
import getPixelDataFromCanvas from './getPixelDataFromCanvas';
import usePageCanvasMap from './usePageCanvasMap';
import usePageSnapshot from './usePageSnapshot';
import PageCanvasCacheValidator from './pageCanvasCacheValidator';
import getPageWithoutSelection from './getPageWithoutSelection';

/**
 * @typedef {import('@googleforcreators/elements').Page} Page
 */

function PageCanvasProvider({ children }: PropsWithChildren<unknown>) {
  const queueIdleTask = useIdleQueue();
  // This is our cache to hold generated canvases for
  // full story pages within the story we're viewing
  const [pageCanvasMap, actions] = usePageCanvasMap();
  // This is our cache to hold 1 generated canvas
  // for a partial page
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
    currentPageValue: currentPage as Page,
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
  const generateDeferredPageCanvas = useCallback(
    ([taskId, page]: [string, Page]) => {
      const cancelIdleTask = queueIdleTask({
        taskId,
        task: async () => {
          try {
            const canvas = await storyPageToCanvas(page, {});
            actions.setPageCanvas({ pageId: page.id, canvas });
          } catch {
            actions.setPageCanvas({ pageId: page.id, canvas: null });
          }
        },
      });
      return cancelIdleTask;
    },
    [queueIdleTask, actions]
  );

  /**
   * Small wrapper around `generateDeferredPageCanvas()` that just passes in the
   * current page.
   *
   * @return {void}
   */
  const generateDeferredCurrentPageCanvas = useCallback(() => {
    const { currentPageValue, pageCanvasMapValue } = valuesRef.current;
    const canvas = pageCanvasMapValue[currentPageValue.id];
    if (typeof canvas === 'undefined') {
      generateDeferredPageCanvas([currentPageValue.id, currentPageValue]);
    }
  }, [generateDeferredPageCanvas]);

  /**
   * Gets or creates a canvas from the page and excludes
   * the current selection from the generated canvas.
   *
   * @return {HTMLCanvasElement} generated canvas
   */
  const getSelectionExclusionCanvas = useCallback(
    async (page: Page, selection: string[]) => {
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
    async (page: Page) => {
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
    async (element: TextElement) => {
      const { currentPageValue, singleElementSelectionValue } =
        valuesRef.current;

      let canvas: HTMLCanvasElement;
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
          generateDeferredPageCanvas,
          generateDeferredCurrentPageCanvas,
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

export default PageCanvasProvider;
