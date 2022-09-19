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
import { fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import useGlobalClipboardHandlers from '../useGlobalClipboardHandlers';

describe('useGlobalClipboardHandlers', () => {
  it('should call the set handlers as expected', () => {
    const copyCutHandler = jest.fn();
    const pasteHandler = jest.fn();

    const windowSpy = jest
      .spyOn(window, 'getSelection')
      .mockImplementation(() => false);

    renderHook(() => {
      useGlobalClipboardHandlers(copyCutHandler, pasteHandler);
    });

    fireEvent.paste(document, '');
    expect(pasteHandler).toHaveBeenCalledOnce();

    fireEvent.copy(document);
    fireEvent.cut(document);
    expect(copyCutHandler).toHaveBeenCalledTimes(2);

    windowSpy.mockRestore();
  });
});
