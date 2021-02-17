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
import { useRef, useState } from 'react';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { StoryAnimation } from '../../../animation';
import { getDefinitionForType } from '../../elements';
import {
  elementWithPosition,
  elementWithRotation,
  elementWithSize,
} from '../../elements/shared';
import WithMask from '../../masks/display';
import StoryPropTypes from '../../types';
import { useUnits } from '../../units';
import generatePatternStyles from '../../utils/generatePatternStyles';
import { useTransformHandler } from '../transform';
import useColorTransformHandler from '../../elements/shared/useColorTransformHandler';
import {
  getBorderPositionCSS,
  getResponsiveBorder,
  shouldDisplayBorder,
} from '../../utils/elementBorder';
import getTransformFlip from '../../elements/shared/getTransformFlip';

const Wrapper = styled.div`
  ${elementWithPosition}
  ${elementWithSize}
  ${elementWithRotation}
  contain: layout;
  transition: opacity 0.15s cubic-bezier(0, 0, 0.54, 1);
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

const ReplacementContainer = styled.div`
  transition: opacity 0.25s cubic-bezier(0, 0, 0.54, 1);
  pointer-events: none;
  opacity: ${({ hasReplacement }) => (hasReplacement ? 1 : 0)};
  transform: ${({ flip }) => (flip ? getTransformFlip(flip) : null)};
  height: 100%;
`;

function AnimationWrapper({ children, id, isAnimatable }) {
  return isAnimatable ? (
    <StoryAnimation.WAAPIWrapper target={id}>
      {children}
    </StoryAnimation.WAAPIWrapper>
  ) : (
    children
  );
}
AnimationWrapper.propTypes = {
  isAnimatable: PropTypes.bool.isRequired,
  children: PropTypes.arrayOf(PropTypes.node),
  id: PropTypes.string,
};

function DisplayElement({ element, previewMode, isAnimatable = false }) {
  const { getBox, dataToEditorX } = useUnits((state) => ({
    getBox: state.actions.getBox,
    dataToEditorX: state.actions.dataToEditorX,
  }));

  const [replacement, setReplacement] = useState(null);

  const hasReplacement = Boolean(replacement);

  const replacementElement = hasReplacement
    ? {
        ...element,
        type: replacement.resource.type,
        resource: replacement.resource,
        scale: replacement.scale,
        focalX: replacement.focalX,
        focalY: replacement.focalY,
        flip: replacement.flip,
      }
    : null;

  const {
    id,
    opacity,
    type,
    isBackground,
    backgroundOverlay,
    border = {},
    flip,
  } = element;
  const { Display } = getDefinitionForType(type);
  const { Display: Replacement } =
    getDefinitionForType(replacement?.resource.type) || {};

  const wrapperRef = useRef(null);

  const box = getBox(element);

  useTransformHandler(id, (transform) => {
    const target = wrapperRef.current;
    if (transform === null) {
      target.style.transform = '';
      target.style.width = '';
      target.style.height = '';
    } else {
      const { translate, rotate, resize, dropTargets } = transform;
      target.style.transform = `translate(${translate?.[0]}px, ${translate?.[1]}px) rotate(${rotate}deg)`;
      if (resize && resize[0] !== 0 && resize[1] !== 0) {
        target.style.width = `${resize[0]}px`;
        target.style.height = `${resize[1]}px`;
      }
      if (dropTargets?.hover !== undefined) {
        target.style.opacity = dropTargets.hover ? 0 : 1;
      }
      if (dropTargets?.replacement !== undefined) {
        setReplacement(dropTargets.replacement || null);
      }
    }
  });

  const bgOverlayRef = useRef(null);
  useColorTransformHandler({
    id,
    targetRef: bgOverlayRef,
    resetOnNullTransform: false,
  });

  return (
    <Wrapper ref={wrapperRef} data-element-id={id} {...box}>
      <AnimationWrapper id={id} isAnimatable={isAnimatable}>
        <WithMask
          element={element}
          fill={true}
          box={box}
          style={{
            opacity: typeof opacity !== 'undefined' ? opacity / 100 : null,
            ...(shouldDisplayBorder(element)
              ? getBorderPositionCSS({
                  ...getResponsiveBorder(border, previewMode, dataToEditorX),
                  width: `${box.width}px`,
                  height: `${box.height}px`,
                })
              : null),
          }}
          previewMode={previewMode}
        >
          <Display element={element} previewMode={previewMode} box={box} />
        </WithMask>
        {!previewMode && (
          <ReplacementContainer
            flip={flip}
            hasReplacement={Boolean(replacementElement)}
          >
            {replacementElement && (
              <WithMask
                element={replacementElement}
                fill={true}
                box={box}
                style={{
                  opacity: opacity ? opacity / 100 : null,
                }}
                previewMode={previewMode}
              >
                <Replacement element={replacementElement} box={box} />
              </WithMask>
            )}
          </ReplacementContainer>
        )}
        {isBackground && backgroundOverlay && !hasReplacement && (
          <BackgroundOverlay
            ref={bgOverlayRef}
            style={generatePatternStyles(backgroundOverlay)}
          />
        )}
      </AnimationWrapper>
    </Wrapper>
  );
}

DisplayElement.propTypes = {
  previewMode: PropTypes.bool,
  element: StoryPropTypes.element.isRequired,
  isAnimatable: PropTypes.bool,
};

export default DisplayElement;
