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
import {
  ElementType,
  elementIs,
  ElementId,
  Element,
} from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { states, useHighlights } from '../highlights';
import updateProperties from '../../components/style/updateProperties';
import { useHistory } from '../history';
import { useStory } from '../story';
import useInsertElement from '../../components/canvas/useInsertElement';
import { DEFAULT_PRESET } from '../../components/library/panes/text/textPresets';
import { useMediaRecording } from '../../components/mediaRecording';
import { getResetProperties } from './utils';
import { ACTIONS, RESET_DEFAULTS, RESET_PROPERTIES } from './constants';
import useTextActions from './useTextActions';
import useMediaActions from './useMediaActions';

const UNDO_HELP_TEXT = sprintf(
  /* translators: %s: Ctrl/Cmd + Z keyboard shortcut */
  __('Press %s to undo the last change', 'web-stories'),
  prettifyShortcut('mod+z')
);

const { Bucket, CircleSpeed, Eraser, LetterTPlus, Link, Media } = Icons;

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
    backgroundElement,
    currentPageNumber,
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
        (element) => elementIs.backgroundable(element) && element.isBackground
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
  const showSnackbar = useSnackbar(({ showSnackbar }) => showSnackbar);
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
  const handleMouseDown = useCallback((ev: MouseEvent) => {
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
    (
      elementType: ElementType,
      elementId: ElementId,
      properties: string[]
    ) => {
      const newProperties: Partial<Element> = {};
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

      if (elementType === ElementType.Text) {
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

  const resetProperties = useMemo(
    () => getResetProperties(selectedElement, selectedElementAnimations),
    [selectedElement, selectedElementAnimations]
  );

  const showClearAction = resetProperties.length > 0;
  const handleFocusMediaPanel = useMemo(() => {
    const resourceId = selectedElements?.[0]?.resource?.id?.toString() || '';
    const is3PMedia = resourceId.startsWith('media/');
    const panelToFocus = is3PMedia ? states.Media3p : states.Media;

    return handleFocusPanel(panelToFocus);
  }, [handleFocusPanel, selectedElements]);

  const {
    handleFocusAnimationPanel,
    handleFocusLinkPanel,
    handleFocusPageBackground,
  } = useMemo(
    () => ({
      handleFocusAnimationPanel: handleFocusPanel(states.Animation),
      handleFocusLinkPanel: handleFocusPanel(states.Link),
      handleFocusPageBackground: handleFocusPanel(states.PageBackground),
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
  }, [
    actionMenuProps,
    backgroundElement,
    handleFocusMediaPanel,
    handleFocusPageBackground,
    setHighlights,
    insertElement,
  ]);

  const foregroundCommonActions = useMemo(() => {
    const commonActions = [];

    // Don't show the 'Add animation' button on the first page
    if (currentPageNumber > 1) {
      // 'Add animation' button
      commonActions.push({
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
      });
    }

    // 'Add link' button is always rendered
    commonActions.push({
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

          trackEvent('quick_action', {
            name: ACTIONS.RESET_ELEMENT.trackingEventName,
            element: selectedElement?.type,
          });
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
