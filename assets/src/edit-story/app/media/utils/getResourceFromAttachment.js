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
 * Internal dependencies
 */
import createResource from './createResource';
import getResourceSize from './getResourceSize';

/**
 * Generates a resource object from a WordPress attachment.
 *
 * @param {Object} attachment WP Attachment object.
 * @return {import('./createResource').Resource} Resource object.
 */
function getResourceFromAttachment(attachment) {
  const {
    id,
    date_gmt,
    guid: { rendered: src },
    media_details: {
      width,
      height,
      length,
      length_formatted: lengthFormatted,
      sizes,
    },
    title: { raw: title },
    description: { raw: description },
    mime_type: mimeType,
    featured_media: posterId,
    featured_media_src: {
      src: poster,
      width: posterWidth,
      height: posterHeight,
      generated: posterGenerated,
    },
    alt_text: alt,
  } = attachment;
  return createResource({
    mimeType,
    creationDate: date_gmt,
    src,
    ...getResourceSize(
      width,
      height,
      posterGenerated,
      posterWidth,
      posterHeight
    ),
    poster,
    posterId,
    id,
    length,
    lengthFormatted,
    alt: alt || description || title,
    title,
    sizes,
    local: false,
  });
}

export default getResourceFromAttachment;
