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
import { groupTemplatesByTag } from '../../../../testUtils';
import { getRelatedTemplatesIds } from '../utils';

const templates = [
  { id: 1, tags: ['beauty', 'fries'] },
  { id: 2, tags: ['squirrels', 'bananas'] },
  { id: 3, tags: ['squirrels', 'fries'] },
  { id: 4, tags: ['sake', 'fine dining', 'not as fine dining'] },
];

const templatesByType = groupTemplatesByTag(templates);

describe('getRelatedTemplatesIds', () => {
  it.each`
    template        | result
    ${templates[0]} | ${[templates[2].id]}
    ${templates[1]} | ${[templates[2].id]}
    ${templates[2]} | ${[templates[1].id, templates[0].id]}
    ${templates[3]} | ${[]}
  `(
    'should return related templates for each template',
    ({ template, result }) => {
      expect(getRelatedTemplatesIds(template, templatesByType)).toStrictEqual(
        expect.arrayContaining(result)
      );
    }
  );
});
