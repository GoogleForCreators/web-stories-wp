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
import {
  objectFromEntries,
  mapObjectVals,
  mapObjectKeys,
  mergeNestedDictionaries,
  dictionaryOnKey,
  cacheFromEmbeddedTerms,
} from '..';

describe('objectFromEntries', () => {
  it('returns an empty object if no entries provided', () => {
    expect(objectFromEntries([])).toStrictEqual({});
  });

  it('creates an object from entries', () => {
    expect(
      objectFromEntries([
        ['key1', 1],
        ['key2', { subkey: 'someValue' }],
        ['key3', 'a'],
        ['key4', true],
      ])
    ).toStrictEqual({
      key1: 1,
      key2: { subkey: 'someValue' },
      key3: 'a',
      key4: true,
    });
  });
});

describe('mapObjectValues', () => {
  it('performs an operation on all object values', () => {
    expect(
      mapObjectVals(
        {
          a: 0,
          b: 1,
          c: 2,
        },
        (val) => val + 1
      )
    ).toStrictEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });
});

describe('mapObjectKeys', () => {
  it('performs an operation on all object values', () => {
    expect(
      mapObjectKeys(
        {
          a: 0,
          b: 1,
          c: 2,
        },
        (key) => `prefixed-${key}`
      )
    ).toStrictEqual({
      'prefixed-a': 0,
      'prefixed-b': 1,
      'prefixed-c': 2,
    });
  });
});

describe('mergeNestedDictionaries', () => {
  it('merges nested dictionaries', () => {
    expect(
      mergeNestedDictionaries(
        {
          a: { a: 'someString' },
        },
        {
          a: { b: 1 },
          b: { a: 2 },
        }
      )
    ).toStrictEqual({
      a: { a: 'someString', b: 1 },
      b: { a: 2 },
    });
  });
});

describe('dictionaryOnKey', () => {
  it('merges nested dictionaries', () => {
    expect(
      mergeNestedDictionaries(
        dictionaryOnKey(
          [
            { id: 'id1', a: 'anotherProp' },
            { id: 'id2', a: 'something else' },
          ],
          'id'
        )
      )
    ).toStrictEqual({
      id1: { id: 'id1', a: 'anotherProp' },
      id2: { id: 'id2', a: 'something else' },
    });
  });
});

describe('cacheFromEmbeddedTerms', () => {
  it('creates a nested dictionary from embedded terms', () => {
    expect(
      cacheFromEmbeddedTerms([
        [
          { taxonomy: 'taxonomyA', slug: 'slugA', id: 1 },
          { taxonomy: 'taxonomyA', slug: 'slugB', id: 2 },
          { taxonomy: 'taxonomyA', slug: 'slugC', id: 3 },
        ],
        [
          { taxonomy: 'taxonomyB', slug: 'slugA', id: 1 },
          { taxonomy: 'taxonomyB', slug: 'slugB', id: 2 },
        ],
      ])
    ).toStrictEqual({
      taxonomyA: {
        slugA: { taxonomy: 'taxonomyA', slug: 'slugA', id: 1 },
        slugB: { taxonomy: 'taxonomyA', slug: 'slugB', id: 2 },
        slugC: { taxonomy: 'taxonomyA', slug: 'slugC', id: 3 },
      },
      taxonomyB: {
        slugA: { taxonomy: 'taxonomyB', slug: 'slugA', id: 1 },
        slugB: { taxonomy: 'taxonomyB', slug: 'slugB', id: 2 },
      },
    });
  });
});
