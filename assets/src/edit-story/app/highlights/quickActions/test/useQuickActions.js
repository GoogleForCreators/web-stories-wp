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
import { useQuickActions } from '..';
import { states } from '../..';
import useHighlights from '../../useHighlights';
import { useStory } from '../../../story';
import { Bucket, LetterTPlus, Media } from '../../../../../design-system/icons';

jest.mock('../../../story', () => ({
  useStory: jest.fn(),
}));

jest.mock('../../useHighlights', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const BACKGROUND_ELEMENT = {
  id: 'background-element-id',
  isBackground: true,
  type: 'shape',
};

const IMAGE_ELEMENT = {
  id: 'image-element-id',
  type: 'image',
};

const SHAPE_ELEMENT = {
  id: 'shape-element-id',
  type: 'shape',
};

const TEXT_ELEMENT = {
  id: 'text-element-id',
  type: 'text',
};

const VIDEO_ELEMENT = {
  id: 'image-element-id',
  type: 'image',
};

const defaultQuickActions = [
  expect.objectContaining({
    label: 'Change background color',
    onClick: expect.any(Function),
    Icon: Bucket,
  }),
  expect.objectContaining({
    label: 'Insert background media',
    onClick: expect.any(Function),
    Icon: Media,
  }),
  expect.objectContaining({
    label: 'Insert text',
    onClick: expect.any(Function),
    Icon: LetterTPlus,
  }),
];

describe('useQuickActions', () => {
  let highlight;
  const mockUseHighlights = useHighlights;
  const mockUseStory = useStory;

  beforeEach(() => {
    jest.clearAllMocks();

    highlight = undefined;
    mockUseHighlights.mockImplementation(() => ({
      setHighlights: (value) => {
        highlight = value;
      },
    }));

    mockUseStory.mockReturnValue({
      currentPage: {
        elements: [BACKGROUND_ELEMENT],
      },
      selectedElements: [],
    });
  });

  describe('multiple elements selected', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT, IMAGE_ELEMENT, VIDEO_ELEMENT],
        },
        selectedElements: [IMAGE_ELEMENT, VIDEO_ELEMENT],
      });
    });

    it('should return no quick actions', () => {
      const { result } = renderHook(() => useQuickActions());

      expect(result.current).toStrictEqual([]);
    });
  });

  describe('no element selected', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT],
        },
        selectedElements: [],
      });
    });

    it('should return the quick actions', () => {
      const { result } = renderHook(() => useQuickActions());

      expect(result.current).toStrictEqual(defaultQuickActions);
    });

    it('should set the correct highlight', () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[0].onClick();
      expect(highlight).toStrictEqual({
        elementId: 'background-element-id',
        highlight: states.PAGE_BACKGROUND,
      });

      result.current[1].onClick();
      expect(highlight).toStrictEqual({
        elementId: 'background-element-id',
        highlight: states.MEDIA,
      });

      result.current[2].onClick();
      expect(highlight).toStrictEqual({
        elementId: 'background-element-id',
        highlight: states.TEXT,
      });
    });
  });

  describe('background element selected', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT],
        },
        selectedElements: [BACKGROUND_ELEMENT],
      });
    });

    it('should return the quick actions', () => {
      const { result } = renderHook(() => useQuickActions());

      expect(result.current).toStrictEqual(defaultQuickActions);
    });

    it('should set the correct highlight', () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[0].onClick();
      expect(highlight).toStrictEqual({
        elementId: 'background-element-id',
        highlight: states.PAGE_BACKGROUND,
      });

      result.current[1].onClick();
      expect(highlight).toStrictEqual({
        elementId: 'background-element-id',
        highlight: states.MEDIA,
      });

      result.current[2].onClick();
      expect(highlight).toStrictEqual({
        elementId: 'background-element-id',
        highlight: states.TEXT,
      });
    });
  });

  describe('foreground image element selected', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT, IMAGE_ELEMENT],
        },
        selectedElements: [IMAGE_ELEMENT],
      });
    });

    it.todo('should return the quick actions');
    it.todo('should set the correct highlight');
  });

  describe('shape element selected', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT, SHAPE_ELEMENT],
        },
        selectedElements: [SHAPE_ELEMENT],
      });
    });

    it.todo('should return the quick actions');
    it.todo('should set the correct highlight');
  });

  describe('text selected', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT, VIDEO_ELEMENT],
        },
        selectedElements: [VIDEO_ELEMENT],
      });
    });
    it.todo('should return the quick actions');
    it.todo('should set the correct highlight');
  });

  describe('video element selected', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT, TEXT_ELEMENT],
        },
        selectedElements: [TEXT_ELEMENT],
      });
    });

    it.todo('should return the quick actions');
    it.todo('should set the correct highlight');
  });
});
