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
import { useCallback, useMemo, useRef } from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';
import { useSnackbar, PLACEMENT, Icons } from '@web-stories-wp/design-system';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { states, useHighlights } from '..';
import updateProperties from '../../../components/inspector/design/updateProperties';
import { useHistory } from '../../history';
import { useConfig } from '../../config';
import {
  useStory,
  useStoryTriggersDispatch,
  STORY_EVENTS,
  ELEMENT_TYPES,
} from '../../story';
import { getResetProperties } from './utils';
import { ACTION_TEXT, RESET_PROPERTIES, RESET_DEFAULTS } from './constants';

const {
  Bucket,
  CircleSpeed,
  Eraser,
  LetterTLargeLetterTSmall,
  LetterTPlus,
  Link,
  Media,
  PictureSwap,
  Captions,
} = Icons;

/** @typedef {import('@web-stories-wp/design-system').MenuItemProps} MenuItemProps */

/**
 * Determines the quick actions to display in the quick
 * actions menu from the selected element.
 *
 * Quick actions should have the same shape as items in
 * the design system's context menu.
 *
 * @return {Array.<MenuItemProps>} an array of quick action objects
 */
const useQuickActions = () => {
  const { isRTL } = useConfig();
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

      trackEvent('quick_action', {
        name: 'reset_properties',
        element: elementType,
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
        dismissable: false,
        message: __('Element properties have been reset', 'web-stories'),
        // Don't pass a stale version of `undo`
        onAction: () => undoRef.current(),
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
    (highlight) =>
      ({ elementId, elementType } = {}) =>
      (ev) => {
        ev.preventDefault();
        setHighlights({
          elementId: elementId || selectedElement?.id,
          highlight,
        });

        trackEvent('quick_action', {
          name: 'focus_panel',
          element: elementType || selectedElement?.type,
          panel: highlight,
        });
      },
    [setHighlights, selectedElement]
  );

  const handleFocusMediaPanel = useMemo(() => {
    const idOrigin = selectedElements?.[0]?.resource?.id
      ?.toString()
      .split(':')?.[0];
    const is3PGif =
      (!idOrigin || idOrigin?.toLowerCase() === 'media/tenor') &&
      selectedElements?.[0]?.resource?.type?.toLowerCase() === 'gif';
    const is3PVideo = idOrigin?.toLowerCase() === 'media/coverr';
    const is3PImage = idOrigin?.toLowerCase() === 'media/unsplash';

    const panelToFocus =
      is3PImage || is3PVideo || is3PGif ? states.MEDIA3P : states.MEDIA;

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
        label: ACTION_TEXT.CHANGE_BACKGROUND_COLOR,
        onClick: handleFocusPageBackground({
          elementId: backgroundElement?.id,
          elementType: backgroundElement?.type,
        }),
        ...actionMenuProps,
      },
      {
        Icon: Media,
        label: ACTION_TEXT.INSERT_BACKGROUND_MEDIA,
        onClick: handleFocusMediaPanel(),
        separator: 'top',
        ...actionMenuProps,
      },
      {
        Icon: LetterTPlus,
        label: ACTION_TEXT.INSERT_TEXT,
        onClick: handleFocusTextSetsPanel(),
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
        label: ACTION_TEXT.ADD_ANIMATION,
        onClick: handleFocusAnimationPanel(),
        ...actionMenuProps,
      },
      {
        Icon: Link,
        label: ACTION_TEXT.ADD_LINK,
        onClick: handleFocusLinkPanel(),
        ...actionMenuProps,
      },
    ];

    const clearAction = {
      Icon: Eraser,
      label: ACTION_TEXT.RESET_ELEMENT,
      onClick: () =>
        handleElementReset({
          elementId: selectedElement?.id,
          resetProperties,
          elementType: selectedElement?.type,
        }),
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

  const foregroundImageActions = useMemo(
    () => [
      {
        Icon: PictureSwap,
        label: ACTION_TEXT.REPLACE_MEDIA,
        onClick: (ev) => {
          dispatchStoryEvent(STORY_EVENTS.onReplaceForegroundMedia);
          handleFocusMediaPanel()(ev);
        },
        ...actionMenuProps,
      },
      ...foregroundCommonActions,
    ],
    [
      actionMenuProps,
      handleFocusMediaPanel,
      foregroundCommonActions,
      dispatchStoryEvent,
    ]
  );

  const shapeActions = useMemo(
    () => [
      {
        Icon: Bucket,
        label: ACTION_TEXT.CHANGE_COLOR,
        onClick: handleFocusStylePanel(),
        ...actionMenuProps,
      },
      ...foregroundCommonActions,
    ],
    [handleFocusStylePanel, foregroundCommonActions, actionMenuProps]
  );

  const textActions = useMemo(
    () => [
      {
        Icon: Bucket,
        label: ACTION_TEXT.CHANGE_COLOR,
        onClick: handleFocusTextColor(),
        ...actionMenuProps,
      },
      {
        Icon: LetterTLargeLetterTSmall,
        label: ACTION_TEXT.CHANGE_FONT,
        onClick: handleFocusFontPicker(),
        ...actionMenuProps,
      },
      ...foregroundCommonActions,
    ],
    [
      foregroundCommonActions,
      actionMenuProps,
      handleFocusTextColor,
      handleFocusFontPicker,
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
        label: ACTION_TEXT.ADD_CAPTIONS,
        onClick: handleFocusCaptionsPanel(),
        ...actionMenuProps,
      },
      ...clearActions,
    ];
  }, [
    showClearAction,
    foregroundImageActions,
    handleFocusCaptionsPanel,
    actionMenuProps,
  ]);

  const backgroundElementMediaActions = useMemo(() => {
    const baseActions = [
      {
        Icon: PictureSwap,
        label: ACTION_TEXT.REPLACE_BACKGROUND_MEDIA,
        onClick: (ev) => {
          dispatchStoryEvent(STORY_EVENTS.onReplaceBackgroundMedia);
          handleFocusMediaPanel()(ev);
        },
        ...actionMenuProps,
      },
      {
        Icon: CircleSpeed,
        label: ACTION_TEXT.ADD_ANIMATION,
        onClick: handleFocusAnimationPanel(),
        ...actionMenuProps,
      },
    ];

    const clearAction = {
      Icon: Eraser,
      label: ACTION_TEXT.RESET_ELEMENT,
      onClick: () =>
        handleElementReset({
          elementId: selectedElement?.id,
          resetProperties,
          elementType: ELEMENT_TYPES.IMAGE,
        }),
      separator: 'top',
      ...actionMenuProps,
    };

    return showClearAction ? [...baseActions, clearAction] : baseActions;
  }, [
    actionMenuProps,
    handleFocusAnimationPanel,
    selectedElement?.id,
    showClearAction,
    handleElementReset,
    dispatchStoryEvent,
    handleFocusMediaPanel,
    resetProperties,
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
  // 2. and, the background is selected
  if (isBackgroundSelected && isBackgroundElementMedia) {
    return backgroundElementMediaActions;
  }

  // switch quick actions based on non-background element type
  switch (selectedElements?.[0]?.type) {
    case ELEMENT_TYPES.IMAGE:
      return foregroundImageActions;
    case ELEMENT_TYPES.SHAPE:
      return shapeActions;
    case ELEMENT_TYPES.TEXT:
      return textActions;
    case ELEMENT_TYPES.VIDEO:
      return videoActions;
    default:
      return [];
  }
};

export default useQuickActions;
