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
import { waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../../../karma';

describe('Text Panel', () => {
  describe('Text Panel: Contrast Warning', () => {
    let fixture;

    beforeEach(async () => {
      fixture = new Fixture();
      await fixture.render();
      await fixture.collapseHelpCenter();
    });

    afterEach(() => {
      fixture.restore();
    });

    it('should show contrast warning', async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
      await waitFor(() => fixture.editor.canvas.framesLayer.frames[1].node);
      //change font color to white
      await fixture.events.click(
        fixture.editor.inspector.designPanel.textStyle.fontColor.button
      );
      await waitFor(() =>
        fixture.events.click(
          fixture.screen.getByRole('option', { name: '#fff' })
        )
      );
      // check that the warning icon is on screen
      await expect(fixture.screen.queryByTitle('Low Warning')).toBeDefined();
      // change font color back to black
      await waitFor(() =>
        fixture.events.click(
          fixture.screen.getByRole('option', { name: '#000' })
        )
      );
      // Check that the warning icon has been removed from screen. We cannot check
      // for the text, since useLiveRegion will leave the message on the dom.
      await expect(fixture.screen.queryByTitle('Low Warning')).toBeNull();
    });
  });
});
