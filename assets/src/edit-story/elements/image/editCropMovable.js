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

/**
 * WordPress dependencies
 */
import { useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Movable from '../../components/movable';
import { useUnits } from '../../units';
import calcRotatedResizeOffset from '../../utils/calcRotatedResizeOffset';
import { getFocalFromOffset } from './../shared';

function EditCropMovable({
  setProperties,
  cropBox,
  croppedImage,
  x,
  y,
  width,
  height,
  rotationAngle,
  offsetX,
  offsetY,
  imgWidth,
  imgHeight,
}) {
  const {
    actions: { editorToDataX, editorToDataY },
  } = useUnits();

  const moveableRef = useRef();
  const cropRef = useRef([0, 0, 0, 0, 0, 0]);

  // Refresh moveables to ensure that the selection rect is always correct.
  useEffect(() => {
    moveableRef.current.updateRect();
  });

  return (
    <Movable
      ref={moveableRef}
      className="crop-movable"
      targets={cropBox}
      origin={false}
      resizable={true}
      onResize={({
        width: resizeWidth,
        height: resizeHeight,
        direction,
        delta,
        drag,
      }) => {
        // Focal point offset.
        const [fx, fy] = [drag.beforeTranslate[0], drag.beforeTranslate[1]];
        // Direction of resize: left/right/top/bottom and resize deltas for
        // each side.
        const [dirX, dirY] = direction;
        const dw = resizeWidth - width;
        const dh = resizeHeight - height;
        const left = dirX < 0 ? dw : 0;
        const right = dirX > 0 ? dw : 0;
        const top = dirY < 0 ? dh : 0;
        const bottom = dirY > 0 ? dh : 0;
        cropRef.current = [fx, fy, left, right, top, bottom];
        cropBox.style.transform = `translate(${fx}px, ${fy}px)`;
        croppedImage.style.transform = `translate(${-fx}px, ${-fy}px)`;
        if (delta[0]) {
          cropBox.style.width = `${resizeWidth}px`;
        }
        if (delta[1]) {
          cropBox.style.height = `${resizeHeight}px`;
        }
      }}
      onResizeEnd={() => {
        const [fx, fy, left, right, top, bottom] = cropRef.current;
        cropRef.current = [0, 0, 0, 0, 0, 0];
        cropBox.style.transform = '';
        croppedImage.style.transform = '';
        cropBox.style.width = '';
        cropBox.style.height = '';
        if (left === 0 && right === 0 && top === 0 && bottom === 0) {
          return;
        }
        const resizeWidth = width + left + right;
        const resizeHeight = height + top + bottom;
        const [dx, dy] = calcRotatedResizeOffset(
          rotationAngle,
          left,
          right,
          top,
          bottom
        );
        const resizeScale =
          Math.min(imgWidth / resizeWidth, imgHeight / resizeHeight) * 100;
        const resizeFocalX = getFocalFromOffset(
          resizeWidth,
          imgWidth,
          offsetX + fx
        );
        const resizeFocalY = getFocalFromOffset(
          resizeHeight,
          imgHeight,
          offsetY + fy
        );
        setProperties({
          x: editorToDataX(x + dx),
          y: editorToDataY(y + dy),
          width: editorToDataX(resizeWidth),
          height: editorToDataY(resizeHeight),
          scale: resizeScale,
          focalX: resizeFocalX,
          focalY: resizeFocalY,
        });
      }}
      snappable={true}
      // todo@: it looks like resizing bounds are not supported.
      verticalGuidelines={[x - offsetX, x - offsetX + imgWidth]}
      horizontalGuidelines={[y - offsetY, y - offsetY + imgHeight]}
    />
  );
}

EditCropMovable.propTypes = {
  setProperties: PropTypes.func.isRequired,
  cropBox: PropTypes.object.isRequired,
  croppedImage: PropTypes.object.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rotationAngle: PropTypes.number.isRequired,
  offsetX: PropTypes.number.isRequired,
  offsetY: PropTypes.number.isRequired,
  imgWidth: PropTypes.number.isRequired,
  imgHeight: PropTypes.number.isRequired,
};

export default EditCropMovable;
