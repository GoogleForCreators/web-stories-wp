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
            type: expect.toBeOneOf([
              null,
              'cover',
              'editorial',
              'list',
              'quote',
              'section',
              'table',
              'steps',
            ]),
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

  it('should have keys for color, label, and family for each template color', async () => {
    const templates = await getTemplates('example.com/');

    templates.forEach((template) => {
      template.colors.forEach((color) => {
        expect(color).toStrictEqual(
          expect.objectContaining({
            label: expect.toBeString(),
            color: expect.stringContaining('#'),
            family: expect.toBeString(),
          })
        );
      });
    });
  });

  it('should only list valid elements as animation targets', async () => {
    const templates = await getTemplates('example.com/');
    for (const template of templates) {
      for (const { id, elements, animations = [] } of template.pages) {
        const elementIds = elements.map((e) => e.id);
        for (const animation of animations) {
          try {
            expect(elementIds).toIncludeAllMembers(animation.targets);
          } catch {
            throw new Error(
              `Animation target failure in: '${template.slug}', page ${id}, animation ${animation.id}`
            );
          }
        }
      }
    }
  });

  it('should list elements in the same group sequentially without gaps', async () => {
    const templates = await getTemplates('example.com/');
    let i = 0;
    for (const template of templates) {
      i++;
      for (const { id, elements, groups = {} } of template.pages) {
        const existingGroupIds = Object.keys(groups);

        const seenGroupIds = [];

        let lastGroupId = null;
        const elementGroups = elements.map(({ groupId }) => groupId);
        for (const groupId of elementGroups) {
          try {
            expect(
              // eslint-disable-next-line jest/no-conditional-in-test
              lastGroupId &&
                groupId &&
                lastGroupId !== groupId &&
                seenGroupIds.includes(groupId)
            ).toBeFalsy();
          } catch {
            throw new Error(
              `Group order failure in: '${template.slug} (${i}/${
                templates.length
              })', page ${id}, group ${groupId}.\nGroups are:\n* ${elementGroups
                // eslint-disable-next-line jest/no-conditional-in-test
                .map((g) => (g === undefined ? 'none' : g))
                .join('\n* ')}`
            );
          }

          // eslint-disable-next-line jest/no-conditional-in-test
          if (groupId) {
            seenGroupIds.push(groupId);

            // eslint-disable-next-line jest/no-conditional-expect
            expect(existingGroupIds).toContain(groupId);
          }

          lastGroupId = groupId;
        }
      }
    }
  });
});
