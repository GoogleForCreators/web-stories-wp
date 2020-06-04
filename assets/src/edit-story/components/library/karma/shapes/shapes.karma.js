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
import { act } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../../karma/fixture';

describe('TextEdit integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();

    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should render ok', () => {
    expect(
      fixture.container.querySelector('[data-testid="fullbleed"]')
    ).toBeTruthy();
  });

  it('add shape via clicking on shape preview', async () => {
    let shapes = await fixture.container.querySelectorAll(
      '[data-testid="safezone"] [d="M 0.5 0 L 1 1 L 0 1 Z"]'
    );
    expect(shapes.length).toBe(0);

    await act(async () => {
      await fixture.events.click(
        fixture.querySelector(`[id="library-tab-shapes"]`)
      );
      await fixture.events.click(
        fixture.querySelector('[aria-label="Triangle"]')
      );

      shapes = await fixture.container.querySelectorAll(
        '[data-testid="safezone"] [d="M 0.5 0 L 1 1 L 0 1 Z"]'
      );
    });
    expect(shapes.length).toBeGreaterThan(0);
  });

  xit('add shape via dragging from shape preview', async () => {
    // Skipping this test because drag and drop doesn't work properly in
    // puppeteer for now.
    let shapes = await fixture.container.querySelectorAll(
      '[data-testid="safezone"] [d="M 0.5 0 L 1 1 L 0 1 Z"]'
    );
    expect(shapes.length).toBe(0);

    await act(async () => {
      await fixture.events.click(
        fixture.querySelector(`[id="library-tab-shapes"]`)
      );
      // Move the mouse to the middel of the shape preview and start mouse press
      // down.
      const shapePreview = await fixture.querySelector(
        '[aria-label="Triangle"]'
      );
      const shapeBoundingBox = await shapePreview.getBoundingClientRect();
      await fixture.events.mouse.move(
        shapeBoundingBox.x + shapeBoundingBox.width / 2,
        shapeBoundingBox.y + shapeBoundingBox.height / 2
      );
      await fixture.events.mouse.down();

      // Move the mouse to the middle of the safe area and then mouse press up.
      const safezone = await fixture.querySelector('[data-testid="safezone"]');
      const safezoneBox = await safezone.getBoundingClientRect();

      await fixture.events.mouse.move(
        safezoneBox.x + safezoneBox.width / 2,
        safezoneBox.y + safezoneBox.height / 2,
        { steps: 100 }
      );

      await fixture.events.mouse.up();
    });

    shapes = await fixture.container.querySelectorAll(
      '[data-testid="safezone"] [d="M 0.5 0 L 1 1 L 0 1 Z"]'
    );
    expect(shapes.length).toBeGreaterThan(0);
  });
});
