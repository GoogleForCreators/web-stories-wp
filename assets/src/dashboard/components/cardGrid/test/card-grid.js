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
import { renderWithProviders } from '../../../testUtils/';
import CardGrid from '../';

describe('CardGrid', () => {
  it('should render CardGrid', () => {
    const { getAllByTestId } = renderWithProviders(
      <CardGrid pageSize={{ width: 210, height: 316 }}>
        <div data-testid={'test-child'}>{'Item 1'}</div>
        <div data-testid={'test-child'}>{'Item 2'}</div>
        <div data-testid={'test-child'}>{'Item 3'}</div>
        <div data-testid={'test-child'}>{'Item 4'}</div>
        <div data-testid={'test-child'}>{'Item 5'}</div>
      </CardGrid>
    );

    expect(getAllByTestId('test-child')).toHaveLength(5);
  });
});
