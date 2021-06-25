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
import { Icons } from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import { useQuickActions } from '..';
import { states } from '../..';
import useHighlights from '../../useHighlights';
import { STORY_EVENTS } from '../../../story/storyTriggers/storyEvents';
import { useStory, useStoryTriggersDispatch } from '../../../story';
import { ACTION_TEXT } from '../constants';

const {
  Bucket,
  Captions,
  CircleSpeed,
  Eraser,
  LetterTLargeLetterTSmall,
  LetterTPlus,
  Link,
  Media,
  PictureSwap,
} = Icons;

jest.mock('../../../story', () => ({
  useStory: jest.fn(),
  useStoryTriggersDispatch: jest.fn(),
  // Was getting a circular deps error or something
  // trying to requireActual here so just manually
  // set STORY_EVENTS for now:
  // __esModule: true,
  // ...jest.requireActual('../../../story'),
  STORY_EVENTS: {
    onReplaceBackgroundMedia: 'onReplaceBackgroundMedia',
    onReplaceForegroundMedia: 'onReplaceForegroundMedia',
  },
}));

jest.mock('../../useHighlights', () => ({
  ...jest.requireActual('../../useHighlights'),
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../../../design-system', () => ({
  ...jest.requireActual('../../../../../design-system'),
  useSnackbar: () => ({ showSnackbar: jest.fn() }),
}));

const mockClickEvent = {
  preventDefault: jest.fn(),
};

const BACKGROUND_ELEMENT = {
  id: 'background-element-id',
  isBackground: true,
  type: 'shape',
};
const BACKGROUND_IMAGE_ELEMENT = {
  id: 'background-image-element-id',
  isBackground: true,
  type: 'image',
  resource: {
    resource: {
      id: 'mysite/1234',
    },
  },
};

const BACKGROUND_IMAGE_MEDIA3P_ELEMENT = {
  id: 'background-image-media3p-element-id',
  isBackground: true,
  type: 'image',
  resource: {
    id: 'media/unsplash:wsomemedia-123',
  },
};

const BACKGROUND_VIDEO_ELEMENT = {
  id: 'background-video-element-id',
  isBackground: true,
  type: 'video',
  resource: {
    id: 'mysite/1234',
  },
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
  id: 'video-element-id',
  type: 'video',
};

const resetElementAction = expect.objectContaining({
  label: ACTION_TEXT.RESET_ELEMENT,
  onClick: expect.any(Function),
  Icon: Eraser,
});

const defaultQuickActions = [
  expect.objectContaining({
    label: ACTION_TEXT.CHANGE_BACKGROUND_COLOR,
    onClick: expect.any(Function),
    Icon: Bucket,
  }),
  expect.objectContaining({
    label: ACTION_TEXT.INSERT_BACKGROUND_MEDIA,
    onClick: expect.any(Function),
    Icon: Media,
  }),
  expect.objectContaining({
    label: ACTION_TEXT.INSERT_TEXT,
    onClick: expect.any(Function),
    Icon: LetterTPlus,
  }),
];

const foregroundImageQuickActions = [
  expect.objectContaining({
    label: ACTION_TEXT.REPLACE_MEDIA,
    onClick: expect.any(Function),
    Icon: PictureSwap,
  }),
  expect.objectContaining({
    label: ACTION_TEXT.ADD_ANIMATION,
    onClick: expect.any(Function),
    Icon: CircleSpeed,
  }),
  expect.objectContaining({
    label: ACTION_TEXT.ADD_LINK,
    onClick: expect.any(Function),
    Icon: Link,
  }),
];

const foregroundImageQuickActionsWithClear = [
  ...foregroundImageQuickActions,
  resetElementAction,
];

const shapeQuickActions = [
  expect.objectContaining({
    label: ACTION_TEXT.CHANGE_COLOR,
    onClick: expect.any(Function),
    Icon: Bucket,
  }),
  expect.objectContaining({
    label: ACTION_TEXT.ADD_ANIMATION,
    onClick: expect.any(Function),
    Icon: CircleSpeed,
  }),
  expect.objectContaining({
    label: ACTION_TEXT.ADD_LINK,
    onClick: expect.any(Function),
    Icon: Link,
  }),
];

const shapeQuickActionsWithClear = [...shapeQuickActions, resetElementAction];

