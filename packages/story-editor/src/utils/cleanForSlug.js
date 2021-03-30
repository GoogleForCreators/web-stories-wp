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
 * In the style of the `sanitize_title()` and `remove_accents()` PHP functions in
 * WordPress, this performs some basic cleanup of a string for use as a URL slug.
 *
 * It is not an exact replication, but more of an approximation.
 *
 * Converts whitespace, periods, forward slashes and underscores to hyphens.
 * Converts Latin-1 Supplement and Latin Extended-A letters to basic Latin
 * letters. Removes combining diacritical marks. Converts remaining string
 * to lowercase. It does not touch octets, HTML entities, or other encoded
 * characters.
 *
 * @see https://github.com/WordPress/gutenberg/blob/164d5830a9acd895dfd661b5fde1ca8b80b270ac/packages/url/src/clean-for-slug.js
 *
 * @param {string} string Title or slug to be processed.
 * @param {boolean} isEditing Flag the user is currently editing the input
 allowing extra hyphens (default false)
 *
 * @return {string} Processed string.
 */
export default function cleanForSlug(string, isEditing = false) {
  if (!string) {
    return '';
  }

  return [string]
    .map((s) => s.replace(/[\s./_]/g, '-'))
    .map((s) => (isEditing ? s : s.replace(/^-+|-+$/g, '')))
    .map((s) => (isEditing ? s : s.replace(/--+/g, '-')))
    .map((s) => s.normalize('NFD'))
    .map((s) => s.replace(/[\u0300-\u036f]/g, ''))
    .map((s) => s.toLowerCase())
    .pop();
}
