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

/**
 * Internal dependencies
 */
import addQueryArgs from '../../../utils/addQueryArgs';
import { useAPI } from '../../api';
import { OutputPage } from '../../../output';

/**
 * Creates AMP HTML markup for saving to DB for rendering in the FE.
 *
 * @param {Object} pages Object of pages.
 * @return {Element} Markup of pages.
 */
const getStoryMarkupFromPages = (pages) => {
  const markup = pages.map((page) => {
    return renderToString(<OutputPage page={page} />);
  });
  return markup.join('');
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

    const content = getStoryMarkupFromPages(pages);
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
  }, [storyId, pages, story, updateStory, saveStoryById, refreshPostEditURL]);

  return { saveStory, isSaving };
}

export default useSaveStory;
