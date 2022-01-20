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
import PropTypes from 'prop-types';
import { useCallback, useMemo, useRef } from '@web-stories-wp/react';
import { __, sprintf, translateToExclusiveList } from '@web-stories-wp/i18n';
import {
  prettifyShortcut,
  useSnackbar,
  PLACEMENT,
  Icons,
} from '@web-stories-wp/design-system';
import { trackEvent } from '@web-stories-wp/tracking';
import { resourceList } from '@web-stories-wp/media';

/**
 * Internal dependencies
 */
import { states, useHighlights } from '..';
import updateProperties from '../../../components/inspector/design/updateProperties';
import useVideoTrim from '../../../components/videoTrim/useVideoTrim';
import { useHistory } from '../../history';
import { useConfig } from '../../config';
import { useLocalMedia } from '../../media';
import { ELEMENT_TYPES } from '../../../elements';
import { useStory, useStoryTriggersDispatch, STORY_EVENTS } from '../../story';
import useApplyTextAutoStyle from '../../../utils/useApplyTextAutoStyle';
import useFFmpeg from '../../media/utils/useFFmpeg';
import { getResetProperties } from './utils';
import { ACTIONS, RESET_PROPERTIES, RESET_DEFAULTS } from './constants';

const UNDO_HELP_TEXT = sprintf(
  /* translators: %s: Ctrl/Cmd + Z keyboard shortcut */
  __('Press %s to undo the last change', 'web-stories'),
  prettifyShortcut('mod+z')
);

const {
  Bucket,
  ColorBucket,
  CircleSpeed,
  Eraser,
  LetterTLargeLetterTSmall,
  LetterTPlus,
  Link,
  Media,
  PictureSwap,
  Captions,
  Scissors,
} = Icons;

