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
import { fireEvent, render, screen } from '@testing-library/react';
import { Icons, useSnackbar } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useQuickActions } from '..';
import { states } from '../..';
import useHighlights from '../../useHighlights';
import { STORY_EVENTS } from '../../../story/storyTriggers/storyEvents';
import { useStory, useStoryTriggersDispatch } from '../../../story';
import { ACTIONS } from '../constants';
import useApplyTextAutoStyle from '../../../../utils/useApplyTextAutoStyle';
import { useConfig, useLocalMedia } from '../../..';
import useFFmpeg from '../../../media/utils/useFFmpeg';
import { MediaPicker } from '../useQuickActions';
import { noop } from '../../../../utils/noop';
import useInsertElement from '../../../../components/canvas/useInsertElement';

const {
  Bucket,
  Captions,
  CircleSpeed,
  ColorBucket,
  Eraser,
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
  // set STORY_EVENTS and ELEMENT_TYPES for now:
  // __esModule: true,
  // ...jest.requireActual('../../../story'),
  STORY_EVENTS: {
    onReplaceBackgroundMedia: 'onReplaceBackgroundMedia',
    onReplaceForegroundMedia: 'onReplaceForegroundMedia',
  },
  ELEMENT_TYPES: {
    IMAGE: 'image',
    SHAPE: 'shape',
    TEXT: 'text',
    VIDEO: 'video',
    GIF: 'gif',
    PRODUCT: 'product',
  },
}));

