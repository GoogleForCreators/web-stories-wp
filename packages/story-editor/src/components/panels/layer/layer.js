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
import PropTypes from 'prop-types';
import { useRef, memo } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useCanvas } from '../../../app';
import usePerformanceTracking from '../../../utils/usePerformanceTracking';
import LayerIdContext from './layerIdContext';
import LayerForm from './layerForm';
import {
  ActionsContainer,
  LayerContainer,
  LayerButton,
  LayerInputWrapper,
  LayerDescription,
  LayerText,
  IconWrapper,
  LayerContentContainer,
  HiddenIconWrapper,
  LayerIconWrapper,
  FadeOutWrapper,
} from './layerComponents.js';

function Layer({
  id,
  handleNewLayerName,
  layerName,
  handleClick,
  isSelected,
  LayerIcon,
  hasLayerLockIcon,
  hasLayerHiddenIcon,
  LayerLockIcon,
  LayerVisibilityIcon,
  actions,
  hasActions = true,
  isNested = false,
  skipLayer = false,
  trackingData = null,
}) {
  const renamableLayer = useCanvas(({ state }) => state.renamableLayer);

  const layerRef = useRef(null);
  usePerformanceTracking({
    node: trackingData ? layerRef.current : null,
    eventData: trackingData,
  });

  if (skipLayer) {
    return null;
  }

  const layerId = `layer-${id}`;
  const isRenameable = renamableLayer?.elementId === id;

  return (
    <LayerContainer>
      {isRenameable ? (
        <LayerInputWrapper isNested={isNested}>
          <LayerIcon />
          <LayerForm
            handleNewLayerName={handleNewLayerName}
            layerName={layerName}
          />
        </LayerInputWrapper>
      ) : (
        <LayerIdContext.Provider value={layerId}>
          <LayerButton
            ref={layerRef}
            id={layerId}
            onClick={handleClick}
            isSelected={isSelected}
            isNested={isNested}
          >
            <LayerIconWrapper isHidden={hasLayerHiddenIcon}>
              <LayerIcon />
            </LayerIconWrapper>
            <LayerDescription>
              <LayerContentContainer>
                <LayerText isHidden={hasLayerHiddenIcon}>{layerName}</LayerText>
              </LayerContentContainer>
              {(hasLayerHiddenIcon || hasLayerLockIcon) && (
                <FadeOutWrapper>
                  {hasLayerHiddenIcon && (
                    <HiddenIconWrapper>
                      {hasLayerHiddenIcon && <LayerVisibilityIcon />}
                    </HiddenIconWrapper>
                  )}
                  {(hasLayerHiddenIcon || hasLayerLockIcon) && (
                    <IconWrapper>
                      {hasLayerLockIcon && <LayerLockIcon />}
                    </IconWrapper>
                  )}
                </FadeOutWrapper>
              )}
            </LayerDescription>
          </LayerButton>
          {hasActions && <ActionsContainer>{actions}</ActionsContainer>}
        </LayerIdContext.Provider>
      )}
    </LayerContainer>
  );
}

Layer.propTypes = {
  id: PropTypes.string.isRequired,
  handleNewLayerName: PropTypes.func.isRequired,
  layerName: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  LayerIcon: PropTypes.elementType.isRequired,
  LayerVisibilityIcon: PropTypes.elementType.isRequired,
  hasLayerLockIcon: PropTypes.bool,
  hasLayerHiddenIcon: PropTypes.bool,
  LayerLockIcon: PropTypes.elementType.isRequired,
  actions: PropTypes.object.isRequired,
  hasActions: PropTypes.bool,
  isNested: PropTypes.bool,
  skipLayer: PropTypes.bool,
  trackingData: PropTypes.object,
};

export default memo(Layer);
