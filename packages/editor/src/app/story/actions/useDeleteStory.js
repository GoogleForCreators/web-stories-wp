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
import { useCallback } from 'react';

/**
 * Internal dependencies
 */
import addQueryArgs from '../../../utils/addQueryArgs';
import { useAPI } from '../../api';
import { useConfig } from '../../config';

/**
 * Custom hook to delete story.
 *
 * @param {Object}    properties Properties to delete.
 * @param {number}    properties.storyId Story post id.
 * @return {Function} Function that can be called to delete a story.
 */
function useDeleteStory({ storyId }) {
  const {
    actions: { deleteStoryById },
  } = useAPI();
  const { postType } = useConfig();

  /**
   * Refresh page to edit url.
   *
   * @param {number} postId Current story id.
   */
  const refreshPostEditURL = useCallback(
    (postId) => {
      const getPostEditURL = addQueryArgs('edit.php', {
        trashed: 1,
        post_type: postType,
        ids: postId,
      });
      window.location.href = getPostEditURL;
    },
    [postType]
  );

  const deleteStory = useCallback(() => {
    deleteStoryById(storyId)
      .then(() => {
        refreshPostEditURL(storyId);
      })
      .catch(() => {
        // TODO Display error message to user as delete as failed.
      });
  }, [storyId, deleteStoryById, refreshPostEditURL]);

  return { deleteStory };
}

export default useDeleteStory;
