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
import { memo, useRef, useState } from '@googleforcreators/react';
import styled, { css } from 'styled-components';
import { generatePatternStyles } from '@googleforcreators/patterns';
import { useUnits } from '@googleforcreators/units';
import { StoryAnimation } from '@googleforcreators/animation';
import { useTransformHandler } from '@googleforcreators/transform';
import {
  getDefinitionForType,
  ELEMENT_TYPES,
} from '@googleforcreators/elements';
import {
  elementWithPosition,
  elementWithRotation,
  elementWithSize,
  useColorTransformHandler,
} from '@googleforcreators/element-library';
import {
  DisplayWithMask as WithMask,
  getBorderPositionCSS,
  getResponsiveBorder,
  shouldDisplayBorder,
} from '@googleforcreators/masks';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import useCORSProxy from '../../utils/useCORSProxy';
import { useLocalMedia, useFont } from '../../app';

// Using attributes to avoid creation of hundreds of classes by styled components for previewMode.
const Wrapper = styled.div.attrs(
  ({ previewMode, x, y, width, height, rotationAngle }) => {
    const style = {
      position: 'absolute',
      zIndex: 1,
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}px`,
      height: `${height}px`,
      transform: `rotate(${rotationAngle}deg)`,
    };
    return previewMode ? { style } : {};
  }
)`
  ${({ previewMode }) => !previewMode && elementWithPosition}
  ${({ previewMode }) => !previewMode && elementWithSize}
  ${({ previewMode }) => !previewMode && elementWithRotation}
  contain: layout;
  transition: opacity 0.15s cubic-bezier(0, 0, 0.54, 1);
  ${({ isBackground, theme }) =>
    isBackground &&
    css`
      border-radius: ${theme.borders.radius.small};
      overflow: hidden;
    `}
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

function DisplayElement({ element, previewMode, isAnimatable = false, siblingCount = 0 }) {
  
  const { getBox, dataToEditorX } = useUnits((state) => ({
    getBox: state.actions.getBox,
    dataToEditorX: state.actions.dataToEditorX,
  }));
  const { getProxiedUrl } = useCORSProxy();
  const {
    actions: { maybeEnqueueFontStyle },
  } = useFont();

  const [replacement, setReplacement] = useState(null);

  const hasReplacement = Boolean(replacement);

  const {
    id,
    opacity,
    type,
    isBackground,
    overlay,
    border = {},
    flip,
  } = element;

  const { isCurrentResourceProcessing, isCurrentResourceUploading } =
    useLocalMedia(({ state }) => {
      return ELEMENT_TYPES.IMAGE === type
        ? {
            isCurrentResourceProcessing: state.isCurrentResourceProcessing,
            isCurrentResourceUploading: state.isCurrentResourceUploading,
          }
        : {};
    });

  const replacementElement = hasReplacement
    ? {
        ...element,
        type: replacement.resource.type,
        resource: replacement.resource,
        scale: replacement.scale,
        focalX: replacement.focalX,
        focalY: replacement.focalY,
        // Okay, this is a bit weird, but... the flip and overlay properties are taken from the dragged image
        // if the drop-target is the background element, but from the original drop-target image
        // itself if the drop-target is a regular element.
        //
        // @see compare with similar logic in `combineElements`
        flip: isBackground ? replacement.flip : flip,
        overlay: isBackground ? replacement.overlay : overlay,
      }
    : null;

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

  const responsiveBorder = getResponsiveBorder(
    border,
    previewMode,
    dataToEditorX
  );

  return (
    <Wrapper
      ref={wrapperRef}
      data-element-id={id}
      isBackground={element.isBackground}
      previewMode={previewMode}
      {...box}
    >
      <AnimationWrapper id={id} isAnimatable={isAnimatable}>
        <WithMask
          element={element}
          fill
          style={{
            opacity: typeof opacity !== 'undefined' ? opacity / 100 : null,
            ...(shouldDisplayBorder(element)
              ? getBorderPositionCSS({
                  ...responsiveBorder,
                  width: `${box.width}px`,
                  height: `${box.height}px`,
                })
              : null),
          }}
          previewMode={previewMode}
          responsiveBorder={responsiveBorder}
        >
          <Display
            element={element}
            previewMode={previewMode}
            box={box}
            getProxiedUrl={getProxiedUrl}
            isCurrentResourceProcessing={isCurrentResourceProcessing}
            isCurrentResourceUploading={isCurrentResourceUploading}
            maybeEnqueueFontStyle={maybeEnqueueFontStyle}
            siblingCount={siblingCount}
          />
        </WithMask>
        {!previewMode && (
          <ReplacementContainer hasReplacement={hasReplacement}>
            {replacementElement && (
              <WithMask
                element={replacementElement}
                fill
                style={{
                  opacity: opacity ? opacity / 100 : null,
                }}
                previewMode={previewMode}
              >
                <Replacement
                  element={replacementElement}
                  box={box}
                  getProxiedUrl={getProxiedUrl}
                  isCurrentResourceProcessing={isCurrentResourceProcessing}
                  isCurrentResourceUploading={isCurrentResourceUploading}
                  maybeEnqueueFontStyle={maybeEnqueueFontStyle}
                />
              </WithMask>
            )}
          </ReplacementContainer>
        )}
        {isBackground && overlay && !hasReplacement && (
          <BackgroundOverlay
            ref={bgOverlayRef}
            style={generatePatternStyles(overlay)}
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

// Don't rerender the display element needlessly (e.g. element selection change)
// if the element or other props haven't changed.
export default memo(DisplayElement);
