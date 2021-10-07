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
 * Internal dependencies
 */
import * as apiCallbacks from '..';

/**
 * Get api callbacks.
 *
 * @param {Object} config Editor configuration.
 * @param config.api
 * @param config.encodeMarkup
 * @param config.postType
 * @return {Object} api callbacks.
 */
const getApiCallbacks = ({ api, encodeMarkup, postType }) => {
  const args = {
    getStoryById: [api.stories],
    saveStoryById: [api.stories, encodeMarkup],
    autoSaveById: [api.stories, encodeMarkup],
    getMedia: [api.media],
    uploadMedia: [api.media],
    updateMedia: [api.media],
    deleteMedia: [api.media],
    getLinkMetadata: [api.link],
    getAuthors: [api.users],
    getPublisherLogos: [api.publisherLogos],
    addPublisherLogo: [api.publisherLogos],
    getCurrentUser: [api.currentUser],
    updateCurrentUser: [api.currentUser],
    getCustomPageTemplates: [api.pageTemplates],
    addPageTemplate: [api.pageTemplates],
    deletePageTemplate: [api.pageTemplates],
    getHotlinkInfo: [api.hotlink],
    getTaxonomies: [api.taxonomies, postType],
  };

  return Object.entries(apiCallbacks).reduce((callbacks, [name, callback]) => {
    callbacks[name] = args[name]
      ? callback.bind(null, ...args[name])
      : callback;
    return callbacks;
  }, {});
};

export default getApiCallbacks;
