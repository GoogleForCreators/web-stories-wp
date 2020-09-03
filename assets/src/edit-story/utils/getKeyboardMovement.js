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

const MOVE_COARSE_STEP = 10;

function getKeyboardMovement(key, shiftKey, coarseDistance = MOVE_COARSE_STEP) {
  const dirX = getArrowDir(key, 'ArrowRight', 'ArrowLeft');
  const dirY = getArrowDir(key, 'ArrowDown', 'ArrowUp');
  const delta = shiftKey ? 1 : coarseDistance;
  return {
    dx: dirX * delta,
    dy: dirY * delta,
  };
}

function getArrowDir(key, pos, neg) {
  if (key === pos) {
    return 1;
  }
  if (key === neg) {
    return -1;
  }
  return 0;
}

export default getKeyboardMovement;
