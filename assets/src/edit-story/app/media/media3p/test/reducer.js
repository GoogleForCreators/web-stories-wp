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
 * External dependencies
 */
import { renderHook } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import * as actionsToWrap from '../actions';
import * as types from '../../types';
import reducer from '../reducer';
import useMediaReducer from '../../useMediaReducer';

describe('reducer', () => {
  let initialValue;

  beforeEach(() => {
    initialValue = reducer(undefined, { type: types.INITIAL_STATE });
  });

  it('should provide initial state for each provider', () => {
    expect(initialValue).toStrictEqual(
      expect.objectContaining({ unsplash: expect.anything() })
    );
  });

  it('should reduce each provider state', () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, actionsToWrap)
    );

    result.current.actions.fetchMediaSuccess({
      provider: 'unsplash',
      media: [{ id: 'id' }],
    });

    expect(result.current.state.unsplash).toStrictEqual(
      expect.objectContaining({
        isMediaLoaded: true,
        isMediaLoading: false,
      })
    );
  });

  it('should assign selectedProvider on setSelectedProvider', () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, actionsToWrap)
    );

    result.current.actions.setSelectedProvider({ provider: 'unsplash' });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        selectedProvider: 'unsplash',
      })
    );
  });
});
