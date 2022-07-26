/*
 * Copyright 2022 Google LLC
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
import { fireEvent, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import CustomFontsSettings, { TEXT } from '..';
import { renderWithProviders } from '../../../../testUtils';

describe('Editor Settings: <CustomFontsSettings />', () => {
  it('should select font when clicked', () => {
    renderWithProviders(
      <CustomFontsSettings
        customFonts={[
          {
            id: 609,
            family: 'Overpass ExtraBold Italic',
            url: 'https://example.com/overpass-extrabold-italic.ttf',
          },
          {
            id: 610,
            family: 'Overpass Regular',
            url: 'https://example.com/overpass-regular.ttf',
          },
          {
            id: 611,
            family: 'Overpass SemiBold Italic',
            url: 'https://example.com/overpass-semibold-italic.ttf',
          },
        ]}
        addCustomFont={jest.fn}
        deleteCustomFont={jest.fn}
      />
    );

    const heading = screen.getByText(TEXT.SECTION_HEADING);
    expect(heading).toBeInTheDocument();

    const textContext = screen.getByText(TEXT.ADD_CONTEXT);
    expect(textContext).toBeInTheDocument();

    fireEvent.click(screen.getByText('Overpass Regular'));

    const selected = screen.getByRole('option', { selected: true });
    expect(selected.id).toBe('font-610');
  });
});
