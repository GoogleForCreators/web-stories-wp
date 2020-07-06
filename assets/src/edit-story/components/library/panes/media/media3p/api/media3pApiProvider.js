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
import { createResource } from '../../../../../../app/media/utils';
import { listMedia as apiListMedia } from './apiFetcher';
import Context from './context';

/**
 * Provider for the Media3P API. Delegates fetching the data to apiFetcher,
 * but transforms the response into resources.
 *
 * @param children Scope where this provider is available.
 * @return {*}
 * @class
 */
function Media3pApiProvider({ children }) {
  const MEDIA_PAGE_SIZE = 20;

  function constructFilter(provider, searchTerm, mediaType) {
    let tokens = [];
    if (provider) {
      tokens.push(`provider:${provider}`);
    }
    if (mediaType) {
      tokens.push(`type:${mediaType}`);
    }
    if (searchTerm) {
      tokens.push(searchTerm);
    }
    return tokens.join(' ');
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
   * Get media for the given parameters.
   *
   * @param provider The provider to get the media from. Currently only 'unsplash' is supported.
   * @param searchTerm The search term to send, eg: 'cute cats'.
   * @param orderBy The desired ordering of the results. 'relevance' and 'latest' are supported.
   * @param mediaType The media type of results to get. Only 'image' is supported.
   * @param pageToken A page token to provide, for pagination.
   * @return {Promise<{nextPageToken: *, media: *}>}
   */
  async function listMedia({
    provider,
    searchTerm,
    orderBy,
    mediaType,
    pageToken = null,
  }) {
    const response = await apiListMedia({
      filter: constructFilter(provider, searchTerm, mediaType),
      orderBy: orderBy,
      pageSize: MEDIA_PAGE_SIZE,
      pageToken: pageToken,
    });
    return {
      media: response.media.map((m) => {
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
      }),
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
