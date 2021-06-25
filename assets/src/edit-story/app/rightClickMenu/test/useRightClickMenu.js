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

/**
 * Internal dependencies
 */
import { isPlatformMacOS } from '@web-stories-wp/design-system';
import { useRightClickMenu, RightClickMenuProvider } from '..';
import { useStory } from '../../story';

// TODO: #6154 remove when the `enableRightClickMenus` experiment is removed
jest.mock('flagged', () => ({
  useFeature: () => true,
}));

jest.mock('../../story', () => ({
  useStory: jest.fn(),
}));

jest.mock('../../../../design-system', () => ({
  ...jest.requireActual('../../../../design-system'),
  isPlatformMacOS: jest.fn(),
}));

const mockEvent = {
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  offsetX: 500,
  offsetY: -1230,
};

const defaultStoryContext = {
  addPage: jest.fn(),
  currentPage: {},
  deleteCurrentPage: jest.fn(),
  pages: [{}],
  replaceCurrentPage: jest.fn(),
  selectedElements: [],
  selectedElementAnimations: [],
};

describe('useRightClickMenu', () => {
  const mockUseStory = useStory;
  const mockIsPlatformMacOS = isPlatformMacOS;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseStory.mockReturnValue(defaultStoryContext);
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
    it('should return menu items', () => {
      const { result } = renderHook(() => useRightClickMenu(), {
        wrapper: RightClickMenuProvider,
      });

      expect(result.current.menuItems).toStrictEqual([
        {
          label: 'Copy',
          onClick: expect.any(Function),
          onMouseDown: expect.any(Function),
          shortcut: {
            display: 'ctrl C',
            title: 'Control C',
          },
        },
        {
          label: 'Paste',
          onClick: expect.any(Function),
          onMouseDown: expect.any(Function),
          shortcut: {
            display: 'ctrl V',
            title: 'Control V',
          },
        },
        {
          label: 'Delete',
          onClick: expect.any(Function),
          onMouseDown: expect.any(Function),
          shortcut: {
            display: 'DEL',
            title: 'Delete',
          },
        },
        {
          label: 'Duplicate page',
          onClick: expect.any(Function),
          onMouseDown: expect.any(Function),
          separator: 'top',
        },
        {
          label: 'Delete page',
          onClick: expect.any(Function),
          onMouseDown: expect.any(Function),
          disabled: expect.any(Boolean),
        },
      ]);
    });

    it('"delete page" button should be enabled if there is more than one page', () => {
      const { result, rerender } = renderHook(() => useRightClickMenu(), {
        wrapper: RightClickMenuProvider,
      });

      expect(
        result.current.menuItems.find((item) => item.label === 'Delete page')
          .disabled
      ).toBe(true);

      mockUseStory.mockReturnValue({ ...defaultStoryContext, pages: [{}, {}] });

      rerender();

      expect(
        result.current.menuItems.find((item) => item.label === 'Delete page')
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
    it.todo('should return the correct menu items');
  });

  describe('Shape element right clicked', () => {
    it.todo('should return the correct menu items');
  });
});
