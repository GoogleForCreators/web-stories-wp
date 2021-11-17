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
import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
import stickers from '@web-stories-wp/stickers';
import { isValid } from '@web-stories-wp/date';

describe('raw template files', () => {
  const templates = readdirSync(
    resolve(process.cwd(), 'packages/templates/src/raw')
  );

  // @see https://github.com/google/web-stories-wp/issues/2473#issuecomment-651509687
  it.each(templates)(
    '%s template should not contain invisible characters',
    (template) => {
      const templateContent = readFileSync(
        resolve(
          process.cwd(),
          `packages/templates/src/raw/${template}/template.json`
        ),
        'utf8'
      );

      expect(templateContent).not.toContain('\u2028');
    }
  );

  // @see https://github.com/google/web-stories-wp/pull/4516
  // @see https://github.com/google/web-stories-wp/pull/6159
  it.each(templates)(
    '%s template should contain replaceable URLs',
    async (template) => {
      const { default: templateData } = await import(
        /* webpackChunkName: "chunk-web-stories-template-[index]" */ `../raw/${template}`
      );

      for (const { elements } of templateData.pages) {
        for (const element of elements) {
          if (!element?.resource?.src) {
            continue;
          }

          expect(element?.resource?.src).toStartWith(
            `__WEB_STORIES_TEMPLATE_BASE_URL__/images/templates/${template}`
          );
        }
      }
    }
  );

  it.each(templates)(
    '%s template should contain replaceable poster URLs',
    async (template) => {
      const { default: templateData } = await import(
        /* webpackChunkName: "chunk-web-stories-template-[index]" */ `../raw/${template}`
      );

      for (const { elements } of templateData.pages) {
        for (const element of elements) {
          if (element?.type !== 'video' || !element?.resource?.poster) {
            continue;
          }

          expect(element?.resource?.poster).toStartWith(
            `__WEB_STORIES_TEMPLATE_BASE_URL__/images/templates/${template}`
          );
        }
      }
    }
  );

  // @see https://github.com/google/web-stories-wp/pull/7944#pullrequestreview-686071526
  it.each(templates)(
    '%s template images and video ids should default to 0',
    async (template) => {
      const { default: templateData } = await import(
        /* webpackChunkName: "chunk-web-stories-template-[index]" */ `../raw/${template}`
      );

      const typesToCheck = ['image', 'video'];

      for (const { elements } of templateData.pages) {
        for (const element of elements) {
          if (!typesToCheck.includes(element?.type)) {
            continue;
          }

          expect(element?.resource?.id).toBe(0);

          if ('video' !== element?.type) {
            continue;
          }

          expect(element?.resource?.posterId).toBe(0);
        }
      }
    }
  );

  // @see https://github.com/google/web-stories-wp/pull/5889
  it.each(templates)(
    '%s template should contain pageTemplateType',
    async (template) => {
      const { default: templateData } = await import(
        /* webpackChunkName: "chunk-web-stories-template-[index]" */ `../raw/${template}`
      );

      for (const page of templateData.pages) {
        expect(page).toStrictEqual(
          expect.objectContaining({
            pageTemplateType: expect.any(String),
          })
        );
      }
    }
  );

  // @see https://github.com/google/web-stories-wp/issues/7227
  it.each(templates)(
    '%s template should not contain extraneous properties',
    async (template) => {
      const { default: templateData } = await import(
        /* webpackChunkName: "chunk-web-stories-template-[index]" */ `../raw/${template}`
      );

      expect(templateData.current).toBeNull();
      expect(templateData.selection).toStrictEqual([]);
      expect(templateData.story.globalStoryStyles).toBeUndefined();
    }
  );

  it.each(templates)(
    '%s template should only contain videos marked as optimized',
    async (template) => {
      const { default: templateData } = await import(
        /* webpackChunkName: "chunk-web-stories-template-[index]" */ `../raw/${template}`
      );

      for (const { elements } of templateData.pages) {
        for (const element of elements) {
          if (element?.type !== 'video' || !element?.resource?.src) {
            continue;
          }

          expect(element?.resource?.isOptimized).toBeTrue();
        }
      }
    }
  );

  it.each(templates)(
    '%s template should only contain videos have isMuted attribute',
    async (template) => {
      const { default: templateData } = await import(
        /* webpackChunkName: "chunk-web-stories-template-[index]" */ `../raw/${template}`
      );

      for (const { elements } of templateData.pages) {
        for (const element of elements) {
          if (element?.type !== 'video' || !element?.resource?.src) {
            continue;
          }

          expect(element?.resource?.isMuted).toBeDefined();
          expect(element?.resource?.isMuted).toBeBoolean();
        }
      }
    }
  );

  it.each(templates)(
    '%s template should contain only valid stickers',
    async (template) => {
      const { default: templateData } = await import(
        /* webpackChunkName: "chunk-web-stories-template-[index]" */ `../raw/${template}`
      );

      for (const { elements } of templateData.pages) {
        for (const element of elements) {
          if (element?.type !== 'sticker' || !element?.sticker?.type) {
            continue;
          }

          expect(stickers).toStrictEqual(
            expect.objectContaining({
              [element?.sticker?.type]: expect.any(Object),
            })
          );
        }
      }
    }
  );

  // @see https://github.com/google/web-stories-wp/pull/8692
  it.each(templates)(
    '%s template should contain a slug for screenshot referencing',
    async (template) => {
      const { default: templateData } = await import(
        /* webpackChunkName: "chunk-web-stories-template-[index]" */ `../raw/${template}`
      );
      expect(templateData.slug).toBeString();
    }
  );

  it.each(templates)(
    '%s template should contain a valid createdDate',
    async (template) => {
      const { default: metaData } = await import(
        /* webpackChunkName: "chunk-web-stories-template-[index]-metaData" */ `../raw/${template}/metaData`
      );
      expect(isValid(new Date(metaData.creationDate))).toBe(true);

      const { default: templateData } = await import(
        /* webpackChunkName: "chunk-web-stories-template-[index]" */ `../raw/${template}`
      );
      expect(isValid(new Date(templateData.creationDate))).toBe(true);
    }
  );
});
