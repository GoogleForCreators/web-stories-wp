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
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import * as Utils from '..';
import store from '../../store';

/**
 * Test shortcode build function.
 */
describe('Test shortcode is preparation', () => {
  beforeAll(() => {
    dispatch(store).setViewSettings('circles', {
      order: 'latest',
      dummy: {
        show: true,
        label: 'Dummy Text',
        hidden: true,
      },
    });
  });

  it('editor instance not set', () => {
    const shortCode = Utils.prepareShortCode();
    expect(shortCode).toBe('[web_stories /]');
  });

  it('editor instance set', () => {
    dispatch(store).setEditor('test_editor');
    const shortCode = Utils.prepareShortCode();
    expect(shortCode).toBe('[web_stories order="latest" dummy="true" /]');
  });
});
