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
import { FlagsProvider } from 'flagged';

/**
 * Internal dependencies
 */
import { FontProvider } from '../../../../app/font';
import { TextPane } from '../../panes/text';
import APIContext from '../../../../app/api/context';
import { DEFAULT_PRESET } from '../../panes/text/textPresets';
import { renderWithTheme } from '../../../../testUtils/index';

const mockInsertElement = jest.fn();
jest.mock('../../useLibrary', () => ({
  useLibrary: () => ({
    insertElement: mockInsertElement,
  }),
}));

describe('TextPane', () => {
  beforeEach(() => {
    mockInsertElement.mockReset();
  });

  it('should insert text with default text style on pressing quick action', async () => {
    const getAllFontsPromise = Promise.resolve([]);
    const apiContextValue = {
      actions: {
        getAllFonts: () => getAllFontsPromise,
      },
    };
    await act(async () => {
      const { getByRole } = renderWithTheme(
        <FlagsProvider
          features={{
            showTextSets: false,
            showTextAndShapesSearchInput: false,
          }}
        >
          <APIContext.Provider value={apiContextValue}>
            <FontProvider apiContextValue>
              <TextPane isActive={true} />
            </FontProvider>
          </APIContext.Provider>
        </FlagsProvider>
      );

      await getAllFontsPromise;

      fireEvent.click(getByRole('button', { name: 'Add new text' }));
    });

    expect(mockInsertElement).toHaveBeenCalledTimes(1);
    expect(mockInsertElement).toHaveBeenCalledWith('text', DEFAULT_PRESET);
  });
});
