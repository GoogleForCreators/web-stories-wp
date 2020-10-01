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
import { Fixture } from '../../../../../../karma/fixture';
import { useStory } from '../../../../../../app/story';

describe('Text Sets Library Panel', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ showTextSets: true });

    await fixture.render();

    // Make Text tab active in library panels
    const textTab = fixture.editor.library.getByRole('tab', {
      name: /^Text library$/,
    });

    await fixture.events.mouse.clickOn(textTab, 10, 20);
  });

  afterEach(() => {
    fixture.restore();
  });

  async function getTextElements() {
    const {
      state: {
        currentPage: { elements },
      },
    } = await fixture.renderHook(() => useStory());
    return elements.filter((e) => e.type === 'text');
  }

  describe('CUJ: Text Sets (Text and Shape Combinations): Inserting Text Sets', () => {
    // Disable reason: not implemented yet.
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should display text sets', async () => {});

    it('should allow inserting text sets', async () => {
      const textSet = await waitFor(
        () =>
          fixture.editor.library.getAllByRole('listitem', {
            name: /^Insert Text Set$/,
          })[0]
      );

      // The page should start off with no text elements
      expect((await getTextElements()).length).toBe(0);

      await fixture.events.mouse.clickOn(textSet, 25, 25);

      // After text set has been added, there should some text elements
      expect((await getTextElements()).length).toBeGreaterThan(0);
    });

    it('should allow user to drag and drop text set onto page', async () => {
      const textSet = await waitFor(
        () =>
          fixture.editor.library.getAllByRole('listitem', {
            name: /^Insert Text Set$/,
          })[0]
      );

      const page = fixture.editor.canvas.fullbleed.container;

      // The page should start off with no text elements
      expect((await getTextElements()).length).toBe(0);

      await fixture.events.mouse.moveRel(textSet, 25, 25);
      await fixture.events.mouse.down();

      await fixture.events.mouse.moveRel(page, 50, 100);
      await fixture.snapshot('Text set dragged');
      await fixture.events.mouse.up();

      // After text set has been added, there should some text elements
      await fixture.snapshot('Text set added');
      expect((await getTextElements()).length).toBeGreaterThan(0);
    });
  });
});
