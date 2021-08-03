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
import { isPlatformMacOS } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { useRightClickMenu, RightClickMenuProvider } from '..';
import { useCanvas } from '../../canvas';
import { useStory } from '../../story';
import { RIGHT_CLICK_MENU_LABELS } from '../constants';

// TODO: #6154 remove when the `enableRightClickMenus` experiment is removed
jest.mock('flagged', () => ({
  useFeature: () => true,
}));

jest.mock('../../canvas', () => ({
  useCanvas: jest.fn(),
}));

jest.mock('../../story', () => ({
  useStory: jest.fn(),
}));

jest.mock('@web-stories-wp/design-system', () => ({
  ...jest.requireActual('@web-stories-wp/design-system'),
  isPlatformMacOS: jest.fn(),
}));

const mockEvent = {
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  offsetX: 500,
  offsetY: -1230,
};

const defaultCanvasContext = {
  actions: {
    setEditingElement: jest.fn(),
  },
};

const defaultStoryContext = {
  addPage: jest.fn(),
  currentPage: {
    elements: [],
  },
  deleteCurrentPage: jest.fn(),
  pages: [{}],
  replaceCurrentPage: jest.fn(),
  selectedElements: [],
  selectedElementAnimations: [],
};

const expectedDefaultActions = [
  RIGHT_CLICK_MENU_LABELS.COPY,
  RIGHT_CLICK_MENU_LABELS.PASTE,
  RIGHT_CLICK_MENU_LABELS.DELETE,
];

describe('useRightClickMenu', () => {
  const mockUseCanvas = useCanvas;
  const mockUseStory = useStory;
  const mockIsPlatformMacOS = isPlatformMacOS;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseStory.mockReturnValue(defaultStoryContext);
    mockUseCanvas.mockReturnValue(defaultCanvasContext);
    mockIsPlatformMacOS.mockReturnValue(false);
  });

  describe('context menu manipulation', () => {
    it('should open the menu at the specified position', () => {
      const { result } = renderHook(() => useRightClickMenu(), {
        wrapper: RightClickMenuProvider,
      });

      act(() => {
        result.current.onOpenMenu(mockEvent);
      });

      expect(result.current.isMenuOpen).toBe(true);
      expect(result.current.menuPosition).toStrictEqual({ x: 500, y: -1230 });
    });

    it('should close the menu and reset the position', () => {
      const { result } = renderHook(() => useRightClickMenu(), {
        wrapper: RightClickMenuProvider,
      });

      act(() => {
        result.current.onOpenMenu(mockEvent);
      });

      expect(result.current.isMenuOpen).toBe(true);
      expect(result.current.menuPosition).toStrictEqual({ x: 500, y: -1230 });

      act(() => {
        result.current.onCloseMenu();
      });

      expect(result.current.isMenuOpen).toBe(false);
      expect(result.current.menuPosition).toStrictEqual({ x: 0, y: 0 });
    });
  });

  describe('Page selected from right click', () => {
    it('should return the correct menu items', () => {
      const { result } = renderHook(() => useRightClickMenu(), {
        wrapper: RightClickMenuProvider,
      });

      const labels = result.current.menuItems.map((item) => item.label);
      expect(labels).toStrictEqual([
        ...expectedDefaultActions,
        RIGHT_CLICK_MENU_LABELS.DUPLICATE_PAGE,
        RIGHT_CLICK_MENU_LABELS.DELETE_PAGE,
      ]);
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
    it.todo('should return the correct menu items');
  });

  describe('Background image right clicked', () => {
    it.todo('should return the correct menu items');
  });

  describe('Foreground media elements (image, gif, video) right clicked', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        ...defaultStoryContext,
        selectedElements: [
          {
            id: '991199',
            type: 'video',
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
        ...expectedDefaultActions,
        RIGHT_CLICK_MENU_LABELS.SEND_BACKWARD,
        RIGHT_CLICK_MENU_LABELS.SEND_TO_BACK,
        RIGHT_CLICK_MENU_LABELS.BRING_FORWARD,
        RIGHT_CLICK_MENU_LABELS.BRING_TO_FRONT,
        RIGHT_CLICK_MENU_LABELS.SET_AS_PAGE_BACKGROUND,
        RIGHT_CLICK_MENU_LABELS.SCALE_AND_CROP_IMAGE,
      ]);
    });
  });

  describe('Shape element right clicked', () => {
    it.todo('should return the correct menu items');
  });
});
