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
import { Fixture } from '../../../karma';
import { initHelpers } from './_utils';

describe('Rich text editor: Inline style override', () => {
  const data = {};

  const { getTextContent, addInitialText } = initHelpers(data);

  beforeEach(async () => {
    data.fixture = new Fixture();
    await data.fixture.render();

    await addInitialText();
  });

  afterEach(() => {
    data.fixture.restore();
  });

  it('should have the correct initial text and formatting', () => {
    expect(getTextContent()).toBe('Fill in some text');
  });

  it('should have correct formatting when pressing mod+b for bold, then inserting text', async () => {
    // Enter edit-mode
    await data.fixture.events.keyboard.press('Enter');

    // Place cursor after second character
    await data.fixture.events.keyboard.press('ArrowLeft');
    await data.fixture.events.keyboard.press('ArrowRight');
    await data.fixture.events.keyboard.press('ArrowRight');

    // Toggle bold by keyboard command
    await data.fixture.events.keyboard.shortcut('mod+b');

    // Type "foo"
    await data.fixture.events.keyboard.type('foo');

    // Exit edit-mode
    await data.fixture.events.keyboard.press('Escape');

    // Expect correct result
    const actual = getTextContent();
    const expected =
      'Fi<span style="font-weight: 700">foo</span>ll in some text';
    expect(actual).toBe(expected);
  });
});
