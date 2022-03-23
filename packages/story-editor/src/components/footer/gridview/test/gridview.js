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
import { fireEvent } from '@testing-library/react';
import {
  queryByAriaLabel,
  renderWithTheme,
} from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import StoryContext from '../../../../app/story/context';
import GridView from '../gridView';
import { noop } from '../../../../utils/noop';

function setupGridView() {
  const setCurrentPage = jest.fn();
  const arrangePage = jest.fn();

  const storyContextValue = {
    state: {
      currentPageIndex: 0,
      pages: [
        {
          id: 'foo',
          elements: [],
        },
        {
          id: 'bar',
          elements: [],
        },
      ],
    },
    actions: { setCurrentPage, arrangePage },
  };
  const { container } = renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <GridView onClose={noop} />
    </StoryContext.Provider>
  );
  return {
    container,
    setCurrentPage,
    arrangePage,
  };
}

describe('Grid View', () => {
  it('should change the current page upon selection', () => {
    const { container, setCurrentPage } = setupGridView();
    const secondPage = queryByAriaLabel(container, 'Page 2');

    fireEvent.click(secondPage);
    expect(setCurrentPage).toHaveBeenCalledWith({ pageId: 'bar' });
  });
});