const textQuickActions = [
  expect.objectContaining({
    label: ACTION_TEXT.CHANGE_TEXT_COLOR,
    onClick: expect.any(Function),
    Icon: Bucket,
  }),
  expect.objectContaining({
    label: ACTION_TEXT.CHANGE_FONT,
    onClick: expect.any(Function),
    Icon: LetterTLargeLetterTSmall,
  }),
  expect.objectContaining({
    label: ACTION_TEXT.ADD_ANIMATION,
    onClick: expect.any(Function),
    Icon: CircleSpeed,
  }),
  expect.objectContaining({
    label: ACTION_TEXT.ADD_LINK,
    onClick: expect.any(Function),
    Icon: Link,
  }),
];
const textQuickActionsWithClear = [...textQuickActions, resetElementAction];

const backgroundMediaQuickActions = [
  expect.objectContaining({
    label: ACTION_TEXT.REPLACE_BACKGROUND_MEDIA,
    onClick: expect.any(Function),
    Icon: PictureSwap,
  }),
  expect.objectContaining({
    label: ACTION_TEXT.ADD_ANIMATION,
    onClick: expect.any(Function),
    Icon: CircleSpeed,
  }),
];
const backgroundMediaQuickActionsWithClear = [
  ...backgroundMediaQuickActions,
  resetElementAction,
];

const videoQuickActions = [
  ...foregroundImageQuickActions,
  expect.objectContaining({
    label: ACTION_TEXT.ADD_CAPTIONS,
    onClick: expect.any(Function),
    Icon: Captions,
  }),
];

const videoQuickActionsWithClear = [...videoQuickActions, resetElementAction];

