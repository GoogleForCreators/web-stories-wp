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
import { AnimationMove } from '../../parts/move';
import { AnimationSpin } from '../../parts/spin';
import { getOffPageOffset } from '../../utils';

const numberOfRotations = 1;
const stopAngle = 0;

export function EffectRotateIn({
  duration = 1000,
  rotateInDir = DIRECTION.LEFT_TO_RIGHT,
  easing = 'cubic-bezier(0.4, 0.4, 0.0, 1)',
  delay,
  element,
}) {
  const id = uuidv4();

  const { offsetLeft, offsetRight } = getOffPageOffset(element);

  const offsetX =
    rotateInDir === DIRECTION.RIGHT_TO_LEFT
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
    WAAPIAnimation: SpinWAAPIAnimation,
    AMPTarget: SpinAMPTarget,
    AMPAnimation: SpinAMPAnimation,
    generatedKeyframes: spinKeyframes,
  } = AnimationSpin({
    rotation: `${
      (rotateInDir === DIRECTION.LEFT_TO_RIGHT ? -1 : 1) *
      360 *
      numberOfRotations
    }`,
    stopAngle,
    duration,
    delay,
    easing,
    element,
  });

  return {
    id,
    // eslint-disable-next-line react/prop-types
    WAAPIAnimation: function WAAPIAnimation({ children, hoistAnimation }) {
      return (
        <MoveWAAPIAnimation hoistAnimation={hoistAnimation}>
          <SpinWAAPIAnimation hoistAnimation={hoistAnimation}>
            {children}
          </SpinWAAPIAnimation>
        </MoveWAAPIAnimation>
      );
    },
    // eslint-disable-next-line react/prop-types
    AMPTarget: function AMPTarget({ children, style }) {
      return (
        <MoveAMPTarget style={style}>
          <SpinAMPTarget style={style}>{children}</SpinAMPTarget>
        </MoveAMPTarget>
      );
    },
    AMPAnimation: function AMPAnimation() {
      return (
        <>
          <MoveAMPAnimation />
          <SpinAMPAnimation />
        </>
      );
    },
    generatedKeyframes: {
      ...moveKeyframes,
      ...spinKeyframes,
    },
  };
}
