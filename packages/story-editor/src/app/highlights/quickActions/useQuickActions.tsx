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
import { useCallback, useMemo, useRef } from '@googleforcreators/react';
import { __, sprintf } from '@googleforcreators/i18n';
import {
  Icons,
  PLACEMENT,
  prettifyShortcut,
  useSnackbar,
} from '@googleforcreators/design-system';
import { trackEvent } from '@googleforcreators/tracking';
import type { EventParameters } from '@googleforcreators/tracking';
import { ELEMENT_TYPES } from '@googleforcreators/elements';
import styled from 'styled-components';
import type { MouseEvent } from 'react';
/**
 * Internal dependencies
 */
import states from '../states';
import useHighlights from '../useHighlights';
import updateProperties from '../../../components/style/updateProperties';
import { useHistory } from '../../history';
import { useConfig } from '../../config';
import { STORY_EVENTS, useStory, useStoryTriggersDispatch } from '../../story';
import useApplyTextAutoStyle from '../../../utils/useApplyTextAutoStyle';
import useInsertElement from '../../../components/canvas/useInsertElement';
import { DEFAULT_PRESET } from '../../../components/library/panes/text/textPresets';
import { useMediaRecording } from '../../../components/mediaRecording';
import {
  BACKGROUND_BLUR_PX,
  VIDEO_EFFECTS,
} from '../../../components/mediaRecording/constants';
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
  Scissors,
} = Icons;

const quickActionIconAttrs = {
  width: 24,
  height: 24,
};
const StyledSettings = styled(Settings).attrs(quickActionIconAttrs)``;
const Mic = styled(Icons.Mic).attrs(quickActionIconAttrs)``;
const MicOff = styled(Icons.MicOff).attrs(quickActionIconAttrs)``;
const Video = styled(Icons.Camera).attrs(quickActionIconAttrs)``;
const VideoOff = styled(Icons.CameraOff).attrs(quickActionIconAttrs)``;
const BackgroundBlur = styled(Icons.BackgroundBlur).attrs(
  quickActionIconAttrs
)``;
const BackgroundBlurOff = styled(Icons.BackgroundBlurOff).attrs(
  quickActionIconAttrs
)``;

interface handleElementResetProp {
  elementId: string;
  resetProperties: string[];
  elementType: string;
}

/**
 * Determines the quick actions to display in the quick
 * actions menu from the selected element.
 *
 * Quick actions should follow the `quickActionPropType` definition.
 *
 * @return an array of quick action objects
 */
