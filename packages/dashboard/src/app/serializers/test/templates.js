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
import { getOptions, toDate, toUTCDate } from '@web-stories-wp/date';

/**
 * Internal dependencies
 */
import { APP_ROUTES } from '../../../constants';
import reshapeTemplateObject from '../templates';

describe('reshapeTemplateObject', () => {
  const templateData = {
    id: 1,
    slug: 'beauty',
    title: 'Beauty',
    createdBy: 'Google',
    creationDate: '2020-03-01T07:00:00.000Z',
    modified: '2020-04-21T07:00:00.000Z',
    tags: ['Health', 'Bold', 'Joy'],
    colors: [
      { label: 'Pink', color: '#f3d9e1' },
      { label: 'Green', color: '#d8ddcc' },
      { label: 'Black', color: '#28292b' },
    ],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    pages: [{ id: 0, elements: [] }],
    version: 17,
  };

  it('should return object', () => {
    const responseObj = {
      id: 1,
      slug: 'template-1-slug',
      pages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
      creationDate: '2020-03-26T20:57:24',
      modified: '2020-03-26T20:57:24',
    };

    const reshapedObj = reshapeTemplateObject(responseObj, 'example.com/');

    expect(reshapedObj).toMatchObject({
      id: 1,
      slug: 'template-1-slug',
      postersByPage: {
        0: {
          webp: 'example.com/images/templates/template-1-slug/posters/1.webp',
          png: 'example.com/images/templates/template-1-slug/posters/1.png',
        },
        1: {
          webp: 'example.com/images/templates/template-1-slug/posters/2.webp',
          png: 'example.com/images/templates/template-1-slug/posters/2.png',
        },
        2: {
          webp: 'example.com/images/templates/template-1-slug/posters/3.webp',
          png: 'example.com/images/templates/template-1-slug/posters/3.png',
        },
      },
      centerTargetAction: `${APP_ROUTES.TEMPLATE_DETAIL}?id=1&isLocal=false`,
      creationDate: toDate('2020-03-26T20:57:24.000Z'),
      status: 'template',
      modified: toDate('2020-03-26T20:57:24.000Z'),
    });
  });

  it('should not return an object', () => {
    const reshapedObj = reshapeTemplateObject(
      {
        pages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        creationDate: '2020-03-26T20:57:24',
      },
      'example.com/'
    );

    expect(reshapedObj).toBeNull();
  });

  it('should reshape object to match snapshot', () => {
    const reshapedObject = reshapeTemplateObject(templateData, 'example.com/');
    expect(reshapedObject).toMatchSnapshot();
  });

  it('should reshape template object with a date object', () => {
    const reshapedObject = reshapeTemplateObject(templateData, 'example.com/');
    expect(reshapedObject.modified).toMatchObject(
      toUTCDate('2020-04-21T07:00:00.000Z')
    );

    expect(reshapedObject.creationDate).toMatchObject(
      toDate('2020-03-01T07:00:00.000Z', getOptions())
    );
  });

  it('should pass through tags and colors into reshaped object', () => {
    const reshapedObject = reshapeTemplateObject(templateData, 'example.com/');

    expect(reshapedObject.tags).toMatchObject(['Health', 'Bold', 'Joy']);
    expect(reshapedObject.colors).toMatchObject([
      { label: 'Pink', color: '#f3d9e1' },
      { label: 'Green', color: '#d8ddcc' },
      { label: 'Black', color: '#28292b' },
    ]);
  });

  it('should apply isLocal to the reshaped object', () => {
    const localReshapedObject = reshapeTemplateObject(
      templateData,
      'example.com/',
      true
    );
    expect(localReshapedObject.isLocal).toBe(true);

    const notlocalReshapedObject = reshapeTemplateObject(
      templateData,
      'example.com/'
    );
    expect(notlocalReshapedObject.isLocal).toBe(false);
  });
});
