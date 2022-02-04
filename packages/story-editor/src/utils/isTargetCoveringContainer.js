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

function isTargetCoveringContainer(target, container) {
  const targetBox = target.getBoundingClientRect();
  const containerBox = container.getBoundingClientRect();

  const intersectionArea =
    Math.max(
      0,
      Math.min(targetBox.right, containerBox.right) -
        Math.max(targetBox.left, containerBox.left)
    ) *
    Math.max(
      0,
      Math.min(targetBox.bottom, containerBox.bottom) -
        Math.max(targetBox.top, containerBox.top)
    );

  const containerArea = containerBox.width * containerBox.height;
  const coverRatio = intersectionArea / containerArea;

  return coverRatio > 0.995;
}

export default isTargetCoveringContainer;
