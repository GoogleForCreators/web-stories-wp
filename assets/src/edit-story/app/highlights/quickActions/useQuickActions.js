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
import { __ } from '@web-stories-wp/i18n';
import { useCallback, useMemo } from 'react';
/**
 * Internal dependencies
 */
import { states, useHighlights } from '..';
import { useSnackbar, PLACEMENT } from '../../../../design-system';
import {
  Bucket,
  CircleSpeed,
  Eraser,
  LetterTPlus,
  Link,
  Media,
  PictureSwap,
} from '../../../../design-system/icons';
import updateProperties from '../../../components/inspector/design/updateProperties';
import { useHistory } from '../../history';
import { useConfig } from '../../config';
import { useStory } from '../../story';

/** @typedef {import('../../../../design-system/components').MenuItemProps} MenuItemProps */

export const ELEMENT_TYPE = {
  IMAGE: 'image',
  SHAPE: 'shape',
  TEXT: 'text',
  VIDEO: 'video',
};

export const ACTION_TEXT = {
  ADD_ANIMATION: __('Add animation', 'web-stories'),
  ADD_LINK: __('Add Link', 'web-stories'),
  CHANGE_BACKGROUND_COLOR: __('Change background color', 'web-stories'),
  CHANGE_COLOR: __('Change color', 'web-stories'),
  CLEAR_ANIMATIONS: __('Clear animations', 'web-stories'),
  INSERT_BACKGROUND_MEDIA: __('Insert background media', 'web-stories'),
  INSERT_TEXT: __('Insert text', 'web-stories'),
  REPLACE_MEDIA: __('Replace media', 'web-stories'),
};

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
      if (properties.includes('overlay')) {
        newProperties.overlay = null;
      }

      if (properties.includes('animation')) {
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
   * @return {void}
   */
  const handleClearAnimations = useCallback(
    (elementId) => {
      handleResetProperties(elementId, ['animation']);

      showSnackbar({
        actionLabel: __('Undo', 'web-stories'),
        dismissable: false,
        message: __(
          'All animations were removed from the image',
          'web-stories'
        ),
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

  const {
    handleFocusAnimationPanel,
    handleFocusMediaPanel,
    handleFocusMedia3pPanel,
    handleFocusLinkPanel,
    handleFocusPageBackground,
    handleFocusTextSetsPanel,
    handleFocusStylePanel,
  } = useMemo(
    () => ({
      handleFocusAnimationPanel: handleFocusPanel(states.ANIMATION),
      handleFocusLinkPanel: handleFocusPanel(states.LINK),
      handleFocusMediaPanel: handleFocusPanel(states.MEDIA),
      handleFocusMedia3pPanel: handleFocusPanel(states.MEDIA3P),
      handleFocusPageBackground: handleFocusPanel(states.PAGE_BACKGROUND),
      handleFocusTextSetsPanel: handleFocusPanel(states.TEXT),
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

  const foregroundCommonActions = useMemo(
    () => [
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
      {
        Icon: Eraser,
        label: ACTION_TEXT.CLEAR_ANIMATIONS,
        onClick: () => handleClearAnimations(selectedElement?.id),
        separator: 'top',
        disabled: !selectedElementAnimations?.length,
        ...actionMenuProps,
      },
    ],
    [
      handleClearAnimations,
      handleFocusLinkPanel,
      handleFocusAnimationPanel,
      actionMenuProps,
      selectedElement?.id,
      selectedElementAnimations?.length,
    ]
  );

  const foregroundImageActions = useMemo(
    () => [
      {
        Icon: PictureSwap,
        label: ACTION_TEXT.REPLACE_MEDIA,
        onClick: handleFocusMedia3pPanel(selectedElement?.id),
        ...actionMenuProps,
      },
      ...foregroundCommonActions,
    ],
    [
      actionMenuProps,
      handleFocusMedia3pPanel,
      foregroundCommonActions,
      selectedElement?.id,
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

  // Hide menu if there are multiple elements selected
  if (selectedElements.length > 1) {
    return [];
  }

  // Return the base state if:
  //  1. no element is selected
  //  2. the selected element is the background element
  if (
    (selectedElements.length === 0 && backgroundElement) ||
    selectedElements[0]?.isBackground
  ) {
    return defaultActions;
  }

  switch (selectedElements?.[0]?.type) {
    case ELEMENT_TYPE.IMAGE:
      return foregroundImageActions;
    case ELEMENT_TYPE.SHAPE:
      return shapeActions;
    case ELEMENT_TYPE.TEXT:
    case ELEMENT_TYPE.VIDEO:
    default:
      return [];
  }
};

export default useQuickActions;
