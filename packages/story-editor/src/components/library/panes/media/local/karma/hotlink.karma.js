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
import { screen, waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */

import { Fixture } from '../../../../../../karma/fixture';
import { useStory } from '../../../../../../app/story';

describe('Embedding hotlinked media', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  async function getElements() {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.currentPage.elements;
  }

  it('should not allow embedding media from an invalid link', async () => {
    const button = fixture.screen.getByRole('button', {
      name: 'Insert by link',
    });
    await fixture.events.click(button);
    const input = fixture.screen.getByRole('textbox', { name: 'URL' });
    const insertBtn = fixture.screen.getByRole('button', {
      name: 'Insert',
    });

    // Try inserting from a string that's not a link at all.
    await fixture.events.click(input);
    await fixture.events.keyboard.type('d');
    await fixture.events.click(insertBtn);
    let dialog = screen.getByRole('dialog');
    await waitFor(() => expect(dialog.textContent).toContain('Invalid link'));

    // Delete the value, verify now the informative message show instead again.
    await fixture.events.click(input, { clickCount: 3 });
    await fixture.events.keyboard.press('Del');
    dialog = screen.getByRole('dialog');
    await waitFor(() => expect(dialog.textContent).toContain('You can insert'));

    await fixture.events.click(input);
    await fixture.events.keyboard.type('https://example.jpgef');
    await fixture.events.click(insertBtn);

    await fixture.events.sleep(500);
    dialog = screen.getByRole('dialog');
    await waitFor(() => expect(dialog.textContent).toContain('Invalid link'), {
      timeout: 1500,
    });
  });

  it('should insert a new media element from valid url', async () => {
    spyOn(window, 'fetch').and.callFake(() => {
      return true;
    });

    // Get URL from existing library.
    const libraryElement = fixture.editor.library.media.item(0);
    const img = libraryElement.getElementsByTagName('img')[0];

    const button = fixture.screen.getByRole('button', {
      name: 'Insert by link',
    });
    await fixture.events.click(button);
    const input = fixture.screen.getByRole('textbox', { name: 'URL' });
    const insertBtn = fixture.screen.getByRole('button', {
      name: 'Insert',
    });
    await fixture.events.click(input);
    await fixture.events.keyboard.type(img.src);
    await fixture.events.click(insertBtn);

    const elements = await getElements();
    expect(elements[1].resource.src).toBe(img.src);
  });

  it('should insert a new media element from valid url using proxy', async () => {
    // Let's throw an error when checking for HEAD, forcing to use the CORS proxy.
    spyOn(window, 'fetch').and.callFake(() => {
      throw new Error();
    });

    const button = fixture.screen.getByRole('button', {
      name: 'Insert by link',
    });
    await fixture.events.click(button);
    const input = fixture.screen.getByRole('textbox', { name: 'URL' });
    const insertBtn = fixture.screen.getByRole('button', {
      name: 'Insert',
    });
    await fixture.events.click(input);
    await fixture.events.keyboard.type(
      'http://localhost:9876/__static__/saturn.jpg'
    );
    await fixture.events.click(insertBtn);

    const elements = await getElements();
    expect(elements[1].resource.src).toBe(
      'http://localhost:9876/__static__/saturn.jpg'
    );
  });
});
