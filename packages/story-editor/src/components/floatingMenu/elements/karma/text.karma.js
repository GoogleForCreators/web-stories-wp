/*
 * Copyright 2022 Google LLC
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
import { within } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../../karma';
import { useStory } from '../../../../app/story';

describe('Design Menu: Text Styles', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ floatingMenu: true });
    await fixture.render();

    await fixture.collapseHelpCenter();

    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should allow whole number font sizes', async () => {
    const menuList = await fixture.screen.findByRole('region', {
      name: 'Design menu',
    });

    const fontSize = await within(menuList).findByLabelText('Font size');

    const size = 42;

    await fixture.events.focus(fontSize);
    await fixture.events.keyboard.type(`${size}`);
    await fixture.events.keyboard.press('tab');

    const {
      state: {
        currentPage: { elements },
      },
    } = await fixture.renderHook(() => useStory());
    expect(elements[1].fontSize).toBe(size);
  });

  it('should allow fractional font sizes', async () => {
    const menuList = await fixture.screen.findByRole('region', {
      name: 'Design menu',
    });

    const fontSize = await within(menuList).findByLabelText('Font size');

    const size = 15.25;

    await fixture.events.focus(fontSize);
    await fixture.events.keyboard.type(`${size}`);
    await fixture.events.keyboard.press('tab');

    const {
      state: {
        currentPage: { elements },
      },
    } = await fixture.renderHook(() => useStory());
    expect(elements[1].fontSize).toBe(size);
  });
});
