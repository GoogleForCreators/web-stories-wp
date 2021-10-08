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
import { toDate } from '@web-stories-wp/date';

/**
 * Internal dependencies
 */
import { APP_ROUTES } from '../../../constants';
import reshapeTemplateObject from '../templates';

describe('reshapeTemplateObject', () => {
  it('should return the template object', () => {
    const responseObj = {
      id: 1,
      slug: 'template-1-slug',
      pages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
      creationDate: '2020-03-26T20:57:24',
      modified: '2020-03-26T20:57:24',
      status: 'template',
    };

    const reshapedObj = reshapeTemplateObject(responseObj, false);

    expect(reshapedObj).toMatchObject({
      id: 1,
      slug: 'template-1-slug',
      centerTargetAction: `${APP_ROUTES.TEMPLATE_DETAIL}?id=1&isLocal=false`,
      creationDate: toDate('2020-03-26T20:57:24.000Z'),
      status: 'template',
      modified: toDate('2020-03-26T20:57:24.000Z'),
    });
  });

  it('should not return the template object', () => {
    const reshapedObj = reshapeTemplateObject(
      {
        pages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        creationDate: '2020-03-26T20:57:24',
      },
      true
    );

    expect(reshapedObj).toBeNull();
  });
});
