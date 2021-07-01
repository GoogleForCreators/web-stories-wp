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
 * External dependencies
 */
import { renderHook, act } from '@testing-library/react-hooks';
/**
 * Internal dependencies
 */
import { ChecklistProvider, useChecklist } from '..';

function setup() {
  const wrapper = ({ children }) => (
    <ChecklistProvider>{children}</ChecklistProvider>
  );

  return renderHook(() => useChecklist(), { wrapper });
}

describe('useChecklist', () => {
  it('returns isOpen as false by default', () => {
    const { result } = setup();

    expect(result.current.state.isOpen).toBe(false);
  });

  it('updates `isOpen` to false when close fires', async () => {
    const { result } = setup();

    await act(() => result.current.actions.toggle());
    expect(result.current.state.isOpen).toBe(true);

    await act(() => result.current.actions.close());
    expect(result.current.state.isOpen).toBe(false);
  });
});
