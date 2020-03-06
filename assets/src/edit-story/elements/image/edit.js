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
  getMediaProps,
  EditPanMovable,
  ScalePanel,
} from '../shared';
import { useStory } from '../../app';
import StoryPropTypes from '../../types';
import { WithElementMask } from '../../masks';
import getTransformFlip from '../shared/getTransformFlip';
import { imageWithScale } from './util';
import EditCropMovable from './editCropMovable';

const Element = styled.div`
  ${elementFillContent}
`;

const FadedImg = styled.img`
  position: absolute;
  opacity: 0.4;
  pointer-events: none;
  ${imageWithScale}
  ${elementWithFlip}
`;

const CropImg = styled.img`
  position: absolute;
  ${imageWithScale}
  ${elementWithFlip}
`;

function ImageEdit({ element, box }) {
  const {
    id,
    src,
    origRatio,
    scale,
    flip,
    focalX = 50,
    focalY = 50,
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

  const imgProps = getMediaProps(
    width,
    height,
    scale,
    flip && flip.horizontal ? 100 - focalX : focalX,
    flip && flip.vertical ? 100 - focalY : focalY,
    origRatio
  );

  imgProps.transformFlip = getTransformFlip(flip);

  return (
    <Element>
      <FadedImg ref={setFullImage} draggable={false} src={src} {...imgProps} />
      <CropBox ref={setCropBox}>
        <WithElementMask element={element} fill={true} applyFlip={false}>
          <CropImg
            ref={setCroppedImage}
            draggable={false}
            src={src}
            {...imgProps}
          />
        </WithElementMask>
      </CropBox>

      {!isFill && !isBackground && cropBox && croppedImage && (
        <EditCropMovable
          setProperties={setProperties}
          cropBox={cropBox}
          croppedImage={croppedImage}
          flip={flip}
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
          flip={flip}
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
