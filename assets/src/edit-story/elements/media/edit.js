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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { elementFillContent, elementWithFlip } from '../shared';
import { useStory } from '../../app';
import StoryPropTypes from '../../types';
import WithMask from '../../masks/display';
import getTransformFlip from '../shared/getTransformFlip';
import EditCropMoveable from './editCropMoveable';
import { calculateSrcSet, mediaWithScale } from './util';
import getMediaSizePositionProps from './getMediaSizePositionProps';
import EditPanMoveable from './editPanMoveable';
import ScalePanel from './scalePanel';
import { CropBox, MEDIA_MASK_OPACITY } from './';

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
  } = element;
  const { x, y, width, height, rotationAngle } = box;
  const [fullMedia, setFullMedia] = useState(null);
  const [croppedMedia, setCroppedMedia] = useState(null);
  const [cropBox, setCropBox] = useState(null);
  const elementRef = useRef();

  const { updateElementById } = useStory((state) => ({
    updateElementById: state.actions.updateElementById,
  }));
  const setProperties = useCallback(
    (properties) => updateElementById({ elementId: id, properties }),
    [id, updateElementById]
  );

  const isImage = ['image', 'gif'].includes(type);
  const isVideo = 'video' === type;

  const mediaProps = getMediaSizePositionProps(
    resource,
    width,
    height,
    scale,
    flip?.horizontal ? 100 - focalX : focalX,
    flip?.vertical ? 100 - focalY : focalY
  );

  mediaProps.transformFlip = getTransformFlip(flip);

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
          <source src={resource.src} type={resource.mimeType} />
        </FadedVideo>
      )}
      <CropBox ref={setCropBox}>
        <WithMask element={element} fill={true} applyFlip={false} box={box}>
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
          setProperties={setProperties}
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
          setProperties={setProperties}
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
        setProperties={setProperties}
        x={x}
        y={y}
        width={width}
        height={height}
        scale={scale || 100}
      />
    </Element>
  );
}

MediaEdit.propTypes = {
  element: StoryPropTypes.elements.media.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default MediaEdit;
