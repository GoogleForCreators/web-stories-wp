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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { createResource } from '../../utils';
import { listMedia as apiListMedia } from './apiFetcher';
import Context from './context';

/**
 * The supported providers.
 *
 * @enum {string}
 */
const Providers = {
  UNSPLASH: 'unsplash',
};

/**
 * Provider for the Media3P API. Delegates fetching the data to apiFetcher,
 * but transforms the response into resources.
 */
function Media3pApiProvider({ children }) {
  const MEDIA_PAGE_SIZE = 20;

  function constructFilter(provider, searchTerm, mediaType) {
    return [
      provider ? `provider:${provider}` : null,
      mediaType ? `type:${mediaType}` : null,
      searchTerm,
    ]
      .filter(Boolean)
      .join(' ');
  }

  function getUrls(m) {
    if (m.type.toLowerCase() === 'image') {
      return Object.fromEntries(
        new Map(m.imageUrls.map((u) => [u.imageName, u.url]))
      );
    }
    throw new Error('Invalid media type.');
  }

  function getFullAsset(m) {
    if (m.type.toLowerCase() === 'image') {
      return m.imageUrls.find((i) => i.imageName === 'full');
    }
    throw new Error('Invalid media type.');
  }

  /**
   * Maps a media object returned from the API to a Story Editor resource.
   *
   * @param {Object} m The media object to map.
   * @return {Object} The mapped resource.
   */
  function mapMediaToResource(m) {
    const urls = getUrls(m);
    const fullAsset = getFullAsset(m);
    return createResource({
      type: m.type.toLowerCase(),
      mimeType: fullAsset.mimeType,
      creationDate: m.createTime,
      src: fullAsset.url,
      width: fullAsset.width,
      height: fullAsset.height,
      poster: null, // TODO: Implement for videos.
      posterId: null, // TODO: Implement for videos.
      id: m.name,
      length: null, // TODO: Implement for videos.
      lengthFormatted: null, // TODO: Implement for videos.
      title: m.description,
      alt: null,
      local: false, // TODO: How does this interact with the rest?
      sizes: urls, // TODO: Map with expected keys for canvas.
    });
  }

  /**
   * Get media for the given parameters.
   *
   * @param {Object} obj - An object with the options.
   * @param {string} obj.provider The provider to get the media from.
   * Currently only 'unsplash' is supported.
   * @param {?string} obj.searchTerm Optional search term to send,
   * eg: 'cute cats'.
   * @param {?string} obj.orderBy The desired ordering of the results.
   * Defaults to 'relevance' in the API.
   * @param {?string} obj.mediaType The media type of results to get.
   * Currently ignored by the API as Unsplash only handles images.
   * @param {?string} obj.pageToken An optional page token to provide,
   * for pagination. If unspecified, the first page of results will be returned.
   * @return {Promise<{nextPageToken: *, media: *}>} An object with the media
   * resources and a next page token.
   */
  async function listMedia({
    provider,
    searchTerm,
    orderBy,
    mediaType,
    pageToken,
  }) {
    if (provider.toLowerCase() !== Providers.UNSPLASH) {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    const response = await apiListMedia({
      filter: constructFilter(provider, searchTerm, mediaType),
      orderBy: orderBy,
      pageSize: MEDIA_PAGE_SIZE,
      pageToken: pageToken,
    });
    return {
      media: response.media.map(mapMediaToResource),
      nextPageToken: response.nextPageToken,
    };
  }

  const state = {
    actions: {
      listMedia,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

Media3pApiProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Media3pApiProvider;
