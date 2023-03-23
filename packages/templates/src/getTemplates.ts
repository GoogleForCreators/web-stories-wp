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
import type {
  MediaElement,
  Element,
  SequenceMediaElement,
} from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { TEMPLATE_NAMES } from './constants';
import type { RawTemplate, Template } from './types';
import { getTemplateMetaData } from './getMetaData';

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

  function isMediaElement(e: Element): e is MediaElement {
    return 'resource' in e;
  }

  function isSequenceMediaElement(e: MediaElement): e is SequenceMediaElement {
    return 'poster' in e.resource;
  }

  const template = {
    ...data.default,
    pages: (data.default.pages || []).map((page) => ({
      ...page,
      elements: page.elements?.map((elem) => {
        if (isMediaElement(elem) && elem.resource) {
          if ('sizes' in elem.resource && elem.resource.sizes) {
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

          if (isSequenceMediaElement(elem) && elem.resource.poster) {
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
    version: DATA_VERSION,
  } as Template;
}

async function getTemplates(imageBaseUrl: string, search: string) {
  const trackTiming = getTimeTracker('load_templates');
  let templateNamesToLoad = TEMPLATE_NAMES;

  if (search) {
    const lowercaseSearchTerm = search.toLowerCase();
    templateNamesToLoad = (await getTemplateMetaData()).reduce(
      (acc: string[], { title, vertical, slug, tags, colors }) => {
        const doesTitleMatch = title
          .toLowerCase()
          .includes(lowercaseSearchTerm);

        if (doesTitleMatch) {
          return [...acc, slug];
        }

        const doesVerticalMatch = vertical
          .toLowerCase()
          .includes(lowercaseSearchTerm);

        if (doesVerticalMatch) {
          return [...acc, slug];
        }

        let doesTagsMatch = false;
        tags.forEach((tag) => {
          if (tag.toLowerCase().includes(lowercaseSearchTerm)) {
            doesTagsMatch = true;
            return;
          }
        });

        if (doesTagsMatch) {
          return [...acc, slug];
        }

        let doesColorsMatch = false;
        colors.forEach((color) => {
          if (
            color.label.toLowerCase().includes(lowercaseSearchTerm) ||
            color.family.toLowerCase().includes(lowercaseSearchTerm)
          ) {
            doesColorsMatch = true;
            return;
          }
        });

        if (doesColorsMatch) {
          return [...acc, slug];
        }

        return acc;
      },
      []
    );
  }

  const templates = await Promise.all(
    templateNamesToLoad.map((title) => {
      return loadTemplate(title, imageBaseUrl);
    })
  );

  trackTiming();

  return templates;
}

export default getTemplates;
