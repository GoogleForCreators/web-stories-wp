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
import { useMemo } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';
import { Icons } from '@googleforcreators/design-system';
import { ELEMENT_TYPES } from '@googleforcreators/elements';
import { __ } from '@googleforcreators/i18n';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { states } from '../highlights';
import {
  BACKGROUND_BLUR_PX,
  VIDEO_EFFECTS,
} from '../../components/mediaRecording/constants';
import { useMediaRecording } from '../../components/mediaRecording';
import { STORY_EVENTS, useStoryTriggersDispatch } from '../story';
import { useConfig } from '../config';
import { ACTIONS } from './constants';
import useElementReset from './useElementReset';

const quickActionIconAttrs = {
  width: 24,
  height: 24,
};
const StyledSettings = styled(Icons.Settings).attrs(quickActionIconAttrs)``;
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

function useMediaActions({
  actionProps,
  selectedElement,
  handleFocusPanel,
  resetProperties,
  commonActions,
}) {
  const {
    capabilities: { hasUploadMediaAction },
  } = useConfig();
  const dispatchStoryEvent = useStoryTriggersDispatch();
  const {
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
  const showClearAction = resetProperties.length > 0;

  const foregroundImageActions = useMemo(() => {
    const actions = [];

    if (hasUploadMediaAction) {
      actions.push({
        Icon: Icons.PictureSwap,
        label: ACTIONS.REPLACE_MEDIA.text,
        onClick: () => {
          dispatchStoryEvent(STORY_EVENTS.onReplaceForegroundMedia);

          trackEvent('quick_action', {
            name: ACTIONS.REPLACE_MEDIA.trackingEventName,
            element: selectedElement?.type,
          });
        },
        wrapWithMediaPicker: true,
        ...actionProps,
      });
    }

    return [...actions, ...commonActions];
  }, [
    hasUploadMediaAction,
    commonActions,
    actionProps,
    dispatchStoryEvent,
    selectedElement?.type,
  ]);

  const { handleFocusAnimationPanel, handleFocusCaptionsPanel } = useMemo(
    () => ({
      handleFocusAnimationPanel: handleFocusPanel(states.Animation),
      handleFocusCaptionsPanel: handleFocusPanel(states.Captions),
    }),
    [handleFocusPanel]
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
        Icon: Icons.Captions,
        label: ACTIONS.ADD_CAPTIONS.text,
        onClick: (evt) => {
          handleFocusCaptionsPanel()(evt);

          trackEvent('quick_action', {
            name: ACTIONS.ADD_CAPTIONS.trackingEventName,
            element: selectedElement?.type,
          });
        },
        ...actionProps,
      },
      ...clearActions,
    ];
  }, [
    actionProps,
    foregroundImageActions,
    handleFocusCaptionsPanel,
    selectedElement?.type,
    showClearAction,
  ]);

  const handleElementReset = useElementReset();
  const backgroundElementMediaActions = useMemo(() => {
    const baseActions = [
      {
        Icon: Icons.CircleSpeed,
        label: ACTIONS.ADD_ANIMATION.text,
        onClick: (evt) => {
          handleFocusAnimationPanel()(evt);

          trackEvent('quick_action', {
            name: ACTIONS.ADD_ANIMATION.trackingEventName,
            element: selectedElement?.type,
            isBackground: true,
          });
        },
        ...actionProps,
      },
    ];

    if (hasUploadMediaAction) {
      baseActions.unshift({
        Icon: Icons.PictureSwap,
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
        ...actionProps,
      });
    }

    const clearAction = {
      Icon: Icons.Eraser,
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
      ...actionProps,
    };

    return showClearAction ? [...baseActions, clearAction] : baseActions;
  }, [
    actionProps,
    dispatchStoryEvent,
    handleElementReset,
    handleFocusAnimationPanel,
    hasUploadMediaAction,
    resetProperties,
    selectedElement?.id,
    selectedElement?.type,
    showClearAction,
  ]);

  const mediaRecordingActions = useMemo(() => {
    return [
      {
        Icon: Icons.Cross,
        label: __('Close', 'web-stories'),
        onClick: () => {
          trackEvent('media_recording_mode_toggled', {
            status: 'closed',
          });
          toggleRecordingMode();
        },
        ...actionProps,
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
        ...actionProps,
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
        disabled: !isReady || !hasVideo,
        ...actionProps,
      },
      videoInput && {
        Icon: hasVideo ? Video : VideoOff,
        label: hasVideo
          ? __('Disable Video', 'web-stories')
          : __('Enable Video', 'web-stories'),
        onClick: () => {
          trackEvent('media_recording_video_toggled', {
            status: hasVideo ? 'off' : 'on',
          });
          toggleVideo();
        },
        disabled: !isReady || !hasAudio,
        ...actionProps,
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
          trackEvent('media_recording_background_blur_px', {
            value: videoEffect === VIDEO_EFFECTS.BLUR ? 0 : BACKGROUND_BLUR_PX,
          });
          const newVideoEffect =
            videoEffect === VIDEO_EFFECTS.BLUR
              ? VIDEO_EFFECTS.NONE
              : VIDEO_EFFECTS.BLUR;
          setVideoEffect(newVideoEffect);
        },
        disabled: !isReady || !hasVideo,
        ...actionProps,
      },
      {
        Icon: Icons.Scissors,
        label: __('Trim Video', 'web-stories'),
        onClick: () => {
          trackEvent('media_recording_trim_start');
          startTrim();
        },
        disabled:
          !isProcessing || isAdjustingTrim || !hasVideo || isProcessingTrim,
        ...actionProps,
      },
    ].filter(Boolean);
  }, [
    actionProps,
    isReady,
    audioInput,
    hasAudio,
    hasVideo,
    videoInput,
    videoEffect,
    isProcessing,
    isAdjustingTrim,
    isProcessingTrim,
    toggleRecordingMode,
    toggleSettings,
    toggleAudio,
    toggleVideo,
    setVideoEffect,
    startTrim,
  ]);

  return {
    backgroundElementMediaActions,
    foregroundImageActions,
    mediaRecordingActions,
    videoActions,
  };
}

export default useMediaActions;
