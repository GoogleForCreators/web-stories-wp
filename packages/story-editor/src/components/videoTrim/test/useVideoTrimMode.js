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
import { renderHook, act, waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import CanvasContext from '../../../app/canvas/context';
import APIContext from '../../../app/api/context';
import StoryContext from '../../../app/story/context';
import useVideoTrimMode from '../useVideoTrimMode';
import { useLocalMedia } from '../../../app/media';

jest.mock('../../../app/media');

const mockTranscodingEnabled = jest.fn().mockImplementation(() => true);

jest.mock('../../../app/media/utils/useFFmpeg', () => () => ({
  isTranscodingEnabled: mockTranscodingEnabled(),
}));

function setup({
  mockGetMediaById,
  canvas = {},
  element = {},
  extraElements = [],
} = {}) {
  const canvasCtx = {
    state: {
      isEditing: false,
      editingElementState: undefined,
      ...canvas,
    },
    actions: {
      setEditingElementWithState: jest.fn(),
      clearEditing: jest.fn(),
    },
  };
  const apiCtx = {
    actions: {
      getMediaById: mockGetMediaById ? mockGetMediaById : jest.fn(),
    },
  };
  const storyCtx = {
    state: {
      selectedElements: [
        {
          type: 'video',
          id: 'video123',
          ...element,
          resource: { isExternal: false, src: 'bar', ...element?.resource },
        },
        ...extraElements,
      ],
    },
  };
  const wrapper = ({ children }) => (
    <CanvasContext.Provider value={canvasCtx}>
      <APIContext.Provider value={apiCtx}>
        <StoryContext.Provider value={storyCtx}>
          {children}
        </StoryContext.Provider>
      </APIContext.Provider>
    </CanvasContext.Provider>
  );
  const rendering = renderHook(() => useVideoTrimMode(), { wrapper });

  return {
    ...rendering,
    ...canvasCtx.actions,
    ...apiCtx.actions,
  };
}

describe('useVideoTrimMode', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useLocalMedia.mockReturnValue({
      canTranscodeResource: jest.fn(() => true),
      isCurrentResourceUploading: jest.fn(() => false),
    });
  });
  it('should allow trim mode for single video element', () => {
    const { result } = setup();

    expect(result.current.isTrimMode).toBe(false);
    expect(result.current.hasTrimMode).toBe(true);
  });

  it('should not allow trim mode for non-video', () => {
    const { result } = setup({ element: { type: 'image' } });

    expect(result.current.hasTrimMode).toBe(false);
  });

  it('should not allow trim mode for resource that is currently being uploaded', () => {
    useLocalMedia.mockReturnValue({
      isCurrentResourceUploading: jest.fn(() => true),
    });
    const { result } = setup({ element: { resource: { id: 123 } } });

    expect(result.current.hasTrimMode).toBe(false);
  });

  it('should not allow trim mode for third-party video', () => {
    useLocalMedia.mockReturnValue({
      canTranscodeResource: jest.fn(),
    });

    const { result } = setup({ element: { resource: { isExternal: true } } });

    expect(result.current.hasTrimMode).toBe(false);
  });

  it('should not allow trim mode if multiple videos selected', () => {
    const { result } = setup({ extraElements: [{ type: 'image' }] });

    expect(result.current.hasTrimMode).toBe(false);
  });

  it('should not allow trim mode if transcoding is not supported', () => {
    mockTranscodingEnabled.mockImplementationOnce(() => false);
    const { result } = setup();

    expect(result.current.hasTrimMode).toBe(false);
  });

  it('should not in trim mode if editing element without trim mode state', () => {
    const { result } = setup({ canvas: { isEditing: true } });

    expect(result.current.isTrimMode).toBe(false);
  });

  it('should be in trim mode if editing element in trim mode state', () => {
    const { result } = setup({
      canvas: { isEditing: true, editingElementState: { isTrimMode: true } },
    });

    expect(result.current.isTrimMode).toBe(true);
  });

  it('should exit trim mode if editing any element and toggling', () => {
    const { result, clearEditing } = setup({
      canvas: { isEditing: true, editingElementState: { isTrimMode: true } },
    });

    act(() => result.current.toggleTrimMode());
    expect(clearEditing).toHaveBeenCalledWith();
  });

  it('should enter edit mode for original video', () => {
    const { result, setEditingElementWithState } = setup();

    act(() => result.current.toggleTrimMode());

    expect(setEditingElementWithState).toHaveBeenCalledWith(
      'video123',
      expect.objectContaining({ isTrimMode: true })
    );

    expect(result.current.videoData).toStrictEqual({
      element: expect.objectContaining({ id: 'video123' }),
      resource: expect.any(Object),
      start: 0,
      end: null,
    });
  });

  it('should enter edit mode for trimmed video with working original', async () => {
    const originalId = 'video456';
    const originalResource = { id: originalId };
    const mockGetMediaById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(originalResource));
    const { result, setEditingElementWithState, getMediaById } = setup({
      mockGetMediaById,
      element: {
        resource: {
          trimData: {
            original: originalId,
            start: '00:00:02',
            end: '00:00:08',
          },
        },
      },
    });

    act(() => result.current.toggleTrimMode());

    await waitFor(() => {
      expect(getMediaById).toHaveBeenCalledWith(originalId);
    });

    expect(setEditingElementWithState).toHaveBeenCalledWith(
      'video123',
      expect.objectContaining({ isTrimMode: true })
    );

    expect(result.current.videoData).toStrictEqual({
      element: expect.objectContaining({ id: 'video123' }),
      resource: originalResource,
      start: 2000,
      end: 8000,
    });

    mockGetMediaById.mockClear();
  });

  it('should enter edit mode for trimmed video with broken original', async () => {
    const originalId = 'video456';
    const mockGetMediaById = jest
      .fn()
      .mockImplementation(() => Promise.reject(new Error('404')));

    const { result, setEditingElementWithState, getMediaById } = setup({
      mockGetMediaById,
      element: {
        resource: {
          trimData: {
            original: originalId,
            start: '00:00:02',
            end: '00:00:08',
          },
        },
      },
    });

    act(() => result.current.toggleTrimMode());

    await waitFor(() => {
      expect(getMediaById).toHaveBeenCalledWith(originalId);
    });

    expect(setEditingElementWithState).toHaveBeenCalledWith(
      'video123',
      expect.objectContaining({ isTrimMode: true })
    );

    expect(result.current.videoData).toStrictEqual({
      element: expect.objectContaining({ id: 'video123' }),
      resource: expect.any(Object),
      start: 0,
      end: null,
    });

    mockGetMediaById.mockClear();
  });
});
