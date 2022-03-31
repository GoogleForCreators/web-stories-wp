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
import { fireEvent, screen } from '@testing-library/react';
import {
  renderWithTheme,
  firePointerEvent,
} from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import VideoTrimmer from '../videoTrimmer';
import VideoTrimContext from '../videoTrimContext';
import LayoutContext from '../../../app/layout/context';

jest.mock('../useRailBackground');

function setup({ trim, layout } = {}) {
  const layoutCtx = {
    state: {
      workspaceWidth: 1000,
      pageWidth: 100,
      ...layout,
    },
  };
  const trimCtx = {
    state: {
      currentTime: 0,
      startOffset: 0,
      endOffset: 10000,
      maxOffset: 10000,
      hasChanged: false,
      videoData: {},
      ...trim,
    },
    actions: {
      setStartOffset: jest.fn(),
      setEndOffset: jest.fn(),
      performTrim: jest.fn(),
      toggleTrimMode: jest.fn(),
      setIsDraggingHandles: jest.fn(),
    },
  };
  const view = renderWithTheme(
    <LayoutContext.Provider value={layoutCtx}>
      <VideoTrimContext.Provider value={trimCtx}>
        <VideoTrimmer />
      </VideoTrimContext.Provider>
    </LayoutContext.Provider>
  );
  const getVideoTrimmer = () =>
    screen.getByRole('complementary', {
      name: 'Video trimmer',
    });
  const getStartHandle = () =>
    screen.getByRole('slider', { name: 'Start offset' });
  const getEndHandle = () => screen.getByRole('slider', { name: 'End offset' });
  const getCancel = () => screen.getByRole('button', { name: 'Cancel' });
  const getSubmit = () => screen.getByRole('button', { name: 'Trim' });
  const rerender = ({ layout: reLayout, trim: reTrim }) => {
    const reLayoutCtx = {
      ...layoutCtx,
      state: { ...layoutCtx.state, ...reLayout },
    };
    const reTrimCtx = { ...trimCtx, state: { ...trimCtx.state, ...reTrim } };
    view.rerender(
      <LayoutContext.Provider value={reLayoutCtx}>
        <VideoTrimContext.Provider value={reTrimCtx}>
          <VideoTrimmer />
        </VideoTrimContext.Provider>
      </LayoutContext.Provider>
    );
  };
  return {
    ...view,
    getVideoTrimmer,
    getStartHandle,
    getEndHandle,
    getCancel,
    getSubmit,
    rerender,
    layout: layoutCtx.state,
    trim: trimCtx.state,
    actions: trimCtx.actions,
  };
}

