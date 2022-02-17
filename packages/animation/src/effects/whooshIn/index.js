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
import { v4 as uuidv4 } from 'uuid';
/**
 * Internal dependencies
 */
import { DIRECTION } from '../../constants';
import { AnimationFade } from '../../parts/fade';
import { AnimationMove } from '../../parts/move';
import { AnimationZoom } from '../../parts/zoom';
import getOffPageOffset from '../../utils/getOffPageOffset';

export function EffectWhooshIn({
  duration = 600,
  whooshInDir = DIRECTION.LEFT_TO_RIGHT,
  easing = 'cubic-bezier(0.4, 0.4, 0.0, 1)',
  delay,
  element,
}) {
  const id = uuidv4();

  const { offsetLeft, offsetRight } = getOffPageOffset(element);

  const offsetX =
    whooshInDir === DIRECTION.RIGHT_TO_LEFT
      ? `${offsetRight}%`
      : `${offsetLeft}%`;

  const {
    WAAPIAnimation: MoveWAAPIAnimation,
    AMPTarget: MoveAMPTarget,
    AMPAnimation: MoveAMPAnimation,
    generatedKeyframes: moveKeyframes,
  } = AnimationMove({
    offsetX,
    duration,
    delay,
    easing,
    element,
  });

  const {
    WAAPIAnimation: FadeWAAPIAnimation,
    AMPTarget: FadeAMPTarget,
    AMPAnimation: FadeAMPAnimation,
    generatedKeyframes: fadeKeyframes,
  } = AnimationFade({
    fadeFrom: 0,
    fadeTo: 1,
    duration,
    delay,
    easing,
  });

  const {
    WAAPIAnimation: ZoomWAAPIAnimation,
    AMPTarget: ZoomAMPTarget,
    AMPAnimation: ZoomAMPAnimation,
    generatedKeyframes: zoomKeyframes,
  } = AnimationZoom({
    zoomFrom: 0.15,
    zoomTo: 1,
    duration,
    delay,
    easing,
  });
  const [moveTransformStart, moveTransformEnd] =
    MoveWAAPIAnimation.keyframes.transform;
  const [zoomTransformStart, zoomTransformEnd] =
    ZoomWAAPIAnimation.keyframes.transform;
  const keyframes = {
    transform: [
      `${moveTransformStart} ${zoomTransformStart}`,
      `${moveTransformEnd} ${zoomTransformEnd}`,
    ],
    opacity: FadeWAAPIAnimation.keyframes.opacity,
  };

  return {
    id,
    WAAPIAnimation: {
      ...ZoomWAAPIAnimation,
      keyframes,
    },
    // eslint-disable-next-line react/prop-types -- Negligible.
    AMPTarget: function AMPTarget({ children, style }) {
      return (
        <MoveAMPTarget style={style}>
          <FadeAMPTarget style={style}>
            <ZoomAMPTarget style={style}>{children}</ZoomAMPTarget>
          </FadeAMPTarget>
        </MoveAMPTarget>
      );
    },
    AMPAnimation: function AMPAnimation() {
      return (
        <>
          <MoveAMPAnimation />
          <FadeAMPAnimation />
          <ZoomAMPAnimation />
        </>
      );
    },
    generatedKeyframes: {
      ...moveKeyframes,
      ...fadeKeyframes,
      ...zoomKeyframes,
    },
  };
}
