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
import { screen } from '@testing-library/react';
import { FlagsProvider } from 'flagged';

/**
 * Internal dependencies
 */
import ArchiveSetting, { TEXT } from '..';
import { ARCHIVE_TYPE } from '../../../../constants';
import { renderWithProviders } from '../../../../testUtils';

describe('Editor Settings: Archive page settings <ArchiveSetting />', function () {
  let archive;
  let mockUpdate;

  beforeEach(() => {
    archive = ARCHIVE_TYPE.DEFAULT;
    mockUpdate = jest.fn();
  });

  afterEach(() => {
    archive = ARCHIVE_TYPE.DEFAULT;
  });

  it('should render archive dropdown button and helper text for default', function () {
    const link = 'http://www.example.com/web-stories';
    renderWithProviders(
      <FlagsProvider features={{ archivePageCustomization: true }}>
        <ArchiveSetting
          archive={archive}
          updateSettings={mockUpdate}
          archiveURL={link}
          archivePageId={0}
          searchPages={jest.fn()}
          getPageById={jest.fn()}
        />
      </FlagsProvider>
    );

    const sectionHeader = screen.getByText(TEXT.SECTION_HEADING);
    expect(sectionHeader).toBeInTheDocument();

    const helperLink = screen.getByText(
      (_, node) => node.textContent === link,
      {
        selector: 'a',
      }
    );
    expect(helperLink).toBeInTheDocument();

    const archiveDropdown = screen.getByRole('button');
    expect(archiveDropdown).toHaveTextContent('Default');
  });

  it('should render archive dropdown button and helper text for disabled', function () {
    const link = 'http://www.example.com/web-stories';
    renderWithProviders(
      <FlagsProvider features={{ archivePageCustomization: true }}>
        <ArchiveSetting
          archive={ARCHIVE_TYPE.DISABLED}
          updateSettings={mockUpdate}
          archiveURL={link}
          archivePageId={0}
          searchPages={jest.fn()}
          getPageById={jest.fn()}
        />
      </FlagsProvider>
    );

    const sectionHeader = screen.getByText(TEXT.SECTION_HEADING);
    expect(sectionHeader).toBeInTheDocument();

    const helpText = screen.getByText(TEXT.ARCHIVE_CONTENT);
    expect(helpText).toBeInTheDocument();

    const archiveDropdown = screen.getByRole('button');
    expect(archiveDropdown).toHaveTextContent('Disabled');
  });
});
