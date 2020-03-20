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
import { SPIN_TYPE } from '../constants';

export default function(type) {
  const frames = {
    [SPIN_TYPE.Clockwise]: {
      transform: ['rotateZ(0deg)', 'rotateZ(360deg)'],
    },
    [SPIN_TYPE.CounterClockwise]: {
      transform: ['rotateZ(0deg)', 'rotateZ(-360deg)'],
    },
    [SPIN_TYPE.PingPong]: {
      transform: ['rotateZ(-45deg)', 'rotateZ(40deg)'],
    },
  };

  const keyframes = frames[type] || frames[SPIN_TYPE.Clockwise];

  return {
    keyframes,
  };
}
