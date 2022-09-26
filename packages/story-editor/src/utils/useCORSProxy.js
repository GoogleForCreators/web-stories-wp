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
 * External dependencies
 */
import { useCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useAPI } from '../app/api';

function useCORSProxy() {
  const {
    actions: { getProxyUrl },
  } = useAPI();

  /**
   * Check if the resource can be accessed directly.
   *
   * Makes a HEAD request, which in turn triggers a CORS preflight request
   * in the browser.
   *
   * If the request passes, we don't need to do anything.
   * If it doesn't, it means we need to run the resource through our CORS proxy at all times.
   *
   * @type {function(string): Promise<boolean>}
   */
  const checkResourceAccess = useCallback(async (link) => {
    let shouldProxy = false;
    if (!link) {
      return shouldProxy;
    }
    try {
      await fetch(link, {
        method: 'HEAD',
      });
    } catch (err) {
      shouldProxy = true;
    }

    return shouldProxy;
  }, []);

  /**
   * Get proxied url.
   *
   * @param {Object} resource Resource object
   * @param {string} src The thumbnail's url
   * @return {null|string} Return proxied source or null.
   */
  const getProxiedUrl = useCallback(
    (resource, src) => {
      const { needsProxy } = resource;
      if (needsProxy && src) {
        return getProxyUrl(src);
      }
      return src;
    },
    [getProxyUrl]
  );

  return {
    getProxiedUrl,
    checkResourceAccess,
  };
}
export default useCORSProxy;
