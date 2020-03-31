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
import usePreventWindowUnload, {
  beforeUnloadListener,
} from '../usePreventWindowUnload';

describe('usePreventWindowUnload', () => {
  it('should register beforeunload listener', () => {
    jest.spyOn(window, 'addEventListener');
    renderHook(() => usePreventWindowUnload(true));

    expect(window.addEventListener).toHaveBeenCalledWith(
      'beforeunload',
      beforeUnloadListener
    );
  });

  it('should unregister beforeunload listener', () => {
    jest.spyOn(window, 'removeEventListener');
    renderHook(() => usePreventWindowUnload(false));

    expect(window.removeEventListener).toHaveBeenCalledWith(
      'beforeunload',
      beforeUnloadListener
    );
  });
});
