/*
 * Copyright 2020 Google LLC
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
import { render, fireEvent } from '@testing-library/react';
import { useRef } from '@googleforcreators/react';
import { registerElementType } from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import useHighlights from '../../../app/highlights/useHighlights';
import useCanvasKeys from '../../../app/canvas/useCanvasKeys';
import StoryContext from '../../../app/story/context.js';
import CanvasContext from '../../../app/canvas/context.js';

jest.mock('../../../app/highlights/useHighlights', () => ({
  ...jest.requireActual('../../../app/highlights/useHighlights'),
  __esModule: true,
  default: jest.fn(),
}));

const Canvas = () => {
  const ref = useRef(null);
  useCanvasKeys(ref);
  return <div ref={ref} />;
};

const mockUseHighlights = useHighlights;
const setHighlights = jest.fn();

describe('useCanvasKeys', function () {
  beforeAll(() => {
    elementTypes.forEach(registerElementType);
    mockUseHighlights.mockImplementation(() => ({
      setHighlights,
    }));
  });

  it('should select all elements and collect their IDs when mod+a is pressed.', () => {
    const setSelectedElementsById = jest.fn();

    const { container } = render(
      <StoryContext.Provider
        value={{
          actions: { setSelectedElementsById },
          state: {
            currentPage: { elements: [{ id: '123' }, { id: '456' }] },
          },
        }}
      >
        <Canvas />
      </StoryContext.Provider>
    );

    fireEvent.keyDown(container, {
      key: 'a',
      which: 65,
      ctrlKey: true,
    });

    expect(setSelectedElementsById).toHaveBeenCalledWith({
      elementIds: ['123', '456'],
    });
  });

  it('should enter edit mode when the element can when the "Enter" key is pressed.', () => {
    const setEditingElement = jest.fn();

    const { container } = render(
      <StoryContext.Provider
        value={{
          actions: { addElements: () => {} },
          state: {
            selectedElements: [{ id: 'abc123', type: 'text' }],
          },
        }}
      >
        <CanvasContext.Provider
          value={{
            state: { isEditing: false },
            actions: { setEditingElement },
          }}
        >
          <Canvas />
        </CanvasContext.Provider>
      </StoryContext.Provider>
    );

    fireEvent.keyDown(container, {
      key: 'Enter',
      which: 13,
    });

    expect(setEditingElement).toHaveBeenCalledWith('abc123');
  });

  it('should delete selected elements when the "Delete" key is pressed.', () => {
    const deleteSelectedElements = jest.fn();

    const { container } = render(
      <StoryContext.Provider
        value={{
          state: {
            currentPage: { elements: [{ id: '123' }] },
            selectedElements: [{ id: '123' }],
          },
          actions: { deleteSelectedElements },
        }}
      >
        <Canvas />
      </StoryContext.Provider>
    );

    fireEvent.keyDown(container, {
      key: 'Backspace',
      which: 8,
    });

    expect(deleteSelectedElements).toHaveBeenCalledWith();
  });

  it('should open and focus the design panel link input when mod+k is pressed.', () => {
    const { container } = render(
      <StoryContext.Provider
        value={{
          actions: {},
          state: {
            selectedElements: [{ id: '123' }, { id: '456' }],
          },
        }}
      >
        <Canvas />
      </StoryContext.Provider>
    );

    fireEvent.keyDown(container, {
      key: 'k',
      which: 75,
      ctrlKey: true,
    });

    expect(setHighlights).toHaveBeenCalledWith({
      elements: [{ id: '123' }, { id: '456' }],
      highlight: 'LINK',
    });
  });

  it('should should play/pause animation when mod+space is pressed.', () => {
    const updateAnimationState = jest.fn();

    const { container } = render(
      <StoryContext.Provider
        value={{
          state: {
            currentPageNumber: 2,
            currentPage: { elements: [{ id: '123' }] },
          },
          actions: { updateAnimationState },
        }}
      >
        <Canvas />
      </StoryContext.Provider>
    );

    fireEvent.keyDown(container, {
      key: 'Space',
      which: 32,
      ctrlKey: true,
    });

    expect(updateAnimationState).toHaveBeenCalledWith({
      animationState: 'playing',
    });
  });
});
