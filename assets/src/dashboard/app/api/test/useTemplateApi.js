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
 * Internal dependencies
 */
import { toUTCDate } from '../../../../date';
import { reshapeTemplateObject } from '../useTemplateApi';

describe('reshapeTemplateObject', () => {
  const templateData = {
    id: 1,
    title: 'Beauty',
    createdBy: 'Google',
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

  it('should reshape object to match snapshot', () => {
    const reshapedObject = reshapeTemplateObject(true)(templateData);
    expect(reshapedObject).toMatchSnapshot();
  });

  it('should reshape template object with a date object', () => {
    const reshapedObject = reshapeTemplateObject(true)(templateData);
    expect(reshapedObject.modified).toMatchObject(
      toUTCDate('2020-04-21T07:00:00.000Z')
    );
  });

  it('should pass through tags and colors into reshaped object', () => {
    const reshapedObject = reshapeTemplateObject(true)(templateData);

    expect(reshapedObject.tags).toMatchObject(['Health', 'Bold', 'Joy']);
    expect(reshapedObject.colors).toMatchObject([
      { label: 'Pink', color: '#f3d9e1' },
      { label: 'Green', color: '#d8ddcc' },
      { label: 'Black', color: '#28292b' },
    ]);
  });

  it('should apply isLocal to the reshaped object', () => {
    const localReshapedObject = reshapeTemplateObject(true)(templateData);
    expect(localReshapedObject.isLocal).toBe(true);

    const notlocalReshapedObject = reshapeTemplateObject(false)(templateData);
    expect(notlocalReshapedObject.isLocal).toBe(false);
  });
});
