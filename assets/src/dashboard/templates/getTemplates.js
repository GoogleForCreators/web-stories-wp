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
import { memoize } from '../utils';
import beauty from './raw/beauty.json';
import cooking from './raw/cooking.json';
import diy from './raw/diy.json';
import entertainment from './raw/entertainment.json';
import fashion from './raw/fashion.json';
import fitness from './raw/fitness.json';
import travel from './raw/travel.json';
import wellbeing from './raw/wellbeing.json';

export function getImageFile(url) {
  const file = (url || '').split('/').slice(-1).join('');
  /** removes `-x` in some_file-x.jpg */
  return file.replace(/-\d+(?=.\w{3,4}$)/g, '');
}

export function loadTemplate(title, data, imageBaseUrl) {
  return {
    ...data,
    pages: (data.pages || []).map((page) => ({
      ...page,
      elements: page.elements?.map((elem) => {
        if (elem.resource && elem.resource.sizes) {
          elem.resource.sizes = [];
        }
        if (elem.resource && elem.resource.src) {
          elem.resource.src = `${imageBaseUrl}/images/templates/${title}/${getImageFile(
            elem.resource.src
          )}`;
        }
        return elem;
      }),
    })),
  };
}

export function loadTemplates(imageBaseUrl) {
  return Object.entries({
    beauty,
    cooking,
    diy,
    entertainment,
    fashion,
    fitness,
    travel,
    wellbeing,
  }).reduce(
    (accum, [title, data]) => ({
      ...accum,
      [title]: loadTemplate(title, data, imageBaseUrl),
    }),
    {}
  );
}

export default memoize(loadTemplates);
