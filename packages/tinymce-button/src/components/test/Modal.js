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
import { render, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import WebStoriesModal from '../Modal';

jest.mock('@wordpress/data', () => ({
  select: jest.fn(() => ({
    getCurrentView: () => 'grid',
  })),
  createReduxStore: jest.fn(),
  combineReducers: jest.fn(),
  register: jest.fn(),
}));

jest.mock('@wordpress/i18n', () => ({
  ...jest.requireActual('@wordpress/i18n'),
  // eslint-disable-next-line no-unused-vars -- Negligible.
  __: (val, domain) => val,
}));

jest.mock('../../utils/globals', () => ({
  webStoriesData: {
    views: [],
  },
}));

jest.mock('../../utils', () => ({
  updateViewSettings: jest.fn((settings) => settings),
}));

describe('Modal', () => {
  it('renders modal with toggles', () => {
    const props = {
      modalOpen: true,
      settings: {
        archive_link: {
          show: true,
        },
        title: {},
        excerpt: {},
        author: {},
        date: {},
      },
      prepareShortCode: jest.fn(),
    };

    render(<WebStoriesModal {...props} />);
    expect(screen.getByText(/Archive Link Label/i)).toBeInTheDocument();
  });
});
