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
import { getGlobalSpace, getOffPageOffset } from '../../utils';

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
  const global = getGlobalSpace(element);
  const minTopOffset = getMinTopOffset(element);
  const { offsetTop } = getOffPageOffset(element);
  const maxBounceHeight =
    -1 * Math.max(Math.abs(minTopOffset), Math.abs(offsetTop));

  const animationName = `drop-effect-${maxBounceHeight}`;
  const keyframes = [
    {
      offset: 0,
      transform: global`translate3d(0, ${maxBounceHeight}%, 0)`,
      easing: 'cubic-bezier(.5, 0, 1, 1)',
    },
    {
      offset: 0.29,
      transform: global`translate3d(0, 0%, 0)`,
      easing: 'cubic-bezier(0, 0, .5, 1)',
    },
    {
      offset: 0.45,
      transform: global`translate3d(0, ${0.2812 * maxBounceHeight}%, 0)`,
      easing: 'cubic-bezier(.5, 0, 1, 1)',
    },
    {
      offset: 0.61,
      transform: global`translate3d(0, 0%, 0)`,
      easing: 'cubic-bezier(0, 0, .5, 1)',
    },
    {
      offset: 0.71,
      transform: global`translate3d(0, ${0.0956 * maxBounceHeight}%, 0)`,
      easing: 'cubic-bezier(.5, 0, 1, 1)',
    },
    {
      offset: 0.8,
      transform: global`translate3d(0, 0%, 0)`,
      easing: 'cubic-bezier(0, 0, .5, 1)',
    },
    {
      offset: 0.85,
      transform: global`translate3d(0, ${0.0359 * maxBounceHeight}%, 0)`,
      easing: 'cubic-bezier(.5, 0, 1, 1)',
    },
    {
      offset: 0.92,
      transform: global`translate3d(0, 0%, 0)`,
      easing: 'cubic-bezier(0, 0, .5, 1)',
    },
    {
      offset: 0.96,
      transform: global`translate3d(0, ${0.0156 * maxBounceHeight}%, 0)`,
      easing: 'cubic-bezier(.5, 0, 1, 1)',
    },
    {
      offset: 1,
      transform: global`translate3d(0, 0%, 0)`,
      easing: 'cubic-bezier(0, 0, .5, 1)',
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
