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
        readonly: true,
      },
    }),
    getEditor: () => 'testEditor',
  })),
}));

jest.mock('../../utils/globals', () => ({
  webStoriesData: {
    tag: 'testStories',
    views: [],
    orderlist: [],
  },
}));

import * as Utils from '../../utils';

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
 * Fail circle view.
 */
describe('Test view is not circle', () => {
  it('view should not be circles', () => {
    const circleView = Utils.isCircleView();
    expect(circleView).toBeFalsy();
  });
});

/**
 * Pass circle view.
 */
describe('Test view is circle', () => {
  it('view should be circles', () => {
    select.mockImplementationOnce(() => ({
      getCurrentView: () => 'circles',
    }));
    const circleView = Utils.isCircleView();
    expect(circleView).toBeTruthy();
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
    expect(shortCode).toBe('[testStories /]');
  });

  it('editor instance set', () => {
    const shortCode = Utils.prepareShortCode();
    expect(shortCode).toBe('[testStories order="latest" dummy="true" /]');
  });
});
