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
 * @typedef {import('./media3p/typedefs').Media3pContext} Media3pContext
 * @typedef {import('./local/typedefs').LocalMediaContext} LocalMediaContext
 */

/**
 * @typedef SizeData
 * @property {string} file file name
 * @property {number} height height in pixels
 * @property {number} width width in pixels
 * @property {string} mime_type mime type of the file
 * @property {string} source_url the source url
 */

/**
 * How the media is represented inside the state.
 *
 * @typedef Media
 * @property {Object} attribution object describing the attribution
 * @property {string} creationDate date created
 * @property {number} height in pixels
 * @property {number} width in pixels
 * @property {string} id media id
 * @property {number} length length
 * @property {string} lengthFormatted lengthFormatted
 * @property {boolean} local whether the media is a locally uploaded media
 * @property {string} mimeType mimeType
 * @property {string} poster poster
 * @property {string} posterId poster id
 * @property {Object.<string, SizeData>} sizes dictionary representing the
 * different sizes of the media
 * @property {string} src url of media
 * @property {string} title title of media
 * @property {string} type type of media
 */

/**
 * How the media is represented inside the state.
 *
 * @typedef MediaContext
 * @property {Media3pContext} media3p Context state and actions of media3p.
 * @property {LocalMediaContext} local Context state and actions of local media.
 */

// This is required so that the IDE doesn't ignore this file.
// Without it the types don't show up when you use {import('./typedefs)}.
export default {};
