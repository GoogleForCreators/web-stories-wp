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
import { useCallback, useMemo } from 'react';
import { __ } from '@web-stories-wp/i18n';
/**
 * Internal dependencies
 */
import { states, useHighlights } from '..';
import { useSnackbar, PLACEMENT } from '../../../../design-system';
import {
  Bucket,
  CircleSpeed,
  Eraser,
  LetterTLargeLetterTSmall,
  LetterTPlus,
  Link,
  Media,
  PictureSwap,
} from '../../../../design-system/icons';
import updateProperties from '../../../components/inspector/design/updateProperties';
import { useHistory } from '../../history';
import { useConfig } from '../../config';
import { useStory, useStoryTriggersDispatch, STORY_EVENTS } from '../../story';
import { getResetProperties, getSnackbarClearCopy } from './utils';
import { ELEMENT_TYPE, ACTION_TEXT, RESET_PROPERTIES } from './constants';

/** @typedef {import('../../../../design-system/components').MenuItemProps} MenuItemProps */

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
    (elementId, properties) => {
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
   * Clear animations and show a confirmation snackbar. Clicking
   * the action in the snackbar adds the animations back to the element.
   *
   * @param {string} elementId the id of the element
   * @param {Array} resetProperties the properties that are to be reset ('animations', 'overlay')
   * @param {string} elementType the type of element being adjusted
   * @return {void}
   */
  const handleClearAnimationsAndFilters = useCallback(
    ({ elementId, resetProperties, elementType }) => {
      handleResetProperties(elementId, resetProperties);
      const message = getSnackbarClearCopy(resetProperties, elementType);

      showSnackbar({
        actionLabel: __('Undo', 'web-stories'),
        dismissable: false,
        message,
        onAction: undo,
      });
    },
    [handleResetProperties, showSnackbar, undo]
  );

  const handleFocusPanel = useCallback(
    (highlight) => (elementId) => (ev) => {
      ev.preventDefault();
      setHighlights({ elementId, highlight });
    },
    [setHighlights]
  );

  const handleFocusMediaPanel = useMemo(() => {
    const idOrigin = selectedElements?.[0]?.resource?.id
      ?.toString()
      .split(':')?.[0];
    const is3PGif =
      !idOrigin &&
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
  } = useMemo(
    () => ({
      handleFocusAnimationPanel: handleFocusPanel(states.ANIMATION),
      handleFocusLinkPanel: handleFocusPanel(states.LINK),
      handleFocusPageBackground: handleFocusPanel(states.PAGE_BACKGROUND),
      handleFocusTextSetsPanel: handleFocusPanel(states.TEXT_SET),
      handleFocusFontPicker: handleFocusPanel(states.FONT),
      handleFocusTextColor: handleFocusPanel(states.TEXT_COLOR),
      handleFocusStylePanel: handleFocusPanel(states.STYLE),
    }),
    [handleFocusPanel]
  );

  const backgroundElement =
    currentPage?.elements.find((element) => element.isBackground) ||
    selectedElements?.[0]?.isBackground;
  const selectedElement = selectedElements?.[0];

  const actionMenuProps = useMemo(
    () => ({
      tooltipPlacement: isRTL ? PLACEMENT.LEFT : PLACEMENT.RIGHT,
      onMouseDown: handleMouseDown,
    }),
    [handleMouseDown, isRTL]
  );

  const defaultActions = useMemo(() => {
    return [
      {
        Icon: Bucket,
        label: ACTION_TEXT.CHANGE_BACKGROUND_COLOR,
        onClick: handleFocusPageBackground(backgroundElement?.id),
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
    backgroundElement?.id,
    handleFocusMediaPanel,
    handleFocusPageBackground,
    handleFocusTextSetsPanel,
    handleMouseDown,
  ]);

  const foregroundCommonActions = useMemo(() => {
    const resetProperties = getResetProperties(
      selectedElement,
      selectedElementAnimations
    );
    const baseActions = [
      {
        Icon: CircleSpeed,
        label: ACTION_TEXT.ADD_ANIMATION,
        onClick: handleFocusAnimationPanel(selectedElement?.id),
        ...actionMenuProps,
      },
      {
        Icon: Link,
        label: ACTION_TEXT.ADD_LINK,
        onClick: handleFocusLinkPanel(selectedElement?.id),
        ...actionMenuProps,
      },
    ];

    const clearAction = {
      Icon: Eraser,
      label: ACTION_TEXT.CLEAR_ANIMATIONS,
      onClick: () =>
        handleClearAnimationsAndFilters({
          elementId: selectedElement?.id,
          resetProperties,
          elementType: selectedElement?.type,
        }),
      separator: 'top',
      ...actionMenuProps,
    };

    return resetProperties.length > 0
      ? [...baseActions, clearAction]
      : baseActions;
  }, [
    handleClearAnimationsAndFilters,
    handleFocusLinkPanel,
    handleFocusAnimationPanel,
    actionMenuProps,
    selectedElement,
    selectedElementAnimations,
  ]);

  const foregroundImageActions = useMemo(
    () => [
      {
        Icon: PictureSwap,
        label: ACTION_TEXT.REPLACE_MEDIA,
        onClick: (ev) => {
          dispatchStoryEvent(STORY_EVENTS.onReplaceForegroundMedia);
          handleFocusMediaPanel(selectedElement?.id)(ev);
        },
        ...actionMenuProps,
      },
      ...foregroundCommonActions,
    ],
    [
      actionMenuProps,
      handleFocusMediaPanel,
      foregroundCommonActions,
      selectedElement?.id,
      dispatchStoryEvent,
    ]
  );

  const shapeActions = useMemo(
    () => [
      {
        Icon: Bucket,
        label: ACTION_TEXT.CHANGE_COLOR,
        onClick: handleFocusStylePanel(selectedElement?.id),
        ...actionMenuProps,
      },
      ...foregroundCommonActions,
    ],
    [
      handleFocusStylePanel,
      foregroundCommonActions,
      actionMenuProps,
      selectedElement?.id,
    ]
  );

  const textActions = useMemo(
    () => [
      {
        Icon: Bucket,
        label: ACTION_TEXT.CHANGE_COLOR,
        onClick: handleFocusTextColor(selectedElement?.id),
        ...actionMenuProps,
      },
      {
        Icon: LetterTLargeLetterTSmall,
        label: ACTION_TEXT.CHANGE_FONT,
        onClick: handleFocusFontPicker(selectedElement?.id),
        ...actionMenuProps,
      },
      ...foregroundCommonActions,
    ],
    [
      foregroundCommonActions,
      actionMenuProps,
      selectedElement?.id,
      handleFocusTextColor,
      handleFocusFontPicker,
    ]
  );

  const backgroundElementMediaActions = useMemo(() => {
    const resetProperties = getResetProperties(
      selectedElement,
      selectedElementAnimations
    );

    const baseActions = [
      {
        Icon: PictureSwap,
        label: ACTION_TEXT.REPLACE_BACKGROUND_MEDIA,
        onClick: (ev) => {
          dispatchStoryEvent(STORY_EVENTS.onReplaceBackgroundMedia);
          handleFocusMediaPanel(selectedElement?.id)(ev);
        },
        ...actionMenuProps,
      },
      {
        Icon: CircleSpeed,
        label: ACTION_TEXT.ADD_ANIMATION,
        onClick: handleFocusAnimationPanel(selectedElement?.id),
        ...actionMenuProps,
      },
    ];

    const clearAction = {
      Icon: Eraser,
      label: ACTION_TEXT.CLEAR_ANIMATION_AND_FILTERS,
      onClick: () =>
        handleClearAnimationsAndFilters({
          elementId: selectedElement?.id,
          resetProperties,
          elementType: ELEMENT_TYPE.BACKGROUND,
        }),
      separator: 'top',
      ...actionMenuProps,
    };

    return resetProperties.length > 0
      ? [...baseActions, clearAction]
      : baseActions;
  }, [
    selectedElement,
    selectedElementAnimations,
    handleFocusMediaPanel,
    actionMenuProps,
    handleFocusAnimationPanel,
    handleClearAnimationsAndFilters,
    dispatchStoryEvent,
  ]);

  // Hide menu if there are multiple elements selected
  if (selectedElements.length > 1) {
    return [];
  }

  const isBackgroundElementMedia = Boolean(
    backgroundElement && backgroundElement?.resource
  );

  // Return the base state if:
  //  1. no element is selected
  //  2. the selected element is the background element and it's not media
  if (
    !isBackgroundElementMedia &&
    ((selectedElements.length === 0 && backgroundElement) ||
      selectedElements[0]?.isBackground)
  ) {
    return defaultActions;
  }

  if (
    isBackgroundElementMedia &&
    [ELEMENT_TYPE.IMAGE, ELEMENT_TYPE.VIDEO, ELEMENT_TYPE.GIF].indexOf(
      selectedElements?.[0]?.type
    ) > -1
  ) {
    return backgroundElementMediaActions;
  }

  switch (selectedElements?.[0]?.type) {
    case ELEMENT_TYPE.IMAGE:
      return foregroundImageActions;
    case ELEMENT_TYPE.SHAPE:
      return shapeActions;
    case ELEMENT_TYPE.TEXT:
      return textActions;
    case ELEMENT_TYPE.VIDEO:
    default:
      return [];
  }
};

export default useQuickActions;
