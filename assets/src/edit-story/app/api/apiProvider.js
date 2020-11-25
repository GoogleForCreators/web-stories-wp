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
import { useCallback } from 'react';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import addQueryArgs from '../../utils/addQueryArgs';
import { DATA_VERSION } from '../../migration';
import { useConfig } from '../config';
import Context from './context';
import base64Encode from './base64Encode';

function APIProvider({ children }) {
  const {
    api: { stories, media, link, users, statusCheck },
    encodeMarkup,
  } = useConfig();

  const getStoryById = useCallback(
    (storyId) => {
      const path = addQueryArgs(`${stories}${storyId}/`, {
        context: 'edit',
        _embed: 'wp:featuredmedia,author',
      });

      return apiFetch({ path });
    },
    [stories]
  );

  const getStorySaveData = useCallback(
    ({
      pages,
      featuredMedia,
      stylePresets,
      publisherLogo,
      autoAdvance,
      defaultPageDuration,
      content,
      author,
      ...rest
    }) => {
      return {
        story_data: {
          version: DATA_VERSION,
          pages,
          autoAdvance,
          defaultPageDuration,
        },
        featured_media: featuredMedia.id,
        style_presets: stylePresets,
        publisher_logo: publisherLogo,
        content: encodeMarkup ? base64Encode(content) : content,
        author: author.id,
        ...rest,
      };
    },
    [encodeMarkup]
  );

  const saveStoryById = useCallback(
    /**
     * Fire REST API call to save story.
     *
     * @param {import('../../types').Story} story Story object.
     * @return {Promise} Return apiFetch promise.
     */
    (story) => {
      const { storyId } = story;
      return apiFetch({
        path: `${stories}${storyId}/`,
        data: getStorySaveData(story),
        method: 'POST',
      });
    },
    [stories, getStorySaveData]
  );

  const autoSaveById = useCallback(
    /**
     * Fire REST API call to save story.
     *
     * @param {import('../../types').Story} story Story object.
     * @return {Promise} Return apiFetch promise.
     */
    (story) => {
      const { storyId } = story;
      return apiFetch({
        path: `${stories}${storyId}/autosaves/`,
        data: getStorySaveData(story),
        method: 'POST',
      });
    },
    [stories, getStorySaveData]
  );

  const getMedia = useCallback(
    ({ mediaType, searchTerm, pagingNum, cacheBust }) => {
      let apiPath = media;
      const perPage = 100;
      apiPath = addQueryArgs(apiPath, {
        context: 'edit',
        per_page: perPage,
        page: pagingNum,
        _web_stories_envelope: true,
      });

      if (mediaType) {
        apiPath = addQueryArgs(apiPath, { media_type: mediaType });
      }

      if (searchTerm) {
        apiPath = addQueryArgs(apiPath, { search: searchTerm });
      }

      // cacheBusting is due to the preloading logic preloading and caching
      // some requests. (see preload_paths in Dashboard.php)
      // Adding cache_bust forces the path to look different from the preloaded
      // paths and hence skipping the cache. (cache_bust itself doesn't do
      // anything)
      if (cacheBust) {
        apiPath = addQueryArgs(apiPath, { cache_bust: true });
      }

      return apiFetch({ path: apiPath }).then((response) => {
        return { data: response.body, headers: response.headers };
      });
    },
    [media]
  );

  /**
   * Upload file to via REST API.
   *
   * @param {File}    file           Media File to Save.
   * @param {?Object} additionalData Additional data to include in the request.
   *
   * @return {Promise} Media Object Promise.
   */
  const uploadMedia = useCallback(
    (file, additionalData) => {
      // Create upload payload
      const data = new window.FormData();
      data.append('file', file, file.name || file.type.replace('/', '.'));
      Object.entries(additionalData).forEach(([key, value]) =>
        data.append(key, value)
      );

      // TODO: Intercept window.fetch here to support progressive upload indicator when uploading
      return apiFetch({
        path: media,
        body: data,
        method: 'POST',
      });
    },
    [media]
  );

  /**
   * Update Existing media.
   *
   * @param  {number} mediaId
   * @param  {Object} data Object of properties to update on attachment.
   * @return {Promise} Media Object Promise.
   */
  const updateMedia = useCallback(
    (mediaId, data) => {
      return apiFetch({
        path: `${media}${mediaId}/`,
        data,
        method: 'POST',
      });
    },
    [media]
  );

  /**
   * Delete existing media.
   *
   * @param  {number} mediaId
   * @return {Promise} Media Object Promise.
   */
  const deleteMedia = useCallback(
    (mediaId) => {
      // `apiFetch` by default turns `DELETE` requests into `POST` requests
      // with `X-HTTP-Method-Override: DELETE` headers.
      // However, some Web Application Firewall (WAF) solutions prevent this.
      // `?_method=DELETE` is an alternative solution to override the request method.
      // See https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/#_method-or-x-http-method-override-header
      return apiFetch({
        path: addQueryArgs(`${media}${mediaId}/`, { _method: 'DELETE' }),
        data: { force: true },
        method: 'POST',
      });
    },
    [media]
  );

  /**
   * Gets metadata (title, favicon, etc.) from
   * a provided URL.
   *
   * @param  {number} url
   * @return {Promise} Result promise
   */
  const getLinkMetadata = useCallback(
    (url) => {
      const path = addQueryArgs(link, { url });
      return apiFetch({
        path,
      });
    },
    [link]
  );

  const getAuthors = useCallback(
    (search = null) => {
      return apiFetch({
        path: addQueryArgs(users, { per_page: '100', who: 'authors', search }),
      });
    },
    [users]
  );

  /**
   * Status check, submit html string.
   *
   * @param {string} HTML string.
   * @return {Promise} Result promise
   */
  const getStatusCheck = useCallback(
    (content) => {
      return apiFetch({
        path: statusCheck,
        data: { content: encodeMarkup ? base64Encode(content) : content },
        method: 'POST',
      });
    },
    [statusCheck, encodeMarkup]
  );

  const state = {
    actions: {
      autoSaveById,
      getStoryById,
      getMedia,
      getLinkMetadata,
      saveStoryById,
      getAuthors,
      uploadMedia,
      updateMedia,
      deleteMedia,
      getStatusCheck,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

APIProvider.propTypes = {
  children: PropTypes.node,
};

export default APIProvider;
