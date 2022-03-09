import { useReducer, shallowEqual, useMemo } from '@googleforcreators/react';
import { v4 as uuidv4 } from 'uuid';
import { renderHook, act } from '@testing-library/react-hooks';

import { usePageCanvas, PageCanvasProvider } from '..';
import createMockPage from '../testUtils/createMockPage';
import createMockUseContextSelector from '../testUtils/createMockUseContextSelector';

jest.mock('../../story/useStory');
import useStory from '../../story/useStory';
jest.mock('../../../utils/storyPageToCanvas');
import storyPageToCanvas from '../../../utils/storyPageToCanvas';

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
  let forceRender;

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
    const { mockUseContextSelector, forceRender: _forceRender } =
      createMockUseContextSelector(getContextValue);
    forceRender = _forceRender;
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
        act(() => forceRender());

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
        selectedElement.opacity = 50;
        act(() => forceRender());

        // change selection
        const anotherElement = currentPage.elements[0];
        mockStoryContext.state.selectedElementIds = [anotherElement.id];
        act(() => forceRender());

        // revert selection back to originally selected element
        mockStoryContext.state.selectedElementIds = [selectedElement.id];
        act(() => forceRender());

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
        act(() => forceRender());

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