jest.mock('../../useHighlights', () => ({
  ...jest.requireActual('../../useHighlights'),
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../../utils/useApplyTextAutoStyle');

jest.mock('../../../../components/canvas/useInsertElement');

jest.mock('@googleforcreators/design-system', () => ({
  ...jest.requireActual('@googleforcreators/design-system'),
  useSnackbar: jest.fn((selector = (v) => v) =>
    selector({ showSnackbar: jest.fn() })
  ),
}));

jest.mock('@googleforcreators/tracking');

jest.mock('@googleforcreators/media', () => ({
  ...jest.requireActual('@googleforcreators/media'),
  resourceList: {
    set: jest.fn(),
  },
}));

jest.mock('../../../media', () => ({
  ...jest.requireActual('../../../media'),
  useLocalMedia: jest.fn(),
}));

jest.mock('../../../config');
jest.mock('../../../media/utils/useFFmpeg');

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
    isExternal: true,
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

const STICKER_ELEMENT = {
  id: 'sticker-element-id',
  type: 'sticker',
};

const resetElementAction = expect.objectContaining({
  label: ACTIONS.RESET_ELEMENT.text,
  onClick: expect.any(Function),
  Icon: Eraser,
});

const defaultQuickActions = [
  expect.objectContaining({
    label: ACTIONS.CHANGE_BACKGROUND_COLOR.text,
    onClick: expect.any(Function),
    Icon: Bucket,
  }),
  expect.objectContaining({
    label: ACTIONS.INSERT_BACKGROUND_MEDIA.text,
    onClick: expect.any(Function),
    Icon: Media,
  }),
  expect.objectContaining({
    label: ACTIONS.INSERT_TEXT.text,
    onClick: expect.any(Function),
    Icon: LetterTPlus,
  }),
];

const foregroundCommonActions = [
  expect.objectContaining({
    label: ACTIONS.ADD_ANIMATION.text,
    onClick: expect.any(Function),
    Icon: CircleSpeed,
  }),
  expect.objectContaining({
    label: ACTIONS.ADD_LINK.text,
    onClick: expect.any(Function),
    Icon: Link,
  }),
];

const foregroundImageQuickActions = [
  expect.objectContaining({
    label: ACTIONS.REPLACE_MEDIA.text,
    onClick: expect.any(Function),
    Icon: PictureSwap,
  }),
  ...foregroundCommonActions,
];

const foregroundImageQuickActionsWithClear = [
  ...foregroundImageQuickActions,
  resetElementAction,
];

const shapeQuickActions = foregroundCommonActions;

const shapeQuickActionsWithClear = [...shapeQuickActions, resetElementAction];

const textQuickActions = [
  expect.objectContaining({
    label: ACTIONS.AUTO_STYLE_TEXT.text,
    onClick: expect.any(Function),
    Icon: ColorBucket,
  }),
  ...foregroundCommonActions,
];
const textQuickActionsWithClear = [...textQuickActions, resetElementAction];

const backgroundMediaQuickActions = [
  expect.objectContaining({
    label: ACTIONS.REPLACE_BACKGROUND_MEDIA.text,
    onClick: expect.any(Function),
    Icon: PictureSwap,
  }),
  expect.objectContaining({
    label: ACTIONS.ADD_ANIMATION.text,
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
    label: ACTIONS.ADD_CAPTIONS.text,
    onClick: expect.any(Function),
    Icon: Captions,
  }),
];

const videoQuickActionsWithClear = [...videoQuickActions, resetElementAction];

const stickerQuickActions = [...foregroundCommonActions];

const stickerQuickActionsWithClear = [
  ...stickerQuickActions,
  resetElementAction,
];

const videoResource = {
  id: 'video',
  type: 'video',
  mimeType: 'video/mp4',
  src: 'video',
};
const imageResource = {
  id: 'image',
  type: 'image',
  mimeType: 'image',
  src: 'image',
};
const gifResource = {
  id: 'gif',
  type: 'gif',
  mimeType: 'image/gif',
  src: 'gif',
};

let highlight;
const mockUseHighlights = useHighlights;
const mockUseStory = useStory;
const mockDispatchStoryEvent = jest.fn();
const mockUpdateElementsById = jest.fn();
const mockUseApplyTextAutoStyle = useApplyTextAutoStyle;
const mockUseInsertElement = useInsertElement;
const mockInsertElement = jest.fn();
const mockUseConfig = useConfig;
const mockUseLocalMedia = useLocalMedia;
const mockResetWithFetch = jest.fn();
const mockPostProcessingResource = jest.fn();
const mockOptimizeVideo = jest.fn();
const mockOptimizeGif = jest.fn();
const mockUseFFmpeg = useFFmpeg;
const mockUseSnackbar = useSnackbar;
const mockShowSnackbar = jest.fn();

const MockMediaPicker = ({ onSelect, onClose }) => (
  <>
    <button onClick={() => onSelect(imageResource)}>{'onSelect image'}</button>
    <button onClick={() => onSelect(gifResource)}>{'onSelect gif'}</button>
    <button onClick={() => onSelect(videoResource)}>{'onSelect video'}</button>
    <button
      onClick={() =>
        onSelect({
          ...videoResource,
          isMuted: null,
        })
      }
    >
      {'onSelect muted video'}
    </button>
    <button onClick={onClose}>{'onClose'}</button>
  </>
);

describe('useQuickActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    highlight = undefined;
    mockUseHighlights.mockImplementation(() => ({
      setHighlights: (value) => {
        highlight = value;
      },
    }));

    mockUseApplyTextAutoStyle.mockImplementation(() => ({
      applyTextAutoStyle: jest.fn(),
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

    mockUseConfig.mockReturnValue({
      allowedMimeTypes: {
        image: [],
        vector: [],
        video: [],
        caption: [],
        audio: [],
      },
      capabilities: { hasUploadMediaAction: true },
      isRTL: true,
      MediaPicker: MockMediaPicker,
    });

    mockUseLocalMedia.mockReturnValue({
      resetWithFetch: noop,
      postProcessingResource: noop,
      optimizeVideo: noop,
      optimizeGif: noop,
      canTranscodeResource: noop,
    });
  });

  describe('multiple elements selected', () => {
    beforeEach(() => {
      mockUseStory.mockImplementation((s) =>
        s({
          state: {
            currentPage: {
              elements: [BACKGROUND_ELEMENT, IMAGE_ELEMENT, VIDEO_ELEMENT],
            },
            selectedElementAnimations: [],
            selectedElements: [IMAGE_ELEMENT, VIDEO_ELEMENT],
          },
          actions: {
            updateElementsById: mockUpdateElementsById,
          },
        })
      );
    });

    it('should return no quick actions', () => {
      const { result } = renderHook(() => useQuickActions());

      expect(result.current).toStrictEqual([]);
    });
  });

  describe('no element selected', () => {
    beforeEach(() => {
      mockUseStory.mockImplementation((s) =>
        s({
          state: {
            currentPage: {
              elements: [BACKGROUND_ELEMENT],
            },
            selectedElementAnimations: [],
            selectedElements: [],
          },
          actions: {
            updateElementsById: mockUpdateElementsById,
          },
        })
      );
      mockUseInsertElement.mockReturnValue(mockInsertElement);
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
      mockUseStory.mockImplementation((selector) =>
        selector({
          state: {
            currentPage: {
              elements: [BACKGROUND_ELEMENT],
            },
            selectedElementAnimations: [],
            selectedElements: [BACKGROUND_ELEMENT],
          },
          actions: {
            updateElementsById: mockUpdateElementsById,
          },
        })
      );
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
        elementId: BACKGROUND_ELEMENT.id,
        highlight: states.MEDIA,
      });

      result.current[2].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: BACKGROUND_ELEMENT.id,
        highlight: states.TEXT_SET,
      });
    });
  });

  describe('background image element is selected', () => {
    beforeEach(() => {
      mockUseStory.mockImplementation((selector) =>
        selector({
          state: {
            currentPage: {
              elements: [BACKGROUND_IMAGE_ELEMENT],
            },
            selectedElementAnimations: [],
            selectedElements: [BACKGROUND_IMAGE_ELEMENT],
          },
          actions: {
            updateElementsById: mockUpdateElementsById,
          },
        })
      );
    });

    it('should return the quick actions', () => {
      const { result } = renderHook(() => useQuickActions());

      expect(result.current).toStrictEqual(backgroundMediaQuickActions);
    });

    it('should set the correct highlight', () => {
      const { result } = renderHook(() => useQuickActions());

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
      mockUseStory.mockImplementation((selector) =>
        selector({
          state: {
            currentPage: {
              elements: [BACKGROUND_IMAGE_MEDIA3P_ELEMENT],
            },
            selectedElementAnimations: [],
            selectedElements: [BACKGROUND_IMAGE_MEDIA3P_ELEMENT],
          },
          actions: {
            updateElementsById: mockUpdateElementsById,
          },
        })
      );
    });

    it('should return the quick actions', () => {
      const { result } = renderHook(() => useQuickActions());

      expect(result.current).toStrictEqual(backgroundMediaQuickActions);
    });

    it('should set the correct highlight', () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[1].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: BACKGROUND_IMAGE_MEDIA3P_ELEMENT.id,
        highlight: states.ANIMATION,
      });
    });
  });

  describe('background video element is selected', () => {
    beforeEach(() => {
      mockUseStory.mockImplementation((selector) =>
        selector({
          state: {
            currentPage: {
              elements: [BACKGROUND_VIDEO_ELEMENT],
            },
            selectedElementAnimations: [
              {
                target: [BACKGROUND_VIDEO_ELEMENT.id],
              },
            ],
            selectedElements: [BACKGROUND_VIDEO_ELEMENT],
          },
          actions: {
            updateElementsById: mockUpdateElementsById,
          },
        })
      );
    });

    it('should return the quick actions', () => {
      const { result } = renderHook(() => useQuickActions());

      expect(result.current).toStrictEqual(
        backgroundMediaQuickActionsWithClear
      );
    });

    it('should set the correct highlight', () => {
      const { result } = renderHook(() => useQuickActions());

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

    it(`\`${ACTIONS.RESET_ELEMENT.text}\` action should not be present if element has no animations`, () => {
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
        highlight: states.ANIMATION,
      });

      result.current[1].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: SHAPE_ELEMENT.id,
        highlight: states.LINK,
      });
    });

    it(`\`${ACTIONS.RESET_ELEMENT.text}\` action should not be present if element has no animations`, () => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT, SHAPE_ELEMENT],
        },
        selectedElementAnimations: [],
        selectedElements: [SHAPE_ELEMENT],
        updateElementsById: mockUpdateElementsById,
      });

      const { result } = renderHook(() => useQuickActions());

      expect(result.current[2]).toBeUndefined();
    });

    it('clicking `clear animations` should call `updateElementsById`', () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[2].onClick(mockClickEvent);
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

      result.current[1].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: TEXT_ELEMENT.id,
        highlight: states.ANIMATION,
      });

      result.current[2].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: TEXT_ELEMENT.id,
        highlight: states.LINK,
      });
    });

    it(`\`${ACTIONS.RESET_ELEMENT.text}\` action should not be present if element has no animations`, () => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT, TEXT_ELEMENT],
        },
        selectedElementAnimations: [],
        selectedElements: [TEXT_ELEMENT],
        updateElementsById: mockUpdateElementsById,
      });

      const { result } = renderHook(() => useQuickActions());

      expect(result.current[3]).toBeUndefined();
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

      result.current[3].onClick(mockClickEvent);
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

    it(`should not show \`${ACTIONS.RESET_ELEMENT.text}\` action if element has no animations`, () => {
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

    it(`should click \`${ACTIONS.RESET_ELEMENT.text} and update the element`, () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[4].onClick(mockClickEvent);
      expect(mockUpdateElementsById).toHaveBeenCalledWith({
        elementIds: [VIDEO_ELEMENT.id],
        properties: expect.any(Function),
      });
    });
  });

  describe('sticker element selected', () => {
    beforeEach(() => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT, STICKER_ELEMENT],
        },
        selectedElementAnimations: [
          {
            target: [STICKER_ELEMENT.id],
          },
        ],
        selectedElements: [STICKER_ELEMENT],
        updateElementsById: mockUpdateElementsById,
      });
    });

    it('should return the quick actions', () => {
      const { result } = renderHook(() => useQuickActions());

      expect(result.current).toStrictEqual(stickerQuickActionsWithClear);
    });

    it('should set the correct highlight', () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[0].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: STICKER_ELEMENT.id,
        highlight: states.ANIMATION,
      });

      result.current[1].onClick(mockClickEvent);
      expect(highlight).toStrictEqual({
        elementId: STICKER_ELEMENT.id,
        highlight: states.LINK,
      });
    });

    it(`\`${ACTIONS.RESET_ELEMENT.text}\` action should not be present if element has no animations`, () => {
      mockUseStory.mockReturnValue({
        currentPage: {
          elements: [BACKGROUND_ELEMENT, STICKER_ELEMENT],
        },
        selectedElementAnimations: [],
        selectedElements: [STICKER_ELEMENT],
        updateElementsById: mockUpdateElementsById,
      });

      const { result } = renderHook(() => useQuickActions());

      expect(result.current[3]).toBeUndefined();
    });

    it('clicking `reset element` should update the element', () => {
      const { result } = renderHook(() => useQuickActions());

      result.current[2].onClick(mockClickEvent);
      expect(mockUpdateElementsById).toHaveBeenCalledWith({
        elementIds: [STICKER_ELEMENT.id],
        properties: expect.any(Function),
      });
    });
  });
});

