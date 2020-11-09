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
import { TabGroup } from '../';
import { renderWithProviders } from '../../../testUtils/renderWithProviders';

describe('TabGroup', () => {
  const onClickMock = jest.fn();

  it('should render three tab buttons in a tabGroup', () => {
    const { queryAllByRole } = renderWithProviders(
      <TabGroup
        activeTabId={'2'}
        tabs={[
          { id: '1', title: 'tab one' },
          { id: '2', title: 'tab two' },
          { id: '3', title: 'tab three' },
        ]}
        label={'tab group label'}
        handleTabClicked={onClickMock}
      />
    );

    expect(queryAllByRole('tab')).toHaveLength(3);
  });

  it('should specify second item is active', () => {
    const { getByRole } = renderWithProviders(
      <TabGroup
        activeTabId={'2'}
        tabs={[
          { id: '1', title: 'tab one' },
          { id: '2', title: 'tab two' },
          { id: '3', title: 'tab three' },
        ]}
        label={'tab group label'}
        handleTabClicked={onClickMock}
      />
    );

    const activeTab = getByRole('tab', { selected: true });

    expect(activeTab).toHaveTextContent('tab two');
  });
});
