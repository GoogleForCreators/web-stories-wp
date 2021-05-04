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
import { renderWithProviders } from '../../../../../testUtils';
import { AD_NETWORK_TYPE } from '../../../../../constants';
import AdManagement, { TEXT } from '..';

describe('Editor Settings: Ad Management group settings <AdManagement />', function () {
  let adNetwork;
  let mockUpdate;

  beforeEach(() => {
    adNetwork = AD_NETWORK_TYPE.NONE;
    mockUpdate = jest.fn();
  });

  afterEach(() => {
    adNetwork = AD_NETWORK_TYPE.NONE;
  });

  it('should render ad management settings area with ad network dropdown button and helper text by default', function () {
    const { getByText, getByRole } = renderWithProviders(
      <AdManagement
        adNetwork={adNetwork}
        updateSettings={mockUpdate}
        publisherId=""
        adSenseSlotId=""
        adManagerSlotId=""
      />
    );

    const sectionHeader = getByText(TEXT.SECTION_HEADING);
    expect(sectionHeader).toBeInTheDocument();

    const helperLink = getByText('Learn more', {
      selector: 'a',
    });
    expect(helperLink).toBeInTheDocument();

    const networkDropdown = getByRole('button');
    expect(networkDropdown).toHaveTextContent('None');
  });

  it('should render ad network settings and link adsense', function () {
    const { getByText } = renderWithProviders(
      <AdManagement
        adNetwork={AD_NETWORK_TYPE.ADSENSE}
        updateSettings={mockUpdate}
        publisherId=""
        adSenseSlotId=""
        adManagerSlotId=""
      />
    );

    const sectionHeader = getByText(TEXT.SECTION_HEADING);
    expect(sectionHeader).toBeInTheDocument();

    const helperLink = getByText('how to monetize your Web Stories', {
      selector: 'a',
    });
    expect(helperLink).toBeInTheDocument();
  });

  it('should render ad network settings and link Ad Manager', function () {
    const { getByText } = renderWithProviders(
      <AdManagement
        adNetwork={AD_NETWORK_TYPE.ADMANAGER}
        updateSettings={mockUpdate}
        publisherId=""
        adSenseSlotId=""
        adManagerSlotId=""
      />
    );

    const sectionHeader = getByText(TEXT.SECTION_HEADING);
    expect(sectionHeader).toBeInTheDocument();

    const helperLink = getByText('enable programmatic demand in Web Stories', {
      selector: 'a',
    });
    expect(helperLink).toBeInTheDocument();
  });
});
