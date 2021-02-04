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
import { AnimationPulse } from '../../parts/pulse';

export function EffectPulse({
  iterations = 1,
  scale = 0.05,
  duration = 600,
  delay,
  easing,
}) {
  return AnimationPulse({
    scale,
    duration,
    delay,
    easing,
    iterations,
  });
}
