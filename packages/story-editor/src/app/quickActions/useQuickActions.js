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
import { Icons, Placement } from '@googleforcreators/design-system';
import { trackEvent } from '@googleforcreators/tracking';
import { ElementType } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { states, useHighlights } from '../highlights';
import { useHistory } from '../history';
import { useStory } from '../story';
import useInsertElement from '../../components/canvas/useInsertElement';
import { DEFAULT_PRESET } from '../../components/library/panes/text/textPresets';
import { useMediaRecording } from '../../components/mediaRecording';
import { AUDIO_STICKER_DEFAULT_PRESET } from '../../constants';
import { getResetProperties } from './utils';
import { ACTIONS } from './constants';
import useTextActions from './useTextActions';
import useMediaActions from './useMediaActions';
import useForegroundActions from './useForegroundActions';

const { Bucket, LetterTPlus, Media, AudioSticker } = Icons;

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
    backgroundElement,
    selectedElementAnimations,
    selectedElements,
    updateElementsById,
  } = useStory(
    ({
      state: {
        currentPage,
        currentPageNumber,
        selectedElementAnimations,
        selectedElements,
      },
      actions: { updateElementsById },
    }) => ({
      backgroundElement: currentPage?.elements.find(
        (element) => element.isBackground
      ),
      currentPageNumber,
      selectedElementAnimations,
      selectedElements,
      updateElementsById,
    })
  );
  const { undo } = useHistory(({ actions: { undo } }) => ({
    undo,
  }));
  const { setHighlights } = useHighlights(({ setHighlights }) => ({
    setHighlights,
  }));

  const { isInRecordingMode } = useMediaRecording(({ state }) => ({
    isInRecordingMode: state.isInRecordingMode,
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

  const resetProperties = useMemo(
    () => getResetProperties(selectedElement, selectedElementAnimations),
    [selectedElement, selectedElementAnimations]
  );

  const handleFocusMediaPanel = useMemo(() => {
    const resourceId = selectedElements?.[0]?.resource?.id?.toString() || '';
    const is3PMedia = resourceId.startsWith('media/');
    const panelToFocus = is3PMedia ? states.Media3p : states.Media;

    return handleFocusPanel(panelToFocus);
  }, [handleFocusPanel, selectedElements]);

  const { handleFocusPageBackground } = useMemo(
    () => ({
      handleFocusPageBackground: handleFocusPanel(states.PageBackground),
    }),
    [handleFocusPanel]
  );

  const insertElement = useInsertElement();

  const actionMenuProps = useMemo(
    () => ({
      // The <BaseTooltip> component will handle proper placement for RTL layout
      tooltipPlacement: Placement.Right,
      onMouseDown: handleMouseDown,
    }),
    [handleMouseDown]
  );

  const hasAudioAnywhere = useStory(
    ({ state }) =>
      state.story.backgroundAudio ||
      state.pages.some((page) => {
        return (
          page.backgroundAudio ||
          page.elements
            .filter((element) => element.type === ElementType.Video)
            .some((element) => !element.resource.isMuted)
        );
      })
  );

  const noElementSelectedActions = useMemo(() => {
    const actions = [
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
        onClick: () => {
          setHighlights({
            highlight: states.StylePane,
          });
          insertElement('text', DEFAULT_PRESET);
          trackEvent('quick_action', {
            name: ACTIONS.INSERT_TEXT.trackingEventName,
            element: 'none',
          });
        },
        ...actionMenuProps,
      },
    ];

    if (hasAudioAnywhere) {
      actions.push({
        Icon: AudioSticker,
        label: ACTIONS.INSERT_AUDIO_STICKER.text,
        onClick: () => {
          insertElement('audioSticker', AUDIO_STICKER_DEFAULT_PRESET);
        },
        ...actionMenuProps,
      });
    }

    return actions;
  }, [
    actionMenuProps,
    backgroundElement,
    handleFocusMediaPanel,
    handleFocusPageBackground,
    setHighlights,
    insertElement,
    hasAudioAnywhere,
  ]);

  const foregroundCommonActions = useForegroundActions({
    actionProps: actionMenuProps,
    selectedElement,
    handleFocusPanel,
    resetProperties,
  });

  const textActions = useTextActions({
    selectedElement,
    updater: updateElementsById,
    commonActions: foregroundCommonActions,
    actionProps: actionMenuProps,
  });
  const {
    backgroundElementMediaActions,
    foregroundImageActions,
    mediaRecordingActions,
    videoActions,
  } = useMediaActions({
    selectedElement,
    handleFocusPanel,
    resetProperties,
    commonActions: foregroundCommonActions,
  });

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
    return backgroundElementMediaActions;
  }

  // switch quick actions based on non-background element type
  switch (selectedElements?.[0]?.type) {
    case ElementType.Image:
    case ElementType.Gif:
      return foregroundImageActions;
    case ElementType.Shape:
    case ElementType.Sticker:
      return foregroundCommonActions;
    case ElementType.Text:
      return textActions;
    case ElementType.Video:
      return videoActions;
    default:
      return [];
  }
};

export default useQuickActions;
