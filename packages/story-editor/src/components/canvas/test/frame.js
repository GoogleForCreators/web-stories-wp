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
import { render, fireEvent, act, screen } from '@testing-library/react';
import { createSolid } from '@googleforcreators/patterns';
import { setUpEditorStore } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import { TestFrameElement } from './_utils';

jest.useFakeTimers();

/* eslint-disable testing-library/no-node-access, testing-library/no-container */

describe('TextFrame: enter edit mode', () => {
  let element;
  let storyContext;
  let setEditingElementWithState;
  let editingElementContext;

  beforeAll(() => {
    setUpEditorStore();
  });

  beforeEach(() => {
    element = {
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

    storyContext = {};
    setEditingElementWithState = jest.fn();
    editingElementContext = { setEditingElementWithState };
  });

  function setSelected() {
    storyContext = {
      ...storyContext,
      state: {
        selectedElements: [element],
        selectedElementIds: [element.id],
      },
    };
  }

  it('should go to edit mode on a single click when selected', () => {
    setSelected();
    render(
      <TestFrameElement
        storyContext={storyContext}
        editingElementContext={editingElementContext}
        element={element}
      />
    );

    const frame = screen.queryByText(element.content);

    act(() => jest.runOnlyPendingTimers());

    fireEvent.mouseDown(frame);
    fireEvent.mouseUp(frame);

    expect(
      editingElementContext.setEditingElementWithState
    ).toHaveBeenCalledWith('1', { offset: 0 });
  });

  it('should go to edit mode on enter key', () => {
    setSelected();
    const { container } = render(
      <TestFrameElement
        storyContext={storyContext}
        editingElementContext={editingElementContext}
        element={element}
      />
    );

    // Find the focusable target.
    const target = container.querySelector('[tabindex="0"]');

    act(() => jest.runOnlyPendingTimers());

    // Fire "Enter" keydown.
    fireEvent.keyDown(target, { key: 'Enter' });

    expect(
      editingElementContext.setEditingElementWithState
    ).toHaveBeenCalledWith('1', { selectAll: true });
  });

  it('should go to edit mode on a character key', () => {
    setSelected();
    const { container } = render(
      <TestFrameElement
        storyContext={storyContext}
        editingElementContext={editingElementContext}
        element={element}
      />
    );

    // Find the focusable target.
    const target = container.querySelector('[tabindex="0"]');

    act(() => jest.runOnlyPendingTimers());

    // Fire "d" keydown.
    fireEvent.keyDown(target, { key: 'd' });

    expect(
      editingElementContext.setEditingElementWithState
    ).toHaveBeenCalledWith('1', { selectAll: true });
  });
});

/* eslint-enable testing-library/no-node-access, testing-library/no-container */
