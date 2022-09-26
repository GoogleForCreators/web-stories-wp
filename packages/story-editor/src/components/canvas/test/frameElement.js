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
import { createSolid } from '@googleforcreators/patterns';
import { registerElementType } from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import { TestFrameElement } from './_utils';

/* eslint-disable testing-library/no-node-access, testing-library/no-container */

describe('FrameElement selection', () => {
  beforeAll(() => {
    elementTypes.forEach(registerElementType);
  });

  let setSelectedElementsById;
  let toggleElementInSelection;
  let storyContext;

  beforeEach(() => {
    setSelectedElementsById = jest.fn();
    toggleElementInSelection = jest.fn();
    storyContext = {
      actions: {
        setSelectedElementsById,
        toggleElementInSelection,
      },
    };
  });

  it('should select unselected element on mousedown', () => {
    const element = {
      id: '1',
      type: 'text',
      x: 0,
      y: 0,
      width: 100,
      height: 80,
      rotationAngle: 0,
      font: {
        family: 'Roboto',
      },
      fontSize: 20,
      content: 'hello world',
      color: createSolid(255, 255, 255),
    };
    const { container } = render(
      <TestFrameElement storyContext={storyContext} element={element} />
    );

    // Fire a mousedown event.
    const wrapper = container.querySelector('[data-element-id="1"]');
    fireEvent.mouseDown(wrapper);
    expect(setSelectedElementsById).toHaveBeenCalledWith({
      elementIds: ['1'],
      withLinked: true,
    });
  });

  it('should select unselected element on focus', () => {
    const element = {
      id: '1',
      type: 'text',
      x: 0,
      y: 0,
      width: 100,
      height: 80,
      rotationAngle: 0,
      font: {
        family: 'Roboto',
      },
      fontSize: 20,
      content: 'hello world',
      color: createSolid(255, 255, 255),
    };
    const { container } = render(
      <TestFrameElement storyContext={storyContext} element={element} />
    );

    // Fire a mousedown event.
    const wrapper = container.querySelector('[data-element-id="1"]');
    fireEvent.focus(wrapper);
    expect(setSelectedElementsById).toHaveBeenCalledWith({
      elementIds: ['1'],
      withLinked: true,
    });
  });

  it('should not select on mousedown if already selected', () => {
    const element = {
      id: '1',
      type: 'text',
      x: 0,
      y: 0,
      width: 100,
      height: 80,
      rotationAngle: 0,
      font: {
        family: 'Roboto',
      },
      fontSize: 20,
      content: 'hello world',
      color: createSolid(255, 255, 255),
    };
    storyContext = {
      ...storyContext,
      state: {
        selectedElementIds: [element.id],
      },
    };
    const { container } = render(
      <TestFrameElement storyContext={storyContext} element={element} />
    );

    // Fire a mousedown event.
    const wrapper = container.querySelector('[data-element-id="1"]');
    fireEvent.mouseDown(wrapper);
    expect(setSelectedElementsById).not.toHaveBeenCalled();
  });

  it('should toggle selection on mousedown with shift', () => {
    const element = {
      id: '1',
      type: 'text',
      x: 0,
      y: 0,
      width: 100,
      height: 80,
      rotationAngle: 0,
      font: {
        family: 'Roboto',
      },
      fontSize: 20,
      content: 'hello world',
      color: createSolid(255, 255, 255),
    };
    const { container } = render(
      <TestFrameElement storyContext={storyContext} element={element} />
    );

    // Fire a mousedown event with shift.
    const wrapper = container.querySelector('[data-element-id="1"]');
    fireEvent.mouseDown(wrapper, { shiftKey: true });
    expect(toggleElementInSelection).toHaveBeenCalledWith({
      elementId: '1',
      withLinked: true,
    });
  });
});

/* eslint-enable testing-library/no-node-access, testing-library/no-container */
