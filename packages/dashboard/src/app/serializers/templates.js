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
import { toUTCDate, toDate, getSettings } from '@web-stories-wp/date';
/**
 * Internal dependencies
 */
import { APP_ROUTES } from '../../constants';

export default function reshapeTemplateObject(
  originalTemplateData,
  cdnURL,
  isLocal = false
) {
  const { id, slug, pages, modified, creationDate } = originalTemplateData;
  if (!id || !slug) {
    return null;
  }

  const postersByPage = pages.reduce((memo, _, i) => {
    const srcPath = `${cdnURL}images/templates/${slug}/posters/${i + 1}`;
    return {
      ...memo,
      [i]: {
        webp: `${srcPath}.webp`,
        png: `${srcPath}.png`,
      },
    };
  }, {});

  return {
    ...originalTemplateData,
    id,
    slug,
    postersByPage,
    centerTargetAction: `${APP_ROUTES.TEMPLATE_DETAIL}?id=${id}&isLocal=${isLocal}`,
    creationDate: toDate(creationDate, getSettings()),
    status: 'template',
    modified: toUTCDate(modified),
  };
}
