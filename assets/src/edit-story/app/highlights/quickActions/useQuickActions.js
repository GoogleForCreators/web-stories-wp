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
import { useSnackbar } from '../../../../design-system';
import {
  Bucket,
  CircleSpeed,
  Eraser,
  LetterTPlus,
  Link,
  Media,
  PictureSwap,
} from '../../../../design-system/icons';
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
  CLEAR_FILTERS_AND_ANIMATIONS: __(
    'Clear filters and animations',
    'web-stories'
  ),
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
  const { currentPage, selectedElements } = useStory(
    ({ state: { currentPage, selectedElements } }) => ({
      currentPage,
      selectedElements,
    })
  );

  const { showSnackbar } = useSnackbar();

  const { setHighlights } = useHighlights(({ setHighlights }) => ({
    setHighlights,
  }));

  const handleMouseDown = useCallback((ev) => {
    ev.stopPropagation();
  }, []);

  const handleClearFiltersAndAnimations = useCallback(
    (elementId) => {
      setHighlights({ elementId });
      showSnackbar({
        actionLabel: __('Undo', 'web-stories'),
        dismissable: false,
        message: __('All styles were removed from the image', 'web-stories'),
        onAction: () => console.log('UNDID'),
      });
    },
    [setHighlights, showSnackbar]
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
  } = useMemo(
    () => ({
      handleFocusAnimationPanel: handleFocusPanel(states.ANIMATION),
      handleFocusLinkPanel: handleFocusPanel(states.LINK),
      handleFocusMediaPanel: handleFocusPanel(states.MEDIA),
      handleFocusMedia3pPanel: handleFocusPanel(states.MEDIA3P),
      handleFocusPageBackground: handleFocusPanel(states.PAGE_BACKGROUND),
      handleFocusTextSetsPanel: handleFocusPanel(states.TEXT),
    }),
    [handleFocusPanel]
  );

  const backgroundElement =
    currentPage?.elements.find((element) => element.isBackground) ||
    selectedElements?.[0]?.isBackground;
  const selectedElement = selectedElements?.[0];

  const defaultActions = useMemo(
    () => [
      {
        Icon: Bucket,
        label: ACTION_TEXT.CHANGE_BACKGROUND_COLOR,
        onClick: handleFocusPageBackground(backgroundElement?.id),
        onMouseDown: handleMouseDown,
      },
      {
        Icon: Media,
        label: ACTION_TEXT.INSERT_BACKGROUND_MEDIA,
        onClick: handleFocusMediaPanel(),
        onMouseDown: handleMouseDown,
        separator: 'top',
      },
      {
        Icon: LetterTPlus,
        label: ACTION_TEXT.INSERT_TEXT,
        onClick: handleFocusTextSetsPanel(),
        onMouseDown: handleMouseDown,
      },
    ],
    [
      backgroundElement?.id,
      handleFocusMediaPanel,
      handleFocusPageBackground,
      handleFocusTextSetsPanel,
      handleMouseDown,
    ]
  );

  const foregroundImageActions = useMemo(
    () => [
      {
        Icon: PictureSwap,
        label: ACTION_TEXT.REPLACE_MEDIA,
        onClick: handleFocusMedia3pPanel(selectedElement?.id),
        onMouseDown: handleMouseDown,
      },
      {
        Icon: CircleSpeed,
        label: ACTION_TEXT.ADD_ANIMATION,
        onClick: handleFocusAnimationPanel(selectedElement?.id),
        onMouseDown: handleMouseDown,
      },
      {
        Icon: Link,
        label: ACTION_TEXT.ADD_LINK,
        onClick: handleFocusLinkPanel(selectedElement?.id),
        onMouseDown: handleMouseDown,
      },
      {
        Icon: Eraser,
        label: ACTION_TEXT.CLEAR_FILTERS_AND_ANIMATIONS,
        onClick: () => handleClearFiltersAndAnimations(selectedElement?.id),
        onMouseDown: handleMouseDown,
        separator: 'top',
      },
    ],
    [
      handleClearFiltersAndAnimations,
      handleFocusAnimationPanel,
      handleFocusMedia3pPanel,
      handleFocusLinkPanel,
      handleMouseDown,
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
    case ELEMENT_TYPE.TEXT:
    case ELEMENT_TYPE.VIDEO:
    default:
      return [];
  }
};

export default useQuickActions;
