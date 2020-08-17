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

const getOrientation = (obj) => {
  if (obj.width / obj.height > 1) {
    return Orientation.LANDSCAPE;
  } else if (obj.width / obj.height < 1) {
    return Orientation.PORTRAIT;
  }
  return Orientation.SQUARE;
};

const Orientation = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
  SQUARE: 'square',
};

/**
 * Returns a valid srcSet attribute value for the given media resource.
 *
 * @param {Object} resource The resource.
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
      .filter((s) => getOrientation(s) === getOrientation(resource))
      // Remove duplicates. Given it's already ordered in descending width order, we can be
      // more efficient and just check the last item in each reduction.
      .reduce(
        (unique, s) =>
          unique.length && unique[unique.length - 1].width == s.width
            ? unique
            : [...unique, s],
        []
      )
      .map((s) => `${s.source_url} ${s.width}w`)
      .join(',')
  );
}

/**
 * Choose the source URL of the smallest available size image wider than
 * minWidth, according to the device pixel ratio.
 *
 * @param {number} minWidth The minimum width of the thumbnail to return.
 * @param {*} resource Image resource object.
 * @return {string} Source URL of the smallest available size image.
 */
export function getThumbnailUrl(minWidth, resource) {
  if (resource.sizes) {
    const smallestValidImage = Object.values(resource.sizes)
      .sort((s1, s2) => s1.width - s2.width)
      .filter((s) => getOrientation(s) === getOrientation(resource))
      .find((s) => s.width >= minWidth * window.devicePixelRatio);
    if (smallestValidImage) {
      return smallestValidImage.source_url;
    }
  }
  return resource.src;
}

/**
 * Choose the preview video URL if available, or else choose the normal source URL.
 *
 * @param {*} resource Image resource object.
 * @return {string} Source URL of the smallest available size image.
 */
export function getPreviewVideoUrl(resource) {
  if (resource.sizes && resource.sizes.preview) {
    return resource.sizes.preview.source_url;
  }
  return resource.src;
}
