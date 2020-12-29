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
//import { forEach, isEmpty, webStoriesData } from '../../utils/globals';
/**
 * Internal dependencies
 */
import TinyMCEToggle from '../../components/controls/Toggle';
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
}));

jest.mock('../../utils/globals', () => ({
  forEach: () => {},
  isEmpty: () => {},
  webStoriesData: {
    views: [],
    orderlist: [],
  },
}));

jest.mock('../../components/controls/Toggle', () => 'TinyMCEToggle');

describe('TinyMCE Controls Modal', () => {
  it('modal is opened', () => {
    const props = {
      modalOpen: true,
      settings: {},
      prepareShortCode: jest.fn(),
    };

    const tree = renderer.create(<WebStoriesModal {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