describe('Video Trimmer', () => {
  describe('as it loads', () => {
    it('should render empty trimmer if missing page width', () => {
      const { getVideoTrimmer } = setup({
        layout: { pageWidth: null },
      });

      const videoTrimmer = getVideoTrimmer();
      expect(videoTrimmer).toBeInTheDocument();
      expect(videoTrimmer).toBeEmptyDOMElement();
    });

    it('should render empty trimmer if no video length', () => {
      const { getVideoTrimmer } = setup({
        trim: { maxOffset: null },
      });

      const videoTrimmer = getVideoTrimmer();
      expect(videoTrimmer).toBeInTheDocument();
      expect(videoTrimmer).toBeEmptyDOMElement();
    });

    it('should render empty trimmer if no video data', () => {
      const { getVideoTrimmer } = setup({
        trim: { videoData: null },
      });

      const videoTrimmer = getVideoTrimmer();
      expect(videoTrimmer).toBeInTheDocument();
      expect(videoTrimmer).toBeEmptyDOMElement();
    });

    it('should render correctly if all data ready', () => {
      const { getVideoTrimmer } = setup();

      const videoTrimmer = getVideoTrimmer();
      expect(videoTrimmer).toBeInTheDocument();
      expect(videoTrimmer).not.toBeEmptyDOMElement();
    });

    it('should display initial handles correctly if new trim', () => {
      const { getStartHandle, getEndHandle } = setup();

      expect(getStartHandle()).toHaveStyle('left: 0.00px');
      expect(getEndHandle()).toHaveStyle('left: 100.00px');
    });

    it('should display initial handles correctly if re-trimming', () => {
      const { getStartHandle, getEndHandle } = setup({
        trim: { startOffset: 1000, endOffset: 9000 },
      });

      expect(getStartHandle()).toHaveStyle('left: 10.00px');
      expect(getEndHandle()).toHaveStyle('left: 90.00px');
    });

    it('should have enabled cancel button', () => {
      const { getCancel } = setup();

      expect(getCancel()).toBeEnabled();
    });

    it('should have enabled trim button if and only if component handles have updated', () => {
      const { getSubmit, rerender } = setup();
      expect(getSubmit()).toBeDisabled();

      rerender({ trim: { hasChanged: true } });
      expect(getSubmit()).toBeEnabled();
    });
  });

  describe('when interacted with', () => {
    it('should invoke callbacks when using mouse to move start handle', () => {
      const {
        getStartHandle,
        actions: { setStartOffset, setIsDraggingHandles },
      } = setup();

      const handle = getStartHandle();

      // Click at position 0
      firePointerEvent.pointerDown(handle, { clientX: 0 });

      expect(setIsDraggingHandles).toHaveBeenCalledWith(true);
      setIsDraggingHandles.mockReset();

      // Move to the 10% mark
      firePointerEvent.pointerMove(handle, { clientX: 10 });

      expect(setStartOffset).toHaveBeenCalledWith(1000);
      setStartOffset.mockReset();

      // Move to the 30% mark
      firePointerEvent.pointerMove(handle, { clientX: 30 });

      expect(setStartOffset).toHaveBeenCalledWith(3000);
      setStartOffset.mockReset();

      // Release it
      firePointerEvent.pointerUp(handle);

      expect(setIsDraggingHandles).toHaveBeenCalledWith(false);
    });

    it('should invoke callbacks when using mouse to move end handle', () => {
      const {
        getEndHandle,
        actions: { setEndOffset, setIsDraggingHandles },
      } = setup();

      const handle = getEndHandle();

      // Click at position 0
      firePointerEvent.pointerDown(handle, { clientX: 100 });

      expect(setIsDraggingHandles).toHaveBeenCalledWith(true);
      setIsDraggingHandles.mockReset();

      // Move to the 90% mark
      firePointerEvent.pointerMove(handle, { clientX: 90 });

      expect(setEndOffset).toHaveBeenCalledWith(9000);
      setEndOffset.mockReset();

      // Move to the 70% mark
      firePointerEvent.pointerMove(handle, { clientX: 70 });

      expect(setEndOffset).toHaveBeenCalledWith(7000);

      // Release it
      firePointerEvent.pointerUp(handle);

      expect(setIsDraggingHandles).toHaveBeenCalledWith(false);
    });

    describe('when using a keyboard', () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });

      it('should invoke callbacks when moving start handle', () => {
        const {
          getStartHandle,
          actions: { setStartOffset, setIsDraggingHandles },
        } = setup();

        const handle = getStartHandle();

        // Move once to the right
        fireEvent.keyDown(handle, { key: 'ArrowRight', which: 39 });

        expect(setIsDraggingHandles).toHaveBeenCalledWith(true);
        setIsDraggingHandles.mockReset();

        expect(setStartOffset).toHaveBeenCalledWith(100);

        // Run all timers to trigger the debounced release
        jest.runAllTimers();

        expect(setIsDraggingHandles).toHaveBeenCalledWith(false);
      });

      it('should invoke callbacks when moving end handle', () => {
        const {
          getEndHandle,
          actions: { setEndOffset, setIsDraggingHandles },
        } = setup();

        const handle = getEndHandle();

        // Move once to the left
        fireEvent.keyDown(handle, { key: 'ArrowLeft', which: 37 });

        expect(setIsDraggingHandles).toHaveBeenCalledWith(true);
        setIsDraggingHandles.mockReset();

        expect(setEndOffset).toHaveBeenCalledWith(9900);

        // Run all timers to trigger the debounced release
        jest.runAllTimers();

        expect(setIsDraggingHandles).toHaveBeenCalledWith(false);
      });
    });

    it('should invoke callback when cancelling', () => {
      const {
        getCancel,
        actions: { toggleTrimMode },
      } = setup();

      fireEvent.click(getCancel());

      expect(toggleTrimMode).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should invoke callback when trimming', () => {
      const {
        getSubmit,
        actions: { performTrim },
      } = setup({ trim: { hasChanged: true } });

      fireEvent.click(getSubmit());

      expect(performTrim).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});
