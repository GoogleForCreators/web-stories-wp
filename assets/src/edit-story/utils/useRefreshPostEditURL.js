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
 * Update page URL in browser.
 *
 * @param {number} postId Current story id.
 * @param {string} postEditURL Current story's edit link.
 * @return {Function} Function to refresh the post edit URL.
 */
function useRefreshPostEditURL(postId, postEditURL) {
  const refreshPostEditURL = useCallback(() => {
    let postEditPath;
    const hash = window.location.hash;
    try {
      const newUrl = new URL(postEditURL);
      newUrl.hash = hash;
      // Remove the schema and host and just return path, params and hash.
      postEditPath = newUrl.toString().replace(newUrl.origin, '');
    } catch (error) {
      // If try fails, fallback to using window location origin.
      postEditPath = postEditURL.replace(window.location.origin, '') + hash;
    }
    window.history.replaceState({ id: postId }, 'Post ' + postId, postEditPath);
  }, [postId, postEditURL]);
  return refreshPostEditURL;
}

export default useRefreshPostEditURL;
