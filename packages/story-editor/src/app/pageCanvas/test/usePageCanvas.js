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

/**
 * Internal dependencies
 */
import { PageCanvasProvider, usePageCanvas } from '..';
import storyPageToCanvas from '../../../utils/storyPageToCanvas';
import useStory from '../../story/useStory';
import createMockPage from '../testUtils/createMockPage';
import { MockStoryProvider, useStoryMock } from '../testUtils/useStoryMock';

jest.mock('../../story/useStory');
jest.mock('../../../utils/storyPageToCanvas');

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

function renderUsePageCanvas(_mockStoryContext) {
  return renderHook(() => [usePageCanvas(), useStoryMock()], {
    wrapper: ({ children }) => (
      <MockStoryProvider mockContextValue={_mockStoryContext}>
        <PageCanvasProvider>{children}</PageCanvasProvider>
      </MockStoryProvider>
    ),
  });
}

describe('usePageCanvas', () => {
  let mockStoryContext;
  let currentPage;

  beforeEach(() => {
    storyPageToCanvas.mockImplementation(
      () =>
        'lets pretend this is a canvas. I wont tell the computer if you dont 🤫'
    );

    currentPage = createMockPage();
    mockStoryContext = {
      actions: {},
      state: {
        pages: [currentPage],
        currentPage,
        selectedElementIds: [],
      },
    };

    useStory.mockImplementation(useStoryMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('calculateAccessibleTextColors', () => {
    describe('page canvas cache', () => {
      it('generates a page canvas when called and canvas cache is not populated', async () => {
        const { result } = renderUsePageCanvas(mockStoryContext);
        const element = { id: 'a' };

        // see that no canvas has been generated at this point
        expect(storyPageToCanvas).toHaveBeenCalledTimes(0);

        // cache populates with generated canvas for currentPage
        await act(async () => {
          const [usePageCanvasCurrent] = result.current;
          await usePageCanvasCurrent.actions.calculateAccessibleTextColors(
            element
          );
        });
        expect(storyPageToCanvas).toHaveBeenCalledTimes(1);
      });

      it('does not generate a page canvas when called and canvas cache is populated', async () => {
        const { result } = renderUsePageCanvas(mockStoryContext);
        const element1 = { id: 'a' };
        const element2 = { id: 'b' };

        // cache populates with generated canvas for currentPage
        await act(async () => {
          const [usePageCanvasCurrent] = result.current;
          await usePageCanvasCurrent.actions.calculateAccessibleTextColors(
            element1
          );
        });
        expect(storyPageToCanvas).toHaveBeenCalledTimes(1);

        // cache already populated with generated canvas for currentPage
        await act(async () => {
          const [usePageCanvasCurrent] = result.current;
          await usePageCanvasCurrent.actions.calculateAccessibleTextColors(
            element2
          );
        });
        expect(storyPageToCanvas).toHaveBeenCalledTimes(1);
      });

      it('generates a page canvas when called and canvas cache is stale', async () => {
        const { result } = renderUsePageCanvas(mockStoryContext);
        const [, useStoryMockCurrent] = result.current;
        const { actions: storyActions } = useStoryMockCurrent;

        const element1 = { id: 'a' };
        const element2 = { id: 'b' };

        // cache populates with generated canvas for currentPage
        await act(async () => {
          const [usePageCanvasCurrent] = result.current;
          await usePageCanvasCurrent.actions.calculateAccessibleTextColors(
            element1
          );
        });
        expect(storyPageToCanvas).toHaveBeenCalledTimes(1);

        // make currentPage stale by making an update to it
        act(() => storyActions.duplicateLastElement());
        expect(result.current[0].state.pageCanvasMap).toStrictEqual({});

        // cache populates with generated canvas for updated currentPage
        await act(async () => {
          const [usePageCanvasCurrent] = result.current;
          await usePageCanvasCurrent.actions.calculateAccessibleTextColors(
            element2
          );
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
        const { result } = renderUsePageCanvas(mockStoryContext);

        // since we're testing an existing element against the currentPage
        // calculateAccessibleTextColors knows to exclude the element we're testing
        // from the generated canvas. It holds this canvas generated from a partial
        // of the page in the snapshot cache.
        await act(async () => {
          const [usePageCanvasCurrent] = result.current;
          await usePageCanvasCurrent.actions.calculateAccessibleTextColors(
            selectedElement
          );
        });
        expect(storyPageToCanvas).toHaveBeenCalledTimes(1);

        // See that we're calling the story generation on a page partial and
        // not the full page.
        const generatedStory = storyPageToCanvas.mock.calls[0][0];
        for (const element of generatedStory.elements) {
          expect(element.id).not.toBe(selectedElement.id);
        }
      });

      it('does not generate a new partial page canvas when called and snapshot cache stays valid', async () => {
        // set up story to have single selected element
        const lastElementIndex = currentPage.elements.length - 1;
        const selectedElement = currentPage.elements[lastElementIndex];
        mockStoryContext.state.selectedElementIds = [selectedElement.id];

        // render hook
        const { result } = renderUsePageCanvas(mockStoryContext);
        const [, useStoryMockCurrent] = result.current;
        const { actions: storyActions } = useStoryMockCurrent;

        // since we're testing an existing element against the currentPage
        // calculateAccessibleTextColors knows to exclude the element we're testing
        // from the generated canvas. It holds this canvas generated from a partial
        // of the page in the snapshot cache.
        await act(async () => {
          const [usePageCanvasCurrent] = result.current;
          await usePageCanvasCurrent.actions.calculateAccessibleTextColors(
            selectedElement
          );
        });
        expect(storyPageToCanvas).toHaveBeenCalledTimes(1);

        // update the selected element
        act(() =>
          storyActions.updateSelectedElement({ properties: { opacity: 50 } })
        );

        // change selection
        const anotherElementId = currentPage.elements[0].id;
        act(() =>
          storyActions.setSelectedElement({ elementId: anotherElementId })
        );

        // revert selection back to originally selected element
        act(() =>
          storyActions.setSelectedElement({ elementId: selectedElement.id })
        );

        // since we haven't called calculateAccessibleTextColors since the
        // last story partial page changed, and with the current selection
        // the canvas generated for the partial page is the same since the
        // last time we called calculateAccessibleTextColors, the snapshot
        // cache should still be valid and shouldn't have been updated.
        await act(async () => {
          const [usePageCanvasCurrent] = result.current;
          await usePageCanvasCurrent.actions.calculateAccessibleTextColors(
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
        const { result } = renderUsePageCanvas(mockStoryContext);
        const [, useStoryMockCurrent] = result.current;
        const { actions: storyActions } = useStoryMockCurrent;

        // since we're testing an existing element against the currentPage
        // calculateAccessibleTextColors knows to exclude the element we're testing
        // from the generated canvas. It holds this canvas generated from a partial
        // of the page in the snapshot cache.
        await act(async () => {
          const [usePageCanvasCurrent] = result.current;
          await usePageCanvasCurrent.actions.calculateAccessibleTextColors(
            selectedElement
          );
        });
        expect(storyPageToCanvas).toHaveBeenCalledTimes(1);

        // add a new element
        act(() => storyActions.duplicateLastElement());

        // in this scenario, the snapshot cache is no longer valid
        // because we've added a new element to the currentPage.
        // We should be generating a new canvas based on the updated
        // page partial in this scenario.
        await act(async () => {
          const [usePageCanvasCurrent] = result.current;
          await usePageCanvasCurrent.actions.calculateAccessibleTextColors(
            selectedElement
          );
        });
        expect(storyPageToCanvas).toHaveBeenCalledTimes(2);
      });
    });
  });
});
