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
import { PLACEMENT } from '../../../../design-system';
import { Bucket, LetterTPlus, Media } from '../../../../design-system/icons';
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
  CHANGE_BACKGROUND_COLOR: __('Change background color', 'web-stories'),
  INSERT_BACKGROUND_MEDIA: __('Insert background media', 'web-stories'),
  INSERT_TEXT: __('Insert text', 'web-stories'),
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
  const { currentPage, selectedElements } = useStory(
    ({ state: { currentPage, selectedElements } }) => ({
      currentPage,
      selectedElements,
    })
  );

  const { setHighlights } = useHighlights(({ setHighlights }) => ({
    setHighlights,
  }));

  const handleFocusPanel = useCallback(
    (highlight) => (elementId) => () => {
      setHighlights({ elementId, highlight });
    },
    [setHighlights]
  );

  const {
    handleFocusPageBackground,
    handleFocusMediaPanel,
    handleFocusTextSetsPanel,
  } = useMemo(
    () => ({
      handleFocusPageBackground: handleFocusPanel(states.PAGE_BACKGROUND),
      handleFocusMediaPanel: handleFocusPanel(states.MEDIA),
      handleFocusTextSetsPanel: handleFocusPanel(states.TEXT),
    }),
    [handleFocusPanel]
  );

  const backgroundElement =
    currentPage?.elements.find((element) => element.isBackground) ||
    selectedElements?.[0]?.isBackground;

  const defaultActions = useMemo(() => {
    const actionMenuProps = {
      tooltipPlacement: isRTL ? PLACEMENT.LEFT : PLACEMENT.RIGHT,
    };
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
        ...actionMenuProps,
      },
    ];
  }, [
    backgroundElement?.id,
    handleFocusMediaPanel,
    handleFocusPageBackground,
    handleFocusTextSetsPanel,
    isRTL,
  ]);

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
    case ELEMENT_TYPE.SHAPE:
    case ELEMENT_TYPE.TEXT:
    case ELEMENT_TYPE.VIDEO:
    default:
      return [];
  }
};

export default useQuickActions;
