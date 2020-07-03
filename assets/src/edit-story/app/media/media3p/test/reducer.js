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
import providerReducer from '../providerReducer';
import reducer from '../reducer';
import useMediaReducer from '../../useMediaReducer';
import * as media3pActionsToWrap from '../actions';
import * as types from '../../types';

jest.mock('../providerReducer');

describe('reducer', () => {
  let initialValue;

  beforeEach(() => {
    providerReducer.mockReturnValueOnce({});
    initialValue = reducer(undefined, { type: types.INITIAL_STATE });
  });

  it('should provide initial state for each provider', () => {
    expect(initialValue).toStrictEqual(
      expect.objectContaining({ unsplash: {} })
    );
  });

  it('should reduce each provider state', () => {
    providerReducer.mockReturnValueOnce({ key: 'value' });
    const newState = reducer(initialValue, {
      type: 'action',
      payload: { provider: 'unsplash' },
    });

    expect(providerReducer).toHaveBeenCalledWith(
      {},
      { type: 'action', payload: { provider: 'unsplash' } }
    );
    expect(newState).toStrictEqual(
      expect.objectContaining({ unsplash: { key: 'value' } })
    );
  });

  it('should assign selectedProvider on setSelectedProvider', () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, media3pActionsToWrap)
    );

    result.current.actions.setSelectedProvider({ provider: 'unsplash' });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        selectedProvider: 'unsplash',
      })
    );
  });
});
