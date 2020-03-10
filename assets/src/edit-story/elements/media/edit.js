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
import { useCallback, useState } from 'react';

/**
 * Internal dependencies
 */
import {
  elementFillContent,
  elementWithFlip,
  CropBox,
  getMediaSizePositionProps,
  EditPanMovable,
  ScalePanel,
  MEDIA_MASK_OPACITY,
} from '../shared';
import { useStory } from '../../app';
import StoryPropTypes from '../../types';
import WithMask from '../../masks/display';
import getTransformFlip from '../shared/getTransformFlip';
import EditCropMovable from '../shared/editCropMovable';
import { mediaWithScale } from './util';

const Element = styled.div`
  ${elementFillContent}
`;

// Opacity of the mask is reduced depending on the opacity assigned to the image.
const FadedImage = styled.img`
  position: absolute;
  opacity: ${({ opacity }) =>
    opacity ? opacity * MEDIA_MASK_OPACITY : MEDIA_MASK_OPACITY};
  pointer-events: none;
  ${mediaWithScale}
  ${elementWithFlip}
`;

const FadedVideo = styled.video`
  position: absolute;
  opacity: ${({ opacity }) =>
    opacity ? opacity * MEDIA_MASK_OPACITY : MEDIA_MASK_OPACITY};
  pointer-events: none;
  ${mediaWithScale}
  ${elementWithFlip}
  max-width: initial;
  max-height: initial;
`;

// Opacity is adjusted so that the double image opacity would equal
// the opacity assigned to the image.
const CropImage = styled.img`
  position: absolute;
  opacity: ${({ opacity }) =>
    opacity ? 1 - (1 - opacity) / (1 - opacity * MEDIA_MASK_OPACITY) : null};
  ${mediaWithScale}
  ${elementWithFlip}
`;

// Opacity of the mask is reduced depending on the opacity assigned to the video.
const CropVideo = styled.video`
  position: absolute;
  ${mediaWithScale}
  ${elementWithFlip}
  max-width: initial;
  max-height: initial;
  opacity: ${({ opacity }) =>
    opacity ? 1 - (1 - opacity) / (1 - opacity * MEDIA_MASK_OPACITY) : null};
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
    isFill,
    isBackground,
    type,
  } = element;
  const { x, y, width, height, rotationAngle } = box;

  const [fullMedia, setFullMedia] = useState(null);
  const [croppedMedia, setCroppedMedia] = useState(null);
  const [cropBox, setCropBox] = useState(null);

  const {
    actions: { updateElementById },
  } = useStory();
  const setProperties = useCallback(
    (properties) => updateElementById({ elementId: id, properties }),
    [id, updateElementById]
  );

  const mediaProps = getMediaSizePositionProps(
    resource,
    width,
    height,
    scale,
    flip?.horizontal ? 100 - focalX : focalX,
    flip?.vertical ? 100 - focalY : focalY
  );

  mediaProps.transformFlip = getTransformFlip(flip);

  const fadedMedia =
    'image' === type ? (
      <FadedImage
        ref={setFullMedia}
        draggable={false}
        src={resource.src}
        {...mediaProps}
        opacity={opacity / 100}
      />
    ) : (
      <FadedVideo
        ref={setFullMedia}
        draggable={false}
        {...mediaProps}
        opacity={opacity / 100}
      >
        <source src={resource.src} type={resource.mimeType} />
      </FadedVideo>
    );

  const cropMedia =
    'image' === type ? (
      <CropImage
        ref={setCroppedMedia}
        draggable={false}
        src={resource.src}
        {...mediaProps}
        opacity={opacity / 100}
      />
    ) : (
      <CropVideo
        ref={setCroppedMedia}
        draggable={false}
        src={resource.src}
        {...mediaProps}
        opacity={opacity / 100}
      >
        <source src={resource.src} type={resource.mimeType} />
      </CropVideo>
    );

  return (
    <Element>
      {fadedMedia}
      <CropBox ref={setCropBox}>
        <WithMask element={element} fill={true} applyFlip={false}>
          {cropMedia}
        </WithMask>
      </CropBox>

      {fullMedia && croppedMedia && (
        <EditPanMovable
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

      {!isFill && !isBackground && cropBox && croppedMedia && (
        <EditCropMovable
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
  element: StoryPropTypes.elements.image.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default MediaEdit;
