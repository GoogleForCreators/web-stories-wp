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
import { isInputValid, parseInput } from '../validation';

describe('isInputValid - should validate input', () => {
  it.each`
    test                               | value        | allowEmpty | isFloat  | max          | min          | result
    ${'no options'}                    | ${0}         | ${false}   | ${false} | ${undefined} | ${undefined} | ${true}
    ${'no options as string'}          | ${'0'}       | ${false}   | ${false} | ${undefined} | ${undefined} | ${true}
    ${'no options as float'}           | ${1.002}     | ${false}   | ${false} | ${undefined} | ${undefined} | ${true}
    ${'no options as string float'}    | ${'0'}       | ${false}   | ${false} | ${undefined} | ${undefined} | ${true}
    ${'under minimum'}                 | ${-100}      | ${false}   | ${false} | ${undefined} | ${0}         | ${false}
    ${'over maximum'}                  | ${99999}     | ${false}   | ${false} | ${10}        | ${undefined} | ${false}
    ${'under minimum as float'}        | ${-101.102}  | ${false}   | ${false} | ${undefined} | ${0}         | ${false}
    ${'over maximum as float'}         | ${999.83}    | ${false}   | ${false} | ${10}        | ${undefined} | ${false}
    ${'under minimum as string'}       | ${'-100'}    | ${false}   | ${false} | ${undefined} | ${0}         | ${false}
    ${'over maximum as string'}        | ${'99999'}   | ${false}   | ${false} | ${10}        | ${undefined} | ${false}
    ${'over maximum as string float'}  | ${'999.83'}  | ${false}   | ${false} | ${10}        | ${undefined} | ${false}
    ${'under minimum as string float'} | ${'-100.12'} | ${false}   | ${false} | ${undefined} | ${0}         | ${false}
    ${'empty and allow empty'}         | ${''}        | ${true}    | ${false} | ${undefined} | ${undefined} | ${true}
    ${'empty and disallow empty'}      | ${''}        | ${false}   | ${false} | ${undefined} | ${undefined} | ${false}
  `(
    '$test: returns `$result` when value=`$value`, allowEmpty=`$allowEmpty`, isFloat=`$isFloat`, max=`$max`, min=`$min`',
    ({ value, allowEmpty, isFloat, max, min, result }) => {
      expect(
        isInputValid(value, {
          allowEmpty,
          isFloat,
          max,
          min,
        })
      ).toStrictEqual(result);
    }
  );
});

describe('parseInput - should parse input', () => {
  it.each`
    test                                 | value        | allowEmpty | isFloat  | max          | min          | result
    ${'no options'}                      | ${0}         | ${false}   | ${false} | ${undefined} | ${undefined} | ${0}
    ${'no options as string'}            | ${'0'}       | ${false}   | ${false} | ${undefined} | ${undefined} | ${0}
    ${'no options as float'}             | ${1.002}     | ${false}   | ${false} | ${undefined} | ${undefined} | ${1}
    ${'no options as string float'}      | ${'0'}       | ${false}   | ${false} | ${undefined} | ${undefined} | ${0}
    ${'under minimum'}                   | ${-100}      | ${false}   | ${false} | ${undefined} | ${0}         | ${0}
    ${'over maximum'}                    | ${99999}     | ${false}   | ${false} | ${10}        | ${undefined} | ${10}
    ${'under minimum as float'}          | ${-101.102}  | ${false}   | ${false} | ${undefined} | ${0}         | ${0}
    ${'over maximum as float'}           | ${999.83}    | ${false}   | ${false} | ${10}        | ${undefined} | ${10}
    ${'under minimum as string'}         | ${'-100'}    | ${false}   | ${false} | ${undefined} | ${0}         | ${0}
    ${'over maximum as string'}          | ${'99999'}   | ${false}   | ${false} | ${10}        | ${undefined} | ${10}
    ${'under minimum as string float'}   | ${'-100.12'} | ${false}   | ${false} | ${undefined} | ${0}         | ${0}
    ${'over maximum as string float'}    | ${'999.83'}  | ${false}   | ${false} | ${10}        | ${undefined} | ${10}
    ${'empty and allow empty'}           | ${''}        | ${true}    | ${false} | ${undefined} | ${undefined} | ${''}
    ${'empty and disallow empty'}        | ${''}        | ${false}   | ${false} | ${undefined} | ${undefined} | ${null}
    ${'minimum and maximum in range'}    | ${25}        | ${false}   | ${false} | ${100}       | ${0}         | ${25}
    ${'minimum and maximum below range'} | ${-25}       | ${false}   | ${false} | ${100}       | ${0}         | ${0}
    ${'minimum and maximum above range'} | ${125}       | ${false}   | ${false} | ${100}       | ${0}         | ${100}
  `(
    '$test: returns `$result` when value=`$value`, allowEmpty=`$allowEmpty`, isFloat=`$isFloat`, max=`$max`, min=`$min`',
    ({ value, allowEmpty, isFloat, max, min, result }) => {
      expect(
        parseInput(value, {
          allowEmpty,
          isFloat,
          max,
          min,
        })
      ).toStrictEqual(result);
    }
  );
});
