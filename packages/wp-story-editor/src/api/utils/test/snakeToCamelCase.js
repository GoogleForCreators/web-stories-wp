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
  snakeToCamelCase,
  snakeToCamelCaseObjectKeys,
} from '../snakeToCamelCase';

describe('snakeToCamelCase', () => {
  it.each`
    key                 | result
    ${''}               | ${''}
    ${undefined}        | ${''}
    ${'test'}           | ${'test'}
    ${'rest_base'}      | ${'restBase'}
    ${'rest-base'}      | ${'restBase'}
    ${'rest-base_test'} | ${'restBaseTest'}
    ${'_links'}         | ${'_links'}
    ${'links_'}         | ${'links_'}
    ${'a_l'}            | ${'aL'}
  `('should return the expected string for $key', ({ key, result }) => {
    expect(snakeToCamelCase(key)).toStrictEqual(result);
  });
});

describe('snakeToCamelCaseObjectKeys', () => {
  it.each`
    key                    | result
    ${{}}                  | ${{}}
    ${[1, 2]}              | ${[1, 2]}
    ${undefined}           | ${undefined}
    ${''}                  | ${''}
    ${{ item_one: 'two' }} | ${{ itemOne: 'two' }}
  `('should return the expected value for $key', ({ key, result }) => {
    expect(snakeToCamelCaseObjectKeys(key)).toStrictEqual(result);
  });

  it('should return camelcase keys for nested objects', () => {
    const transformedObject = snakeToCamelCaseObjectKeys({
      item_one: 'string',
      itemTwo: 'string',
      item_three: {
        level_one_item_one: {
          level_two_item_one: {
            level_three_item_one: 22,
          },
          leveTwoItemTwo: 'string',
        },
        random: 'string',
      },
    });

    const expectedResult = {
      itemOne: 'string',
      itemTwo: 'string',
      itemThree: {
        levelOneItemOne: {
          levelTwoItemOne: {
            levelThreeItemOne: 22,
          },
          leveTwoItemTwo: 'string',
        },
        random: 'string',
      },
    };

    expect(transformedObject).toStrictEqual(expectedResult);
  });
});
