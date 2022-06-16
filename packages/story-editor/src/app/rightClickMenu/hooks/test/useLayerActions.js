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
import { renderHook } from '@testing-library/react';
/**
 * Internal dependencies
 */
import { useLayerActions } from '..';
import { useStory } from '../../..';
import { ELEMENT } from './testUtils';

jest.mock('@googleforcreators/tracking'); // should be mocked in the testing env.
jest.mock('../../../story/useStory');

const mockUseStory = useStory;

const mockArrangeElement = jest.fn();

const defaultStoryContext = {
  arrangeElement: mockArrangeElement,
  elements: [
    { id: 'background-layer', isBackground: true },
    { id: 'bottom-layer' },
    { id: 'middle-bottom-layer' },
    ELEMENT,
    { id: 'middle-top-layer' },
    { id: 'top-layer' },
  ],
  selectedElement: ELEMENT,
};

describe('useLayerActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseStory.mockReturnValue(defaultStoryContext);
  });

  it('should not move the background layer', () => {
    mockUseStory.mockReturnValue({
      ...defaultStoryContext,
      selectedElement: { id: 'background-layer', isBackground: true },
    });
    const { result } = renderHook(() => useLayerActions());

    expect(result.current.canElementMoveForwards).toBe(false);
    expect(result.current.canElementMoveBackwards).toBe(false);

    result.current.handleSendBackward();
    result.current.handleSendToBack();
    result.current.handleBringForward();
    result.current.handleBringToFront();

    expect(mockArrangeElement).not.toHaveBeenCalled();
  });

  it('should not be movable if the selected element is the only layer', () => {
    mockUseStory.mockReturnValue({
      ...defaultStoryContext,
      elements: [{ id: 'background-layer', isBackground: true }, ELEMENT],
    });

    const { result } = renderHook(() => useLayerActions());

    result.current.handleSendBackward();

    expect(result.current.canElementMoveBackwards).toBe(false);
    expect(result.current.canElementMoveForwards).toBe(false);
  });

  describe('moving backwards', () => {
    it('should move the selected layer backwards', () => {
      const { result } = renderHook(() => useLayerActions());

      result.current.handleSendBackward();

      expect(mockArrangeElement).toHaveBeenCalledWith({
        elementId: ELEMENT.id,
        position: 2,
      });
    });

    it('should move the selected layer all the way back', () => {
      const { result } = renderHook(() => useLayerActions());

      result.current.handleSendToBack();

      expect(mockArrangeElement).toHaveBeenCalledWith({
        elementId: ELEMENT.id,
        position: 1, // can't move past background
      });
    });

    it('`canElementMoveBackwards` should be false it the selected element is all the way back', () => {
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        elements: [
          { id: 'background-layer', isBackground: true },
          ELEMENT,
          { id: 'bottom-layer' },
          { id: 'middle-bottom-layer' },
          { id: 'middle-top-layer' },
          { id: 'top-layer' },
        ],
      });

      const { result } = renderHook(() => useLayerActions());

      result.current.handleSendBackward();

      expect(result.current.canElementMoveBackwards).toBe(false);
    });
  });

  describe('moving forwards', () => {
    it('should move the selected layer forwards', () => {
      const { result } = renderHook(() => useLayerActions());

      result.current.handleBringForward();

      expect(mockArrangeElement).toHaveBeenCalledWith({
        elementId: ELEMENT.id,
        position: 4,
      });
    });

    it('should move the selected layer all the way forward', () => {
      const { result } = renderHook(() => useLayerActions());

      result.current.handleBringToFront();

      expect(mockArrangeElement).toHaveBeenCalledWith({
        elementId: ELEMENT.id,
        position: 5,
      });
    });

    it('`canElementMoveForwards` should be false it the selected element is all the way forward', () => {
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        elements: [
          { id: 'background-layer', isBackground: true },
          { id: 'bottom-layer' },
          { id: 'middle-bottom-layer' },
          { id: 'middle-top-layer' },
          { id: 'top-layer' },
          ELEMENT,
        ],
      });

      const { result } = renderHook(() => useLayerActions());

      result.current.handleSendBackward();

      expect(result.current.canElementMoveForwards).toBe(false);
    });
  });
});
