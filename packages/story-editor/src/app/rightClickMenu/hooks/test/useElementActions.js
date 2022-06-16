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
import { useSnackbar } from '@googleforcreators/design-system';
import { renderHook } from '@testing-library/react';
/**
 * Internal dependencies
 */
import { useElementActions } from '..';
import { useCanvas, useStory } from '../../..';
import { ELEMENT } from './testUtils';

jest.mock('@googleforcreators/design-system', () => ({
  ...jest.requireActual('@googleforcreators/design-system'),
  useSnackbar: jest.fn(),
}));
jest.mock('@googleforcreators/tracking'); // should be mocked in the testing env.
jest.mock('../../../story/useStory');
jest.mock('../../../canvas/useCanvas');

const mockUseCanvas = useCanvas;
const mockUseStory = useStory;
const mockUseSnackbar = useSnackbar;

const mockShowSnackbar = jest.fn();
const mockClearBackgroundElement = jest.fn();
const mockDuplicateElementsById = jest.fn();
const mockSetBackgroundElement = jest.fn();
const mockUpdateElementsById = jest.fn();
const mockSetEditingElement = jest.fn();

const defaultStoryContext = {
  selectedElements: [ELEMENT],
  clearBackgroundElement: mockClearBackgroundElement,
  duplicateElementsById: mockDuplicateElementsById,
  setBackgroundElement: mockSetBackgroundElement,
  updateElementsById: mockUpdateElementsById,
};

describe('useElementActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseStory.mockReturnValue(defaultStoryContext);
    mockUseCanvas.mockReturnValue(mockSetEditingElement);
    mockUseSnackbar.mockReturnValue(mockShowSnackbar);
  });

  describe('element duplication', () => {
    it('should not duplicate anything if no elements are selected', () => {
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        selectedElements: [],
      });

      const { result } = renderHook(() => useElementActions());

      result.current.handleDuplicateSelectedElements();

      expect(mockDuplicateElementsById).not.toHaveBeenCalled();
    });
    it('should duplicate the selected element', () => {
      const { result } = renderHook(() => useElementActions());

      result.current.handleDuplicateSelectedElements();

      expect(mockDuplicateElementsById).toHaveBeenCalledWith({
        elementIds: [ELEMENT.id],
      });
    });

    it('should duplicate the selected elements', () => {
      // need multiple selected elements
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        selectedElements: [{ id: '1' }, { id: 'potato' }, { id: '3' }],
      });

      const { result } = renderHook(() => useElementActions());

      result.current.handleDuplicateSelectedElements();

      expect(mockDuplicateElementsById).toHaveBeenCalledWith({
        elementIds: ['1', 'potato', '3'],
      });
    });

    it('should show a snackbar', () => {
      const { result } = renderHook(() => useElementActions());

      result.current.handleDuplicateSelectedElements();

      expect(mockShowSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          actionLabel: 'Undo',
          message: 'Duplicated elements.',
        })
      );
    });
  });

  describe('scale and crop', () => {
    it('should not set the editing element if there is no selected element', () => {
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        selectedElements: [],
      });

      const { result } = renderHook(() => useElementActions());

      result.current.handleOpenScaleAndCrop();

      expect(mockSetEditingElement).not.toHaveBeenCalled();
    });

    it('should set the editing element', () => {
      const { result } = renderHook(() => useElementActions());

      result.current.handleOpenScaleAndCrop({ type: 'event' });

      expect(mockSetEditingElement).toHaveBeenCalledWith(ELEMENT.id, {
        type: 'event',
      });
    });
  });

  describe('set page background', () => {
    it('should not set the page background if no element is selected', () => {
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        selectedElements: [],
      });

      const { result } = renderHook(() => useElementActions());

      result.current.handleSetPageBackground();

      expect(mockSetBackgroundElement).not.toHaveBeenCalled();
    });

    it('should not set the page background if background element is selected', () => {
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        selectedElements: [{ isBackground: true }],
      });

      const { result } = renderHook(() => useElementActions());

      result.current.handleSetPageBackground();

      expect(mockSetBackgroundElement).not.toHaveBeenCalled();
    });

    it('should set the page background', () => {
      const { result } = renderHook(() => useElementActions());

      result.current.handleSetPageBackground();

      expect(mockSetBackgroundElement).toHaveBeenCalledWith({
        elementId: ELEMENT.id,
      });
    });

    it('should show a snackbar', () => {
      const { result } = renderHook(() => useElementActions());

      result.current.handleSetPageBackground();

      expect(mockShowSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          actionLabel: 'Undo',
          message: 'Set page background.',
        })
      );
    });
  });

  describe('remove page background', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        selectedElements: [{ ...ELEMENT, isBackground: true }],
      });
    });

    it('should not remove the page background if no element is selected', () => {
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        selectedElements: [],
      });

      const { result } = renderHook(() => useElementActions());

      result.current.handleRemovePageBackground();

      expect(mockClearBackgroundElement).not.toHaveBeenCalled();
    });

    it('should not set the page background if non-background element is selected', () => {
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        selectedElements: [{ isBackground: false }],
      });

      const { result } = renderHook(() => useElementActions());

      result.current.handleRemovePageBackground();

      expect(mockClearBackgroundElement).not.toHaveBeenCalled();
    });

    it('should set the page background', () => {
      const { result } = renderHook(() => useElementActions());

      result.current.handleRemovePageBackground();

      expect(mockUpdateElementsById).toHaveBeenCalledWith({
        elementIds: [ELEMENT.id],
        properties: expect.any(Function),
      });

      // Removing the background removes background-specific styles (overlay)
      // also resets the opacity

      // Need to call updater fn that is passed to `updateElementById`
      // to see what is being updated.
      const updatedStyles =
        mockUpdateElementsById.mock.calls[0][0].properties();
      expect(updatedStyles).toStrictEqual({
        overlay: null,
        opacity: 100,
        isBackground: false,
      });

      expect(mockClearBackgroundElement).toHaveBeenCalledTimes(1);
    });

    it('should show a snackbar', () => {
      const { result } = renderHook(() => useElementActions());

      result.current.handleRemovePageBackground();

      expect(mockShowSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          actionLabel: 'Undo',
          message: 'Removed page background.',
        })
      );
    });
  });
});
