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
import useMediaReducer from '../useMediaReducer';

describe('useMediaReducer', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useMediaReducer());
    expect(result.current.state).toStrictEqual({
      local: expect.objectContaining({ media: [], hasMore: true }),
      media3p: expect.objectContaining({
        unsplash: expect.objectContaining({ media: [], hasMore: true }),
      }),
    });
  });

  it('should return actions', () => {
    const { result } = renderHook(() => useMediaReducer());
    expect(result.current.actions).toStrictEqual({
      local: expect.objectContaining({ fetchMediaStart: expect.any(Function) }),
      media3p: expect.objectContaining({
        setSelectedProvider: expect.any(Function),
        fetchMediaStart: expect.any(Function),
      }),
    });
  });
});
