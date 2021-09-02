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
import reducer, { ACTIONS } from '../reducer';

describe('<Tags.Input /> Reducer', () => {
  describe('ACTIONS.UPDATE_VALUE', () => {
    it('should update the value', () => {
      const oldState = {
        offset: 0,
        value: '',
        tags: ['tag1'],
      };
      const action = { type: ACTIONS.UPDATE_VALUE, payload: 'potato' };
      const expectedState = {
        offset: 0,
        value: 'potato',
        tags: ['tag1'],
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);
    });

    it('should add tags when theres postfixed commas in the value', () => {
      const oldState = {
        offset: 0,
        value: '',
        tags: ['tag1'],
      };
      const action = {
        type: ACTIONS.UPDATE_VALUE,
        payload: 'potato, tomato, pizza pie',
      };
      const expectedState = {
        offset: 0,
        value: 'pizza pie',
        tags: ['tag1', 'potato', 'tomato'],
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);
    });

    it('should strip extraneous spaces once added as a tag', () => {
      const oldState = {
        offset: 0,
        value: '',
        tags: ['tag1'],
      };
      const action = {
        type: ACTIONS.UPDATE_VALUE,
        payload: 'potato, tomato     , pizza   pie',
      };
      const expectedState = {
        offset: 0,
        value: ' pizza   pie',
        tags: ['tag1', 'potato', 'tomato'],
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);
    });

    it('should respect the offset when adding new tags', () => {
      const oldState = {
        offset: 1,
        value: '',
        tags: ['tag1'],
      };
      const action = {
        type: ACTIONS.UPDATE_VALUE,
        payload: 'potato, tomato, pizza pie',
      };
      const expectedState = {
        offset: 1,
        value: 'pizza pie',
        tags: ['potato', 'tomato', 'tag1'],
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);
    });
  });
});
