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
import React from 'react';
import renderer from 'react-test-renderer';
/**
 * Internal dependencies
 */
import { isView } from '../../utils';
import WebStoriesModal from '../../components/Modal';

jest.mock('@wordpress/data', () => ({
  select: jest.fn(() => ({
    getCurrentView: () => 'grid',
  })),
}));

jest.mock('@wordpress/i18n', () => ({
  // eslint-disable-next-line no-unused-vars
  __: (val, domain) => val,
}));

jest.mock('@wordpress/components', () => ({
  Modal: 'Modal',
  RangeControl: 'Range',
  SelectControl: 'Select',
  Button: 'Button',
  TextControl: 'TextControl',
}));

jest.mock('../../utils/globals', () => ({
  webStoriesData: {
    views: [],
    orderlist: [],
  },
}));

jest.mock('../../components/controls/Toggle', () => 'TinyMCEToggle');

jest.mock('../../utils', () => ({
  isView: jest.fn((view) => view === 'grid'),
  isCircleView: jest.fn(() => false),
  updateViewSettings: jest.fn((settings) => settings),
}));

describe('TinyMCE Controls Modal', () => {
  it('modal is opened and view is non-circle', () => {
    const props = {
      modalOpen: true,
      settings: {
        archive_link: {
          show: true,
        },
      },
      prepareShortCode: jest.fn(),
    };

    const tree = renderer.create(<WebStoriesModal {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('modal is opened and view is circle', () => {
    isView.mockImplementationOnce((view) => view === 'circles');

    const props = {
      modalOpen: true,
      settings: {
        archive_link: {
          show: true,
        },
      },
      prepareShortCode: jest.fn(),
    };

    const tree = renderer.create(<WebStoriesModal {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