describe('useQuickActions', () => {
  let highlight;
  const mockUseHighlights = useHighlights;
  const mockUseStory = useStory;
  const mockDispatchStoryEvent = jest.fn();
  const mockUpdateElementsById = jest.fn();

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
      selectedElementAnimations: [],
      selectedElements: [],
      updateElementsById: mockUpdateElementsById,
    });

    useStoryTriggersDispatch.mockReturnValue(mockDispatchStoryEvent);
  });

  describe('multiple elements selected', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT, IMAGE_ELEMENT, VIDEO_ELEMENT],
        },
        selectedElementAnimations: [],
        selectedElements: [IMAGE_ELEMENT, VIDEO_ELEMENT],
        updateElementsById: mockUpdateElementsById,
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
        selectedElementAnimations: [],
        selectedElements: [],
        updateElementsById: mockUpdateElementsById,
      });
    });

    it('should return the quick actions', () => {
      const { result } = renderHook(() => useQuickActions());

      expect(result.current).toStrictEqual(defaultQuickActions);
    });

    it('should set the correct highlight', () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[0].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: BACKGROUND_ELEMENT.id,
        highlight: states.PAGE_BACKGROUND,
      });

      result.current[1].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: undefined,
        highlight: states.MEDIA,
      });

      result.current[2].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: undefined,
        highlight: states.TEXT_SET,
      });
    });
  });

  describe('empty background element selected', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT],
        },
        selectedElementAnimations: [],
        selectedElements: [BACKGROUND_ELEMENT],
        updateElementsById: mockUpdateElementsById,
      });
    });

    it('should return the quick actions', () => {
      const { result } = renderHook(() => useQuickActions());

      expect(result.current).toStrictEqual(defaultQuickActions);
    });

    it('should set the correct highlight', () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[0].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: BACKGROUND_ELEMENT.id,
        highlight: states.PAGE_BACKGROUND,
      });

      result.current[1].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: undefined,
        highlight: states.MEDIA,
      });

      result.current[2].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: undefined,
        highlight: states.TEXT_SET,
      });
    });
  });

  describe('background image element is selected', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_IMAGE_ELEMENT],
        },
        selectedElementAnimations: [],
        selectedElements: [BACKGROUND_IMAGE_ELEMENT],
        updateElementsById: mockUpdateElementsById,
      });
    });

    it('should return the quick actions', () => {
      const { result } = renderHook(() => useQuickActions());

      expect(result.current).toStrictEqual(backgroundMediaQuickActions);
    });

    it('should set the correct highlight', () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[0].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: BACKGROUND_IMAGE_ELEMENT.id,
        highlight: states.MEDIA,
      });

      result.current[1].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: BACKGROUND_IMAGE_ELEMENT.id,
        highlight: states.ANIMATION,
      });
    });

    it(`should trigger ${STORY_EVENTS.onReplaceBackgroundMedia} when replace media clicked`, () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[0].onClick(mockClickEvent);
      expect(mockDispatchStoryEvent).toHaveBeenCalledTimes(1);
      expect(mockDispatchStoryEvent).toHaveBeenCalledWith(
        STORY_EVENTS.onReplaceBackgroundMedia
      );
    });
  });

  describe('background third party image element is selected with animation', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_IMAGE_MEDIA3P_ELEMENT],
        },
        selectedElementAnimations: [],
        selectedElements: [BACKGROUND_IMAGE_MEDIA3P_ELEMENT],
        updateElementsById: mockUpdateElementsById,
      });
    });

    it('should return the quick actions', () => {
      const { result } = renderHook(() => useQuickActions());

      expect(result.current).toStrictEqual(backgroundMediaQuickActions);
    });

    it('should set the correct highlight', () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[0].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: BACKGROUND_IMAGE_MEDIA3P_ELEMENT.id,
        highlight: states.MEDIA3P,
      });

      result.current[1].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: BACKGROUND_IMAGE_MEDIA3P_ELEMENT.id,
        highlight: states.ANIMATION,
      });
    });
  });

  describe('background video element is selected', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_VIDEO_ELEMENT],
        },
        selectedElementAnimations: [
          {
            target: [BACKGROUND_VIDEO_ELEMENT.id],
          },
        ],
        selectedElements: [BACKGROUND_VIDEO_ELEMENT],
        updateElementsById: mockUpdateElementsById,
      });
    });

    it('should return the quick actions', () => {
      const { result } = renderHook(() => useQuickActions());

      expect(result.current).toStrictEqual(
        backgroundMediaQuickActionsWithClear
      );
    });

    it('should set the correct highlight', () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[0].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: BACKGROUND_VIDEO_ELEMENT.id,
        highlight: states.MEDIA,
      });

      result.current[1].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: BACKGROUND_VIDEO_ELEMENT.id,
        highlight: states.ANIMATION,
      });
    });

    it('clicking `clear filters and animations` should update the element', () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[2].onClick(mockClickEvent);
      expect(mockUpdateElementsById).toHaveBeenCalledWith({
        elementIds: [BACKGROUND_VIDEO_ELEMENT.id],
        properties: expect.any(Function),
      });
    });
  });

  describe('foreground image element selected', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT, IMAGE_ELEMENT],
        },
        selectedElementAnimations: [
          {
            target: [IMAGE_ELEMENT.id],
          },
        ],
        selectedElements: [IMAGE_ELEMENT],
        updateElementsById: mockUpdateElementsById,
      });
    });

    it('should return the quick actions', () => {
      const { result } = renderHook(() => useQuickActions());

      expect(result.current).toStrictEqual(
        foregroundImageQuickActionsWithClear
      );
    });

    it('should set the correct highlight', () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[0].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: IMAGE_ELEMENT.id,
        highlight: states.MEDIA,
      });

      result.current[1].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: IMAGE_ELEMENT.id,
        highlight: states.ANIMATION,
      });

      result.current[2].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: IMAGE_ELEMENT.id,
        highlight: states.LINK,
      });
    });

    it(`\`${ACTION_TEXT.RESET_ELEMENT}\` action should not be present if element has no animations`, () => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT, IMAGE_ELEMENT],
        },
        selectedElementAnimations: [],
        selectedElements: [IMAGE_ELEMENT],
        updateElementsById: mockUpdateElementsById,
      });

      const { result } = renderHook(() => useQuickActions());

      expect(result.current[3]).toBeUndefined();
    });

    it('clicking `reset element` should update the element', () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[3].onClick(mockClickEvent);
      expect(mockUpdateElementsById).toHaveBeenCalledWith({
        elementIds: [IMAGE_ELEMENT.id],
        properties: expect.any(Function),
      });
    });

    it(`should trigger ${STORY_EVENTS.onReplaceForegroundMedia} when replace media clicked`, () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[0].onClick(mockClickEvent);
      expect(mockDispatchStoryEvent).toHaveBeenCalledTimes(1);
      expect(mockDispatchStoryEvent).toHaveBeenCalledWith(
        STORY_EVENTS.onReplaceForegroundMedia
      );
    });
  });

  describe('shape element selected', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT, SHAPE_ELEMENT],
        },
        selectedElementAnimations: [
          {
            target: [SHAPE_ELEMENT.id],
          },
        ],
        selectedElements: [SHAPE_ELEMENT],
        updateElementsById: mockUpdateElementsById,
      });
    });

    it('should return the quick actions', () => {
      const { result } = renderHook(() => useQuickActions());
      expect(result.current).toStrictEqual(shapeQuickActionsWithClear);
    });

    it('should set the correct highlight', () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[0].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: SHAPE_ELEMENT.id,
        highlight: states.STYLE,
      });

      result.current[1].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: SHAPE_ELEMENT.id,
        highlight: states.ANIMATION,
      });

      result.current[2].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: SHAPE_ELEMENT.id,
        highlight: states.LINK,
      });
    });

    it(`\`${ACTION_TEXT.CLEAR_ANIMATIONS}\` action should not be present if element has no animations`, () => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT, SHAPE_ELEMENT],
        },
        selectedElementAnimations: [],
        selectedElements: [SHAPE_ELEMENT],
        updateElementsById: mockUpdateElementsById,
      });

      const { result } = renderHook(() => useQuickActions());

      expect(result.current[3]).toBeUndefined();
    });

    it('clicking `clear animations` should call `updateElementsById`', () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[3].onClick(mockClickEvent);
      expect(mockUpdateElementsById).toHaveBeenCalledWith({
        elementIds: [SHAPE_ELEMENT.id],
        properties: expect.any(Function),
      });
    });
  });

  describe('text selected', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT, TEXT_ELEMENT],
        },
        selectedElementAnimations: [],
        selectedElements: [TEXT_ELEMENT],
        updateElementsById: mockUpdateElementsById,
      });
    });
    it('should return the quick actions', () => {
      const { result } = renderHook(() => useQuickActions());

      expect(result.current).toStrictEqual(textQuickActions);
    });
    it('should set the correct highlight', () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[0].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: TEXT_ELEMENT.id,
        highlight: states.TEXT_COLOR,
      });

      result.current[1].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: TEXT_ELEMENT.id,
        highlight: states.FONT,
      });

      result.current[2].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: TEXT_ELEMENT.id,
        highlight: states.ANIMATION,
      });

      result.current[3].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: TEXT_ELEMENT.id,
        highlight: states.LINK,
      });
    });

    it(`\`${ACTION_TEXT.RESET_ELEMENT}\` action should not be present if element has no animations`, () => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT, TEXT_ELEMENT],
        },
        selectedElementAnimations: [],
        selectedElements: [TEXT_ELEMENT],
        updateElementsById: mockUpdateElementsById,
      });

      const { result } = renderHook(() => useQuickActions());

      expect(result.current[4]).toBeUndefined();
    });

    it('clicking `reset element` should update the element', () => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT, TEXT_ELEMENT],
        },
        selectedElementAnimations: [
          {
            target: [TEXT_ELEMENT.id],
          },
        ],
        selectedElements: [TEXT_ELEMENT],
        updateElementsById: mockUpdateElementsById,
      });

      const { result } = renderHook(() => useQuickActions());
      expect(result.current).toStrictEqual(textQuickActionsWithClear);

      result.current[4].onClick(mockClickEvent);
      expect(mockUpdateElementsById).toHaveBeenCalledWith({
        elementIds: [TEXT_ELEMENT.id],
        properties: expect.any(Function),
      });
    });
  });

  describe('video element selected', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT, VIDEO_ELEMENT],
        },
        selectedElementAnimations: [
          {
            id: VIDEO_ELEMENT.id,
          },
        ],
        selectedElements: [VIDEO_ELEMENT],
        updateElementsById: mockUpdateElementsById,
      });
    });

    it('should return the quick actions', () => {
      const { result } = renderHook(() => useQuickActions());
      expect(result.current).toStrictEqual(videoQuickActionsWithClear);
    });

    it('should set the correct highlight', () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[0].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: VIDEO_ELEMENT.id,
        highlight: states.MEDIA,
      });

      result.current[1].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: VIDEO_ELEMENT.id,
        highlight: states.ANIMATION,
      });

      result.current[2].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: VIDEO_ELEMENT.id,
        highlight: states.LINK,
      });

      result.current[3].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: VIDEO_ELEMENT.id,
        highlight: states.CAPTIONS,
      });
    });

    it(`should not show \`${ACTION_TEXT.CLEAR_ANIMATION_AND_FILTERS}\` action if element has no animations`, () => {
      mockUseStory.mockReturnValueOnce({
        currentPage: {
          elements: [BACKGROUND_ELEMENT, VIDEO_ELEMENT],
        },
        selectedElementAnimations: [],
        selectedElements: [VIDEO_ELEMENT],
        updateElementsById: mockUpdateElementsById,
      });

      const { result } = renderHook(() => useQuickActions());

      expect(result.current[4]).toBeUndefined();
    });

    it(`should click \`${ACTION_TEXT.CLEAR_ANIMATION_AND_FILTERS} and update the element`, () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[4].onClick(mockClickEvent);
      expect(mockUpdateElementsById).toHaveBeenCalledWith({
        elementIds: [VIDEO_ELEMENT.id],
        properties: expect.any(Function),
      });
    });
  });
});
