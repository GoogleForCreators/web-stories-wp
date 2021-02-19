/*
 * Copyright 2021 Google LLC
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
import { renderHook, act } from '@testing-library/react-hooks';
import { render } from '@testing-library/react';
/**
 * Internal dependencies
 */

import { ThemeProvider } from 'styled-components';
import LibraryProvider from '../libraryProvider';
import useLibrary from '../useLibrary';
import useMedia from '../../../app/media/useMedia';
import theme from '../../../theme';

jest.mock('../../../app/media/useMedia');
jest.mock('../../../app/media/media3p/providerConfiguration', () => ({
  PROVIDERS: {
    PROVIDER_1: {
      displayName: 'Provider 1',
      supportsCategories: true,
      requiresAuthorAttribution: true,
      fetchMediaErrorMessage: 'Error loading media from Provider 1',
      fetchCategoriesErrorMessage: 'Error loading categories from Provider 1',
    },
  },
}));

const PROVIDER_STATE = {
  state: {
    isMediaLoaded: false,
    isMediaLoading: false,
    hasMore: false,
    media: [],
    categories: {
      categories: [],
    },
  },
  actions: {
    selectCategory: jest.fn(),
    deselectCategory: jest.fn(),
    setNextPage: jest.fn(),
  },
};

const USE_MEDIA_RESULT = {
  searchTerm: '',
  selectedProvider: undefined,
  setSelectedProvider: jest.fn(),
  setSearchTerm: jest.fn(),
  media3p: {
    PROVIDER_1: PROVIDER_STATE,
  },
};

describe('useLibrary()', () => {
  const wrapper = ({ children }) => (
    <ThemeProvider theme={theme}>
      <LibraryProvider>{children}</LibraryProvider>
    </ThemeProvider>
  );
  beforeAll(() => {
    useMedia.mockImplementation(() => USE_MEDIA_RESULT);
  });

  it('should return an empty pane for lazy tabs unless active', async () => {
    const { result } = renderHook(() => useLibrary((state) => state), {
      wrapper: LibraryProvider,
    });
    const [media3p, text, pageLayouts] = [1, 2, 4];

    const { Pane: ShouldBeEmptyMedia3pPane } = result.current.data.tabs[
      media3p
    ];
    const { Pane: ShouldBeEmptyTextPane } = result.current.data.tabs[text];
    const { Pane: ShouldBeEmptyPageLayoutsPane } = result.current.data.tabs[
      pageLayouts
    ];

    expect(<ShouldBeEmptyMedia3pPane />).toMatchInlineSnapshot('<EmptyPane />');
    const emptyMedia3pPane = render(<ShouldBeEmptyMedia3pPane />);
    expect(emptyMedia3pPane.container.firstChild).toBeEmptyDOMElement();

    expect(<ShouldBeEmptyTextPane />).toMatchInlineSnapshot('<EmptyPane />');
    const emptyTextPane = render(<ShouldBeEmptyTextPane />);
    expect(emptyTextPane.container.firstChild).toBeEmptyDOMElement();

    expect(<ShouldBeEmptyPageLayoutsPane />).toMatchInlineSnapshot(
      '<EmptyPane />'
    );
    const emptyPageLayoutsPane = render(<ShouldBeEmptyPageLayoutsPane />);
    expect(emptyPageLayoutsPane.container.firstChild).toBeEmptyDOMElement();

    // render the lazy media pane
    await act(async () => {
      await result.current.actions.setTab(result.current.data.tabs[media3p].id);
    });
    const { Pane: ShouldBeRenderedMedia3pPane } = result.current.data.tabs[
      media3p
    ];
    const renderedMedia3pPane = render(<ShouldBeRenderedMedia3pPane />, {
      wrapper,
    });
    expect(renderedMedia3pPane.container.firstChild).not.toBeEmptyDOMElement();

    // render the lazy text pane
    await act(async () => {
      await result.current.actions.setTab(result.current.data.tabs[text].id);
    });
    const { Pane: ShouldBeRenderedTextPane } = result.current.data.tabs[
      media3p
    ];
    const renderedTextPane = render(<ShouldBeRenderedTextPane />, {
      wrapper,
    });
    expect(renderedTextPane.container.firstChild).not.toBeEmptyDOMElement();

    // render the lazy page layouts pane
    await act(async () => {
      await result.current.actions.setTab(
        result.current.data.tabs[pageLayouts].id
      );
    });
    const { Pane: ShouldBeRenderedPageLayoutsPane } = result.current.data.tabs[
      media3p
    ];
    const renderedPageLayoutsPane = render(
      <ShouldBeRenderedPageLayoutsPane />,
      {
        wrapper,
      }
    );
    expect(
      renderedPageLayoutsPane.container.firstChild
    ).not.toBeEmptyDOMElement();
  });
});
