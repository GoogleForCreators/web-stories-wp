/*
 * Copyright 2022 Google LLC
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
import getTextElementTagNames from '../getTextElementTagNames';

const ELEMENT_H1 = {
  id: '111',
  content: 'Title 1',
  fontSize: 36,
  fontWeight: 400,
  type: 'text',
  x: 10,
  y: 10,
};

const ELEMENT_H2 = {
  id: '222',
  content: 'Title 2',
  fontSize: 27,
  fontWeight: 400,
  type: 'text',
  x: 10,
  y: 10,
};

const ELEMENT_H3 = {
  id: '333',
  content: 'Title 3',
  fontSize: 21,
  fontWeight: 400,
  type: 'text',
  x: 10,
  y: 10,
};

const PARAGRAPH = {
  id: '444',
  content: 'Paragraph',
  fontSize: 17,
  fontWeight: 400,
  type: 'text',
  x: 10,
  y: 10,
};

describe('getTextElementTagNames', () => {
  it('should return tag name map for elements', () => {
    const elements = [ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, PARAGRAPH];

    expect(getTextElementTagNames(elements)).toStrictEqual(
      new Map([
        ['111', 'h1'],
        ['222', 'h2'],
        ['333', 'h3'],
        ['444', 'p'],
      ])
    );
  });

  it('should have only one h1 element', () => {
    const elements = [
      ELEMENT_H1,
      {
        ...ELEMENT_H1,
        id: '555',
      },
      ELEMENT_H2,
      ELEMENT_H3,
      PARAGRAPH,
    ];

    expect(getTextElementTagNames(elements)).toStrictEqual(
      new Map([
        ['111', 'h1'],
        ['555', 'h2'],
        ['222', 'h2'],
        ['333', 'h3'],
        ['444', 'p'],
      ])
    );
  });

  it('should prefer possible h1 elements higher up on the page', () => {
    const elements = [
      ELEMENT_H1,
      {
        ...ELEMENT_H1,
        id: '555',
        x: 0,
        y: 0,
      },
      ELEMENT_H2,
      ELEMENT_H3,
      PARAGRAPH,
    ];

    expect(getTextElementTagNames(elements)).toStrictEqual(
      new Map([
        ['111', 'h2'],
        ['555', 'h1'],
        ['222', 'h2'],
        ['333', 'h3'],
        ['444', 'p'],
      ])
    );
  });

  it('should ignore elements with short content', () => {
    const elements = [
      ELEMENT_H1,
      {
        ...ELEMENT_H1,
        id: '555',
        content: '#1',
      },
      ELEMENT_H2,
      ELEMENT_H3,
      PARAGRAPH,
    ];

    expect(getTextElementTagNames(elements)).toStrictEqual(
      new Map([
        ['111', 'h1'],
        ['555', 'p'],
        ['222', 'h2'],
        ['333', 'h3'],
        ['444', 'p'],
      ])
    );
  });
});
