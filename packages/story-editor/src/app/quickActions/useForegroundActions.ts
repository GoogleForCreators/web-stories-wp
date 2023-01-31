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
import { Icons } from '@googleforcreators/design-system';
import { useMemo } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';
import type { Element, ElementId } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { states } from '../highlights';
import type { HighlightType } from '../highlights/states';
import { useStory } from '../story';
import type { QuickAction } from '../../types';
import { ACTIONS } from './constants';
import useElementReset from './useElementReset';

interface ForegroundActionsProps {
  selectedElement: Element;
  actionProps: Partial<QuickAction>;
  handleFocusPanel: (
    highlight: HighlightType
  ) => (elementId?: ElementId) => (evt: MouseEvent) => void;
  resetProperties: string[];
}
function useForegroundActions({
  actionProps,
  selectedElement,
  handleFocusPanel,
  resetProperties,
}: ForegroundActionsProps) {
  const { currentPageNumber } = useStory(
    ({ state: { currentPageNumber } }) => ({
      currentPageNumber: currentPageNumber || 1,
    })
  );
  const handleElementReset = useElementReset();

  const foregroundCommonActions: QuickAction[] = useMemo(() => {
    const handleFocusAnimationPanel = handleFocusPanel(states.Animation);
    const handleFocusLinkPanel = handleFocusPanel(states.Link);
    const commonActions = [];

    // Don't show the 'Add animation' button on the first page
    if (currentPageNumber > 1) {
      // 'Add animation' button
      commonActions.push({
        Icon: Icons.CircleSpeed,
        label: ACTIONS.ADD_ANIMATION.text,
        onClick: (evt: MouseEvent) => {
          handleFocusAnimationPanel()(evt);

          void trackEvent('quick_action', {
            name: ACTIONS.ADD_ANIMATION.trackingEventName,
            element: selectedElement?.type,
          });
        },
        ...actionProps,
      });
    }

    // 'Add link' button is always rendered
    commonActions.push({
      Icon: Icons.Link,
      label: ACTIONS.ADD_LINK.text,
      onClick: (evt: MouseEvent) => {
        handleFocusLinkPanel()(evt);

        void trackEvent('quick_action', {
          name: ACTIONS.ADD_LINK.trackingEventName,
          element: selectedElement?.type,
        });
      },
      ...actionProps,
    });

    // Only show 'Reset element' button for modified elements
    if (resetProperties.length > 0) {
      // 'Reset element' button
      commonActions.push({
        Icon: Icons.Eraser,
        label: ACTIONS.RESET_ELEMENT.text,
        onClick: () => {
          handleElementReset({
            elementId: selectedElement?.id,
            resetProperties,
            elementType: selectedElement?.type,
          });

          void trackEvent('quick_action', {
            name: ACTIONS.RESET_ELEMENT.trackingEventName,
            element: selectedElement?.type,
          });
        },
        separator: 'top',
        ...actionProps,
      });
    }
    return commonActions;
  }, [
    currentPageNumber,
    selectedElement?.id,
    selectedElement?.type,
    actionProps,
    handleFocusPanel,
    handleElementReset,
    resetProperties,
  ]);

  return foregroundCommonActions;
}

export default useForegroundActions;
