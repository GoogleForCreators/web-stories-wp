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
  const { apiCallbacks, cdnURL } = useConfig();
  const pageTemplates = useRef({
    base: [],
    withoutImages: [],
  });

  const actions = {
    ...apiCallbacks,
  };

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
