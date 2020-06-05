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

describe('LibraryTabs integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('keyboad navigation', () => {
    beforeEach(async () => {
      const textTab = fixture.container.querySelector('#library-tab-media');
      await fixture.events.focus(textTab);
    });

    it('should be on the media tab', async () => {
      await fixture.waitOnScreen(
        fixture.container.querySelector('#library-pane-media')
      );
      await fixture.snapshot();
    });

    fit('should switch tabs on left and right keys', async () => {
      await fixture.events.keyboard.press('ArrowRight');

      // @todo: what's the best way to confirm switching of a tab?
      await fixture.waitOnScreen(
        fixture.container.querySelector('#library-pane-text')
      );
      await fixture.snapshot('on text pane');

      await fixture.events.keyboard.press('ArrowRight');

      await fixture.waitOnScreen(
        fixture.container.querySelector('#library-pane-shapes')
      );
      await fixture.snapshot('on text pane');

      await fixture.events.keyboard.press('ArrowLeft');

      await fixture.waitOnScreen(
        fixture.container.querySelector('#library-pane-text')
      );

      await fixture.events.keyboard.press('ArrowLeft');
      await fixture.waitOnScreen(
        fixture.container.querySelector('#library-pane-media')
      );
    });
  });
});
