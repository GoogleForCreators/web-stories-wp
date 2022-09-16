/*
 * Copyright 2020 Google LLC
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
import styled from 'styled-components';
import { rgba } from 'polished';
import { Icons } from '@googleforcreators/design-system';
import { memo, useCallback } from '@googleforcreators/react';
import {
  getDefinitionForType,
  getLayerName,
} from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../../types';
import { useStory } from '../../../app';
import useCORSProxy from '../../../utils/useCORSProxy';
import { TRACKING_EVENTS } from '../../../constants';
import useLayerSelection from './useLayerSelection';
import ShapeMaskWrapper from './shapeMaskWrapper';
import ElementLayerActions from './elementLayerActions';
import Layer from './layer';

const LayerIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: ${({ theme }) => theme.colors.fg.primary};

  :hover {
    background: ${({ theme }) => theme.colors.interactiveBg.tertiaryHover};
  }
  :hover,
  :hover + * {
    --background-color: ${({ theme }) =>
      theme.colors.interactiveBg.tertiaryHover};
    --background-color-opaque: ${({ theme }) =>
      rgba(theme.colors.interactiveBg.tertiaryHover, 0)};
  }
`;

function ElementLayer({ element }) {
  const layerName = getLayerName(element);
  const { LayerIcon } = getDefinitionForType(element.type);
  const { isSelected, handleClick } = useLayerSelection(element);
  const { id, isDefaultBackground, isBackground, type } = element;
  const { updateElementById, currentPageBackgroundColor, groups } = useStory(
    ({ actions, state }) => ({
      updateElementById: actions.updateElementById,
      groups: state.currentPage?.groups || {},
      currentPageBackgroundColor:
        !isDefaultBackground || state.currentPage?.backgroundColor,
    })
  );

  const { getProxiedUrl } = useCORSProxy();

  const isNested = Boolean(element.groupId);

  const group = groups[element.groupId];

  const CompoundLayerIcon = useCallback(
    () => (
      <LayerIconWrapper>
        <ShapeMaskWrapper element={element}>
          <LayerIcon
            element={element}
            getProxiedUrl={getProxiedUrl}
            currentPageBackgroundColor={currentPageBackgroundColor}
          />
        </ShapeMaskWrapper>
      </LayerIconWrapper>
    ),
    [currentPageBackgroundColor, element, getProxiedUrl]
  );

  const hasLayerLockIcon = Boolean(isBackground || element.isLocked);
  const LayerLockIcon = useCallback(
    () =>
      isBackground || isNested ? (
        <Icons.LockFilledClosed />
      ) : (
        <Icons.LockClosed />
      ),
    [isBackground, isNested]
  );

  return (
    <Layer
      id={id}
      handleNewLayerName={(newLayerName) =>
        updateElementById({
          elementId: element.id,
          properties: { layerName: newLayerName },
        })
      }
      layerName={layerName}
      handleClick={handleClick}
      isSelected={isSelected}
      LayerIcon={CompoundLayerIcon}
      hasLayerLockIcon={hasLayerLockIcon}
      LayerLockIcon={LayerLockIcon}
      hasActions={!isBackground}
      actions={<ElementLayerActions element={element} />}
      isNested={isNested}
      skipLayer={group?.isCollapsed}
      trackingData={{ ...TRACKING_EVENTS.SELECT_ELEMENT, label: type }}
    />
  );
}

ElementLayer.propTypes = {
  element: StoryPropTypes.element.isRequired,
};

export default memo(ElementLayer);
