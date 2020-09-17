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
import { css } from 'styled-components';

export const mediaWithScale = css`
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  left: ${({ offsetX }) => `${-offsetX}px`};
  top: ${({ offsetY }) => `${-offsetY}px`};
`;

export function getMediaWithScaleCss({ width, height, offsetX, offsetY }) {
  // todo@: This is a complete duplication of `mediaWithScale` above. But
  // no other apparent way to execute interpolate `mediaWithScale` dynamically.
  return `width:${width}px; height:${height}px; left:${-offsetX}px; top:${-offsetY}px;`;
}

const aspectRatiosApproximatelyMatch = (obj1, obj2) => {
  return Math.abs(obj1.width / obj1.height - obj2.width / obj2.height) < 0.01;
};

/**
 * Returns a valid srcSet attribute value for the given media resource.
 *
 * @param {import('../../app/media/utils/createResource.js').Resource} resource The resource.
 * @return {?string} The srcSet value, or null if the resource has no `sizes`
 * attribute.
 */
export function calculateSrcSet(resource) {
  if (!resource.sizes) {
    return null;
  }

  return (
    Object.values(resource.sizes)
      .sort((s1, s2) => s2.width - s1.width)
      .filter((s) => aspectRatiosApproximatelyMatch(s, resource))
      // Remove duplicates. Given it's already ordered in descending width order, we can be
      // more efficient and just check the last item in each reduction.
      .reduce(
        (unique, s) =>
          unique.length && unique[unique.length - 1].width == s.width
            ? unique
            : [...unique, s],
        []
      )
      .filter((s) => s && s.source_url && s.width)
      .map((s) => `${s.source_url} ${s.width}w`)
      .join(',')
  );
}

/**
 * Choose the source URL of the smallest available size image / video wider than
 * minWidth, according to the device pixel ratio.
 *
 * @param {number} minWidth The minimum width of the thumbnail to return.
 * @param {import('../../app/media/utils/createResource.js').Resource} resource The resource.
 * @return {string} Source URL of the smallest available size media.
 */
export function getSmallestUrlForWidth(minWidth, resource) {
  if (resource.sizes) {
    const smallestMedia = Object.values(resource.sizes)
      .sort((s1, s2) => s1.width - s2.width)
      .filter((s) => aspectRatiosApproximatelyMatch(s, resource))
      .find((s) => s.width >= minWidth * window.devicePixelRatio);
    if (smallestMedia) {
      return smallestMedia.source_url;
    }
  }
  return resource.src;
}
