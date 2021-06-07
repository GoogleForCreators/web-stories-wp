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
import { renderHook } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import { useRightClickMenu } from '..';
import { useStory } from '../../story';

jest.mock('../../story', () => ({
  useStory: jest.fn(),
}));

describe('useRightClickMenu', () => {
  const mockUseStory = useStory;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseStory.mockReturnValue({
      selectedElements: [],
    });
  });

  describe('Page selected from right click', () => {
    it('should return the correct menu items', () => {
      const { result } = renderHook(() => useRightClickMenu());

      expect(result.current).toStrictEqual([
        {
          label: 'Copy',
          onClick: expect.any(Function),
          shortcut: '⌘ X',
        },
        {
          label: 'Paste',
          onClick: expect.any(Function),
          shortcut: '⌘ V',
        },
        {
          label: 'Delete',
          onClick: expect.any(Function),
          shortcut: 'DEL',
        },
        {
          label: 'Duplicate page',
          onClick: expect.any(Function),
        },
        {
          label: 'Delete page',
          onClick: expect.any(Function),
        },
      ]);
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
