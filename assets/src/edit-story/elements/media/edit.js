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
import styled, { css } from 'styled-components';
import { useCallback, useState, useRef, useEffect } from 'react';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { elementFillContent, elementWithFlip } from '../shared';
import { useStory } from '../../app';
import StoryPropTypes from '../../types';
import WithMask from '../../masks/display';
import getTransformFlip from '../shared/getTransformFlip';
import { BG_MIN_SCALE, BG_MAX_SCALE } from '../../../animation';
import useUnmount from '../../utils/useUnmount';
import { shouldDisplayBorder } from '../../utils/elementBorder';
import EditCropMoveable from './editCropMoveable';
import { calculateSrcSet, mediaWithScale } from './util';
import getMediaSizePositionProps from './getMediaSizePositionProps';
import EditPanMoveable from './editPanMoveable';
import ScalePanel from './scalePanel';
import { MEDIA_MASK_OPACITY } from './constants';
import { CropBox } from './';

const Element = styled.div`
  ${elementFillContent}
`;

// Opacity of the mask is reduced depending on the opacity assigned to the media.
const fadedMediaCSS = css`
  position: absolute;
  opacity: ${({ opacity }) =>
    typeof opacity !== 'undefined'
      ? opacity * MEDIA_MASK_OPACITY
      : MEDIA_MASK_OPACITY};
  pointer-events: none;
  ${mediaWithScale}
  ${elementWithFlip}
`;

const FadedImage = styled.img`
  ${fadedMediaCSS}
`;

const FadedVideo = styled.video`
  ${fadedMediaCSS}
  max-width: initial;
  max-height: initial;
`;

// Opacity is adjusted so that the double image opacity would equal
// the opacity assigned to the image.
const cropMediaCSS = css`
  ${mediaWithScale}
  ${elementWithFlip}
  position: absolute;
  cursor: grab;
  opacity: ${({ opacity }) =>
    typeof opacity !== 'undefined'
      ? 1 - (1 - opacity) / (1 - opacity * MEDIA_MASK_OPACITY)
      : null};
`;

const CropImage = styled.img`
  ${cropMediaCSS}
`;

// Opacity of the mask is reduced depending on the opacity assigned to the video.
const CropVideo = styled.video`
  ${cropMediaCSS}
  max-width: initial;
  max-height: initial;
`;

