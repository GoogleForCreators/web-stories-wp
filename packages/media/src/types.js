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
import PropTypes from 'prop-types';

const ResourcePropTypes = {};

ResourcePropTypes.resourceSize = PropTypes.shape({
  file: PropTypes.string,
  source_url: PropTypes.string.isRequired,
  mime_type: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
});

ResourcePropTypes.imageResourceSizes = PropTypes.oneOfType([
  PropTypes.array,
  PropTypes.objectOf(ResourcePropTypes.resourceSize),
]);

ResourcePropTypes.videoResourceSizes = PropTypes.oneOfType([
  PropTypes.array,
  PropTypes.objectOf(ResourcePropTypes.resourceSize),
]);

ResourcePropTypes.imageResource = PropTypes.shape({
  type: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  mimeType: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  alt: PropTypes.string,
  sizes: ResourcePropTypes.imageResourceSizes,
});

ResourcePropTypes.trackResource = PropTypes.shape({
  id: PropTypes.string.isRequired,
  track: PropTypes.string.isRequired,
  trackId: PropTypes.number,
  trackName: PropTypes.string.isRequired,
  kind: PropTypes.string,
  srclang: PropTypes.string,
  label: PropTypes.string,
});

ResourcePropTypes.videoResource = PropTypes.shape({
  type: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  mimeType: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  poster: PropTypes.string,
  posterId: PropTypes.number,
  tracks: PropTypes.arrayOf(ResourcePropTypes.trackResource),
  alt: PropTypes.string,
  title: PropTypes.string,
  sizes: ResourcePropTypes.videoResourceSizes,
});

ResourcePropTypes.gifResource = PropTypes.shape({
  type: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  mimeType: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  title: PropTypes.string,
  alt: PropTypes.string,
  local: PropTypes.bool,
  sizes: ResourcePropTypes.imageResourceSizes,
  output: PropTypes.shape({
    mimeType: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    sizes: PropTypes.shape({
      mp4: ResourcePropTypes.videoResourceSizes,
      webm: ResourcePropTypes.videoResourceSizes,
    }),
  }),
});

ResourcePropTypes.resource = PropTypes.oneOfType([
  ResourcePropTypes.imageResource,
  ResourcePropTypes.videoResource,
  ResourcePropTypes.trackResource,
  ResourcePropTypes.gifResource,
]);

export { ResourcePropTypes };

/**
 * Resource object
 *
 * @typedef {Resource} Resource Resource data for elements
 * @property {{ full: { height: number, width: number }, output: Object }} sizes The data for the full-size element
 * @property {boolean} local Whether the media was uploaded by the user
 * @property {boolean} isPlaceholder Whether the resource is a placeholder and not fully uploaded yet.
 * @property {string} src The source string for the resource
 */

// This is required so that the IDE doesn't ignore this file.
// Without it the types don't show up when you use {import('./types)}.
export default {};
