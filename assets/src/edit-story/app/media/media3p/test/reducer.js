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
import reducer, { INITIAL_STATE } from '../reducer';
import providerReducer from '../providerReducer';

jest.mock('../providerReducer');

describe('reducer', () => {
  it('should provide initial state for each provider', () => {
    expect(INITIAL_STATE).toStrictEqual(
      expect.objectContaining({ unsplash: {} })
    );
  });

  it('should reduce each provider state', () => {
    providerReducer.mockReturnValueOnce({ key: 'value' });
    const newState = reducer(INITIAL_STATE, { type: 'action' });

    expect(providerReducer).toHaveBeenCalledWith({}, { type: 'action' });
    expect(newState).toStrictEqual(
      expect.objectContaining({ unsplash: { key: 'value' } })
    );
  });
});
