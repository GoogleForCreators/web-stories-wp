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
import { useCallback, useMemo, useRef } from '@googleforcreators/react';
import { __, sprintf, translateToExclusiveList } from '@googleforcreators/i18n';
import {
  Icons,
  PLACEMENT,
  prettifyShortcut,
  useSnackbar,
} from '@googleforcreators/design-system';
import { trackEvent } from '@googleforcreators/tracking';
import { ELEMENT_TYPES } from '@googleforcreators/elements';
import {
  getExtensionsFromMimeType,
  resourceList,
} from '@googleforcreators/media';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import states from '../states';
import useHighlights from '../useHighlights';
import updateProperties from '../../../components/style/updateProperties';
import { useHistory } from '../../history';
import { useConfig } from '../../config';
import { TRANSCODABLE_MIME_TYPES, useLocalMedia } from '../../media';
import { STORY_EVENTS, useStory, useStoryTriggersDispatch } from '../../story';
import useApplyTextAutoStyle from '../../../utils/useApplyTextAutoStyle';
import useFFmpeg from '../../media/utils/useFFmpeg';
import useInsertElement from '../../../components/canvas/useInsertElement';
import { DEFAULT_PRESET } from '../../../components/library/panes/text/textPresets';
import { useMediaRecording } from '../../../components/mediaRecording';
import { getResetProperties } from './utils';
import { ACTIONS, RESET_DEFAULTS, RESET_PROPERTIES } from './constants';

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
  LetterTPlus,
  Link,
  Media,
  PictureSwap,
  Captions,
  Cross,
  Settings,
} = Icons;

const StyledSettings = styled(Settings).attrs({
  width: 24,
  height: 24,
})``;

const Mic = styled(Icons.Mic).attrs({
  width: 24,
  height: 24,
})``;

const MicOff = styled(Icons.MicOff).attrs({
  width: 24,
  height: 24,
})``;

