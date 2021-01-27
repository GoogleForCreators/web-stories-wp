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
import { SetDefaultStateSetting } from '../../utils';

jest.mock('../../utils', () => ({
  SetDefaultStateSetting: jest.fn(() => ({
    grid: {
      title: true,
      author: true,
      date: false,
      image_align: false,
      number: 5,
      columns: 1,
      view: 'grid',
      order: 'latest',
    },
  })),
}));

jest.mock('../../utils/globals', () => ({
  webStoriesData: {
    orderlist: [],
    views: {
      grid: {
        label: 'Test Circle',
        value: 'grid',
      },
    },
    fields: {
      grid: {
        title: true,
        author: true,
        date: false,
      },
    },
  },
}));

import DEFAULT_STATE from '../../store/default';

describe('Test default state for store', () => {
  it('compare default state', () => {
    const expected = {
      settings: {
        grid: {
          title: true,
          author: true,
          date: false,
          image_align: false,
          number: 5,
          columns: 1,
          view: 'grid',
          order: 'latest',
        },
      },
      modalOpen: false,
      editor: false,
      currentView: 'circles',
    };

    expect(DEFAULT_STATE).toEqual(expected);
  });
});
