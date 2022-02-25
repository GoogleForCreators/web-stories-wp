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
 * External dependencies
 */
import mime from 'mime/lite';

/**
 * Get the file extension for a given mime type.
 *
 * @param {string} mimeType Mime type.
 * @return {string} File extension.
 */
export function getExtensionFromMimeType(mimeType) {
  return mime.getExtension(mimeType);
}

/**
 * Get all possible file extensions for a given mime type.
 *
 * Some mime types can map to multiple file extensions, but
 * the mime package does not offer a way to retrieve all of them.
 *
 * Since this is only needed for user-facing error messages
 * (e.g. "You can upload jpeg, png, mp4, ..."), this function
 * contains a simple, opinionated, hardcoded list of extensions for the
 * most relevant mime types as used in the story editor.
 *
 * @see https://github.com/broofa/mime/issues/254
 * @param {string} mimeType Mime type.
 * @return {string[]} File extension.
 */
export function getExtensionsFromMimeType(mimeType) {
  switch (mimeType) {
    case 'audio/mpeg':
      return ['mp3', 'm3a'];
    case 'audio/aac':
      return ['aac'];
    case 'audio/ogg':
      return ['oga', 'ogg'];
    case 'image/jpeg':
      return ['jpg', 'jpeg'];
    default:
      return [getExtensionFromMimeType(mimeType)].filter(Boolean);
  }
}
