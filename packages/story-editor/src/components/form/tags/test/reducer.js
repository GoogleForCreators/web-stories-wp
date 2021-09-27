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
        tagBuffer: null,
      };
      const action = { type: ACTIONS.UPDATE_VALUE, payload: 'potato' };
      const expectedState = {
        offset: 0,
        value: 'potato',
        tags: ['tag1'],
        tagBuffer: null,
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);
    });

    it('should add tags when theres postfixed commas in the value', () => {
      const oldState = {
        offset: 0,
        value: '',
        tags: ['tag1'],
        tagBuffer: null,
      };
      const action = {
        type: ACTIONS.UPDATE_VALUE,
        payload: 'potato, tomato, pizza pie',
      };
      const expectedState = {
        offset: 0,
        value: ' pizza pie',
        tags: ['tag1'],
        tagBuffer: ['tag1', 'potato', 'tomato'],
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);
    });

    it('should strip extraneous spaces once added as a tag', () => {
      const oldState = {
        offset: 0,
        value: '',
        tags: ['tag1'],
        tagBuffer: null,
      };
      const action = {
        type: ACTIONS.UPDATE_VALUE,
        payload: 'potato, tomato     , pizza   pie',
      };
      const expectedState = {
        offset: 0,
        value: ' pizza   pie',
        tags: ['tag1'],
        tagBuffer: ['tag1', 'potato', 'tomato'],
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);
    });

    it('should respect the offset when adding new tags', () => {
      const oldState = {
        offset: 1,
        value: '',
        tags: ['tag1'],
        tagBuffer: null,
      };
      const action = {
        type: ACTIONS.UPDATE_VALUE,
        payload: 'potato, tomato, pizza pie',
      };
      const expectedState = {
        offset: 1,
        value: ' pizza pie',
        tags: ['tag1'],
        tagBuffer: ['potato', 'tomato', 'tag1'],
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);
    });
  });

  describe('ACTIONS.SUBMIT_VALUE', () => {
    it('adds the value as a tag on submit and clears the value', () => {
      const oldState = {
        offset: 0,
        value: 'tag2',
        tags: ['tag1'],
      };
      const action = { type: ACTIONS.SUBMIT_VALUE };
      const expectedState = {
        offset: 0,
        value: '',
        tags: ['tag1'],
        tagBuffer: ['tag1', 'tag2'],
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);
    });

    it('formats the new value on submit', () => {
      const oldState = {
        offset: 0,
        value: '   tag   two    ',
        tags: ['tag1'],
      };
      const action = { type: ACTIONS.SUBMIT_VALUE };
      const expectedState = {
        offset: 0,
        value: '',
        tags: ['tag1'],
        tagBuffer: ['tag1', 'tag two'],
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);
    });

    it('returns the original state with the value reset if the value is empty', () => {
      const oldState = {
        offset: 0,
        value: '    ',
        tags: ['tag1'],
        tagBuffer: null,
      };
      const action = { type: ACTIONS.SUBMIT_VALUE };
      expect(reducer(oldState, action)).toStrictEqual({
        ...oldState,
        value: '',
      });
    });

    it('respects the offset when adding tags', () => {
      const oldState = {
        offset: 1,
        value: 'tag2',
        tags: ['tag1', 'tag3'],
        tagBuffer: null,
      };
      const action = { type: ACTIONS.SUBMIT_VALUE };
      const expectedState = {
        offset: 1,
        value: '',
        tags: ['tag1', 'tag3'],
        tagBuffer: ['tag1', 'tag2', 'tag3'],
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);
    });
  });

  describe('ACTIONS.REMOVE_TAG', () => {
    it('removes the tag specified in the payload', () => {
      const oldState = {
        offset: 1,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: null,
      };
      const action = { type: ACTIONS.REMOVE_TAG, payload: 'tag2' };
      const expectedState = {
        offset: 1,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: ['tag1', 'tag3'],
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);
    });
    it('returns original state when tag not found', () => {
      const oldState = {
        offset: 1,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: null,
      };
      const action = { type: ACTIONS.REMOVE_TAG, payload: 'tag8' };
      const expectedState = oldState;
      expect(reducer(oldState, action)).toStrictEqual(expectedState);
    });

    it('removes tag from index dictated by offset when no payload present', () => {
      let oldState = {
        offset: 3,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: null,
      };
      let action = { type: ACTIONS.REMOVE_TAG };
      let expectedState = {
        offset: 3,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: null,
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);

      oldState = {
        offset: 2,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: null,
      };
      action = { type: ACTIONS.REMOVE_TAG };
      expectedState = {
        offset: 2,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: ['tag2', 'tag3'],
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);

      oldState = {
        offset: 1,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: null,
      };
      action = { type: ACTIONS.REMOVE_TAG };
      expectedState = {
        offset: 1,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: ['tag1', 'tag3'],
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);

      oldState = {
        offset: 0,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: null,
      };
      action = { type: ACTIONS.REMOVE_TAG };
      expectedState = {
        offset: 0,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: ['tag1', 'tag2'],
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);
    });
  });

  describe('ACTIONS.INCREMENT_OFFSET', () => {
    it('should increase offset by 1', () => {
      const oldState = {
        offset: 0,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: null,
      };
      const action = { type: ACTIONS.INCREMENT_OFFSET };
      const expectedState = {
        offset: 1,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: null,
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);
    });

    it('should not let offset exceed tag length', () => {
      const oldState = {
        offset: 3,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: null,
      };
      const action = { type: ACTIONS.INCREMENT_OFFSET };
      const expectedState = {
        offset: 3,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: null,
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);
    });
  });

  describe('ACTIONS.DECREMENT_OFFSET', () => {
    it('should decrease offset by 1', () => {
      const oldState = {
        offset: 3,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: null,
      };
      const action = { type: ACTIONS.DECREMENT_OFFSET };
      const expectedState = {
        offset: 2,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: null,
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);
    });

    it('should not let offset go below 0', () => {
      const oldState = {
        offset: 0,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: null,
      };
      const action = { type: ACTIONS.DECREMENT_OFFSET };
      const expectedState = {
        offset: 0,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: null,
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);
    });
  });

  describe('ACTIONS.RESET_OFFSET', () => {
    it('should reset offset to 0', () => {
      const oldState = {
        offset: 3,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: null,
      };
      const action = { type: ACTIONS.RESET_OFFSET };
      const expectedState = {
        offset: 0,
        value: 'tag4',
        tags: ['tag1', 'tag2', 'tag3'],
        tagBuffer: null,
      };
      expect(reducer(oldState, action)).toStrictEqual(expectedState);
    });
  });
});
