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
/**
 * External dependencies
 */
import { screen, waitFor } from '@testing-library/react';
import { Fixture } from '../../../../../karma';
import { useStory } from '../../../../../app/story';

describe('Page background audio panel', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('Page background audio', () => {
    beforeEach(async () => {
      await fixture.events.click(fixture.editor.sidebar.designTab);
      await clickCanvas();
    });

    it('should able to upload background audio ', async () => {
      await fixture.events.click(
        fixture.editor.sidebar.designPanel.pageBackgroundAudio.uploadButton
      );
      const storyContext = await fixture.renderHook(() => useStory());
      expect(
        storyContext.state.currentPage.backgroundAudio.resource.src
      ).not.toBeNull();
    });

    it('should able to hotlink background audio ', async () => {
      await fixture.events.click(
        fixture.editor.sidebar.designPanel.pageBackgroundAudio.hotlinkButton
      );
      const input = fixture.screen.getByRole('textbox', { name: 'URL' });
      const insertBtn = fixture.screen.getByRole('button', {
        name: 'Use audio file',
      });
      await fixture.events.click(input);
      await fixture.events.keyboard.type(
        'http://localhost:9876/__static__/audio.mp3'
      );

      await fixture.events.click(insertBtn);
      await fixture.events.sleep(500);
      const storyContext = await fixture.renderHook(() => useStory());
      expect(
        storyContext.state.currentPage.backgroundAudio.resource.src
      ).toMatch('http://localhost:9876/__static__/audio.mp3');
    });

    it('should not able to hotlink background audio with invalid', async () => {
      await fixture.events.click(
        fixture.editor.sidebar.designPanel.pageBackgroundAudio.hotlinkButton
      );
      const input = fixture.screen.getByRole('textbox', { name: 'URL' });
      const insertBtn = fixture.screen.getByRole('button', {
        name: 'Use audio file',
      });
      await fixture.events.click(input);
      await fixture.events.keyboard.type(
        'http://localhost:9876/__static__/ranger9.jpg'
      );

      await fixture.events.click(insertBtn);
      await fixture.events.sleep(500);
      const dialog = screen.getByRole('dialog');
      await waitFor(() => expect(dialog.textContent).toContain('Invalid link'));
    });
  });

  async function clickCanvas() {
    const focusContainer = fixture.screen.getByTestId('canvas-focus-container');
    await fixture.events.click(focusContainer);
  }
});
