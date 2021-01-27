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
import { withSelect, select } from '@wordpress/data';
import { compose } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import name from '../store/name';
import WebStoriesModal from '../components/Modal';

const { webStoriesData } = window;
const prepareShortCode = () => {
  let shortCode = '[' + webStoriesData.tag;
  const editorInstance = select(name).getEditor();
  const settings = select(name).getCurrentViewSettings();

  if (editorInstance) {
    Object.keys(settings).forEach((value) => {
      const ValueObject = settings[value];
      const Value =
        'object' === typeof ValueObject
          ? ValueObject.show.toString()
          : ValueObject.toString();
      shortCode += `${value.toString()}=${Value}`;
    });
  }

  shortCode += ' /]';

  return shortCode;
};

/**
 *
 * Pass extended props to the Modal component.
 *
 * @param {Function} select Store selector.
 * @return {{categories: Array}}
 */
// eslint-disable-next-line no-shadow
const mapSelectToProps = (select) => {
  return {
    modalOpen: select(name).getModal(),
    settings: select(name).getCurrentViewSettings(),
    prepareShortCode: prepareShortCode,
  };
};

/**
 * Higher-order component.
 */
export default compose([withSelect(mapSelectToProps)])(WebStoriesModal);
