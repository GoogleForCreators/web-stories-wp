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
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { saveMetaBoxes } from '../metaboxes';

jest.mock('@wordpress/api-fetch');

describe('Meta Boxes API Callbacks', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    apiFetch.mockReturnValue(Promise.resolve({}));
  });

  describe('saveMetaBoxes', () => {
    it('sends the correct form data', () => {
      const story = {
        author: {
          id: 123,
          name: 'John Doe',
        },
      };

      const formData = new window.FormData();
      const apiUrl = 'wp-admin/post.php?action=edit&meta-box-loader=1';

      saveMetaBoxes(story, formData, apiUrl);

      expect(apiFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          body: formData,
        })
      );
      expect(formData.getAll('post_author')).toStrictEqual(
        expect.arrayContaining(['123'])
      );
    });
  });
});
