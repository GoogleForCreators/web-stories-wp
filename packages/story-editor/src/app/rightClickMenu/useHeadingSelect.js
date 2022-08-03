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
import { useEffect, useMemo, useState } from '@googleforcreators/react';
import { __, sprintf } from '@googleforcreators/i18n';
import { Icons } from '@googleforcreators/design-system';
import styled from 'styled-components';
import { getTextElementTagNames } from '@googleforcreators/output';

/**
 * Internal dependencies
 */
import useStory from '../story/useStory';
import { useConfig } from '../config';
import { RIGHT_CLICK_MENU_LABELS } from './constants';

const ReversedIcon = styled(Icons.ChevronRightSmall)`
  transform: rotate(180deg);
`;

function useHeadingSelect({ menuItemProps, isMenuOpen }) {
  const { isRTL } = useConfig();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const { selectedElements, updateSelectedElements } = useStory(
    ({ state: { selectedElements }, actions: { updateSelectedElements } }) => ({
      selectedElements,
      updateSelectedElements,
    })
  );

  useEffect(() => {
    // Close submenu if the menu itself also closes.
    if (!isMenuOpen) {
      setIsSubMenuOpen(false);
    }
  }, [isMenuOpen]);

  const subMenuItems = useMemo(() => {
    if (!isMenuOpen || selectedElements.length === 0) {
      return [];
    }

    const HEADING_LEVELS = {
      h1: __('Heading 1', 'web-stories'),
      h2: __('Heading 2', 'web-stories'),
      h3: __('Heading 3', 'web-stories'),
      p: __('Paragraph', 'web-stories'),
    };

    const selectedElement = selectedElements[0];
    const currentTagName = getTextElementTagNames([selectedElement]).get(
      selectedElement.id
    );
    const options = [
      {
        value: 'auto',
        label:
          'auto' === selectedElement.tagName
            ? sprintf(
                /* translators: %s: heading level. */
                __('Automatic (%s)', 'web-stories'),
                HEADING_LEVELS[currentTagName]
              )
            : __('Automatic', 'web-stories'),
      },
      { value: 'h1', label: HEADING_LEVELS.h1 },
      { value: 'h2', label: HEADING_LEVELS.h2 },
      { value: 'h3', label: HEADING_LEVELS.h3 },
      { value: 'p', label: HEADING_LEVELS.p },
    ];

    return options.map((element) => {
      const { value } = element;
      const tagName = selectedElement.tagName
        ? selectedElement.tagName
        : 'auto';
      return {
        key: value,
        supportsIcon: true,
        icon: tagName === value ? <Icons.CheckmarkSmall /> : null,
        label: <span>{element.label}</span>,
        onClick: () => {
          updateSelectedElements({
            properties: (oldElement) => ({
              ...oldElement,
              tagName: value,
            }),
          });
        },
        ...menuItemProps,
      };
    });
  }, [isMenuOpen, menuItemProps, selectedElements, updateSelectedElements]);

  // Only display if submenu has any items.
  return subMenuItems.length > 0
    ? {
        label: RIGHT_CLICK_MENU_LABELS.HEADING_LEVEL,
        openSubMenu: () => setIsSubMenuOpen(true),
        closeSubMenu: () => setIsSubMenuOpen(false),
        isHeadingSubMenuOpen: isSubMenuOpen,
        headingSubMenuItems: isSubMenuOpen ? subMenuItems : [],
        SuffixIcon: isRTL ? ReversedIcon : Icons.ChevronRightSmall,
        ...menuItemProps,
      }
    : null;
}

export default useHeadingSelect;
