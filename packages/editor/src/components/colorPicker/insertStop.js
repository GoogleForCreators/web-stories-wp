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

function insertStop(stops, newPosition) {
  // We're going to find the stop index and the color for the new stop

  // Find index of first stop bigger than new position
  const followingIndex = stops.findIndex(
    ({ position }) => position > newPosition
  );
  // If it's -1, it's easy-peasy
  if (followingIndex === -1) {
    // Insert at end with same color as previously last stop
    return {
      index: stops.length,
      color: stops[stops.length - 1].color,
    };
  }

  // If it's 0, it's also easy
  if (followingIndex === 0) {
    // Insert at start with same color as previously start stop
    return {
      index: 0,
      color: stops[0].color,
    };
  }

  // Find the two stops surrounding the new stop
  const preceeding = stops[followingIndex - 1];
  const following = stops[followingIndex];

  // Find the ratio the new stop is from the preceeding stop
  const diffNewToPreceeding = newPosition - preceeding.position;
  const diffFollowingToPreceeding = following.position - preceeding.position;
  const ratio = diffNewToPreceeding / diffFollowingToPreceeding;

  // Mix the two colors by that amount:
  const {
    color: { r: pr, g: pg, b: pb, a: pa = 1 },
  } = preceeding;
  const {
    color: { r: fr, g: fg, b: fb, a: fa = 1 },
  } = following;
  const mix = (p, f) => p + (f - p) * ratio;
  const fullColor = {
    r: Math.round(mix(pr, fr)),
    g: Math.round(mix(pg, fg)),
    b: Math.round(mix(pb, fb)),
    a: mix(pa, fa),
  };

  const newColor =
    fullColor.a === 1
      ? { r: fullColor.r, g: fullColor.g, b: fullColor.b }
      : fullColor;

  return {
    index: followingIndex,
    color: newColor,
  };
}

export default insertStop;
