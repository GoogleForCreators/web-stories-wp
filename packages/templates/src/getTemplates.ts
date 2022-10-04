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
import { getTimeTracker } from '@googleforcreators/tracking';
import { DATA_VERSION, migrate } from '@googleforcreators/migration';

/**
 * Internal dependencies
 */
import { TEMPLATE_NAMES } from './constants';
import type { RawTemplate, Template } from './types';

type Data = {
  default: RawTemplate;
};

async function loadTemplate(
  title: string,
  imageBaseUrl: string
): Promise<Template> {
  const data: Data = (await import(
    /* webpackChunkName: "chunk-web-stories-template-[index]" */ `./raw/${title}/index.ts`
  )) as Data;

  const template = {
    ...data.default,
    pages: (data.default.pages || []).map((page) => ({
      ...page,
      elements: page.elements?.map((elem) => {
        if ('resource' in elem && elem.resource) {
          if ('sizes' in elem.resource.sizes && elem.resource.sizes) {
            elem.resource.sizes = {};
          }
          if (elem.resource.src) {
            // imageBaseUrl (cdnURL) will always have a trailing slash,
            // so make sure to avoid double slashes when replacing.
            elem.resource.src = elem.resource.src.replace(
              '__WEB_STORIES_TEMPLATE_BASE_URL__/',
              imageBaseUrl
            );
          }

          if ('poster' in elem.resource && elem.resource.poster) {
            // imageBaseUrl (cdnURL) will always have a trailing slash,
            // so make sure to avoid double slashes when replacing.
            elem.resource.poster = elem.resource.poster.replace(
              '__WEB_STORIES_TEMPLATE_BASE_URL__/',
              imageBaseUrl
            );
          }
        }
        return elem;
      }),
    })),

    postersByPage: data.default.pages.map((_, i) => {
      const srcPath = `${imageBaseUrl}images/templates/${
        data.default.slug
      }/posters/${i + 1}`;
      return {
        webp: `${srcPath}.webp`,
        png: `${srcPath}.png`,
        type: data.default.pages[i].pageTemplateType,
      };
    }),
  };

  return {
    ...(migrate(template, template.version) as unknown as Template),
    version: DATA_VERSION as number,
  } as Template;
}

async function getTemplates(imageBaseUrl: string) {
  const trackTiming = getTimeTracker('load_templates');

  const templates = await Promise.all(
    TEMPLATE_NAMES.map((title) => {
      return loadTemplate(title, imageBaseUrl);
    })
  );

  trackTiming();

  return templates;
}

export default getTemplates;
