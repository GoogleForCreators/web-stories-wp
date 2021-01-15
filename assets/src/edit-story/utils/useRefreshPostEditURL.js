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
import { addQueryArgs } from '../../design-system';

/**
 * Update page URL in browser.
 *
 * @param {number} postId Current story id.
 * @return {Function} Function to refresh the post edit URL.
 */
function useRefreshPostEditURL(postId) {
  const refreshPostEditURL = useCallback(() => {
    const getPostEditURL = addQueryArgs('post.php', {
      post: postId,
      action: 'edit',
    });
    window.history.replaceState(
      { id: postId },
      'Post ' + postId,
      getPostEditURL + window.location.hash
    );
  }, [postId]);
  return refreshPostEditURL;
}

export default useRefreshPostEditURL;
