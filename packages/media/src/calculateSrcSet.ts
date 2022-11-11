/*
 * Copyright 2021 Google LLC
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
import type { Resource, ResourceSize } from './types';
import aspectRatiosApproximatelyMatch from './aspectRatiosApproximatelyMatch';

/**
 * Encodes a text string as a valid Uniform Resource Identifier (URI)
 *
 * Only encodes strings that do not look like they're already encoded,
 * by first looking for the percentage sign character.
 *
 * @param str A value representing an encoded URI.
 * @return Encoded URI
 */
function maybeEncodeURI(str: string): string {
  if (str.includes('%')) {
    return str;
  }

  return encodeURI(str);
}

/**
 * Returns a valid srcSet attribute value for the given media resource.
 *
 * @param resource The resource.
 * @return The srcSet value, or null if the resource has no `sizes`
 * attribute.
 */
function calculateSrcSet(resource: Resource): string | null {
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
        (unique: Array<ResourceSize>, s) =>
          unique.length && unique[unique.length - 1].width === s.width
            ? unique
            : [...unique, s],
        []
      )
      .filter((s) => s && s.sourceUrl && s.width)
      .map(
        (s) =>
          `${maybeEncodeURI(s.sourceUrl).replaceAll(',', '%2C')} ${s.width}w`
      )
      .join(',')
  );
}

export default calculateSrcSet;
