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
import removeAccents from 'remove-accents';

/**
 * Performs some basic cleanup of a string for use as a post slug.
 *
 * This replicates some of what `sanitize_title()` does in WordPress core, but
 * is only designed to approximate what the slug will be.
 *
 * Converts Latin-1 Supplement and Latin Extended-A letters to basic Latin
 * letters. Removes combining diacritical marks. Converts whitespace, periods,
 * and forward slashes to hyphens. Removes any remaining non-word characters
 * except hyphens. Converts remaining string to lowercase. It does not account
 * for octets, HTML entities, or other encoded characters.
 *
 * @see https://github.com/WordPress/gutenberg/blob/5ff5acd2815d5260db15ab155fcaf4b3b80d7c1b/packages/url/src/clean-for-slug.js
 * @param string Title or slug to be processed.
 * @param isEditing Flag the user is currently editing the input
 allowing extra hyphens (default false)
 * @return Processed string.
 */
export default function cleanForSlug(string: string, isEditing = false) {
  if (!string) {
    return '';
  }

  const pipe: [string] = [string];

  return (
    pipe
      // Convert each group of whitespace, periods, and forward slashes to a hyphen.
      .map((s) => s.replace(/[\s./_]/g, '-'))
      // If not editing, remove hyphens from the beginning and ending.
      .map((s) => (isEditing ? s : s.replace(/^-+|-+$/g, '')))
      .map((s) => s.normalize('NFC'))
      // Remove anything that's not a letter, number, underscore or hyphen.
      .map((s) => (isEditing ? s : s.replace(/[^\p{L}\p{N}_-]+/gu, '')))
      .map((s) => (isEditing ? s : s.replace(/--+/g, '-')))
      .map((s) => s.toLowerCase())
      .pop() as string
  );
}