export const MediaPicker = ({ render, ...props }) => {
  const {
    allowedTranscodableMimeTypes,
    allowedFileTypes,
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      video: allowedVideoMimeTypes,
    },
    MediaUpload,
  } = useConfig();

  const { selectedElements, updateElementsById } = useStory(
    ({ state: { selectedElements }, actions: { updateElementsById } }) => ({
      selectedElements,
      updateElementsById,
    })
  );
  const {
    resetWithFetch,
    postProcessingResource,
    optimizeVideo,
    optimizeGif,
    canTranscodeResource,
  } = useLocalMedia(
    ({
      state: { canTranscodeResource },
      actions: {
        resetWithFetch,
        postProcessingResource,
        optimizeVideo,
        optimizeGif,
      },
    }) => ({
      canTranscodeResource,
      resetWithFetch,
      postProcessingResource,
      optimizeVideo,
      optimizeGif,
    })
  );

  const { isTranscodingEnabled } = useFFmpeg();
  const { showSnackbar } = useSnackbar();

  // Media Upload Props
  let allowedMimeTypes = [...allowedImageMimeTypes, ...allowedVideoMimeTypes];
  if (isTranscodingEnabled) {
    allowedMimeTypes = allowedMimeTypes.concat(allowedTranscodableMimeTypes);
  }

  const transcodableMimeTypes = allowedTranscodableMimeTypes.filter(
    (x) => !allowedVideoMimeTypes.includes(x)
  );

  let onSelectErrorMessage = __(
    'No file types are currently supported.',
    'web-stories'
  );
  if (allowedFileTypes.length) {
    onSelectErrorMessage = sprintf(
      /* translators: %s: list of allowed file types. */
      __('Please choose only %s to insert into page.', 'web-stories'),
      translateToExclusiveList(allowedFileTypes)
    );
  }

  /**
   * Insert element such image, video and audio into the editor.
   *
   * @param {Object} resource Resource object
   * @param {string} thumbnailURL The thumbnail's url
   * @return {null|*} Return onInsert or null.
   */
  const insertMediaElement = useCallback(
    (resource, thumbnailURL) => {
      resourceList.set(resource.id, {
        url: thumbnailURL,
        type: 'cached',
      });
      updateElementsById({
        elementIds: [selectedElements?.[0]?.id],
        properties: { type: resource.type, resource },
      });
    },
    [selectedElements, updateElementsById]
  );

  const handleMediaSelect = useCallback(
    (resource) => {
      try {
        if (isTranscodingEnabled && canTranscodeResource(resource)) {
          if (transcodableMimeTypes.includes(resource.mimeType)) {
            optimizeVideo({ resource });
          }

          if (resource.mimeType === 'image/gif') {
            optimizeGif({ resource });
          }
        }
        // WordPress media picker event, sizes.medium.source_url is the smallest image
        insertMediaElement(
          resource,
          resource.sizes?.medium?.source_url || resource.src
        );

        postProcessingResource(resource);
      } catch (e) {
        showSnackbar({
          message: e.message,
          dismissable: true,
        });
      }
    },
    [
      isTranscodingEnabled,
      canTranscodeResource,
      insertMediaElement,
      postProcessingResource,
      transcodableMimeTypes,
      optimizeVideo,
      optimizeGif,
      showSnackbar,
    ]
  );
  return (
    <MediaUpload
      title={__('Replace media', 'web-stories')}
      buttonInsertText={__('Replace media', 'web-stories')}
      onSelect={handleMediaSelect}
      onClose={resetWithFetch}
      type={allowedMimeTypes}
      onSelectErrorMessage={onSelectErrorMessage}
      // Only way to access the open function is to dive
      // into the MediaUpload component in the render prop.
      render={(open) => render({ onClick: open })}
      {...props}
    />
  );
};
MediaPicker.propTypes = {
  buttonInsertText: PropTypes.string,
  cropParams: PropTypes.bool,
  multiple: PropTypes.bool,
  onClose: PropTypes.func,
  onPermissionError: PropTypes.func,
  onSelect: PropTypes.func,
  onSelectErrorMessage: PropTypes.string,
  render: PropTypes.func.isRequired,
  title: PropTypes.string,
  type: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

/**
 * Determines the quick actions to display in the quick
 * actions menu from the selected element.
 *
 * Quick actions should follow the `quickActionPropType` definition.
 *
 * @return {Array.<{ Icon: Node, label: string, onClick: Function, separator: string, tooltipPlacement: string, wrapWithMediaPicker: boolean }>} an array of quick action objects
 */
const useQuickActions = () => {
  const {
    capabilities: { hasUploadMediaAction },
    isRTL,
  } = useConfig();
  const dispatchStoryEvent = useStoryTriggersDispatch();
  const {
    currentPage,
    selectedElementAnimations,
    selectedElements,
    updateElementsById,
  } = useStory(
    ({
      state: { currentPage, selectedElementAnimations, selectedElements },
      actions: { updateElementsById },
    }) => ({
      currentPage,
      selectedElementAnimations,
      selectedElements,
      updateElementsById,
    })
  );
  const { undo } = useHistory(({ actions: { undo } }) => ({
    undo,
  }));
  const { showSnackbar } = useSnackbar();
  const { setHighlights } = useHighlights(({ setHighlights }) => ({
    setHighlights,
  }));
  const { hasTrimMode, toggleTrimMode } = useVideoTrim(
    ({ state: { hasTrimMode }, actions: { toggleTrimMode } }) => ({
      hasTrimMode,
      toggleTrimMode,
    })
  );

  const { canTranscodeResource } = useLocalMedia(
    ({ state: { canTranscodeResource } }) => ({
      canTranscodeResource,
    })
  );

  const undoRef = useRef(undo);
  undoRef.current = undo;

  const backgroundElement = currentPage?.elements.find(
    (element) => element.isBackground
  );
  const selectedElement = selectedElements?.[0];

  /**
   * Prevent quick actions menu from removing focus from the canvas.
   */
  const handleMouseDown = useCallback((ev) => {
    ev.stopPropagation();
  }, []);

  /**
   * Reset properties on an element. Shows a snackbar once the properties
   * have been reset.
   *
   * @param {string} elementId the id of the element
   * @param {Array.<string>} properties The properties of the element to update
   * @return {void}
   */
  const handleResetProperties = useCallback(
    (elementType, elementId, properties) => {
      const newProperties = {};
      // Choose properties to clear
      if (properties.includes(RESET_PROPERTIES.OVERLAY)) {
        newProperties.overlay = null;
      }

      if (properties.includes(RESET_PROPERTIES.ANIMATION)) {
        newProperties.animation = {
          ...selectedElementAnimations?.[0],
          delete: true,
        };
      }

      if (properties.includes(RESET_PROPERTIES.STYLES)) {
        newProperties.opacity = 100;
        newProperties.border = null;
        newProperties.borderRadius = null;
      }

      if (elementType === ELEMENT_TYPES.TEXT) {
        newProperties.borderRadius = RESET_DEFAULTS.TEXT_BORDER_RADIUS;
      }

      updateElementsById({
        elementIds: [elementId],
        properties: (currentProperties) =>
          updateProperties(
            currentProperties,
            newProperties,
            /* commitValues */ true
          ),
      });
    },
    [selectedElementAnimations, updateElementsById]
  );

  /**
   * Reset element styles and show a confirmation snackbar. Clicking
   * the action in the snackbar adds the animations back to the element.
   *
   * @param {string} elementId the id of the element
   * @param {Array} resetProperties the properties that are to be reset ('animations', 'overlay')
   * @param {string} elementType the type of element being adjusted
   * @return {void}
   */
  const handleElementReset = useCallback(
    ({ elementId, resetProperties, elementType }) => {
      handleResetProperties(elementType, elementId, resetProperties);

      showSnackbar({
        actionLabel: __('Undo', 'web-stories'),
        dismissible: false,
        message: __('Element properties have been reset', 'web-stories'),
        // Don't pass a stale version of `undo`
        onAction: () => {
          undoRef.current();

          trackEvent('quick_action', {
            name: `undo_${ACTIONS.RESET_ELEMENT.trackingEventName}`,
            element: elementType,
            isBackground: true,
          });
        },
        actionHelpText: UNDO_HELP_TEXT,
      });
    },
    [handleResetProperties, showSnackbar]
  );

  /**
   * Highlights a panel in the editor. Triggers a tracking event
   * using the selected element's type.
   *
   * The selected element and selected element type may be overridden
   * using the `elementParams` arguments.
   *
   * @param {string} highlight The panel to highlight
   * @param {Object} elementParams
   * @param {string} elementParams.elementId The element id that is or will be selected in the canvas.
   * @param {string} elementParams.elementType The type of the element that is or will be selected in the canvas.
   * @param {Event} ev The triggering event.
   */
  const handleFocusPanel = useCallback(
    (highlight) => (elementId) => (ev) => {
      ev.preventDefault();
      setHighlights({
        elementId: elementId || selectedElement?.id,
        highlight,
      });
    },
    [setHighlights, selectedElement]
  );

  const handleFocusMediaPanel = useMemo(() => {
    const resourceId = selectedElements?.[0]?.resource?.id?.toString() || '';
    const is3PMedia = resourceId.startsWith('media/');
    const panelToFocus = is3PMedia ? states.MEDIA3P : states.MEDIA;

    return handleFocusPanel(panelToFocus);
  }, [handleFocusPanel, selectedElements]);

  const {
    handleFocusAnimationPanel,
    handleFocusLinkPanel,
    handleFocusPageBackground,
    handleFocusTextColor,
    handleFocusFontPicker,
    handleFocusTextSetsPanel,
    handleFocusStylePanel,
    handleFocusCaptionsPanel,
  } = useMemo(
    () => ({
      handleFocusAnimationPanel: handleFocusPanel(states.ANIMATION),
      handleFocusLinkPanel: handleFocusPanel(states.LINK),
      handleFocusPageBackground: handleFocusPanel(states.PAGE_BACKGROUND),
      handleFocusTextSetsPanel: handleFocusPanel(states.TEXT_SET),
      handleFocusFontPicker: handleFocusPanel(states.FONT),
      handleFocusTextColor: handleFocusPanel(states.TEXT_COLOR),
      handleFocusStylePanel: handleFocusPanel(states.STYLE),
      handleFocusCaptionsPanel: handleFocusPanel(states.CAPTIONS),
    }),
    [handleFocusPanel]
  );

  const actionMenuProps = useMemo(
    () => ({
      tooltipPlacement: isRTL ? PLACEMENT.LEFT : PLACEMENT.RIGHT,
      onMouseDown: handleMouseDown,
    }),
    [handleMouseDown, isRTL]
  );

  const noElementSelectedActions = useMemo(() => {
    return [
      {
        Icon: Bucket,
        label: ACTIONS.CHANGE_BACKGROUND_COLOR.text,
        onClick: (evt) => {
          handleFocusPageBackground(backgroundElement?.id)(evt);

          trackEvent('quick_action', {
            name: ACTIONS.CHANGE_BACKGROUND_COLOR.trackingEventName,
            element: 'none',
          });
        },
        ...actionMenuProps,
      },
      {
        Icon: Media,
        label: ACTIONS.INSERT_BACKGROUND_MEDIA.text,
        onClick: (evt) => {
          handleFocusMediaPanel()(evt);

          trackEvent('quick_action', {
            name: ACTIONS.INSERT_BACKGROUND_MEDIA.trackingEventName,
            element: 'none',
          });
        },
        separator: 'top',
        ...actionMenuProps,
      },
      {
        Icon: LetterTPlus,
        label: ACTIONS.INSERT_TEXT.text,
        onClick: (evt) => {
          handleFocusTextSetsPanel()(evt);

          trackEvent('quick_action', {
            name: ACTIONS.INSERT_TEXT.trackingEventName,
            element: 'none',
          });
        },
        onMouseDown: handleMouseDown,
      },
    ];
  }, [
    actionMenuProps,
    backgroundElement,
    handleFocusMediaPanel,
    handleFocusPageBackground,
    handleFocusTextSetsPanel,
    handleMouseDown,
  ]);

  const resetProperties = useMemo(
    () => getResetProperties(selectedElement, selectedElementAnimations),
    [selectedElement, selectedElementAnimations]
  );
  const showClearAction = resetProperties.length > 0;

  const foregroundCommonActions = useMemo(() => {
    const baseActions = [
      {
        Icon: CircleSpeed,
        label: ACTIONS.ADD_ANIMATION.text,
        onClick: (evt) => {
          handleFocusAnimationPanel()(evt);

          trackEvent('quick_action', {
            name: ACTIONS.ADD_ANIMATION.trackingEventName,
            element: selectedElement?.type,
          });
        },
        ...actionMenuProps,
      },
      {
        Icon: Link,
        label: ACTIONS.ADD_LINK.text,
        onClick: (evt) => {
          handleFocusLinkPanel()(evt);

          trackEvent('quick_action', {
            name: ACTIONS.ADD_LINK.trackingEventName,
            element: selectedElement?.type,
          });
        },
        ...actionMenuProps,
      },
    ];

    const clearAction = {
      Icon: Eraser,
      label: ACTIONS.RESET_ELEMENT.text,
      onClick: () => {
        handleElementReset({
          elementId: selectedElement?.id,
          resetProperties,
          elementType: selectedElement?.type,
        });

        trackEvent('quick_action', {
          name: ACTIONS.RESET_ELEMENT.trackingEventName,
          element: selectedElement?.type,
        });
      },
      separator: 'top',
      ...actionMenuProps,
    };

    return showClearAction ? [...baseActions, clearAction] : baseActions;
  }, [
    handleFocusAnimationPanel,
    selectedElement?.id,
    selectedElement?.type,
    actionMenuProps,
    handleFocusLinkPanel,
    showClearAction,
    handleElementReset,
    resetProperties,
  ]);

  const foregroundImageActions = useMemo(() => {
    const actions = [];

    if (hasUploadMediaAction) {
      actions.push({
        Icon: PictureSwap,
        label: ACTIONS.REPLACE_MEDIA.text,
        onClick: () => {
          dispatchStoryEvent(STORY_EVENTS.onReplaceForegroundMedia);

          trackEvent('quick_action', {
            name: ACTIONS.REPLACE_MEDIA.trackingEventName,
            element: selectedElement?.type,
          });
        },
        wrapWithMediaPicker: true,
        ...actionMenuProps,
      });
    }

    return [...actions, ...foregroundCommonActions];
  }, [
    actionMenuProps,
    foregroundCommonActions,
    hasUploadMediaAction,
    dispatchStoryEvent,
    selectedElement?.type,
  ]);

  const shapeActions = useMemo(
    () => [
      {
        Icon: Bucket,
        label: ACTIONS.CHANGE_COLOR.text,
        onClick: (evt) => {
          handleFocusStylePanel()(evt);

          trackEvent('quick_action', {
            name: ACTIONS.CHANGE_COLOR.trackingEventName,
            element: selectedElement?.type,
          });
        },
        ...actionMenuProps,
      },
      ...foregroundCommonActions,
    ],
    [
      actionMenuProps,
      foregroundCommonActions,
      handleFocusStylePanel,
      selectedElement?.type,
    ]
  );

  const applyTextAutoStyle = useApplyTextAutoStyle(
    selectedElement,
    (properties) =>
      updateElementsById({
        elementIds: [selectedElement?.id],
        properties,
      })
  );
  const textActions = useMemo(
    () => [
      {
        Icon: Bucket,
        label: ACTIONS.CHANGE_COLOR.text,
        onClick: (evt) => {
          handleFocusTextColor()(evt);

          trackEvent('quick_action', {
            name: ACTIONS.CHANGE_COLOR.trackingEventName,
            element: selectedElement?.type,
          });
        },
        ...actionMenuProps,
      },
      {
        Icon: LetterTLargeLetterTSmall,
        label: ACTIONS.CHANGE_FONT.text,
        onClick: (evt) => {
          handleFocusFontPicker()(evt);

          trackEvent('quick_action', {
            name: ACTIONS.CHANGE_FONT.trackingEventName,
            element: selectedElement?.type,
          });
        },
        ...actionMenuProps,
      },
      {
        Icon: ColorBucket,
        label: ACTIONS.AUTO_STYLE_TEXT.text,
        onClick: () => {
          applyTextAutoStyle();
          trackEvent('quick_action', {
            name: ACTIONS.AUTO_STYLE_TEXT.trackingEventName,
            element: selectedElement?.type,
          });
        },
        ...actionMenuProps,
      },
      ...foregroundCommonActions,
    ],
    [
      applyTextAutoStyle,
      foregroundCommonActions,
      actionMenuProps,
      handleFocusTextColor,
      handleFocusFontPicker,
      selectedElement?.type,
    ]
  );

  const videoCommonActions = useMemo(() => {
    const resource = selectedElements?.[0]?.resource;
    if (!resource) {
      return [];
    }
    return canTranscodeResource(resource) && hasTrimMode
      ? [
          {
            Icon: Scissors,
            label: ACTIONS.TRIM_VIDEO.text,
            onClick: () => {
              toggleTrimMode();
              trackEvent('quick_action', {
                name: ACTIONS.TRIM_VIDEO.trackingEventName,
                element: selectedElement.type,
              });
            },
            ...actionMenuProps,
          },
        ]
      : [];
  }, [
    selectedElements,
    selectedElement,
    canTranscodeResource,
    hasTrimMode,
    actionMenuProps,
    toggleTrimMode,
  ]);

  const videoActions = useMemo(() => {
    const [baseActions, clearActions] = showClearAction
      ? [
          foregroundImageActions.slice(0, foregroundImageActions.length - 1),
          foregroundImageActions.slice(-1),
        ]
      : [foregroundImageActions, []];

    return [
      ...baseActions,
      {
        Icon: Captions,
        label: ACTIONS.ADD_CAPTIONS.text,
        onClick: (evt) => {
          handleFocusCaptionsPanel()(evt);

          trackEvent('quick_action', {
            name: ACTIONS.ADD_CAPTIONS.trackingEventName,
            element: selectedElement?.type,
          });
        },
        ...actionMenuProps,
      },
      ...videoCommonActions,
      ...clearActions,
    ];
  }, [
    actionMenuProps,
    foregroundImageActions,
    handleFocusCaptionsPanel,
    selectedElement?.type,
    showClearAction,
    videoCommonActions,
  ]);

  const backgroundElementMediaActions = useMemo(() => {
    const baseActions = [
      {
        Icon: CircleSpeed,
        label: ACTIONS.ADD_ANIMATION.text,
        onClick: (evt) => {
          handleFocusAnimationPanel()(evt);

          trackEvent('quick_action', {
            name: ACTIONS.ADD_ANIMATION.trackingEventName,
            element: selectedElement?.type,
            isBackground: true,
          });
        },
        ...actionMenuProps,
      },
    ];

    if (hasUploadMediaAction) {
      baseActions.unshift({
        Icon: PictureSwap,
        label: ACTIONS.REPLACE_BACKGROUND_MEDIA.text,
        onClick: () => {
          dispatchStoryEvent(STORY_EVENTS.onReplaceBackgroundMedia);

          trackEvent('quick_action', {
            name: ACTIONS.REPLACE_BACKGROUND_MEDIA.trackingEventName,
            element: selectedElement?.type,
            isBackground: true,
          });
        },
        wrapWithMediaPicker: true,
        ...actionMenuProps,
      });
    }

    const clearAction = {
      Icon: Eraser,
      label: ACTIONS.RESET_ELEMENT.text,
      onClick: () => {
        handleElementReset({
          elementId: selectedElement?.id,
          resetProperties,
          elementType: ELEMENT_TYPES.IMAGE,
        });

        trackEvent('quick_action', {
          name: ACTIONS.RESET_ELEMENT.trackingEventName,
          element: selectedElement?.type,
          isBackground: true,
        });
      },
      separator: 'top',
      ...actionMenuProps,
    };

    return showClearAction ? [...baseActions, clearAction] : baseActions;
  }, [
    actionMenuProps,
    dispatchStoryEvent,
    handleElementReset,
    handleFocusAnimationPanel,
    hasUploadMediaAction,
    resetProperties,
    selectedElement,
    showClearAction,
  ]);

  // Hide menu if there are multiple elements selected
  if (selectedElements.length > 1) {
    return [];
  }

  const isBackgroundElementMedia = Boolean(
    backgroundElement && backgroundElement?.resource
  );

  const noElementsSelected = selectedElements.length === 0;
  const isBackgroundSelected = selectedElements?.[0]?.isBackground;

  // Return the base state if:
  //  1. no element is selected
  //  2. or, the selected element is the background element and it's not media
  if (
    noElementsSelected ||
    (isBackgroundSelected && !isBackgroundElementMedia)
  ) {
    return noElementSelectedActions;
  }

  // return background media actions if:
  // 1. the background is selected
  // 2. and, the background is media
  if (isBackgroundSelected && isBackgroundElementMedia) {
    const isVideo = selectedElement.type === 'video';
    // In case of video, we're also adding actions that are common for video regardless of bg/not.
    if (isVideo) {
      return [...backgroundElementMediaActions, ...videoCommonActions];
    }
    return backgroundElementMediaActions;
  }

  // switch quick actions based on non-background element type
  switch (selectedElements?.[0]?.type) {
    case ELEMENT_TYPES.IMAGE:
    case ELEMENT_TYPES.GIF:
      return foregroundImageActions;
    case ELEMENT_TYPES.SHAPE:
      return shapeActions;
    case ELEMENT_TYPES.TEXT:
      return textActions;
    case ELEMENT_TYPES.VIDEO:
      return videoActions;
    case ELEMENT_TYPES.STICKER:
      return foregroundCommonActions;
    default:
      return [];
  }
};

export default useQuickActions;