export const MediaPicker = ({ render, ...props }) => {
  const {
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      vector: allowedVectorMimeTypes,
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
  let allowedMimeTypes = useMemo(
    () => [
      ...allowedImageMimeTypes,
      ...allowedVectorMimeTypes,
      ...allowedVideoMimeTypes,
    ],
    [allowedImageMimeTypes, allowedVectorMimeTypes, allowedVideoMimeTypes]
  );
  const allowedFileTypes = useMemo(
    () =>
      allowedMimeTypes.map((type) => getExtensionsFromMimeType(type)).flat(),
    [allowedMimeTypes]
  );
  if (isTranscodingEnabled) {
    allowedMimeTypes = allowedMimeTypes.concat(TRANSCODABLE_MIME_TYPES);
  }

  const transcodableMimeTypes = TRANSCODABLE_MIME_TYPES.filter(
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
        // WordPress media picker event, sizes.medium.sourceUrl is the smallest image
        insertMediaElement(
          resource,
          resource.sizes?.medium?.sourceUrl || resource.src
        );

        postProcessingResource(resource);
      } catch (e) {
        const thumbnailSrc =
          resource && ['video', 'gif'].includes(resource.type)
            ? resource.poster
            : resource.src;
        showSnackbar({
          message: e.message,
          dismissable: true,
          thumbnail: thumbnailSrc && {
            src: thumbnailSrc,
            alt: resource?.alt,
          },
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
  } = useConfig();
  const dispatchStoryEvent = useStoryTriggersDispatch();
  const {
    backgroundElement,
    selectedElementAnimations,
    selectedElements,
    updateElementsById,
  } = useStory(
    ({
      state: { currentPage, selectedElementAnimations, selectedElements },
      actions: { updateElementsById },
    }) => ({
      backgroundElement: currentPage?.elements.find(
        (element) => element.isBackground
      ),
      selectedElementAnimations,
      selectedElements,
      updateElementsById,
    })
  );
  const { undo } = useHistory(({ actions: { undo } }) => ({
    undo,
  }));
  const showSnackbar = useSnackbar(({ showSnackbar }) => showSnackbar);
  const { setHighlights } = useHighlights(({ setHighlights }) => ({
    setHighlights,
  }));

  const {
    isInRecordingMode,
    toggleRecordingMode,
    toggleAudio,
    hasAudio,
    toggleSettings,
    audioInput,
    isReady,
  } = useMediaRecording(({ state, actions }) => ({
    isInRecordingMode: state.isInRecordingMode,
    hasAudio: state.hasAudio,
    audioInput: state.audioInput,
    isReady:
      state.status === 'ready' &&
      !state.file?.type?.startsWith('image') &&
      !state.isCountingDown,
    toggleRecordingMode: actions.toggleRecordingMode,
    toggleAudio: actions.toggleAudio,
    toggleSettings: actions.toggleSettings,
    muteAudio: actions.muteAudio,
    unMuteAudio: actions.unMuteAudio,
  }));

  const undoRef = useRef(undo);
  undoRef.current = undo;

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
        // this is the only place where we're updating both animations and other
        // properties on an element. updateElementsById only accepts if you upate
        // one or the other, so we're upating animations if needed here separately
        updateElementsById({
          elementIds: [elementId],
          properties: (currentProperties) =>
            updateProperties(
              currentProperties,
              {
                animation: { ...selectedElementAnimations?.[0], delete: true },
              },
              /* commitValues */ true
            ),
        });
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
    handleFocusTextSetsPanel,
    handleFocusCaptionsPanel,
  } = useMemo(
    () => ({
      handleFocusAnimationPanel: handleFocusPanel(states.ANIMATION),
      handleFocusLinkPanel: handleFocusPanel(states.LINK),
      handleFocusPageBackground: handleFocusPanel(states.PAGE_BACKGROUND),
      handleFocusTextSetsPanel: handleFocusPanel(states.TEXT_SET),
      handleFocusCaptionsPanel: handleFocusPanel(states.CAPTIONS),
    }),
    [handleFocusPanel]
  );

  const insertElement = useInsertElement();

  const actionMenuProps = useMemo(
    () => ({
      // The <BaseTooltip> component will handle proper placement for RTL layout
      tooltipPlacement: PLACEMENT.RIGHT,
      onMouseDown: handleMouseDown,
    }),
    [handleMouseDown]
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
          insertElement('text', DEFAULT_PRESET);
          trackEvent('quick_action', {
            name: ACTIONS.INSERT_TEXT.trackingEventName,
            element: 'none',
          });
        },
        ...actionMenuProps,
      },
    ];
  }, [
    actionMenuProps,
    backgroundElement,
    handleFocusMediaPanel,
    handleFocusPageBackground,
    handleFocusTextSetsPanel,
    insertElement,
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

  const shapeActions = foregroundCommonActions;

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
      selectedElement?.type,
    ]
  );

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
      ...clearActions,
    ];
  }, [
    actionMenuProps,
    foregroundImageActions,
    handleFocusCaptionsPanel,
    selectedElement?.type,
    showClearAction,
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

  const mediaRecordingActions = useMemo(() => {
    return [
      {
        Icon: Cross,
        label: __('Close', 'web-stories'),
        onClick: () => {
          trackEvent('media_recording_mode_toggled', {
            status: 'closed',
          });
          toggleRecordingMode();
        },
        ...actionMenuProps,
      },
      {
        Icon: StyledSettings,
        label: __('Options', 'web-stories'),
        onClick: () => {
          trackEvent('media_recording_open_settings');
          toggleSettings();
        },
        disabled: !isReady,
        separator: 'top',
        ...actionMenuProps,
      },
      audioInput && {
        Icon: hasAudio ? Mic : MicOff,
        label: hasAudio
          ? __('Disable Audio', 'web-stories')
          : __('Enable Audio', 'web-stories'),
        onClick: () => {
          trackEvent('media_recording_audio_toggled', {
            status: hasAudio ? 'muted' : 'unmuted',
          });
          toggleAudio();
        },
        disabled: !isReady,
        ...actionMenuProps,
      },
    ].filter(Boolean);
  }, [
    actionMenuProps,
    audioInput,
    hasAudio,
    toggleAudio,
    toggleRecordingMode,
    toggleSettings,
    isReady,
  ]);

  // Return special actions for media recording mode.
  if (isInRecordingMode) {
    return mediaRecordingActions;
  }

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
      return [...backgroundElementMediaActions];
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
