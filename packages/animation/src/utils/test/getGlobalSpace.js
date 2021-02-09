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
import { getGlobalSpace, literal } from '../';

describe('literal', () => {
  it('interpolates the same as a template literal given an empty string', () => {
    expect(literal([''])).toStrictEqual(``);
  });

  it('interpolates the same as a template literal given some args', () => {
    const args = ['am', 'dog'];
    expect(literal(['I ', ' a '], ...args)).toStrictEqual(
      `I ${args[0]} a ${args[1]}`
    );
  });
});

describe('getGlobalSpace', () => {
  it('returns original transform if no element rotation present', () => {
    const global = getGlobalSpace({});
    expect(global`translate(3px)`).toStrictEqual('translate(3px)');
  });

  it('wraps the transform in a counter/original transform if rotation present on element', () => {
    const rotationAngle = 34;
    const global = getGlobalSpace({
      rotationAngle,
    });
    expect(global`translate(3px)`).toStrictEqual(
      'rotate(-34deg) translate(3px) rotate(34deg)'
    );
  });
});
