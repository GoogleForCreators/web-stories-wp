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
 * Choose the source URL of the smallest available size image.
 *
 * @param {*} resource Image resource object.
 * @return {string} Source URL of the smallest available size image.
 */
function getThumbnailUrl(resource) {
  const { src, sizes } = resource;

  let imageSrc = src;
  if (sizes) {
    const { web_stories_thumbnail: webStoriesThumbnail, large, full } = sizes;
    if (webStoriesThumbnail && webStoriesThumbnail.source_url) {
      imageSrc = webStoriesThumbnail.source_url;
    } else if (large && large.source_url) {
      imageSrc = large.source_url;
    } else if (full && full.source_url) {
      imageSrc = full.source_url;
    }
  }
  return imageSrc;
}

export default getThumbnailUrl;
