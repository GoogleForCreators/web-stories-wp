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
import nativeCopyPasteExpected from '../nativeCopyPasteExpected';

describe('nativeCopyPasteExpected', () => {
  it('should detect selection correctly for different inputs', () => {
    const textArea = document.createElement('textarea');
    document.body.appendChild(textArea);
    textArea.focus();
    expect(nativeCopyPasteExpected()).toBe(true);

    const textInput = document.createElement('input');
    textInput.type = 'text';
    document.body.appendChild(textInput);
    textInput.focus();
    expect(nativeCopyPasteExpected()).toBe(true);

    const numberInput = document.createElement('input');
    numberInput.type = 'number';
    document.body.appendChild(numberInput);
    numberInput.focus();
    expect(nativeCopyPasteExpected()).toBe(true);

    const contentEditable = document.createElement('div');
    contentEditable.setAttribute('contenteditable', 'true');
    document.body.appendChild(contentEditable);
    contentEditable.focus();
    expect(nativeCopyPasteExpected()).toBe(true);

    const originalWindow = { ...window };
    const windowSpy = jest.spyOn(global, 'window', 'get');
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      getSelection: () => false,
    }));

    const incorrectInput = document.createElement('input');
    incorrectInput.type = 'test';
    document.body.appendChild(incorrectInput);
    incorrectInput.focus();
    expect(nativeCopyPasteExpected()).toBe(false);

    windowSpy.mockRestore();
  });

  it('should use native copypaste if there is selection', () => {
    const originalWindow = { ...window };
    const windowSpy = jest.spyOn(global, 'window', 'get');
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      getSelection() {
        return {
          rangeCount: 1,
          collapsed: false,
          getRangeAt: () => true,
        };
      },
    }));

    expect(nativeCopyPasteExpected()).toBe(true);

    windowSpy.mockRestore();
  });
});
