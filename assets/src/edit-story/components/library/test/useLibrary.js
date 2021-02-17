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
import LibraryProvider from '../libraryProvider';
import useLibrary from '../useLibrary';

describe('useLibrary()', () => {
  it('should not return the panes for lazy tabs unless active', async () => {
    const { result } = renderHook(() => useLibrary((state) => state), {
      wrapper: LibraryProvider,
    });

    // order matters
    const [media3p, text, pageLayouts] = [1, 2, 4];

    expect(result.current.data.tabs[media3p].Pane).toBeUndefined();
    expect(result.current.data.tabs[media3p].id).not.toBeUndefined();
    expect(result.current.data.tabs[media3p].icon).not.toBeUndefined();

    expect(result.current.data.tabs[text].Pane).toBeUndefined();
    expect(result.current.data.tabs[text].id).not.toBeUndefined();
    expect(result.current.data.tabs[text].icon).not.toBeUndefined();

    expect(result.current.data.tabs[pageLayouts].Pane).toBeUndefined();
    expect(result.current.data.tabs[pageLayouts].id).not.toBeUndefined();
    expect(result.current.data.tabs[pageLayouts].icon).not.toBeUndefined();

    await act(async () => {
      await result.current.actions.setTab(result.current.data.tabs[text].id);
    });
    expect(result.current.data.tabs[text].Pane).not.toBeUndefined();
    expect(result.current.data.tabs[media3p].Pane).toBeUndefined();
    expect(result.current.data.tabs[pageLayouts].Pane).toBeUndefined();

    await act(async () => {
      await result.current.actions.setTab(result.current.data.tabs[media3p].id);
    });
    expect(result.current.data.tabs[text].Pane).not.toBeUndefined();
    expect(result.current.data.tabs[media3p].Pane).not.toBeUndefined();
    expect(result.current.data.tabs[pageLayouts].Pane).toBeUndefined();

    await act(async () => {
      await result.current.actions.setTab(
        result.current.data.tabs[pageLayouts].id
      );
    });
    expect(result.current.data.tabs[text].Pane).not.toBeUndefined();
    expect(result.current.data.tabs[media3p].Pane).not.toBeUndefined();
    expect(result.current.data.tabs[pageLayouts].Pane).not.toBeUndefined();
  });
});
