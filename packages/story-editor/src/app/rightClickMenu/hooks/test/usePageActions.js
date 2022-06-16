/*
 * Copyright 2022 Google LLC
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
import { renderHook } from '@testing-library/react';
import { createPage, duplicatePage } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { usePageActions } from '..';
import { useStory } from '../../..';
import { ELEMENT } from './testUtils';

jest.mock('@googleforcreators/tracking'); // should be mocked in the testing env.
jest.mock('@googleforcreators/elements');
jest.mock('../../../story/useStory');

const mockUseStory = useStory;

const mockAddPageAt = jest.fn();
const mockDeleteCurrentPage = jest.fn();
const mockCreatePage = createPage;
const mockDuplicatePage = duplicatePage;

const defaultStoryContext = {
  addPageAt: mockAddPageAt,
  currentPage: {
    id: 'current-page',
    elements: [ELEMENT],
  },
  deleteCurrentPage: mockDeleteCurrentPage,
  isSelectedElementBackground: false,
  pageLength: 10,
  selectedElementType: ELEMENT.type,
};

describe('usePageActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseStory.mockReturnValue(defaultStoryContext);
    mockCreatePage.mockReturnValue({ id: 'new-page', elements: [] });
    mockDuplicatePage.mockImplementation((page) => ({
      ...page,
      id: 'duplicated-page',
    }));
  });

  describe('add page at position', () => {
    it('should add a page at a specific position', () => {
      const { result } = renderHook(() => usePageActions());

      result.current.handleAddPageAtPosition(4);

      expect(mockAddPageAt).toHaveBeenCalledWith({
        page: { id: 'new-page', elements: [] },
        position: 4,
      });
    });

    it('should add a position at the end if there are less pages than specified', () => {
      const { result } = renderHook(() => usePageActions());

      result.current.handleAddPageAtPosition(10000);

      expect(mockAddPageAt).toHaveBeenCalledWith({
        page: { id: 'new-page', elements: [] },
        position: 9,
      });
    });

    it('should add a position at the start if a negative number is specified', () => {
      const { result } = renderHook(() => usePageActions());

      result.current.handleAddPageAtPosition(-1);

      expect(mockAddPageAt).toHaveBeenCalledWith({
        page: expect.any(Object),
        position: 0,
      });
    });
  });

  describe('duplicate page', () => {
    it('should duplicate the current page and put it at the end of all existing pages', () => {
      const { result } = renderHook(() => usePageActions());

      result.current.handleDuplicatePage();

      expect(mockDuplicatePage).toHaveBeenCalledWith({
        id: 'current-page',
        elements: [ELEMENT],
      });
      expect(mockAddPageAt).toHaveBeenCalledWith({
        page: { id: 'duplicated-page', elements: [ELEMENT] },
        position: null,
      });
    });
  });

  describe('delete page', () => {
    it('should delete the current page', () => {
      const { result } = renderHook(() => usePageActions());

      result.current.handleDeletePage();

      expect(mockDeleteCurrentPage).toHaveBeenCalledTimes(1);
    });
  });
});
