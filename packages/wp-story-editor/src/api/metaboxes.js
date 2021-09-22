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
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { flattenFormData } from './utils';

// See https://github.com/WordPress/gutenberg/blob/148e2b28d4cdd4465c4fe68d97fcee154a6b209a/packages/edit-post/src/store/effects.js#L72-L126
export function saveMetaBoxes(story, formData, apiUrl) {
  // Additional data needed for backward compatibility.
  // If we do not provide this data, the post will be overridden with the default values.
  const additionalData = [
    story.comment_status ? ['comment_status', story.comment_status] : false,
    story.ping_status ? ['ping_status', story.ping_status] : false,
    story.sticky ? ['sticky', story.sticky] : false,
    story.author ? ['post_author', story.author.id] : false,
  ].filter(Boolean);

  Object.entries(additionalData).forEach(([key, value]) =>
    flattenFormData(formData, key, value)
  );

  return apiFetch({
    url: apiUrl,
    method: 'POST',
    body: formData,
    parse: false,
  });
}
