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
import { useEffect, useRef } from 'react';

/**
 * Internal dependencies
 */
import Movable from '../../components/movable';
import StoryPropTypes from '../../types';
import getTransformFlip from '../shared/getTransformFlip';
import getFocalFromOffset from './getFocalFromOffset';

function EditPanMovable({
  setProperties,
  fullMedia,
  croppedMedia,
  flip,
  x,
  y,
  width,
  height,
  rotationAngle,
  offsetX,
  offsetY,
  mediaWidth,
  mediaHeight,
}) {
  const moveableRef = useRef();
  const translateRef = useRef([0, 0]);
  const transformFlip = getTransformFlip(flip);

  const update = () => {
    const [tx, ty] = translateRef.current;
    fullMedia.style.transform = `translate(${tx}px, ${ty}px) ${
      transformFlip ?? ''
    }`;
    croppedMedia.style.transform = `translate(${tx}px, ${ty}px) ${
      transformFlip ?? ''
    }`;
  };

  // Refresh moveables to ensure that the selection rect is always correct.
  useEffect(() => {
    moveableRef.current.updateRect();
  });

  return (
    <Movable
      ref={moveableRef}
      targets={croppedMedia}
      origin={true}
      draggable={true}
      throttleDrag={0}
      onDrag={({ dist }) => {
        let [tx, ty] = dist;
        if (flip.vertical) {
          ty = -ty;
        }
        if (flip.horizontal) {
          tx = -tx;
        }
        translateRef.current = [tx, ty];
        update();
      }}
      onDragEnd={() => {
        const [tx, ty] = translateRef.current;
        translateRef.current = [0, 0];
        const panFocalX = getFocalFromOffset(width, mediaWidth, offsetX - tx);
        const panFocalY = getFocalFromOffset(height, mediaHeight, offsetY - ty);
        setProperties({
          focalX: flip?.horizontal ? 100 - panFocalX : panFocalX,
          focalY: flip?.vertical ? 100 - panFocalY : panFocalY,
        });
        update();
      }}
      // Snappable
      snappable={true}
      snapCenter={true}
      // todo@: Moveable defines bounds and guidelines as the vertical and
      // horizontal lines and doesn't work well with `rotationAngle > 0` for
      // cropping/panning. It's possible to define a larger bounds using
      // the expansion radius, but the UX is very poor for a rotated shape.
      bounds={
        rotationAngle === 0
          ? {
              left: x + width - mediaWidth,
              top: y + height - mediaHeight,
              right: x + mediaWidth,
              bottom: y + mediaHeight,
            }
          : {}
      }
      verticalGuidelines={
        rotationAngle === 0 ? [x, x + width / 2, x + width] : [x + width / 2]
      }
      horizontalGuidelines={
        rotationAngle === 0 ? [y, y + height / 2, y + height] : [y + height / 2]
      }
    />
  );
}

EditPanMovable.propTypes = {
  setProperties: PropTypes.func.isRequired,
  fullMedia: PropTypes.object.isRequired,
  croppedMedia: PropTypes.object.isRequired,
  flip: StoryPropTypes.flip,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rotationAngle: PropTypes.number.isRequired,
  offsetX: PropTypes.number.isRequired,
  offsetY: PropTypes.number.isRequired,
  mediaWidth: PropTypes.number.isRequired,
  mediaHeight: PropTypes.number.isRequired,
};

export default EditPanMovable;
