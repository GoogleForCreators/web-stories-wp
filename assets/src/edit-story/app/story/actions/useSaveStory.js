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
 * WordPress dependencies
 */
import { useCallback, renderToString, useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { OutputPage } from '../../../output';
import { useConfig } from '../../config';

/**
 * Creates AMP HTML markup for saving to DB for rendering in the FE.
 *
 * @param {Object} story Story object.
 * @param {string} story.featuredMediaUrl Featured media URL.
 * @param {Array<Object>} pages List of pages.
 * @param {Object} metadata Metadata.
 * @param {string} metadata.publisher Publisher name.
 * @param {string} metadata.publisherLogo Publisher logo.
 * @return {Element} Markup of pages.
 */
const getStoryMarkup = (story, pages, metadata) => {
  // TODO: get different image sizes for featured media.

  return renderToString(
    <amp-story
      standalone="standalone"
      publisher={metadata.publisher}
      publisher-logo-src={metadata.publisherLogo}
      title={story.title}
      poster-portrait-src={story.featuredMediaUrl}
      poster-square-src={story.featuredMediaUrl}
      poster-landscape-src={story.featuredMediaUrl}
    >
      {pages.map((page) => (
        <OutputPage key={page.id} page={page} />
      ))}
    </amp-story>
  );
};

/**
 * Custom hook to save story.
 *
 * @param {Object}    properties Properties to update.
 * @param {number}    properties.storyId Story post id.
 * @param {Array}     properties.pages Array of all pages.
 * @param {Object}    properties.story Story-global properties
 * @return {Function} Function that can be called to save a story.
 */
function useSaveStory({ storyId, pages, story, updateStory }) {
  const {
    actions: { saveStoryById },
  } = useAPI();
  const { metadata } = useConfig();
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Refresh page to edit url.
   *
   * @param {number} postId Current story id.
   */
  const refreshPostEditURL = useCallback((postId) => {
    const getPostEditURL = addQueryArgs('post.php', {
      post: postId,
      action: 'edit',
    });
    window.history.replaceState(
      { id: postId },
      'Post ' + postId,
      getPostEditURL
    );
  }, []);

  const saveStory = useCallback(() => {
    setIsSaving(true);
    const {
      title,
      status,
      author,
      date,
      modified,
      slug,
      excerpt,
      featuredMedia,
      password,
    } = story;

    const content = getStoryMarkup(story, pages, metadata);
    saveStoryById({
      storyId,
      title,
      status,
      pages,
      author,
      slug,
      date,
      modified,
      content,
      excerpt,
      featuredMedia,
      password,
    })
      .then((post) => {
        const { status: newStatus, slug: newSlug, link } = post;
        updateStory({
          properties: {
            status: newStatus,
            slug: newSlug,
            link,
          },
        });
        refreshPostEditURL(storyId);
      })
      .catch(() => {
        // TODO Display error message to user as save as failed.
      })
      .finally(() => {
        setIsSaving(false);
      });
  }, [
    story,
    pages,
    metadata,
    saveStoryById,
    storyId,
    updateStory,
    refreshPostEditURL,
  ]);

  return { saveStory, isSaving };
}

export default useSaveStory;
