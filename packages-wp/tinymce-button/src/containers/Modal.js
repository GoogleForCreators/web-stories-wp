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
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import WebStoriesModal from '../components/Modal';
import { prepareShortCode } from '../utils';
import store from '../store';

/**
 *
 * Pass extended props to the Modal component.
 *
 * @param {Function} select Store selector.
 * @return {Object} Injected props.
 */
const mapSelectToProps = (select) => {
  return {
    modalOpen: select(store).getModal(),
    settings: select(store).getCurrentViewSettings(),
    prepareShortCode: prepareShortCode,
  };
};

/**
 * Higher-order component.
 */
export default compose([withSelect(mapSelectToProps)])(WebStoriesModal);
