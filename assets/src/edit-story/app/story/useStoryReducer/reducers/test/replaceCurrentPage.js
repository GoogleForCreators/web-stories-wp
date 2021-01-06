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
import replaceCurrentPage from '../replaceCurrentPage';
import { createPage } from '../../../../../elements';

describe('replaceCurrentPage', () => {
  it('should replace page with place', () => {
    const currentPage = createPage();
    const pages = [createPage(), currentPage, createPage()];
    const state = {
      current: currentPage.id,
      pages,
      selection: [currentPage.elements[0]],
    };
    const newPage = createPage();
    newPage.elements.push({});
    const newState = replaceCurrentPage(state, { page: newPage });
    expect(newState.selection).toStrictEqual([]);
    expect(newState.pages[1]).toStrictEqual({
      ...newPage,
      id: currentPage.id,
    });
    expect(newState.current).toStrictEqual(currentPage.id);
  });

  it('should skip replacing page if new page has no elements', () => {
    const currentPage = createPage();
    const pages = [createPage(), currentPage, createPage()];
    const state = {
      current: currentPage.id,
      pages,
    };
    const newPage = createPage({ elements: [] });
    const newState = replaceCurrentPage(state, { page: newPage });
    expect(newState.pages[1]).toStrictEqual(currentPage);
    expect(newState.current).toStrictEqual(currentPage.id);
  });
});
