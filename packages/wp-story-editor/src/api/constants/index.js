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

// Important: Keep in sync with REST API preloading definition.
export const STORY_FIELDS = [
  'id',
  'title',
  'status',
  'slug',
  'date',
  'modified',
  'excerpt',
  'link',
  'meta',
  'story_data',
  'preview_link',
  'edit_link',
  'embed_post_link',
  'permalink_template',
  'style_presets',
  'password',
].join(',');

export const STORY_EMBED =
  'wp:featuredmedia,wp:lockuser,author,wp:publisherlogo,wp:term';

export const MEDIA_FIELDS = [
  'id',
  'date_gmt',
  'media_details',
  'mime_type',
  'featured_media',
  'featured_media_src',
  'alt_text',
  'source_url',
  'meta',
  'web_stories_media_source',
  'web_stories_is_muted',
  // _web_stories_envelope will add these fields, we need them too.
  'body',
  'status',
  'headers',
].join(',');
