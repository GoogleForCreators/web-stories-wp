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

const AVAILABLE_OPACITY = [0, 0.25, 0.75, 1];
const DEFAULT_STEPS = 10;

export function generateLookupMap(values) {
  return values.reduce(
    (acc, currentValue) => ({
      ...acc,
      [currentValue]: values.filter((opacity) => opacity !== currentValue),
    }),
    {}
  );
}

export function padArray(values, padCount) {
  return values.reduce(
    (acc, currentValue) => acc.concat(Array(padCount).fill(currentValue)),
    []
  );
}

export default function (steps) {
  const blinkCount = steps || DEFAULT_STEPS;
  const opacityFrames = [];
  const lookup = generateLookupMap(AVAILABLE_OPACITY);

  for (let i = 0; i < blinkCount - 2; i++) {
    const opacities = i > 0 ? lookup[opacityFrames[i - 1]] : AVAILABLE_OPACITY;
    const opacity = opacities[Math.floor(Math.random() * opacities.length)];

    opacityFrames.push(opacity);
  }

  return {
    fill: 'forwards',
    keyframes: {
      opacity: [0, ...padArray(opacityFrames, 3), 1],
    },
  };
}
