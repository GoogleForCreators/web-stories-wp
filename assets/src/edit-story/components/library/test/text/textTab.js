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
import { act, fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { FontProvider } from '../../../../app/font';
import { TextIcon } from '../../panes/text';
import APIContext from '../../../../app/api/context';
import { DEFAULT_PRESET } from '../../panes/text/textPresets';
import { renderWithTheme } from '../../../../testUtils/index';

jest.mock('../../useLibrary');
import useLibrary from '../../useLibrary';

describe('TextTab', () => {
  const insertElement = jest.fn();
  beforeAll(() => {
    useLibrary.mockImplementation(() => ({
      actions: {
        insertElement: insertElement,
      },
    }));
  });

  it('should insert text with default text style on shortcut click', async () => {
    const getAllFontsPromise = Promise.resolve([]);
    const apiContextValue = {
      actions: {
        getAllFonts: () => getAllFontsPromise,
      },
    };
    await act(async () => {
      const { getByLabelText } = renderWithTheme(
        <APIContext.Provider value={apiContextValue}>
          <FontProvider apiContextValue>
            <TextIcon />
          </FontProvider>
        </APIContext.Provider>
      );

      await getAllFontsPromise;

      fireEvent.click(getByLabelText('Add new text element'));
    });

    expect(insertElement).toHaveBeenCalledTimes(1);
    expect(insertElement).toHaveBeenCalledWith('text', DEFAULT_PRESET);
  });
});
