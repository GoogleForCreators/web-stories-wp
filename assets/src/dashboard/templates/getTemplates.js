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
 * Internal dependencies
 */
import { DATA_VERSION, migrate } from '../../edit-story/migration/migrate';

export async function loadTemplate(title, imageBaseUrl) {
  const data = await import(
    /* webpackChunkName: "chunk-web-stories-template-[index]" */ `./raw/${title}.json`
  );

  const template = {
    ...data,
    pages: (data.pages || []).map((page) => ({
      ...page,
      elements: page.elements?.map((elem) => {
        if (elem?.resource?.sizes) {
          elem.resource.sizes = [];
        }
        if (elem?.resource?.src) {
          elem.resource.src = elem.resource.src.replace(
            'https://replaceme.com/',
            imageBaseUrl
          );
        }
        return elem;
      }),
    })),
  };

  return {
    ...migrate(template, template.version),
    version: DATA_VERSION,
  };
}

export default async function loadTemplates(imageBaseUrl) {
  const templates = [
    'beauty',
    'cooking',
    'diy',
    'entertainment',
    'fashion',
    'fitness',
    'travel',
    'wellbeing',
  ];

  const result = await Promise.all(
    templates.map(async (title) => {
      return [title, await loadTemplate(title, imageBaseUrl)];
    })
  );

  return Object.fromEntries(result);
}
