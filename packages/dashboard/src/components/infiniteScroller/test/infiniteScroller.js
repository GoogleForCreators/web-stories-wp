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
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import InfiniteScroller from '../index';

const generateArray = (n) => new Array(n).fill(<span>{'Demo Item'}</span>);

describe('InfiniteScroller', () => {
  const onGetDataMock = jest.fn();
  const dummyData = generateArray(5);

  it('should render children and a loading component by default', () => {
    const { getByTestId, getAllByTestId } = render(
      <InfiniteScroller handleGetData={onGetDataMock}>
        {dummyData.map((data, index) => (
          <div data-testid="child-item" key={index}>
            {data} {index}
          </div>
        ))}
      </InfiniteScroller>
    );

    const loadingComponent = getByTestId('load-more-on-scroll');
    const scrollingChildren = getAllByTestId('child-item');

    expect(loadingComponent).toBeDefined();
    expect(scrollingChildren).toHaveLength(5);
  });

  it('should show all data loaded message when `allDataLoadedMessage` is true', () => {
    const { getByText } = render(
      <InfiniteScroller
        handleGetData={onGetDataMock}
        allDataLoadedMessage="All data has been fetched"
        isAllDataLoaded={true}
      >
        {dummyData.map((data, index) => (
          <div key={index}>
            {data} {index}
          </div>
        ))}
      </InfiniteScroller>
    );

    const allDataLoaded = getByText('All data has been fetched');

    expect(allDataLoaded).toBeDefined();
  });
});
