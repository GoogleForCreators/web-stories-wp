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
import { act, renderHook } from '@testing-library/react-hooks';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
jest.mock('../../story/useStory');
jest.mock('../../../utils/storyPageToCanvas');
import { PageCanvasProvider, usePageCanvas } from '..';
import storyPageToCanvas from '../../../utils/storyPageToCanvas';
import useStory from '../../story/useStory';
import createMockPage from '../testUtils/createMockPage';
import createMockUseContextSelector from '../testUtils/createMockUseContextSelector';

jest.mock('../../../utils/contrastUtils', () => {
  return {
    __esModule: true,
    getAccessibleTextColorsFromPixels: () => {},
  };
});
jest.mock('../getPixelDataFromCanvas', () => {
  return {
    __esModule: true,
    default: () => {},
  };
});

function renderUsePageCanvas() {
  return renderHook(() => usePageCanvas(), {
    wrapper: PageCanvasProvider,
  });
}

describe('usePageCanvas', () => {
  let mockStoryContext;
  let currentPage;
  let forceUseStoryRender;

  beforeEach(() => {
    currentPage = createMockPage();
    storyPageToCanvas.mockImplementation(
      () =>
        'lets pretend this is a canvas. I wont tell the computer if you dont 🤫'
    );

    mockStoryContext = {
      actions: {},
      state: {
        pages: [currentPage],
        currentPage,
        selectedElementIds: [],
      },
    };

    // kind of a jank ass mock implementation of useContextSelector but it works
    const getContextValue = () => mockStoryContext;
    const { mockUseContextSelector, forceRender } =
      createMockUseContextSelector(getContextValue);
    forceUseStoryRender = forceRender;
    useStory.mockImplementation(mockUseContextSelector);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('calculateAccessibleTextColors', () => {
    describe('page canvas cache', () => {
      it('generates a page canvas when called and canvas cache is not populated', async () => {
        const { result } = renderUsePageCanvas();
        const element = { id: 'a' };

        // cache populates with generated canvas for currentPage
        await act(async () => {
          await result.current.actions.calculateAccessibleTextColors(element);
        });
        expect(storyPageToCanvas).toHaveBeenCalledTimes(1);
      });

      it('does not generate a page canvas when called and canvas cache is populated', async () => {
        const { result } = renderUsePageCanvas();
        const element1 = { id: 'a' };
        const element2 = { id: 'b' };

        // cache populates with generated canvas for currentPage
        await act(async () => {
          await result.current.actions.calculateAccessibleTextColors(element1);
        });
        expect(storyPageToCanvas).toHaveBeenCalledTimes(1);

        // cache already populated with generated canvas for currentPage
        await act(async () => {
          await result.current.actions.calculateAccessibleTextColors(element2);
        });
        expect(storyPageToCanvas).toHaveBeenCalledTimes(1);
      });

      it('generates a page canvas when called and canvas cache is stale', async () => {
        const { result } = renderUsePageCanvas();
        const element1 = { id: 'a' };
        const element2 = { id: 'b' };

        // cache populates with generated canvas for currentPage
        await act(async () => {
          await result.current.actions.calculateAccessibleTextColors(element1);
        });
        expect(storyPageToCanvas).toHaveBeenCalledTimes(1);

        // make currentPage stale mocking an update to it
        const updatedCurrentPage = {
          ...currentPage,
          elements: [...currentPage.elements],
        };
        mockStoryContext.state.pages = [updatedCurrentPage];
        mockStoryContext.state.currentPage = updatedCurrentPage;
        act(() => forceUseStoryRender());

        // cache populates with generated canvas for updated currentPage
        await act(async () => {
          await result.current.actions.calculateAccessibleTextColors(element2);
        });
        expect(storyPageToCanvas).toHaveBeenCalledTimes(2);
      });
    });

    describe('partial page snapshot cache', () => {
      it('generates a partial page canvas when called and partial page snapshot cache is not populated', async () => {
        // set up story to have single selected element
        const lastElementIndex = currentPage.elements.length - 1;
        const selectedElement = currentPage.elements[lastElementIndex];
        mockStoryContext.state.selectedElementIds = [selectedElement.id];

        // render hook
        const { result } = renderUsePageCanvas();

        // since we're testing an existing element against the currentPage
        // calculateAccessibleTextColors knows to exclude the element we're testing
        // from the generated canvas. It holds this canvas generated from a partial
        // of the page in the snapshot cache.
        await act(async () => {
          await result.current.actions.calculateAccessibleTextColors(
            selectedElement
          );
        });
        expect(storyPageToCanvas).toHaveBeenCalledTimes(1);
      });

      it('does not generate a new partial page canvas when called and snapshot cache stays valid', async () => {
        // set up story to have single selected element
        const lastElementIndex = currentPage.elements.length - 1;
        const selectedElement = currentPage.elements[lastElementIndex];
        mockStoryContext.state.selectedElementIds = [selectedElement.id];

        // render hook
        const { result } = renderUsePageCanvas();

        // since we're testing an existing element against the currentPage
        // calculateAccessibleTextColors knows to exclude the element we're testing
        // from the generated canvas. It holds this canvas generated from a partial
        // of the page in the snapshot cache.
        await act(async () => {
          await result.current.actions.calculateAccessibleTextColors(
            selectedElement
          );
        });
        expect(storyPageToCanvas).toHaveBeenCalledTimes(1);

        // update the selected element
        currentPage.elements = [
          ...currentPage.elements.filter(({ id }) => id !== selectedElement.id),
          { ...selectedElement, opacity: 50 },
        ];
        act(() => forceUseStoryRender());

        // change selection
        const anotherElement = currentPage.elements[0];
        mockStoryContext.state.selectedElementIds = [anotherElement.id];
        act(() => forceUseStoryRender());

        // revert selection back to originally selected element
        mockStoryContext.state.selectedElementIds = [selectedElement.id];
        act(() => forceUseStoryRender());

        // since we haven't called calculateAccessibleTextColors since the
        // last story partial page changed, and with the current selection
        // the canvas generated for the partial page is the same since the
        // last time we called calculateAccessibleTextColors, the snapshot
        // cache should still be valid and shouldn't have been updated.
        await act(async () => {
          await result.current.actions.calculateAccessibleTextColors(
            selectedElement
          );
        });
        expect(storyPageToCanvas).toHaveBeenCalledTimes(1);
      });

      it('generates a new partial page canvas when called and snapshot cache is not valid', async () => {
        // set up story to have single selected element
        const lastElementIndex = currentPage.elements.length - 1;
        const selectedElement = currentPage.elements[lastElementIndex];
        mockStoryContext.state.selectedElementIds = [selectedElement.id];

        // render hook
        const { result } = renderUsePageCanvas();

        // since we're testing an existing element against the currentPage
        // calculateAccessibleTextColors knows to exclude the element we're testing
        // from the generated canvas. It holds this canvas generated from a partial
        // of the page in the snapshot cache.
        await act(async () => {
          await result.current.actions.calculateAccessibleTextColors(
            selectedElement
          );
        });
        expect(storyPageToCanvas).toHaveBeenCalledTimes(1);

        // add a new element
        const newElement = { ...selectedElement, id: uuidv4() };
        currentPage.elements = [...currentPage.elements, newElement];
        act(() => forceUseStoryRender());

        // in this scenario, the snapshot cache is no longer valid
        // because we've added a new element to the currentPage.
        // We should be generating a new canvas based on the updated
        // page partial in this scenario.
        await act(async () => {
          await result.current.actions.calculateAccessibleTextColors(
            selectedElement
          );
        });
        expect(storyPageToCanvas).toHaveBeenCalledTimes(2);
      });
    });
  });
});
