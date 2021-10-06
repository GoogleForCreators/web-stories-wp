/*
 * Copyright 2021 Google LLC
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
import getTemplates from '../getTemplates';

describe('getTemplate', () => {
  it('should return png and webp urls for each page', async () => {
    const templates = await getTemplates('example.com/');

    templates.forEach((template) => {
      template.postersByPage.forEach((page, i) => {
        expect(page).toStrictEqual(
          expect.objectContaining({
            png: expect.stringContaining(
              `example.com/images/templates/${template.slug}/posters/${
                i + 1
              }.png`
            ),
            webp: expect.stringContaining(
              `example.com/images/templates/${template.slug}/posters/${
                i + 1
              }.webp`
            ),
            type: expect.any(String),
          })
        );
      });
    });
  });

  it('should match postersByPage.type with pages.pageTemplateType', async () => {
    const templates = await getTemplates('example.com/');

    templates.forEach((template) => {
      template.postersByPage.forEach((page, i) => {
        expect(page.type).toStrictEqual(template.pages[i].pageTemplateType);
      });
    });
  });

  it('should replace __WEB_STORIES_TEMPLATE_BASE_URL__/ with imageUrl for each page', async () => {
    const templates = await getTemplates('example.com/');

    templates.forEach((template) => {
      template.pages.forEach((page) => {
        page.elements.forEach((element) => {
          expect(element.resource?.src).toStrictEqual(
            expect.not.stringContaining('__WEB_STORIES_TEMPLATE_BASE_URL__/')
          );
          expect(element.resource?.poster).toStrictEqual(
            expect.not.stringContaining('__WEB_STORIES_TEMPLATE_BASE_URL__/')
          );
        });
      });
    });
  });
});
