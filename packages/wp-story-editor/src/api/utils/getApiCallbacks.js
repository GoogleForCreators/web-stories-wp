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
  return Object.entries(apiCallbacks).reduce((callbacks, [name, callback]) => {
    let args = [];

    switch (name) {
      case 'saveStoryById':
        args = [api, encodeMarkup];
        break;
      case 'autoSaveById':
        args = [api, encodeMarkup];
        break;
      case 'getTaxonomies':
        args = [api, postType];
        break;
      case 'getTaxonomyTerm':
        args = [];
        break;
      case 'createTaxonomyTerm':
        args = [];
        break;
      default:
        args = [api];
        break;
    }

    callbacks[name] = callback.bind(null, ...args);

    return callbacks;
  }, {});
};

export default getApiCallbacks;
