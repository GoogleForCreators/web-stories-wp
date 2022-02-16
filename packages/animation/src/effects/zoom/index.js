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
import { AnimationZoom } from '../../parts/zoom';
import { AnimationFade } from '../../parts/fade';
import { SCALE_DIRECTION } from '../../constants';

export function EffectZoom({
  scaleDirection = SCALE_DIRECTION.SCALE_IN,
  duration = 1000,
  delay,
  easing = 'cubic-bezier(.3,0,.55,1)',
}) {
  const id = uuidv4();

  const {
    WAAPIAnimation: ZoomWAAPIAnimation,
    AMPTarget: ZoomAMPTarget,
    AMPAnimation: ZoomAMPAnimation,
    generatedKeyframes: zoomKeyframes,
  } = AnimationZoom({
    zoomFrom: scaleDirection === SCALE_DIRECTION.SCALE_OUT ? 3 : 1 / 3,
    zoomTo: 1,
    duration,
    delay,
    easing,
  });

  const {
    WAAPIAnimation: FadeWAAPIAnimation,
    AMPTarget: FadeAMPTarget,
    AMPAnimation: FadeAMPAnimation,
    generatedKeyframes: fadeKeyframes,
  } = AnimationFade({
    fadeFrom: scaleDirection === SCALE_DIRECTION.SCALE_OUT ? 1 : 0,
    fadeTo: 1,
    duration: duration,
    delay,
    easing,
  });

  const keyframes = {
    transform: ZoomWAAPIAnimation.keyframes.transform,
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
        <FadeAMPTarget style={style}>
          <ZoomAMPTarget style={style}>{children}</ZoomAMPTarget>
        </FadeAMPTarget>
      );
    },
    AMPAnimation: function AMPAnimation() {
      return (
        <>
          <FadeAMPAnimation />
          <ZoomAMPAnimation />
        </>
      );
    },
    generatedKeyframes: {
      ...fadeKeyframes,
      ...zoomKeyframes,
    },
  };
}
