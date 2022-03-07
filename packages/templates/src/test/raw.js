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
import stickers from '@googleforcreators/stickers';
import { isValid } from '@googleforcreators/date';

describe('raw template files', () => {
  const templates = readdirSync(
    resolve(process.cwd(), 'packages/templates/src/raw')
  );

  describe.each(templates)('%s template', (template) => {
    let templateData;

    beforeAll(async () => {
      const { default: _templateData } = await import(
        /* webpackChunkName: "chunk-web-stories-template-[index]" */ `../raw/${template}`
      );

      templateData = _templateData;
    });

    // @see https://github.com/googleforcreators/web-stories-wp/issues/2473#issuecomment-651509687
    it('should not contain invisible characters', () => {
      const templateContent = readFileSync(
        resolve(
          process.cwd(),
          `packages/templates/src/raw/${template}/template.json`
        ),
        'utf8'
      );

      expect(templateContent).not.toContain('\u2028');
    });

    // @see https://github.com/googleforcreators/web-stories-wp/pull/4516
    // @see https://github.com/googleforcreators/web-stories-wp/pull/6159
    it('should contain replaceable URLs', () => {
      for (const { elements } of templateData.pages) {
        for (const element of elements) {
          // eslint-disable-next-line jest/no-if
          if (!element?.resource?.src) {
            continue;
          }

          expect(element?.resource?.src).toStartWith(
            `__WEB_STORIES_TEMPLATE_BASE_URL__/images/templates/${template}`
          );
        }
      }
    });

    it('should contain replaceable poster URLs', () => {
      for (const { elements } of templateData.pages) {
        for (const element of elements) {
          // eslint-disable-next-line jest/no-if
          if (element?.type !== 'video') {
            continue;
          }

          expect(element?.resource?.poster).toStartWith(
            `__WEB_STORIES_TEMPLATE_BASE_URL__/images/templates/${template}`
          );
        }
      }
    });

    // @see https://github.com/googleforcreators/web-stories-wp/pull/7944#pullrequestreview-686071526
    it('images and video ids should default to 0', () => {
      for (const { elements } of templateData.pages) {
        for (const element of elements) {
          // eslint-disable-next-line jest/no-if
          if (!['image', 'video', 'gif'].includes(element?.type)) {
            continue;
          }

          expect(element?.resource?.id).toBe(0);

          if ('image' === element?.type) {
            continue;
          }

          expect(element?.resource?.posterId).toBe(0);
        }
      }
    });

    // @see https://github.com/googleforcreators/web-stories-wp/pull/5889
    it('should contain pageTemplateType', () => {
      for (const page of templateData.pages) {
        expect(page).toStrictEqual(
          expect.objectContaining({
            pageTemplateType: expect.any(String),
          })
        );
      }
    });

    // @see https://github.com/googleforcreators/web-stories-wp/issues/7227
    it('should not contain extraneous properties', () => {
      expect(templateData.current).toBeNull();
      expect(templateData.selection).toStrictEqual([]);
      expect(templateData.story.globalStoryStyles).toBeUndefined();
    });

    it('should only contain videos marked as optimized', () => {
      for (const { elements } of templateData.pages) {
        for (const element of elements) {
          // eslint-disable-next-line jest/no-if
          if (element?.type !== 'video' || !element?.resource?.src) {
            continue;
          }

          expect(element?.resource?.isOptimized).toBeTrue();
        }
      }
    });

    it('should only contain videos have isMuted attribute', () => {
      for (const { elements } of templateData.pages) {
        for (const element of elements) {
          // eslint-disable-next-line jest/no-if
          if (element?.type !== 'video' || !element?.resource?.src) {
            continue;
          }

          expect(element?.resource?.isMuted).toBeDefined();
          expect(element?.resource?.isMuted).toBeBoolean();
        }
      }
    });

    it('images and videos should have baseColor', () => {
      for (const { elements } of templateData.pages) {
        for (const element of elements) {
          // eslint-disable-next-line jest/no-if
          if (!['image', 'video', 'gif'].includes(element?.type)) {
            continue;
          }

          expect(element?.resource?.baseColor).toStrictEqual(
            expect.stringMatching(/^#(?:[0-9a-fA-F]{3}){1,2}$/)
          );
        }
      }
    });

    it('should contain only valid stickers', () => {
      for (const { elements } of templateData.pages) {
        for (const element of elements) {
          // eslint-disable-next-line jest/no-if
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
    });

    // @see https://github.com/googleforcreators/web-stories-wp/pull/8692
    it('should contain a slug for screenshot referencing', () => {
      expect(templateData.slug).toBeString();
    });

    it('should contain a valid createdDate', async () => {
      const { default: metaData } = await import(
        /* webpackChunkName: "chunk-web-stories-template-[index]-metaData" */ `../raw/${template}/metaData`
      );

      expect(isValid(new Date(metaData.creationDate))).toBe(true);
      expect(isValid(new Date(templateData.creationDate))).toBe(true);
    });

    // eslint-disable-next-line jest/no-disabled-tests -- TODO(#10829): Replace Andada
    it.skip('should contain fonts from global fonts list', () => {
      const fonts = JSON.parse(
        readFileSync(
          resolve(process.cwd(), 'packages/fonts/src/fonts.json'),
          'utf8'
        )
      );
      const fontNames = fonts.map(({ family }) => family);

      for (const { elements } of templateData.pages) {
        for (const element of elements) {
          if (!['text'].includes(element?.type)) {
            continue;
          }

          expect(fontNames).toContain(element.font.family);
        }
      }
    });
  });
});
