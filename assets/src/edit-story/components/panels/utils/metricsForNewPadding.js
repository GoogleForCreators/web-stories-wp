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

export function metricsForNewPadding({
  currentPadding,
  newPadding,
  x,
  y,
  width,
  height,
}) {
  const updates = {};

  if ('horizontal' in newPadding) {
    updates.x = x - (newPadding.horizontal - currentPadding.horizontal || 0);
    updates.width =
      width + (newPadding.horizontal - currentPadding.horizontal || 0) * 2;
  }

  if ('vertical' in newPadding) {
    updates.y = y - (newPadding.vertical - currentPadding.vertical || 0);
    updates.height =
      height + (newPadding.vertical - currentPadding.vertical || 0) * 2;
  }

  return updates;
}
