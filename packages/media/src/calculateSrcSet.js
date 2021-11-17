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
import aspectRatiosApproximatelyMatch from './aspectRatiosApproximatelyMatch';

/**
 * Returns a valid srcSet attribute value for the given media resource.
 *
 * @param {import('@web-stories-wp/media').Resource} resource The resource.
 * @return {?string} The srcSet value, or null if the resource has no `sizes`
 * attribute.
 */
function calculateSrcSet(resource) {
  if (!resource.sizes) {
    return null;
  }

  return (
    Object.values(resource.sizes)
      .sort((s1, s2) => Number(s2.width) - Number(s1.width))
      .filter((s) => aspectRatiosApproximatelyMatch(s, resource))
      // Remove duplicates. Given it's already ordered in descending width order, we can be
      // more efficient and just check the last item in each reduction.
      .reduce(
        (unique, s) =>
          unique.length &&
          Number(unique[unique.length - 1].width) === Number(s.width)
            ? unique
            : [...unique, s],
        []
      )
      .filter((s) => s && s.source_url && s.width)
      .map(
        (s) => `${encodeURI(s.source_url).replaceAll(',', '%2C')} ${s.width}w`
      )
      .join(',')
  );
}

export default calculateSrcSet;
