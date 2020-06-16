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
import { OverlayType } from '../../../../utils/backgroundOverlay';
import { setupReducer } from './_utils';

describe('addPage', () => {
  it('should add a page', () => {
    const { addPage } = setupReducer();

    const result = addPage({
      page: {
        id: '123',
        elements: [{ id: '456' }],
      },
    });

    expect(result.pages).toStrictEqual([
      {
        id: '123',
        elements: [{ id: '456' }],
        backgroundOverlay: OverlayType.NONE,
      },
    ]);
  });
  it('should reject adding a page without an element', () => {
    const { restore, addPage } = setupReducer();

    const initial = restore({
      pages: [{ id: '111' }],
    });

    const result = addPage({ page: { id: '222' } });

    expect(result).toStrictEqual(initial);
  });

  it('should make the new page current', () => {
    const { restore, addPage } = setupReducer();

    // Set an initial state with a different current page.
    restore({
      pages: [{ id: '111' }],
      current: '111',
    });

    const result = addPage({ page: { id: '123', elements: [{ id: '456' }] } });

    expect(result.current).toStrictEqual('123');
  });

  it('should insert the new page just after current one', () => {
    const { restore, addPage } = setupReducer();

    // Set an initial state with multiple pages.
    restore({
      pages: [{ id: '111' }, { id: '222' }],
      current: '111',
    });

    const result = addPage({ page: { id: '123', elements: [{ id: '456' }] } });

    const pageIds = result.pages.map(({ id }) => id);

    expect(pageIds).toStrictEqual(['111', '123', '222']);
  });
});
