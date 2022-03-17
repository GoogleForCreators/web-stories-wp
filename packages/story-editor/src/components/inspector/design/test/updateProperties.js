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
import updateProperties from '../updateProperties';
import { MULTIPLE_VALUE } from '../../../../constants';

describe('updateProperties', () => {
  let element;

  beforeEach(() => {
    element = {
      x: 11,
      y: 12,
      width: 111,
      height: 121,
    };
  });

  it('should update properties with a map', () => {
    const update = updateProperties(element, { x: 21, y: 22 });
    expect(update).toStrictEqual({ x: 21, y: 22 });
  });

  it('should update properties with a function', () => {
    const update = updateProperties(element, ({ x, y }) => ({
      x: x + 1,
      y: y + 1,
    }));
    expect(update).toStrictEqual({ x: 12, y: 13 });
  });

  it('should tolerate null/undefined', () => {
    expect(updateProperties(element, null)).toStrictEqual({});
    expect(updateProperties(element, undefined)).toStrictEqual({});
    expect(updateProperties(element, () => null)).toStrictEqual({});
    expect(updateProperties(element, () => undefined)).toStrictEqual({});
  });

  it('should remove "multi" values', () => {
    expect(
      updateProperties(element, { x: MULTIPLE_VALUE, y: 1 })
    ).toStrictEqual({ y: 1 });
  });

  it('should keep intermediary "empty" values', () => {
    expect(updateProperties(element, { x: '', y: 1 })).toStrictEqual({
      x: '',
      y: 1,
    });
  });

  it('should remove final "empty" values', () => {
    expect(updateProperties(element, { x: '', y: 1 }, true)).toStrictEqual({
      y: 1,
    });
  });
});
