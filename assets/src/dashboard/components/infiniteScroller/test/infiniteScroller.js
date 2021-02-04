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
import InfiniteScroller from '../index';

describe('InfiniteScroller', () => {
  const onGetDataMock = jest.fn();

  it('should render a loading component by default', () => {
    const { getByTestId } = renderWithProviders(
      <InfiniteScroller canLoadMore={true} onLoadMore={onGetDataMock} />
    );

    const loadingComponent = getByTestId('load-more-on-scroll');

    expect(loadingComponent).toBeInTheDocument();
  });

  it('should show all data loaded message when `allDataLoadedMessage` is true', () => {
    const { getByText } = renderWithProviders(
      <InfiniteScroller
        onLoadMore={onGetDataMock}
        allDataLoadedMessage="All data has been fetched"
        canLoadMore={false}
      />
    );

    const allDataLoaded = getByText('All data has been fetched');

    expect(allDataLoaded).toBeInTheDocument();
  });
});
