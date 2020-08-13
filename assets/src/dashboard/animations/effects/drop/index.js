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
 * Internal dependencies
 */
import SimpleAnimation from '../../parts/simpleAnimation';
import getOffPageOffset from '../../utils/getOffPageOffset';

const getMinTopOffset = (element) =>
  getOffPageOffset({
    ...element,
    y: 160,
  }).offsetTop;

export function EffectDrop({
  element,
  fill = 'both',
  duration = 1600,
  delay = 0,
}) {
  const minTopOffset = getMinTopOffset(element);
  const { offsetTop } = getOffPageOffset(element);
  const maxBounceHeight =
    -1 * Math.max(Math.abs(minTopOffset), Math.abs(offsetTop));

  const animationName = `drop-effect-${maxBounceHeight}`;
  const keyframes = [
    {
      offset: 0,
      transform: `translateY(${maxBounceHeight}%)`,
      easing: 'cubic-bezier(.75,.05,.86,.08)',
    },
    {
      offset: 0.3,
      transform: 'translateY(0)',
      easing: 'cubic-bezier(.22,.61,.35,1)',
    },
    {
      offset: 0.52,
      transform: `translateY(${0.6 * maxBounceHeight}%)`,
      easing: 'cubic-bezier(.75,.05,.86,.08)',
    },
    {
      offset: 0.74,
      transform: 'translateY(0)',
      easing: 'cubic-bezier(.22,.61,.35,1)',
    },
    {
      offset: 0.83,
      transform: `translateY(${0.3 * maxBounceHeight}%)`,
      easing: 'cubic-bezier(.75,.05,.86,.08)',
    },
    {
      offset: 1,
      transform: 'translateY(0)',
      easing: 'cubic-bezier(.22,.61,.35,1)',
    },
  ];

  const { id, WAAPIAnimation, AMPTarget, AMPAnimation } = SimpleAnimation(
    animationName,
    keyframes,
    {
      fill,
      duration,
      delay,
    }
  );

  return {
    id,
    WAAPIAnimation,
    AMPTarget,
    AMPAnimation,
    generatedKeyframes: {
      [animationName]: keyframes,
    },
  };
}
