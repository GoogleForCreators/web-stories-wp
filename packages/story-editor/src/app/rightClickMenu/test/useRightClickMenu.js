/*
 * Copyright 2021 Google LLC
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
import { act, renderHook } from '@testing-library/react-hooks';
import { isPlatformMacOS, useSnackbar } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useRightClickMenu, RightClickMenuProvider } from '..';
import { useCanvas } from '../../canvas';
import useStory from '../../story/useStory';
import { useLocalMedia } from '../../media';
import { RIGHT_CLICK_MENU_LABELS } from '../constants';

jest.mock('../../canvas', () => ({
  useCanvas: jest.fn(),
}));

jest.mock('../../media');
jest.mock('../../story/useStory');

const mockVideoTrim = jest.fn();
jest.mock(
  '../../../components/videoTrim/useVideoTrim',
  () => (cb) => mockVideoTrim(cb)
);

jest.mock('@googleforcreators/design-system', () => ({
  ...jest.requireActual('@googleforcreators/design-system'),
  isPlatformMacOS: jest.fn(),
  useSnackbar: jest.fn(),
}));

jest.mock('@googleforcreators/tracking');

const mockEvent = {
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  clientX: 500,
  clientY: -1230,
};

const defaultCanvasContext = {
  actions: {
    setEditingElement: jest.fn(),
  },
};

const defaultTrimContext = {
  hasTrimMode: false,
  toggleTrimMode: jest.fn(),
  state: {
    hasTrimMode: false,
  },
  actions: {
    toggleTrimMode: jest.fn(),
  },
};

const defaultStoryContext = {
  addAnimations: jest.fn(),
  addPage: jest.fn(),
  currentPage: {
    elements: [],
  },
  deleteCurrentPage: jest.fn(),
  pages: [{}],
  selectedElements: [],
  selectedElementAnimations: [],
  updateElementsById: jest.fn(),
};

const expectedLayerActions = [
  RIGHT_CLICK_MENU_LABELS.SEND_BACKWARD,
  RIGHT_CLICK_MENU_LABELS.SEND_TO_BACK,
  RIGHT_CLICK_MENU_LABELS.BRING_FORWARD,
  RIGHT_CLICK_MENU_LABELS.BRING_TO_FRONT,
];

describe('useRightClickMenu', () => {
  const mockUseCanvas = useCanvas;
  const mockUseStory = useStory;
  const mockIsPlatformMacOS = isPlatformMacOS;
  const mockUseSnackbar = useSnackbar;
  const mockShowSnackbar = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseStory.mockReturnValue(defaultStoryContext);
    mockUseCanvas.mockReturnValue(defaultCanvasContext);
    mockUseSnackbar.mockReturnValue({ showSnackbar: mockShowSnackbar });
    mockIsPlatformMacOS.mockReturnValue(false);
    mockVideoTrim.mockImplementation((cb) => cb(defaultTrimContext));
    useLocalMedia.mockReturnValue({
      canTranscodeResource: jest.fn(),
    });
  });

  describe('context menu manipulation', () => {
    it('should open the menu if multiple elements are selected', () => {
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        selectedElements: [
          {
            id: '1',
            type: 'text',
            isDefaultBackground: false,
          },

          {
            id: '2',
            type: 'shape',
            isDefaultBackground: false,
          },

          {
            id: '3',
            type: 'text',
            isDefaultBackground: false,
          },
        ],
      });
      const { result } = renderHook(() => useRightClickMenu(), {
        wrapper: RightClickMenuProvider,
      });

      act(() => {
        result.current.onOpenMenu(mockEvent);
      });

      expect(result.current.isMenuOpen).toBe(true);
    });

    it('should open the menu at the specified position', () => {
      const { result } = renderHook(() => useRightClickMenu(), {
        wrapper: RightClickMenuProvider,
      });

      act(() => {
        result.current.onOpenMenu(mockEvent);
      });

      expect(result.current.isMenuOpen).toBe(true);
      expect(result.current.menuPosition).toStrictEqual({
        x: 500,
        y: -1230,
      });
    });

    it('should close the menu and reset the position', () => {
      const { result } = renderHook(() => useRightClickMenu(), {
        wrapper: RightClickMenuProvider,
      });

      act(() => {
        result.current.onOpenMenu(mockEvent);
      });

      expect(result.current.isMenuOpen).toBe(true);
      expect(result.current.menuPosition).toStrictEqual({
        x: 500,
        y: -1230,
      });

      act(() => {
        result.current.onCloseMenu();
      });

      expect(result.current.isMenuOpen).toBe(false);
      expect(result.current.menuPosition).toStrictEqual({ x: 0, y: 0 });
    });
  });

  describe('Page right clicked', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        selectedElements: [
          {
            id: '1',
            type: 'image',
            isDefaultBackground: true,
          },
        ],
      });
    });

    it('should return the correct menu items', () => {
      const { result } = renderHook(() => useRightClickMenu(), {
        wrapper: RightClickMenuProvider,
      });

      const labels = result.current.menuItems.map((item) => item.label);
      expect(labels).toStrictEqual([
        RIGHT_CLICK_MENU_LABELS.DETACH_IMAGE_FROM_BACKGROUND,
        RIGHT_CLICK_MENU_LABELS.SCALE_AND_CROP_BACKGROUND_IMAGE,
        RIGHT_CLICK_MENU_LABELS.CLEAR_STYLES(1),
        RIGHT_CLICK_MENU_LABELS.ADD_NEW_PAGE_AFTER,
        RIGHT_CLICK_MENU_LABELS.ADD_NEW_PAGE_BEFORE,
        RIGHT_CLICK_MENU_LABELS.DUPLICATE_PAGE,
        RIGHT_CLICK_MENU_LABELS.DELETE_PAGE,
      ]);
    });

    it('background media actions should be disabled', () => {
      const { result } = renderHook(() => useRightClickMenu(), {
        wrapper: RightClickMenuProvider,
      });

      const backgroundImageItems = result.current.menuItems.slice(0, 3);
      backgroundImageItems.map((item) => {
        expect(item.disabled).toBeTrue();
      });
    });

    it('"delete page" button should be enabled if there is more than one page', () => {
      const { result, rerender } = renderHook(() => useRightClickMenu(), {
        wrapper: RightClickMenuProvider,
      });

      expect(
        result.current.menuItems.find((item) => item.label === 'Delete Page')
          .disabled
      ).toBe(true);

      mockUseStory.mockReturnValue({ ...defaultStoryContext, pages: [{}, {}] });

      rerender();

      expect(
        result.current.menuItems.find((item) => item.label === 'Delete Page')
          .disabled
      ).toBe(false);
    });
  });

  describe('Text element right clicked', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        selectedElements: [
          {
            id: '1',
            type: 'text',
          },
        ],
      });
    });

    it('should return the correct menu items', () => {
      const { result } = renderHook(() => useRightClickMenu(), {
        wrapper: RightClickMenuProvider,
      });

      const labels = result.current.menuItems.map((item) => item.label);
      expect(labels).toStrictEqual([
        RIGHT_CLICK_MENU_LABELS.DUPLICATE_ELEMENTS(1),
        RIGHT_CLICK_MENU_LABELS.SEND_BACKWARD,
        RIGHT_CLICK_MENU_LABELS.SEND_TO_BACK,
        RIGHT_CLICK_MENU_LABELS.BRING_FORWARD,
        RIGHT_CLICK_MENU_LABELS.BRING_TO_FRONT,
        RIGHT_CLICK_MENU_LABELS.COPY_STYLES,
        RIGHT_CLICK_MENU_LABELS.PASTE_STYLES,
        RIGHT_CLICK_MENU_LABELS.ADD_TO_TEXT_PRESETS,
        RIGHT_CLICK_MENU_LABELS.ADD_TO_COLOR_PRESETS,
      ]);
    });
  });

  describe('Background image right clicked', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        selectedElements: [
          {
            id: '991199',
            type: 'image',
            isBackground: true,
          },
        ],
      });
    });

    it('should return the correct menu items', () => {
      const { result } = renderHook(() => useRightClickMenu(), {
        wrapper: RightClickMenuProvider,
      });

      const labels = result.current.menuItems.map((item) => item.label);
      expect(labels).toStrictEqual([
        RIGHT_CLICK_MENU_LABELS.DETACH_IMAGE_FROM_BACKGROUND,
        RIGHT_CLICK_MENU_LABELS.SCALE_AND_CROP_BACKGROUND_IMAGE,
        RIGHT_CLICK_MENU_LABELS.CLEAR_STYLES(1),
        RIGHT_CLICK_MENU_LABELS.ADD_NEW_PAGE_AFTER,
        RIGHT_CLICK_MENU_LABELS.ADD_NEW_PAGE_BEFORE,
        RIGHT_CLICK_MENU_LABELS.DUPLICATE_PAGE,
        RIGHT_CLICK_MENU_LABELS.DELETE_PAGE,
      ]);
    });
  });

  describe('Background video right clicked', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        selectedElements: [
          {
            id: '991199',
            type: 'video',
            isBackground: true,
          },
        ],
      });
    });

    it('should return the correct menu items', () => {
      const { result } = renderHook(() => useRightClickMenu(), {
        wrapper: RightClickMenuProvider,
      });

      const labels = result.current.menuItems.map((item) => item.label);
      expect(labels).toStrictEqual([
        RIGHT_CLICK_MENU_LABELS.DETACH_VIDEO_FROM_BACKGROUND,
        RIGHT_CLICK_MENU_LABELS.SCALE_AND_CROP_BACKGROUND_VIDEO,
        RIGHT_CLICK_MENU_LABELS.CLEAR_STYLES(1),
        RIGHT_CLICK_MENU_LABELS.ADD_NEW_PAGE_AFTER,
        RIGHT_CLICK_MENU_LABELS.ADD_NEW_PAGE_BEFORE,
        RIGHT_CLICK_MENU_LABELS.DUPLICATE_PAGE,
        RIGHT_CLICK_MENU_LABELS.DELETE_PAGE,
      ]);
    });

    describe('if video transcoding is possible', () => {
      beforeEach(() => {
        mockVideoTrim.mockImplementationOnce((cb) =>
          cb({
            ...defaultTrimContext,
            state: {
              hasTrimMode: true,
            },
          })
        );
      });

      it('should contain enabled "trim video"', () => {
        useLocalMedia.mockReturnValue({
          canTranscodeResource: () => true,
        });
        const { result } = renderHook(() => useRightClickMenu(), {
          wrapper: RightClickMenuProvider,
        });

        expect(result.current.menuItems).toContainEqual(
          expect.objectContaining({
            label: RIGHT_CLICK_MENU_LABELS.TRIM_VIDEO,
            disabled: false,
          })
        );
      });

      describe('if video transcoding is ongoing', () => {
        beforeEach(() => {
          mockUseStory.mockReturnValue({
            ...defaultStoryContext,
            selectedElements: [
              {
                id: '991199',
                type: 'video',
                isBackground: true,
                resource: {
                  isExternal: false,
                },
              },
            ],
          });
        });

        it('should contain disabled "trim video"', () => {
          useLocalMedia.mockReturnValue({
            canTranscodeResource: () => false,
          });
          const { result } = renderHook(() => useRightClickMenu(), {
            wrapper: RightClickMenuProvider,
          });

          expect(result.current.menuItems).toContainEqual(
            expect.objectContaining({
              label: RIGHT_CLICK_MENU_LABELS.TRIM_VIDEO,
              disabled: true,
            })
          );
        });
      });
    });
  });

  describe('Foreground image (or gif) right clicked', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        selectedElements: [
          {
            id: '991199',
            type: 'image',
            borderRadius: '4px',
          },
        ],
      });
    });

    it('should return the correct menu items', () => {
      const { result } = renderHook(() => useRightClickMenu(), {
        wrapper: RightClickMenuProvider,
      });

      const labels = result.current.menuItems.map((item) => item.label);
      expect(labels).toStrictEqual([
        RIGHT_CLICK_MENU_LABELS.DUPLICATE_ELEMENTS(1),
        ...expectedLayerActions,
        RIGHT_CLICK_MENU_LABELS.SET_AS_PAGE_BACKGROUND,
        RIGHT_CLICK_MENU_LABELS.SCALE_AND_CROP_IMAGE,
        RIGHT_CLICK_MENU_LABELS.COPY_IMAGE_STYLES,
        RIGHT_CLICK_MENU_LABELS.PASTE_IMAGE_STYLES,
        RIGHT_CLICK_MENU_LABELS.CLEAR_IMAGE_STYLES,
      ]);
    });

    describe('copying, pasting, and clearing styles', () => {
      it('should show a snackbar when copying, pasting, and clearing styles', () => {
        const { result } = renderHook(() => useRightClickMenu(), {
          wrapper: RightClickMenuProvider,
        });

        const copy = result.current.menuItems.find(
          (item) => item.label === RIGHT_CLICK_MENU_LABELS.COPY_IMAGE_STYLES
        );
        act(() => {
          copy.onClick();
        });

        expect(mockShowSnackbar).toHaveBeenCalledWith(
          expect.objectContaining({
            actionLabel: 'Undo',
            message: 'Copied style.',
          })
        );

        const paste = result.current.menuItems.find(
          (item) => item.label === RIGHT_CLICK_MENU_LABELS.PASTE_IMAGE_STYLES
        );
        act(() => {
          paste.onClick();
        });

        expect(mockShowSnackbar).toHaveBeenCalledWith(
          expect.objectContaining({
            actionLabel: 'Undo',
            message: 'Pasted style.',
          })
        );

        const clear = result.current.menuItems.find(
          (item) => item.label === RIGHT_CLICK_MENU_LABELS.CLEAR_IMAGE_STYLES
        );
        act(() => {
          clear.onClick();
        });

        expect(mockShowSnackbar).toHaveBeenCalledWith(
          expect.objectContaining({
            actionLabel: 'Undo',
            message: 'Cleared style.',
          })
        );
      });
    });
  });

  describe('Foreground video right clicked', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        selectedElements: [
          {
            id: '991199',
            type: 'video',
            borderRadius: '4px',
            resource: {
              isExternal: false,
            },
          },
        ],
      });
    });

    it('should return the correct menu items', () => {
      const { result } = renderHook(() => useRightClickMenu(), {
        wrapper: RightClickMenuProvider,
      });

      const labels = result.current.menuItems.map((item) => item.label);
      expect(labels).toStrictEqual([
        RIGHT_CLICK_MENU_LABELS.DUPLICATE_ELEMENTS(1),
        ...expectedLayerActions,
        RIGHT_CLICK_MENU_LABELS.SET_AS_PAGE_BACKGROUND,
        RIGHT_CLICK_MENU_LABELS.SCALE_AND_CROP_VIDEO,
        RIGHT_CLICK_MENU_LABELS.COPY_VIDEO_STYLES,
        RIGHT_CLICK_MENU_LABELS.PASTE_VIDEO_STYLES,
        RIGHT_CLICK_MENU_LABELS.CLEAR_VIDEO_STYLES,
      ]);
    });

    describe('if video transcoding is possible', () => {
      beforeEach(() => {
        mockVideoTrim.mockImplementationOnce((cb) =>
          cb({
            ...defaultTrimContext,
            state: {
              hasTrimMode: true,
            },
          })
        );
      });

      it('should contain enabled "trim video"', () => {
        useLocalMedia.mockReturnValue({
          canTranscodeResource: () => true,
        });
        const { result } = renderHook(() => useRightClickMenu(), {
          wrapper: RightClickMenuProvider,
        });

        expect(result.current.menuItems).toContainEqual(
          expect.objectContaining({
            label: RIGHT_CLICK_MENU_LABELS.TRIM_VIDEO,
            disabled: false,
          })
        );
      });

      describe('if video transcoding is ongoing', () => {
        beforeEach(() => {
          mockUseStory.mockReturnValue({
            ...defaultStoryContext,
            selectedElements: [
              {
                id: '991199',
                type: 'video',
                borderRadius: '4px',
                resource: {
                  isExternal: true,
                },
              },
            ],
          });
        });

        it('should contain disabled "trim video"', () => {
          useLocalMedia.mockReturnValue({
            canTranscodeResource: () => false,
          });
          const { result } = renderHook(() => useRightClickMenu(), {
            wrapper: RightClickMenuProvider,
          });

          expect(result.current.menuItems).toContainEqual(
            expect.objectContaining({
              label: RIGHT_CLICK_MENU_LABELS.TRIM_VIDEO,
              disabled: true,
            })
          );
        });
      });
    });

    describe('copying, pasting, and clearing styles', () => {
      it('should show a snackbar when copying, pasting, and clearing styles', () => {
        const { result } = renderHook(() => useRightClickMenu(), {
          wrapper: RightClickMenuProvider,
        });

        const copy = result.current.menuItems.find(
          (item) => item.label === RIGHT_CLICK_MENU_LABELS.COPY_VIDEO_STYLES
        );
        act(() => {
          copy.onClick();
        });

        expect(mockShowSnackbar).toHaveBeenCalledWith(
          expect.objectContaining({
            actionLabel: 'Undo',
            message: 'Copied style.',
          })
        );

        const paste = result.current.menuItems.find(
          (item) => item.label === RIGHT_CLICK_MENU_LABELS.PASTE_VIDEO_STYLES
        );
        act(() => {
          paste.onClick();
        });

        expect(mockShowSnackbar).toHaveBeenCalledWith(
          expect.objectContaining({
            actionLabel: 'Undo',
            message: 'Pasted style.',
          })
        );

        const clear = result.current.menuItems.find(
          (item) => item.label === RIGHT_CLICK_MENU_LABELS.CLEAR_VIDEO_STYLES
        );
        act(() => {
          clear.onClick();
        });

        expect(mockShowSnackbar).toHaveBeenCalledWith(
          expect.objectContaining({
            actionLabel: 'Undo',
            message: 'Cleared style.',
          })
        );
      });
    });
  });

  describe('Shape element right clicked', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        selectedElements: [
          {
            id: '991199',
            type: 'shape',
          },
        ],
      });
    });

    it('should return the correct menu items', () => {
      const { result } = renderHook(() => useRightClickMenu(), {
        wrapper: RightClickMenuProvider,
      });

      const labels = result.current.menuItems.map((item) => item.label);
      expect(labels).toStrictEqual([
        RIGHT_CLICK_MENU_LABELS.DUPLICATE_ELEMENTS(1),
        ...expectedLayerActions,
        RIGHT_CLICK_MENU_LABELS.COPY_SHAPE_STYLES,
        RIGHT_CLICK_MENU_LABELS.PASTE_SHAPE_STYLES,
        RIGHT_CLICK_MENU_LABELS.CLEAR_SHAPE_STYLES,
        RIGHT_CLICK_MENU_LABELS.ADD_TO_COLOR_PRESETS,
      ]);
    });
  });

  describe('Sticker element right clicked', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        selectedElements: [
          {
            id: '991199',
            type: 'sticker',
          },
        ],
      });
    });

    it('should return the correct menu items', () => {
      const { result } = renderHook(() => useRightClickMenu(), {
        wrapper: RightClickMenuProvider,
      });

      const labels = result.current.menuItems.map((item) => item.label);
      expect(labels).toStrictEqual([
        RIGHT_CLICK_MENU_LABELS.DUPLICATE_ELEMENTS(1),
        ...expectedLayerActions,
      ]);
    });
  });

  describe('Multiple elements right clicked', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        selectedElements: [
          {
            id: '1',
            type: 'text',
            isDefaultBackground: false,
          },

          {
            id: '2',
            type: 'shape',
            isDefaultBackground: false,
          },

          {
            id: '3',
            type: 'text',
            isDefaultBackground: false,
          },
        ],
      });
    });

    it('should return the correct menu items', () => {
      const { result } = renderHook(() => useRightClickMenu(), {
        wrapper: RightClickMenuProvider,
      });

      const labels = result.current.menuItems.map((item) => item.label);
      expect(labels).toStrictEqual([
        RIGHT_CLICK_MENU_LABELS.DUPLICATE_ELEMENTS(2),
        RIGHT_CLICK_MENU_LABELS.CLEAR_STYLES(2),
      ]);
    });
  });
});
