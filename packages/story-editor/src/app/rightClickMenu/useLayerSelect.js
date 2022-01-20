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
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from '@googleforcreators/react';
import SAT from 'sat';
import { __ } from '@googleforcreators/i18n';
import { Icons } from '@googleforcreators/design-system';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import useStory from '../story/useStory';
import createPolygon from '../canvas/utils/createPolygon';
import { useCanvas } from '../canvas';
import { getDefinitionForType } from '../../elements';

function useLayerSelect({ menuItemProps, menuPosition, isMenuOpen }) {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const { nodesById } = useCanvas(({ state: { nodesById } }) => ({
    nodesById,
  }));
  const { currentPage, selectedElements, setSelectedElementsById } = useStory(
    ({
      state: { currentPage, selectedElements },
      actions: { setSelectedElementsById },
    }) => ({
      currentPage,
      selectedElements,
      setSelectedElementsById,
    })
  );

  useEffect(() => {
    // Close submenu if the menu itself also closes.
    if (!isMenuOpen) {
      setIsSubMenuOpen(false);
    }
  }, [isMenuOpen]);

  const { x, y } = menuPosition;
  const getIntersectingElements = useCallback(() => {
    if (!currentPage?.elements?.length || !Object.keys(nodesById)?.length) {
      return [];
    }
    const clickedPoint = new SAT.Vector(x, y);
    return currentPage.elements
      .map((element) => {
        const { id, rotationAngle } = element;
        const node = nodesById[id];
        if (!node) {
          return null;
        }
        const { x: elX, y: elY, width, height } = node.getBoundingClientRect();
        const elementP = createPolygon(rotationAngle, elX, elY, width, height);
        return SAT.pointInPolygon(clickedPoint, elementP) ? element : null;
      })
      .filter((el) => el);
  }, [currentPage, x, y, nodesById]);

  const subMenuItems = useMemo(() => {
    const intersectingElements = getIntersectingElements();
    intersectingElements.reverse();
    return intersectingElements.map((element) => {
      const { id, isBackground, type } = element;
      const { LayerContent } = getDefinitionForType(type);
      return {
        key: id,
        supportsIcon: true,
        icon: selectedElements[0].id === id ? <Icons.CheckmarkSmall /> : null,
        label: isBackground ? (
          <span>{__('Background', 'web-stories')}</span>
        ) : (
          <LayerContent element={element} />
        ),
        onClick: () => {
          setSelectedElementsById({ elementIds: [id] });
          trackEvent('context_menu_action', {
            name: 'layer_selected',
            element: type,
            isBackground: isBackground,
          });
        },
        ...menuItemProps,
      };
    });
  }, [
    getIntersectingElements,
    menuItemProps,
    setSelectedElementsById,
    selectedElements,
  ]);

  // Only display if submenu has any items.
  return subMenuItems.length > 0
    ? {
        label: __('Select Layer', 'web-stories'),
        separator: 'bottom',
        openSubMenu: () => setIsSubMenuOpen(true),
        closeSubMenu: () => setIsSubMenuOpen(false),
        isSubMenuOpen,
        subMenuItems: isSubMenuOpen ? subMenuItems : [],
        dismissOnClick: false,
        SuffixIcon: Icons.ChevronRightSmall,
        'aria-haspopup': 'menu',
        'aria-expanded': isSubMenuOpen,
        ...menuItemProps,
      }
    : null;
}

export default useLayerSelect;