describe('MediaPicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseStory.mockReturnValue({
      selectedElements: [IMAGE_ELEMENT],
      updateElementsById: mockUpdateElementsById,
    });

    mockUseConfig.mockReturnValue({
      allowedMimeTypes: {
        image: ['image/gif'],
        vector: [],
        video: ['muted'],
        caption: [],
        audio: [],
      },
      capabilities: { hasUploadMediaAction: true },
      isRTL: true,
      MediaUpload: MockMediaPicker,
    });

    mockUseLocalMedia.mockReturnValue({
      resetWithFetch: mockResetWithFetch,
      postProcessingResource: mockPostProcessingResource,
      optimizeVideo: mockOptimizeVideo,
      optimizeGif: mockOptimizeGif,
      canTranscodeResource: () => true,
    });

    mockUseFFmpeg.mockReturnValue({ isTranscodingEnabled: true });
    mockUseSnackbar.mockReturnValue({ showSnackbar: mockShowSnackbar });
  });

  it('should insert an image', () => {
    render(<MediaPicker render={noop} />);

    fireEvent.click(screen.getByText('onSelect image'));

    expect(mockOptimizeGif).toHaveBeenCalledTimes(0);
    expect(mockOptimizeVideo).toHaveBeenCalledTimes(0);
    expect(mockUpdateElementsById).toHaveBeenCalledWith({
      elementIds: [IMAGE_ELEMENT.id],
      properties: { type: imageResource.id, resource: imageResource },
    });
  });

  it('should insert an optimized gif', () => {
    render(<MediaPicker render={noop} />);

    fireEvent.click(screen.getByText('onSelect gif'));

    expect(mockOptimizeGif).toHaveBeenCalledTimes(1);
    expect(mockOptimizeVideo).toHaveBeenCalledTimes(0);
    expect(mockUpdateElementsById).toHaveBeenCalledWith({
      elementIds: [IMAGE_ELEMENT.id],
      properties: { type: gifResource.id, resource: gifResource },
    });
  });

  it('should insert an optimized video', () => {
    render(<MediaPicker render={noop} />);

    fireEvent.click(screen.getByText('onSelect video'));

    expect(mockOptimizeGif).toHaveBeenCalledTimes(0);
    expect(mockOptimizeVideo).toHaveBeenCalledTimes(1);
    expect(mockUpdateElementsById).toHaveBeenCalledWith({
      elementIds: [IMAGE_ELEMENT.id],
      properties: { type: videoResource.id, resource: videoResource },
    });
  });

  it('should call postProcessingResource for a video that is muted', () => {
    render(<MediaPicker render={noop} />);

    fireEvent.click(screen.getByText('onSelect muted video'));

    expect(mockPostProcessingResource).toHaveBeenCalledWith({
      ...videoResource,
      mimeType: 'video/mp4',
      isMuted: null,
    });
    expect(mockUpdateElementsById).toHaveBeenCalledWith({
      elementIds: [IMAGE_ELEMENT.id],
      properties: {
        type: videoResource.id,
        resource: {
          ...videoResource,
          isMuted: null,
        },
      },
    });
  });

  it('should show a snackbar if something fails during upload', () => {
    mockOptimizeVideo.mockImplementation(() => {
      throw new Error('throwing it down');
    });

    render(<MediaPicker render={noop} />);

    fireEvent.click(screen.getByText('onSelect video'));

    expect(mockUpdateElementsById).not.toHaveBeenCalled();
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'throwing it down',
      dismissable: true,
    });
  });
});
