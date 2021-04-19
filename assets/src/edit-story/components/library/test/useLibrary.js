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

import LibraryProvider from '../libraryProvider';
import useLibrary from '../useLibrary';

describe('useLibrary()', () => {
  it('should return an empty pane for lazy tabs unless active', async () => {
    const { result } = renderHook(() => useLibrary((state) => state), {
      wrapper: LibraryProvider,
    });
    const [media3p, text, pageTemplates] = [1, 2, 4];

    const { Pane: ShouldBeEmptyMedia3pPane } = result.current.data.tabs[
      media3p
    ];
    const { Pane: ShouldBeEmptyTextPane } = result.current.data.tabs[text];
    const { Pane: ShouldBeEmptyPageTemplatesPane } = result.current.data.tabs[
      pageTemplates
    ];

    expect(<ShouldBeEmptyMedia3pPane />).toMatchInlineSnapshot('<EmptyPane />');
    const emptyMedia3pPane = render(<ShouldBeEmptyMedia3pPane />);
    expect(emptyMedia3pPane.container.firstChild).toBeEmptyDOMElement();

    expect(<ShouldBeEmptyTextPane />).toMatchInlineSnapshot('<EmptyPane />');
    const emptyTextPane = render(<ShouldBeEmptyTextPane />);
    expect(emptyTextPane.container.firstChild).toBeEmptyDOMElement();

    expect(<ShouldBeEmptyPageTemplatesPane />).toMatchInlineSnapshot(
      '<EmptyPane />'
    );
    const emptyPageTemplatesPane = render(<ShouldBeEmptyPageTemplatesPane />);
    expect(emptyPageTemplatesPane.container.firstChild).toBeEmptyDOMElement();

    // shallow render the lazy media panes
    await act(async () => {
      await result.current.actions.setTab(result.current.data.tabs[media3p].id);
    });
    const { Pane: ShouldBeRenderedMedia3pPane } = result.current.data.tabs[
      media3p
    ];
    expect(<ShouldBeRenderedMedia3pPane />).toMatchInlineSnapshot(
      `<Media3pPane />`
    );

    await act(async () => {
      await result.current.actions.setTab(result.current.data.tabs[text].id);
    });
    const { Pane: ShouldBeRenderedTextPane } = result.current.data.tabs[text];
    expect(<ShouldBeRenderedTextPane />).toMatchInlineSnapshot(`<TextPane />`);

    await act(async () => {
      await result.current.actions.setTab(
        result.current.data.tabs[pageTemplates].id
      );
    });
    const {
      Pane: ShouldBeRenderedPageTemplatesPane,
    } = result.current.data.tabs[pageTemplates];
    expect(<ShouldBeRenderedPageTemplatesPane />).toMatchInlineSnapshot(
      `<PageTemplatesPane />`
    );
  });
});
