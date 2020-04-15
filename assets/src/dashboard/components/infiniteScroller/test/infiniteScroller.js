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
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import theme from '../../../theme';
import InfiniteScroller from '../index';

const wrapper = (children) => {
  return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
};

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

  //   it.skip('should call handleGetData when loading component is seen', () => {
  //     const { getByTestId } = render(
  //       <InfiniteScroller data-testid="scroller" handleGetData={onGetDataMock}>
  //         {dummyData.map((data, index) => (
  //           <div key={index}>
  //             {data} {index}
  //           </div>
  //         ))}
  //       </InfiniteScroller>
  //     );

  //     const loadingComponent = getByTestId('load-more-on-scroll');
  //     const scrollerContainer = getByTestId('scroller');

  //     fireEvent.scroll(scrollerContainer);

  // waitFor(() => {
  //   return expect(onGetDataMock).toHaveBeenCalledTimes(1);
  // });
  //   });

  //   it.skip('should show all data loaded component and not loading component when isAllDataLoaded is true', () => {});
});
