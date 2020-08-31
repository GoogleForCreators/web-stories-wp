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

/**
 * Internal dependencies
 */
import { useRef } from 'react';
import useCanvasKeys from '../useCanvasKeys';
import StoryContext from '../../../app/story/context.js';
import CanvasContext from '../../../components/canvas/context.js';

const Canvas = () => {
  const ref = useRef(null);
  useCanvasKeys(ref);
  return <div ref={ref} />;
};

describe('useCanvasKeys', function () {
  it('should select all elements and collect their IDs when mod+a is pressed.', async function () {
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

    await fireEvent.keyDown(container, {
      key: 'a',
      which: 65,
      ctrlKey: true,
    });

    expect(setSelectedElementsById).toHaveBeenCalledWith({
      elementIds: ['123', '456'],
    });
  });

  it('should enter edit mode when the element can when the "Enter" key is pressed.', async function () {
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

    await fireEvent.keyDown(container, {
      key: 'Enter',
      which: 13,
    });

    expect(setEditingElement).toHaveBeenCalledWith('abc123');
  });

  it('should delete selected elements when the "Delete" key is pressed.', async function () {
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

    await fireEvent.keyDown(container, {
      key: 'Backspace',
      which: 8,
    });

    expect(deleteSelectedElements).toHaveBeenCalledWith();
  });

  it('should deselect items when the "Escape" key is pressed.', async function () {
    const clearSelection = jest.fn();

    const { container } = render(
      <StoryContext.Provider
        value={{
          state: {
            currentPage: { elements: [{ id: '123' }] },
            selectedElements: [{ id: '123' }],
          },
          actions: { clearSelection },
        }}
      >
        <Canvas />
      </StoryContext.Provider>
    );

    await fireEvent.keyDown(container, {
      key: 'Escape',
      which: 27,
    });

    expect(clearSelection).toHaveBeenCalledWith();
  });
});
