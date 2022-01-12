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
import deleteNestedKeys from '../deleteNestedKeys';

describe('deleteNestedKeys', () => {
  it('should correctly delete nested keys', () => {
    const object = {
      foo: {
        bar: {
          a: 'Hello',
          b: 'World',
        },
      },
    };
    deleteNestedKeys(['foo.bar.a'])(object);
    expect(object).toStrictEqual({
      foo: {
        bar: {
          b: 'World',
        },
      },
    });
  });

  it('should correctly delete not nested keys', () => {
    const object = {
      bar: 'Hello World',
      foo: {
        bar: {
          a: 'Hello',
          b: 'World',
        },
      },
    };
    deleteNestedKeys(['foo'])(object);
    expect(object).toStrictEqual({
      bar: 'Hello World',
    });
  });

  it('should not do anything in case of non-existent key', () => {
    const object = {
      bar: 'Hello World',
      foo: {
        bar: {
          a: 'Hello',
          b: 'World',
        },
      },
    };
    deleteNestedKeys(['foo.bar.c'])(object);
    expect(object).toStrictEqual({
      bar: 'Hello World',
      foo: {
        bar: {
          a: 'Hello',
          b: 'World',
        },
      },
    });
  });

  it('should not do anything in case of incorrect paths', () => {
    const object = {
      bar: 'Hello World',
      foo: {
        bar: {
          a: 'Hello',
          b: 'World',
          c: '!',
        },
      },
    };
    deleteNestedKeys(13)(object);
    expect(object).toStrictEqual({
      bar: 'Hello World',
      foo: {
        bar: {
          a: 'Hello',
          b: 'World',
          c: '!',
        },
      },
    });
  });

  it('should delete properties with `null` and `undefined` as values', () => {
    const object = {
      bar: 'Hello World',
      foo: {
        bar: {
          a: null,
          b: undefined,
          c: 'Hello',
        },
      },
    };
    deleteNestedKeys(['foo.bar.a', 'foo.bar.b'])(object);
    expect(object).toStrictEqual({
      bar: 'Hello World',
      foo: {
        bar: {
          c: 'Hello',
        },
      },
    });
  });

  it('should delete multiple properties', () => {
    const object = {
      bar: 'Hello World',
      foo: {
        bar: {
          a: 'Hello',
          b: 'World',
          c: '!',
        },
      },
    };
    deleteNestedKeys(['bar', 'foo.bar.c'])(object);
    expect(object).toStrictEqual({
      foo: {
        bar: {
          a: 'Hello',
          b: 'World',
        },
      },
    });
  });
});
