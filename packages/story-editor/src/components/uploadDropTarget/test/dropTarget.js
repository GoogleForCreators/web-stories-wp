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
import { render, createEvent, fireEvent, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import UploadDropTarget from '../dropTarget';
import useUploadDropTarget from '../use';

const onDropSpy = jest.fn();

function UseUploadDropTargetConsumer() {
  const { isDragging: isDraggingContext } = useUploadDropTarget();
  return (
    <div data-testid="isDragging" data-value={String(isDraggingContext)} />
  );
}

describe('UploadDropTarget', () => {
  let view;
  let container;
  let content1, isDraggingElement;
  let dataTransfer;
  let transferFile1;

  afterEach(() => {
    onDropSpy.mockClear();
  });

  function getGlasspane() {
    // eslint-disable-next-line testing-library/no-node-access
    return container.querySelector('[aria-labelledby="glasspane"]');
  }

  function isDragging() {
    return Boolean(getGlasspane());
  }

  function fireDragEvent(target, type) {
    const event = createEvent[type](target);
    Object.defineProperty(event, 'dataTransfer', { value: dataTransfer });
    Object.defineProperty(event, 'stopPropagation', { value: jest.fn() });
    Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
    fireEvent(target, event);
    return event;
  }

  describe('enter dragging mode', () => {
    it('should start in a non-dragging mode', () => {
      view = render(
        <UploadDropTarget
          label="drop target"
          labelledBy="glasspane"
          onDrop={onDropSpy}
        >
          <div data-testid="content1">{'content 1'}</div>
          <UseUploadDropTargetConsumer />
        </UploadDropTarget>
      );
      // eslint-disable-next-line testing-library/no-node-access
      container = view.container.firstElementChild;
      content1 = screen.getByTestId('content1');
      isDraggingElement = screen.getByTestId('isDragging');
      transferFile1 = {};
      dataTransfer = {
        effectAllowed: 'none',
        types: ['Files'],
        files: [transferFile1],
      };

      expect(isDragging()).toBeFalse();
      expect(getGlasspane()).toBeNull();
      expect(isDraggingElement).toHaveAttribute('data-value', 'false');
    });

    it('should start dragging on the container', () => {
      view = render(
        <UploadDropTarget
          label="drop target"
          labelledBy="glasspane"
          onDrop={onDropSpy}
        >
          <div data-testid="content1">{'content 1'}</div>
          <UseUploadDropTargetConsumer />
        </UploadDropTarget>
      );
      // eslint-disable-next-line testing-library/no-node-access
      container = view.container.firstElementChild;
      content1 = screen.getByTestId('content1');
      isDraggingElement = screen.getByTestId('isDragging');
      transferFile1 = {};
      dataTransfer = {
        effectAllowed: 'none',
        types: ['Files'],
        files: [transferFile1],
      };

      const event = fireDragEvent(container, 'dragEnter');
      expect(event.preventDefault).toHaveBeenCalledWith();
      expect(event.stopPropagation).toHaveBeenCalledWith();

      expect(isDragging()).toBeTrue();
      const glasspane = getGlasspane();
      expect(glasspane).toHaveAttribute('aria-label', 'drop target');
      expect(event.dataTransfer.effectAllowed).toBe('copy');
    });

    it('should start dragging on a child', () => {
      view = render(
        <UploadDropTarget
          label="drop target"
          labelledBy="glasspane"
          onDrop={onDropSpy}
        >
          <div data-testid="content1">{'content 1'}</div>
          <UseUploadDropTargetConsumer />
        </UploadDropTarget>
      );
      // eslint-disable-next-line testing-library/no-node-access
      container = view.container.firstElementChild;
      content1 = screen.getByTestId('content1');
      isDraggingElement = screen.getByTestId('isDragging');
      transferFile1 = {};
      dataTransfer = {
        effectAllowed: 'none',
        types: ['Files'],
        files: [transferFile1],
      };

      const event = fireDragEvent(content1, 'dragEnter');
      expect(event.preventDefault).toHaveBeenCalledWith();
      expect(event.stopPropagation).toHaveBeenCalledWith();
      expect(isDragging()).toBeTrue();
    });

    it('should ignore non-file payloads', () => {
      view = render(
        <UploadDropTarget
          label="drop target"
          labelledBy="glasspane"
          onDrop={onDropSpy}
        >
          <div data-testid="content1">{'content 1'}</div>
          <UseUploadDropTargetConsumer />
        </UploadDropTarget>
      );
      // eslint-disable-next-line testing-library/no-node-access
      container = view.container.firstElementChild;
      content1 = screen.getByTestId('content1');
      isDraggingElement = screen.getByTestId('isDragging');
      transferFile1 = {};
      dataTransfer = {
        effectAllowed: 'none',
        types: ['Files'],
        files: [transferFile1],
      };

      dataTransfer.types = ['text/html'];
      dataTransfer.files = [];
      const event = fireDragEvent(content1, 'dragEnter');
      expect(event.preventDefault).not.toHaveBeenCalledWith();
      expect(event.stopPropagation).not.toHaveBeenCalledWith();
      expect(isDragging()).toBeFalse();
    });
  });

  describe('in dragging mode', () => {
    it('should have the glasspane and the context in dragging mode', () => {
      view = render(
        <UploadDropTarget
          label="drop target"
          labelledBy="glasspane"
          onDrop={onDropSpy}
        >
          <div data-testid="content1">{'content 1'}</div>
          <UseUploadDropTargetConsumer />
        </UploadDropTarget>
      );
      // eslint-disable-next-line testing-library/no-node-access
      container = view.container.firstElementChild;
      content1 = screen.getByTestId('content1');
      isDraggingElement = screen.getByTestId('isDragging');
      transferFile1 = {};
      dataTransfer = {
        effectAllowed: 'none',
        types: ['Files'],
        files: [transferFile1],
      };

      fireDragEvent(container, 'dragEnter');
      const glasspane = getGlasspane();

      expect(isDragging()).toBeTrue();
      expect(getGlasspane()).not.toBeNull();
      expect(getGlasspane()).toBe(glasspane);
      expect(isDraggingElement).toHaveAttribute('data-value', 'true');
    });

    it('should continue dragging when the container exits', () => {
      view = render(
        <UploadDropTarget
          label="drop target"
          labelledBy="glasspane"
          onDrop={onDropSpy}
        >
          <div data-testid="content1">{'content 1'}</div>
          <UseUploadDropTargetConsumer />
        </UploadDropTarget>
      );
      // eslint-disable-next-line testing-library/no-node-access
      container = view.container.firstElementChild;
      content1 = screen.getByTestId('content1');
      isDraggingElement = screen.getByTestId('isDragging');
      transferFile1 = {};
      dataTransfer = {
        effectAllowed: 'none',
        types: ['Files'],
        files: [transferFile1],
      };

      fireDragEvent(container, 'dragEnter');

      const event = fireDragEvent(container, 'dragLeave');
      expect(event.preventDefault).not.toHaveBeenCalledWith();
      expect(event.stopPropagation).not.toHaveBeenCalledWith();
      expect(isDragging()).toBeTrue();
    });

    it('should continue dragging when a child exits', () => {
      view = render(
        <UploadDropTarget
          label="drop target"
          labelledBy="glasspane"
          onDrop={onDropSpy}
        >
          <div data-testid="content1">{'content 1'}</div>
          <UseUploadDropTargetConsumer />
        </UploadDropTarget>
      );
      // eslint-disable-next-line testing-library/no-node-access
      container = view.container.firstElementChild;
      content1 = screen.getByTestId('content1');
      isDraggingElement = screen.getByTestId('isDragging');
      transferFile1 = {};
      dataTransfer = {
        effectAllowed: 'none',
        types: ['Files'],
        files: [transferFile1],
      };

      fireDragEvent(container, 'dragEnter');

      const event = fireDragEvent(content1, 'dragLeave');
      expect(event.preventDefault).not.toHaveBeenCalledWith();
      expect(event.stopPropagation).not.toHaveBeenCalledWith();
      expect(isDragging()).toBeTrue();
    });

    it('should cancel dragging over the container', () => {
      view = render(
        <UploadDropTarget
          label="drop target"
          labelledBy="glasspane"
          onDrop={onDropSpy}
        >
          <div data-testid="content1">{'content 1'}</div>
          <UseUploadDropTargetConsumer />
        </UploadDropTarget>
      );
      // eslint-disable-next-line testing-library/no-node-access
      container = view.container.firstElementChild;
      content1 = screen.getByTestId('content1');
      isDraggingElement = screen.getByTestId('isDragging');
      transferFile1 = {};
      dataTransfer = {
        effectAllowed: 'none',
        types: ['Files'],
        files: [transferFile1],
      };

      fireDragEvent(container, 'dragEnter');

      const event = fireDragEvent(container, 'dragOver');
      expect(event.preventDefault).toHaveBeenCalledWith();
      expect(event.stopPropagation).toHaveBeenCalledWith();
      expect(isDragging()).toBeTrue();
    });

    it('should intercept dragging over the glasspane', () => {
      view = render(
        <UploadDropTarget
          label="drop target"
          labelledBy="glasspane"
          onDrop={onDropSpy}
        >
          <div data-testid="content1">{'content 1'}</div>
          <UseUploadDropTargetConsumer />
        </UploadDropTarget>
      );
      // eslint-disable-next-line testing-library/no-node-access
      container = view.container.firstElementChild;
      content1 = screen.getByTestId('content1');
      isDraggingElement = screen.getByTestId('isDragging');
      transferFile1 = {};
      dataTransfer = {
        effectAllowed: 'none',
        types: ['Files'],
        files: [transferFile1],
      };

      fireDragEvent(container, 'dragEnter');
      const glasspane = getGlasspane();

      const event = fireDragEvent(glasspane, 'dragOver');
      expect(event.preventDefault).toHaveBeenCalledWith();
      expect(event.stopPropagation).toHaveBeenCalledWith();
      expect(isDragging()).toBeTrue();
    });

    it('should cancel dragging when the glasspane exits', () => {
      view = render(
        <UploadDropTarget
          label="drop target"
          labelledBy="glasspane"
          onDrop={onDropSpy}
        >
          <div data-testid="content1">{'content 1'}</div>
          <UseUploadDropTargetConsumer />
        </UploadDropTarget>
      );
      // eslint-disable-next-line testing-library/no-node-access
      container = view.container.firstElementChild;
      content1 = screen.getByTestId('content1');
      isDraggingElement = screen.getByTestId('isDragging');
      transferFile1 = {};
      dataTransfer = {
        effectAllowed: 'none',
        types: ['Files'],
        files: [transferFile1],
      };

      fireDragEvent(container, 'dragEnter');
      const glasspane = getGlasspane();

      const event = fireDragEvent(glasspane, 'dragLeave');
      expect(event.preventDefault).toHaveBeenCalledWith();
      expect(event.stopPropagation).toHaveBeenCalledWith();
      expect(onDropSpy).not.toHaveBeenCalledWith();

      // State is reset.
      expect(isDragging()).toBeFalse();
      expect(getGlasspane()).toBeNull();
      expect(isDraggingElement).toHaveAttribute('data-value', 'false');
    });

    it('should drop and exit the dragging mode', () => {
      view = render(
        <UploadDropTarget
          label="drop target"
          labelledBy="glasspane"
          onDrop={onDropSpy}
        >
          <div data-testid="content1">{'content 1'}</div>
          <UseUploadDropTargetConsumer />
        </UploadDropTarget>
      );
      // eslint-disable-next-line testing-library/no-node-access
      container = view.container.firstElementChild;
      content1 = screen.getByTestId('content1');
      isDraggingElement = screen.getByTestId('isDragging');
      transferFile1 = {};
      dataTransfer = {
        effectAllowed: 'none',
        types: ['Files'],
        files: [transferFile1],
      };

      fireDragEvent(container, 'dragEnter');
      const glasspane = getGlasspane();

      const event = fireDragEvent(glasspane, 'drop');
      expect(event.preventDefault).toHaveBeenCalledWith();
      expect(event.stopPropagation).toHaveBeenCalledWith();
      expect(onDropSpy).toHaveBeenCalledWith([...dataTransfer.files]);

      // State is reset.
      expect(isDragging()).toBeFalse();
      expect(getGlasspane()).toBeNull();
      expect(isDraggingElement).toHaveAttribute('data-value', 'false');
    });
  });
});
