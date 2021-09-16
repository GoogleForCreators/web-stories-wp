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
import { useCallback, useRef } from '@web-stories-wp/react';
import getAllTemplates from '@web-stories-wp/templates';

/**
 * Internal dependencies
 */
import { useConfig } from '../config';
import Context from './context';
import { removeImagesFromPageTemplates } from './utils';

function APIProvider({ children }) {
  const {
    api: {
      stories,
      media,
      hotlink,
      link,
      users,
      metaBoxes,
      currentUser,
      pageTemplates: customPageTemplates,
      taxonomies,
    },
    apiCallbacks,
    encodeMarkup,
    cdnURL,
    postType,
  } = useConfig();

  const {
    getStoryById,
    getDemoStoryById,
    saveStoryById,
    autoSaveById,
    getMedia,
    uploadMedia,
    updateMedia,
    deleteMedia,
    getLinkMetadata,
    getAuthors,
    getCurrentUser,
    updateCurrentUser,
    saveMetaBoxes,
    getCustomPageTemplates,
    addPageTemplate,
    deletePageTemplate,
    getHotlinkInfo,
    getTaxonomies,
    getTaxonomyTerm,
    createTaxonomyTerm,
  } = apiCallbacks;

  const pageTemplates = useRef({
    base: [],
    withoutImages: [],
  });

  const actions = { getTaxonomyTerm, createTaxonomyTerm };

  actions.getPageTemplates = useCallback(
    async ({ showImages = false } = {}) => {
      // check if pageTemplates have been loaded yet
      if (pageTemplates.current.base.length === 0) {
        pageTemplates.current.base = await getAllTemplates({ cdnURL });
        pageTemplates.current.withoutImages = removeImagesFromPageTemplates(
          pageTemplates.current.base
        );
      }

      return pageTemplates.current[showImages ? 'base' : 'withoutImages'];
    },
    [cdnURL]
  );

  actions.getStoryById = useCallback(
    (storyId) => getStoryById(storyId, stories),
    [stories, getStoryById]
  );

  actions.getDemoStoryById = useCallback(
    (storyId) => getDemoStoryById(storyId, stories),
    [stories, getDemoStoryById]
  );

  actions.saveStoryById = useCallback(
    (story) => saveStoryById(story, stories, encodeMarkup),
    [stories, encodeMarkup, saveStoryById]
  );

  actions.autoSaveById = useCallback(
    (story) => autoSaveById(story, stories, encodeMarkup),
    [stories, encodeMarkup, autoSaveById]
  );

  actions.getMedia = useCallback(
    ({ mediaType, searchTerm, pagingNum, cacheBust }) =>
      getMedia({ mediaType, searchTerm, pagingNum, cacheBust }, media),
    [media, getMedia]
  );

  actions.uploadMedia = useCallback(
    (file, additionalData) => uploadMedia(file, additionalData, media),
    [media, uploadMedia]
  );

  actions.updateMedia = useCallback(
    (mediaId, data) => updateMedia(mediaId, data, media),
    [media, updateMedia]
  );

  actions.deleteMedia = useCallback(
    (mediaId) => deleteMedia(mediaId, media),
    [media, deleteMedia]
  );

  actions.getHotlinkInfo = useCallback(
    (url) => getHotlinkInfo(url, hotlink),
    [hotlink, getHotlinkInfo]
  );

  actions.getLinkMetadata = useCallback(
    (url) => getLinkMetadata(url, link),
    [link, getLinkMetadata]
  );

  actions.getAuthors = useCallback(
    (search = null) => getAuthors(search, users),
    [users, getAuthors]
  );

  actions.getCurrentUser = useCallback(
    () => getCurrentUser(currentUser),
    [currentUser, getCurrentUser]
  );

  actions.updateCurrentUser = useCallback(
    (data) => updateCurrentUser(data, currentUser),
    [currentUser, updateCurrentUser]
  );

  // @todo Move to wp-story-editor along with meta-boxes.
  actions.saveMetaBoxes = useCallback(
    (story, formData) => saveMetaBoxes(story, formData, metaBoxes),
    [metaBoxes, saveMetaBoxes]
  );

  actions.getCustomPageTemplates = useCallback(
    (page = 1) => getCustomPageTemplates(page, customPageTemplates),
    [customPageTemplates, getCustomPageTemplates]
  );

  actions.addPageTemplate = useCallback(
    (page) => addPageTemplate(page, customPageTemplates),
    [customPageTemplates, addPageTemplate]
  );

  actions.deletePageTemplate = useCallback(
    (id) => deletePageTemplate(id, customPageTemplates),
    [customPageTemplates, deletePageTemplate]
  );

  actions.getTaxonomies = useCallback(
    () => getTaxonomies(postType, taxonomies),
    [postType, taxonomies, getTaxonomies]
  );

  // If some api callbacks have not been provided via configuration
  // set those actions as undefined, so we can stop them conditionally.
  // @todo Handle undefined api callbacks where they have been used.
  Object.keys(actions).forEach((name) => {
    if ('getPageTemplates' !== name && !apiCallbacks[name]) {
      actions[name] = undefined;
    }
  });

  return <Context.Provider value={{ actions }}>{children}</Context.Provider>;
}

APIProvider.propTypes = {
  children: PropTypes.node,
};

export default APIProvider;
