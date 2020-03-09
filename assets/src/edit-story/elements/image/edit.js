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
  CropBox,
  getMediaSizePositionProps,
  EditPanMovable,
  ScalePanel,
  MEDIA_MASK_OPACITY,
} from '../shared';
import { useStory } from '../../app';
import StoryPropTypes from '../../types';
import { WithElementMask } from '../../masks';
import { imageWithScale } from './util';
import EditCropMovable from './editCropMovable';

const Element = styled.div`
  ${elementFillContent}
`;

// Opacity of the mask is reduced depending on the opacity assigned to the image.
const FadedImg = styled.img`
  position: absolute;
  opacity: ${({ opacity }) =>
    opacity ? opacity * MEDIA_MASK_OPACITY : MEDIA_MASK_OPACITY};
  pointer-events: none;
  ${imageWithScale}
`;

// Opacity is adjusted so that the double image opacity would equal
// the opacity assigned to the image.
const CropImg = styled.img`
  position: absolute;
  opacity: ${({ opacity }) =>
    opacity ? 1 - (1 - opacity) / (1 - opacity * MEDIA_MASK_OPACITY) : null};
  ${imageWithScale}
`;

function ImageEdit({ element, box }) {
  const {
    id,
    resource,
    opacity,
    scale,
    focalX,
    focalY,
    isFill,
    isBackground,
  } = element;
  const { x, y, width, height, rotationAngle } = box;

  const [fullImage, setFullImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropBox, setCropBox] = useState(null);

  const {
    actions: { updateElementById },
  } = useStory();
  const setProperties = useCallback(
    (properties) => updateElementById({ elementId: id, properties }),
    [id, updateElementById]
  );

  const imgProps = getMediaSizePositionProps(
    resource,
    width,
    height,
    scale,
    focalX,
    focalY
  );

  return (
    <Element>
      <FadedImg
        ref={setFullImage}
        draggable={false}
        src={resource.src}
        {...imgProps}
        opacity={opacity / 100}
      />
      <CropBox ref={setCropBox}>
        <WithElementMask element={element} fill={true}>
          <CropImg
            ref={setCroppedImage}
            draggable={false}
            src={resource.src}
            {...imgProps}
            opacity={opacity / 100}
          />
        </WithElementMask>
      </CropBox>

      {!isFill && !isBackground && cropBox && croppedImage && (
        <EditCropMovable
          setProperties={setProperties}
          cropBox={cropBox}
          croppedImage={croppedImage}
          x={x}
          y={y}
          width={width}
          height={height}
          rotationAngle={rotationAngle}
          offsetX={imgProps.offsetX}
          offsetY={imgProps.offsetY}
          imgWidth={imgProps.width}
          imgHeight={imgProps.height}
        />
      )}

      {fullImage && croppedImage && (
        <EditPanMovable
          setProperties={setProperties}
          fullMedia={fullImage}
          croppedMedia={croppedImage}
          x={x}
          y={y}
          width={width}
          height={height}
          rotationAngle={rotationAngle}
          offsetX={imgProps.offsetX}
          offsetY={imgProps.offsetY}
          mediaWidth={imgProps.width}
          mediaHeight={imgProps.height}
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

ImageEdit.propTypes = {
  element: StoryPropTypes.elements.image.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default ImageEdit;
