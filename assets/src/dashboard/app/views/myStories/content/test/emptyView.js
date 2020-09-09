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
import EmptyView from '../emptyView';

describe('My Stories <EmptyView />', function () {
  it('should render default text when no searchKeyword is preset', function () {
    const { getByText } = renderWithProviders(<EmptyView />);

    expect(getByText('Create a story to get started!')).toBeInTheDocument();
  });

  it('should render searchKeyword with no results when searchKeyword is preset', function () {
    const { getByText } = renderWithProviders(
      <EmptyView searchKeyword="Koalas" />
    );

    expect(
      getByText('Sorry, we couldn\'t find any results matching "Koalas"')
    ).toBeInTheDocument();
  });
});