//eslint-disable-next-line complexity
function MediaEdit({ element, box }) {
  const {
    id,
    resource,
    opacity,
    scale,
    flip,
    focalX,
    focalY,
    isBackground,
    type,
    borderRadius,
  } = element;
  const { x, y, width, height, rotationAngle } = box;
  const [fullMedia, setFullMedia] = useState(null);
  const [croppedMedia, setCroppedMedia] = useState(null);
  const [cropBox, setCropBox] = useState(null);
  const elementRef = useRef();
  const [localProperties, setLocalProperties] = useState({});
  const isUpdatedLocally = useRef(false);
  const lastLocalProperties = useRef({ scale });

  const updateLocalProperties = useCallback((properties) => {
    const newProps = {
      ...lastLocalProperties.current,
      ...(typeof properties === 'function'
        ? properties(lastLocalProperties.current)
        : properties),
    };
    lastLocalProperties.current = newProps;
    isUpdatedLocally.current = true;
    setLocalProperties(lastLocalProperties.current);
  }, []);

  // Update the true global properties of the current element
  // This now only happens on unmount
  const { updateElementById } = useStory((state) => ({
    updateElementById: state.actions.updateElementById,
  }));
  const updateProperties = useCallback(() => {
    if (!isUpdatedLocally.current) {
      return;
    }
    isUpdatedLocally.current = false;
    const properties = lastLocalProperties.current;
    updateElementById({ elementId: id, properties });
  }, [id, updateElementById]);

  useUnmount(updateProperties);

  const isImage = ['image', 'gif'].includes(type);
  const isVideo = 'video' === type;

  const localScale = localProperties.scale ?? scale;
  const localFocalX = localProperties.focalX ?? focalX;
  const localFocalY = localProperties.focalY ?? focalY;

  const mediaProps = getMediaSizePositionProps(
    resource,
    width,
    height,
    localScale,
    flip?.horizontal ? 100 - localFocalX : localFocalX,
    flip?.vertical ? 100 - localFocalY : localFocalY
  );

  mediaProps.transformFlip = getTransformFlip(flip);
  mediaProps.crossOrigin = 'anonymous';

  const fadedMediaProps = {
    ref: setFullMedia,
    draggable: false,
    opacity: opacity / 100,
    ...mediaProps,
  };

  const cropMediaProps = {
    ref: setCroppedMedia,
    draggable: false,
    src: resource.src,
    alt: __('Drag to move media element', 'web-stories'),
    opacity: opacity / 100,
    tabIndex: 0,
    ...mediaProps,
  };

  useEffect(() => {
    if (
      croppedMedia &&
      elementRef.current &&
      !elementRef.current.contains(document.activeElement)
    ) {
      croppedMedia.focus();
    }
  }, [croppedMedia]);

  const srcSet = calculateSrcSet(element.resource);
  if (isImage && srcSet) {
    cropMediaProps.srcSet = srcSet;
  }

  const handleWheel = useCallback(
    (evt) => {
      updateLocalProperties(({ scale: oldScale }) => ({
        scale: Math.min(
          BG_MAX_SCALE,
          Math.max(BG_MIN_SCALE, oldScale + evt.deltaY)
        ),
      }));
      evt.preventDefault();
      evt.stopPropagation();
    },
    [updateLocalProperties]
  );

  // Cancelable wheel events require a non-passive listener, which React
  // can't do on its own, so we need to attach manually.
  useEffect(() => {
    const node = elementRef.current;
    const opts = { passive: false };
    node.addEventListener('wheel', handleWheel, opts);
    return () => node.removeEventListener('wheel', handleWheel, opts);
  }, [handleWheel]);

  const borderProps =
    shouldDisplayBorder(element) && borderRadius ? element : null;

  return (
    <Element ref={elementRef}>
      {isImage && (
        <FadedImage
          {...fadedMediaProps}
          src={resource.src}
          srcSet={calculateSrcSet(resource)}
        />
      )}
      {isVideo && (
        <FadedVideo {...fadedMediaProps}>
          {resource.src && (
            <source src={resource.src} type={resource.mimeType} />
          )}
        </FadedVideo>
      )}
      <CropBox ref={setCropBox} {...borderProps}>
        <WithMask element={element} fill applyFlip={false} box={box}>
          {isImage && <CropImage {...cropMediaProps} />}
          {isVideo && (
            <CropVideo {...cropMediaProps}>
              <source src={resource.src} type={resource.mimeType} />
            </CropVideo>
          )}
        </WithMask>
      </CropBox>

      {fullMedia && croppedMedia && (
        <EditPanMoveable
          setProperties={updateLocalProperties}
          fullMedia={fullMedia}
          croppedMedia={croppedMedia}
          flip={flip}
          x={x}
          y={y}
          width={width}
          height={height}
          rotationAngle={rotationAngle}
          offsetX={mediaProps.offsetX}
          offsetY={mediaProps.offsetY}
          mediaWidth={mediaProps.width}
          mediaHeight={mediaProps.height}
        />
      )}

      {!isBackground && cropBox && croppedMedia && (
        <EditCropMoveable
          setProperties={updateLocalProperties}
          cropBox={cropBox}
          croppedMedia={croppedMedia}
          flip={flip}
          x={x}
          y={y}
          width={width}
          height={height}
          rotationAngle={rotationAngle}
          offsetX={mediaProps.offsetX}
          offsetY={mediaProps.offsetY}
          mediaWidth={mediaProps.width}
          mediaHeight={mediaProps.height}
        />
      )}

      <ScalePanel
        setProperties={updateLocalProperties}
        x={x}
        y={y}
        width={width}
        height={height}
        scale={localScale || 100}
      />
    </Element>
  );
}

MediaEdit.propTypes = {
  element: StoryPropTypes.elements.media.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default MediaEdit;
