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
import { waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../karma';

describe('ColorPicker', () => {
  ['LTR', 'RTL'].forEach((direction) => {
    describe(`when document is in ${direction} mode`, () => {
      let fixture;

      beforeEach(async () => {
        fixture = new Fixture();
        fixture.setConfig({ isRTL: direction === 'RTL' });
        await fixture.render();
      });

      afterEach(() => {
        fixture.restore();
      });

      it('should display correctly', async () => {
        // Click the background element
        await fixture.events.click(
          fixture.editor.canvas.framesLayer.frames[0].node
        );

        const bgPanel = fixture.editor.inspector.designPanel.pageBackground;

        // Click the background page panel color preview
        await fixture.events.click(bgPanel.backgroundColor.button);

        await waitFor(() =>
          expect(bgPanel.backgroundColor.picker).toBeDefined()
        );

        // Snapshot it
        await fixture.snapshot();
      });
    });
  });
});
