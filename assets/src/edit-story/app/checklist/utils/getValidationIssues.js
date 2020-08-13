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
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import isLinkBelowLimit from './isLinkBelowLimit';

const getInvalidLinks = (elements) => {
  return elements.reduce((errors, el) => {
    const isInvalidLink = isLinkBelowLimit(el);
    if (!isInvalidLink) {
      return errors;
    }
    return {
      ...errors,
      [el.id]: {
        type: 'EXCLUDE',
        msg: __(
          'Links can not be below the Page Attachment line',
          'web-stories'
        ),
      },
    };
  }, {});
};

const getValidationIssues = (pages) => {
  const errors = pages.reduce((errors, page) => {
    const { id, elements, pageAttachment } = page;
    // Currently checking only for invalid link errors.
    if (!pageAttachment?.url?.length > 0) {
      return errors;
    }
    const invalidLinks = getInvalidLinks(elements);
    // Nothing found, let's not add the page information.
    if (Object.keys(invalidLinks).length === 0) {
      return errors;
    }
    return { ...errors, [id]: invalidLinks };
  }, {});
  return {
    errors,
    recommendations: {},
  };
};

export default getValidationIssues;
