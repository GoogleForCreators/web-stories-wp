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
import { useEffect, useRef, useCallback } from '@googleforcreators/react';
import { getFocalFromOffset } from '@googleforcreators/media';
import {
  useKeyDownEffect,
  getKeyboardMovement,
} from '@googleforcreators/design-system';
import { Moveable } from '@googleforcreators/moveable';
import {
  type Flip,
  getTransformFlip,
  type MediaElement,
} from '@googleforcreators/elements';
import type MoveableType from 'react-moveable';

interface EditPanMoveableProps<T> {
  setProperties: (properties: Partial<T>) => void;
  fullMedia: HTMLElement;
  croppedMedia: HTMLElement;
  flip?: Flip;
  x: number;
  y: number;
  width: number;
  height: number;
  rotationAngle: number;
  offsetX: number;
  offsetY: number;
  mediaWidth: number;
  mediaHeight: number;
}

function EditPanMoveable<T extends MediaElement = MediaElement>({
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
}: EditPanMoveableProps<T>) {
  const moveableRef = useRef<MoveableType>(null);
  const translateRef = useRef([0, 0]);
  const transformFlip = getTransformFlip(flip);

  const update = useCallback(() => {
    const [tx, ty] = translateRef.current;
    fullMedia.style.transform = `translate(${tx}px, ${ty}px) ${
      transformFlip ?? ''
    }`;
    croppedMedia.style.transform = `translate(${tx}px, ${ty}px) ${
      transformFlip ?? ''
    }`;
  }, [croppedMedia, fullMedia, transformFlip]);

  // Refresh moveables to ensure that the selection rect is always correct.
  useEffect(() => {
    moveableRef.current?.updateRect();
  });

  useEffect(update, [update]);

  useKeyDownEffect(
    croppedMedia,
    { key: ['up', 'down', 'left', 'right'], shift: true },
    ({ key, shiftKey }) => {
      const { dx, dy } = getKeyboardMovement(key, shiftKey);
      const panFocalX = getFocalFromOffset(width, mediaWidth, offsetX - dx);
      const panFocalY = getFocalFromOffset(height, mediaHeight, offsetY - dy);
      setProperties({
        focalX: flip?.horizontal ? 100 - panFocalX : panFocalX,
        focalY: flip?.vertical ? 100 - panFocalY : panFocalY,
      } as Partial<T>);
      update();
    },
    [
      update,
      flip?.horizontal,
      flip?.vertical,
      offsetX,
      offsetY,
      setProperties,
      width,
      height,
      mediaHeight,
      mediaWidth,
    ]
  );

  return (
    <Moveable
      ref={moveableRef}
      target={croppedMedia}
      origin
      draggable
      throttleDrag={0}
      onDrag={({ dist }) => {
        translateRef.current = dist;
        update();
      }}
      onDragEnd={() => {
        croppedMedia.focus();
        const [tx, ty] = translateRef.current;
        translateRef.current = [0, 0];
        const panFocalX = getFocalFromOffset(width, mediaWidth, offsetX - tx);
        const panFocalY = getFocalFromOffset(height, mediaHeight, offsetY - ty);
        setProperties({
          focalX: flip?.horizontal ? 100 - panFocalX : panFocalX,
          focalY: flip?.vertical ? 100 - panFocalY : panFocalY,
        } as Partial<T>);
        update();
      }}
      snappable
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

export default EditPanMoveable;
