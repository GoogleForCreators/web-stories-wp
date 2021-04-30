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
 * WordPress dependencies
 */
import { select } from '@wordpress/data';
/**
 * Internal dependencies
 */
jest.mock('@wordpress/data', () => ({
  select: jest.fn(() => ({
    getCurrentView: () => 'grid',
    getCurrentViewSettings: () => ({
      order: 'latest',
      dummy: {
        show: true,
        label: 'Dummy Text',
        hidden: true,
      },
    }),
    getEditor: () => 'testEditor',
  })),
}));

jest.mock('../../utils/globals', () => ({
  webStoriesData: {
    views: [],
  },
}));

import * as Utils from '..';

/**
 * Test that the current view is grid view.
 */
describe('Test the current view', () => {
  it('view should be circles', () => {
    const view = Utils.currentView();
    expect(view).toBe('grid');
  });
});

/**
 * Test shortcode build function.
 */
describe('Test shortcode is preparation', () => {
  it('editor instance not set', () => {
    select.mockImplementationOnce(() => ({
      getEditor: () => null,
      getCurrentViewSettings: () => null,
    }));

    const shortCode = Utils.prepareShortCode();
    expect(shortCode).toBe('[web_stories /]');
  });

  it('editor instance set', () => {
    const shortCode = Utils.prepareShortCode();
    expect(shortCode).toBe('[web_stories order="latest" dummy="true" /]');
  });
});