const useQuickActions = () => {
  const {
    capabilities: { hasUploadMediaAction },
  } = useConfig();
  const dispatchStoryEvent = useStoryTriggersDispatch();
  const {
    backgroundElement,
    currentPageNumber,
    selectedElementAnimations,
    selectedElements,
    updateElementsById,
  } = useStory(({ state, actions }) => ({
    backgroundElement: state.currentPage?.elements.find(
      (element) => element.isBackground
    ),
    currentPageNumber: state.currentPageNumber,
    selectedElementAnimations: state.selectedElementAnimations,
    selectedElements: state.selectedElements,
    updateElementsById: actions.updateElementsById,
  }));
  const { undo } = useHistory(({ actions: { undo } }) => ({
    undo,
  }));
  const showSnackbar = useSnackbar(({ showSnackbar }) => showSnackbar);
  const { setHighlights } = useHighlights((state) => ({
    setHighlights: state.setHighlights,
  }));

  const {
    isInRecordingMode,
    toggleRecordingMode,
    toggleVideo,
    toggleAudio,
    hasVideo,
    hasAudio,
    videoEffect,
    setVideoEffect,
    toggleSettings,
    audioInput,
    videoInput,
    isReady,
    isProcessing,
    isAdjustingTrim,
    isProcessingTrim,
    startTrim,
  } = useMediaRecording(({ state, actions }) => ({
    isInRecordingMode: state.isInRecordingMode,
    hasAudio: state.hasAudio,
    hasVideo: state.hasVideo,
    videoEffect: state.videoEffect,
    audioInput: state.audioInput,
    videoInput: state.videoInput,
    isReady:
      state.inputStatus === 'ready' &&
      !state.file?.type?.startsWith('image') &&
      !state.isCountingDown &&
      (state.status === 'ready' || state.status === 'idle'),
    isProcessing: state.isProcessing,
    isAdjustingTrim: state.isAdjustingTrim,
    isProcessingTrim: state.isProcessingTrim,
    toggleRecordingMode: actions.toggleRecordingMode,
    toggleVideo: actions.toggleVideo,
    toggleAudio: actions.toggleAudio,
    toggleSettings: actions.toggleSettings,
    muteAudio: actions.muteAudio,
    unMuteAudio: actions.unMuteAudio,
    startTrim: actions.startTrim,
    setVideoEffect: actions.setVideoEffect,
  }));

  const undoRef = useRef(undo);
  undoRef.current = undo;

  const selectedElement = selectedElements?.[0];

  /**
   * Prevent quick actions menu from removing focus from the canvas.
   */
  const handleMouseDown = useCallback((ev: MouseEvent<HTMLAnchorElement>) => {
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
    (elementType: string, elementId: string, properties: string[]) => {
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
    ({ elementId, resetProperties, elementType }: handleElementResetProp) => {
      handleResetProperties(elementType, elementId, resetProperties);

      showSnackbar({
        actionLabel: __('Undo', 'web-stories'),
        dismissible: false,
        message: __('Element properties have been reset', 'web-stories'),
        // Don't pass a stale version of `undo`
        onAction: () => {
          undoRef.current();

          void trackEvent('quick_action', {
            name: `undo_${ACTIONS.RESET_ELEMENT.trackingEventName}`,
            element: elementType,
            isBackground: true,
          } as EventParameters);
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
    (highlight: string) =>
      (elementId: string) =>
      (ev: MouseEvent<HTMLAnchorElement>) => {
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
        onClick: (evt: MouseEvent<HTMLAnchorElement>) => {
          handleFocusPageBackground(backgroundElement?.id)(evt);

          void trackEvent('quick_action', {
            name: ACTIONS.CHANGE_BACKGROUND_COLOR.trackingEventName,
            element: 'none',
          } as EventParameters);
        },
        ...actionMenuProps,
      },
      {
        Icon: Media,
        label: ACTIONS.INSERT_BACKGROUND_MEDIA.text,
        onClick: (evt: MouseEvent<HTMLAnchorElement>) => {
          handleFocusMediaPanel()(evt);

          void trackEvent('quick_action', {
            name: ACTIONS.INSERT_BACKGROUND_MEDIA.trackingEventName,
            element: 'none',
          } as EventParameters);
        },
        separator: 'top',
        ...actionMenuProps,
      },
      {
        Icon: LetterTPlus,
        label: ACTIONS.INSERT_TEXT.text,
        onClick: (evt: MouseEvent<HTMLAnchorElement>) => {
          handleFocusTextSetsPanel()(evt);
          insertElement('text', DEFAULT_PRESET);
          void trackEvent('quick_action', {
            name: ACTIONS.INSERT_TEXT.trackingEventName,
            element: 'none',
          } as EventParameters);
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
    const commonActions = [];

    // Don't show the 'Add animation' button on the first page
    if (currentPageNumber > 1) {
      // 'Add animation' button
      commonActions.push({
        Icon: CircleSpeed,
        label: ACTIONS.ADD_ANIMATION.text,
        onClick: (evt: MouseEvent<HTMLAnchorElement>) => {
          handleFocusAnimationPanel()(evt);

          void trackEvent('quick_action', {
            name: ACTIONS.ADD_ANIMATION.trackingEventName,
            element: selectedElement?.type,
          } as EventParameters);
        },
        ...actionMenuProps,
      });
    }

    // 'Add link' button is always rendered
    commonActions.push({
      Icon: Link,
      label: ACTIONS.ADD_LINK.text,
      onClick: (evt: MouseEvent<HTMLAnchorElement>) => {
        handleFocusLinkPanel()(evt);

        void trackEvent('quick_action', {
          name: ACTIONS.ADD_LINK.trackingEventName,
          element: selectedElement?.type,
        } as EventParameters);
      },
      ...actionMenuProps,
    });

    // Only show 'Reset element' button for modified elements
    if (showClearAction) {
      // 'Reset element' button
      commonActions.push({
        Icon: Eraser,
        label: ACTIONS.RESET_ELEMENT.text,
        onClick: () => {
          handleElementReset({
            elementId: selectedElement?.id,
            resetProperties,
            elementType: selectedElement?.type,
          });

          void trackEvent('quick_action', {
            name: ACTIONS.RESET_ELEMENT.trackingEventName,
            element: selectedElement?.type,
          } as EventParameters);
        },
        separator: 'top',
        ...actionMenuProps,
      });
    }

    return commonActions;
  }, [
    currentPageNumber,
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

          void trackEvent('quick_action', {
            name: ACTIONS.REPLACE_MEDIA.trackingEventName,
            element: selectedElement?.type,
          } as EventParameters);
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
          void applyTextAutoStyle();
          void trackEvent('quick_action', {
            name: ACTIONS.AUTO_STYLE_TEXT.trackingEventName,
            element: selectedElement?.type,
          } as EventParameters);
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
        onClick: (evt: MouseEvent<HTMLAnchorElement>) => {
          handleFocusCaptionsPanel()(evt);

          void trackEvent('quick_action', {
            name: ACTIONS.ADD_CAPTIONS.trackingEventName,
            element: selectedElement?.type,
          } as EventParameters);
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
        onClick: (evt: MouseEvent<HTMLAnchorElement>) => {
          handleFocusAnimationPanel()(evt);

          void trackEvent('quick_action', {
            name: ACTIONS.ADD_ANIMATION.trackingEventName,
            element: selectedElement?.type,
            isBackground: true,
          } as EventParameters);
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

          void trackEvent('quick_action', {
            name: ACTIONS.REPLACE_BACKGROUND_MEDIA.trackingEventName,
            element: selectedElement?.type,
            isBackground: true,
          } as EventParameters);
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

        void trackEvent('quick_action', {
          name: ACTIONS.RESET_ELEMENT.trackingEventName,
          element: selectedElement?.type,
          isBackground: true,
        } as EventParameters);
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
          void trackEvent('media_recording_mode_toggled', {
            status: 'closed',
          } as EventParameters);
          toggleRecordingMode();
        },
        ...actionMenuProps,
      },
      {
        Icon: StyledSettings,
        label: __('Options', 'web-stories'),
        onClick: () => {
          void trackEvent('media_recording_open_settings');
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
          void trackEvent('media_recording_audio_toggled', {
            status: hasAudio ? 'muted' : 'unmuted',
          } as EventParameters);
          toggleAudio();
        },
        disabled: !isReady || !hasVideo,
        ...actionMenuProps,
      },
      videoInput && {
        Icon: hasVideo ? Video : VideoOff,
        label: hasVideo
          ? __('Disable Video', 'web-stories')
          : __('Enable Video', 'web-stories'),
        onClick: () => {
          void trackEvent('media_recording_video_toggled', {
            status: hasVideo ? 'off' : 'on',
          } as EventParameters);
          toggleVideo();
        },
        disabled: !isReady || !hasAudio,
        ...actionMenuProps,
      },
      videoInput && {
        Icon:
          videoEffect === VIDEO_EFFECTS.BLUR
            ? BackgroundBlur
            : BackgroundBlurOff,
        label:
          videoEffect === VIDEO_EFFECTS.BLUR
            ? __('Disable Background Blur', 'web-stories')
            : __('Enable Background Blur', 'web-stories'),
        onClick: () => {
          void trackEvent('media_recording_background_blur_px', {
            value: videoEffect === VIDEO_EFFECTS.BLUR ? 0 : BACKGROUND_BLUR_PX,
          });
          const newVideoEffect =
            videoEffect === VIDEO_EFFECTS.BLUR
              ? VIDEO_EFFECTS.NONE
              : VIDEO_EFFECTS.BLUR;
          setVideoEffect(newVideoEffect);
        },
        disabled: !isReady || !hasVideo,
        ...actionMenuProps,
      },
      {
        Icon: Scissors,
        label: __('Trim Video', 'web-stories'),
        onClick: () => {
          void trackEvent('media_recording_trim_start');
          startTrim();
        },
        disabled:
          !isProcessing || isAdjustingTrim || !hasVideo || isProcessingTrim,
        ...actionMenuProps,
      },
    ].filter(Boolean);
  }, [
    actionMenuProps,
    isReady,
    audioInput,
    videoInput,
    hasVideo,
    hasAudio,
    isProcessing,
    isAdjustingTrim,
    isProcessingTrim,
    toggleAudio,
    toggleVideo,
    toggleRecordingMode,
    toggleSettings,
    startTrim,
    videoEffect,
    setVideoEffect,
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
