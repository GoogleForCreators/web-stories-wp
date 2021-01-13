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
import getAllTemplates from '../../../dashboard/templates';

const replacePageImagesWithPlaceholders = (page) => {
  return {
    ...page,
    elements: page.elements.map((element) => {
      if (element.type !== 'image') {
        return element;
      }

      const title = __('Placeholder', 'web-stories');
      return {
        ...element,
        focalX: 50,
        focalY: 50,
        backgroundColor: {
          color: { r: 219, g: 223, b: 226 },
        },
        resource: {
          type: 'image',
          mimeType: 'image/png',
          // TODO: replace this with `${cdnURL}/path/to/image.jpg`
          src: 'http://www.squidsuds.com/i/gwsplaceholder.png',
          width: 412,
          height: 732,
          posterId: 0,
          id: 0,
          title,
          alt: title,
          local: false,
          sizes: [],
        },
      };
    }),
  };
};

export default async function getAllPageLayouts({ cdnURL }) {
  const templates = await getAllTemplates({ cdnURL });
  return templates.map((template) => ({
    ...template,
    pages: template.pages.map((page) =>
      replacePageImagesWithPlaceholders(page, { cdnURL })
    ),
  }));
}
