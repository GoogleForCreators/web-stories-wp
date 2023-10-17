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
import { orderByKeys } from '..';

describe('orderByKeys', () => {
  it('reorders properties by keys', () => {
    const propertyOrder = ['a', 'c', 'b'];
    const input = {
      b: 0,
      a: '',
      c: false,
    };
    const result = orderByKeys(input, propertyOrder);

    expect(result).toStrictEqual(input);
    expect(Object.keys(result)).toStrictEqual(propertyOrder);
  });

  it('maintains object equality if keys include property outside of object', () => {
    const propertyOrder = ['a', 'b', 'c', 'd', 'e'];
    const input = {
      b: 0,
      a: '',
      c: false,
    };
    const result = orderByKeys(input, propertyOrder);

    expect(result).toStrictEqual(input);
  });

  it('maintains object equality if keys exclude property inside of object', () => {
    const propertyOrder = ['a'];
    const input = {
      b: 0,
      a: '',
      c: false,
    };
    const result = orderByKeys(input, propertyOrder);

    expect(result).toStrictEqual(input);
  });

  it('retains order of unspecified keys and orders them after specified keys', () => {
    const propertyOrder = ['a'];
    const input = {
      b: 0,
      a: '',
      c: false,
    };
    const result = orderByKeys(input, propertyOrder);

    expect(Object.keys(result)).toStrictEqual(['a', 'b', 'c']);
  });
});
