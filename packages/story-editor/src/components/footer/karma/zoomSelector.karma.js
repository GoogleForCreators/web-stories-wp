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

describe('Zoom selector', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();

    // Add an image to the canvas to make it more visual when things move
    await fixture.events.mouse.clickOn(
      fixture.editor.library.media.item(0),
      20,
      20
    );

    // Add some matchers not generally useful, but applicable in this file
    jasmine.addMatchers({
      toBeVerticallyScrollable: () => ({
        compare: function (actual) {
          const { scrollHeight, clientHeight } = actual;
          const pass = scrollHeight > clientHeight;
          return {
            pass,
            message: pass
              ? `Expected element to not be vertically scrollable, but overflows ${
                  clientHeight - scrollHeight
                } pixels`
              : `Expected element to be vertically scrollable`,
          };
        },
      }),
      toBeHorizontallyScrollable: () => ({
        compare: function (actual) {
          const { scrollWidth, clientWidth } = actual;
          const pass = scrollWidth > clientWidth;
          return {
            pass,
            message: pass
              ? `Expected element to not be horizontally scrollable, but overflows ${
                  clientWidth - scrollWidth
                } pixels`
              : `Expected element to be horizontally scrollable`,
          };
        },
      }),
      toHaveSize: () => ({
        compare: function (actual, width, height) {
          const { clientWidth, clientHeight } = actual;
          // 1px differences due to rounding are OK.
          const pass =
            Math.abs(clientWidth - width) <= 1 &&
            Math.abs(clientHeight - height) <= 1;
          return {
            pass,
            message: pass
              ? `Expected element to not be ${width}x${height} pixels`
              : `Expected element to be ${width}x${height} pixels, but found it to be ${clientWidth}x${clientHeight} pixels`,
          };
        },
      }),
    });
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should always show zoom selector in primary menu', () => {
    const { zoomSelector } = fixture.editor.footer;
    expect(zoomSelector).not.toBeNull();
  });

  it('should default set zoom to FIT and have no scroll', async () => {
    const { zoomSelector } = fixture.editor.footer;
    expect(zoomSelector.node).toHaveTextContent('Fit');

    const { scrollContainer } = fixture.editor.canvas.framesLayer;
    expect(scrollContainer).not.toBeVerticallyScrollable();
    expect(scrollContainer).not.toBeHorizontallyScrollable();

    await fixture.snapshot();
  });

  it('should allow setting zoom to 100% and work correctly', async () => {
    const { zoomSelector } = fixture.editor.footer;

    await fixture.events.click(zoomSelector.select);
    await fixture.events.sleep(300);
    await fixture.events.click(await zoomSelector.option('100%'));
    await fixture.events.sleep(300);

    const { scrollContainer, fullbleed } = fixture.editor.canvas.framesLayer;
    // 100% is actually smaller than FIT because we are using such a large browser window
    expect(scrollContainer).not.toBeVerticallyScrollable();
    expect(scrollContainer).not.toBeHorizontallyScrollable();

    expect(fullbleed).toHaveSize(408, 725);

    await fixture.snapshot();
  });

  it('should allow setting zoom to FILL and work correctly', async () => {
    const { zoomSelector } = fixture.editor.footer;

    await fixture.events.click(zoomSelector.select);
    await fixture.events.sleep(300);
    await fixture.events.click(await zoomSelector.option('Fill'));
    await fixture.events.sleep(300);

    const { scrollContainer } = fixture.editor.canvas.framesLayer;
    expect(scrollContainer).toBeVerticallyScrollable();
    expect(scrollContainer).not.toBeHorizontallyScrollable();

    await fixture.snapshot();
  });

  it('should allow setting zoom to 200% and work correctly', async () => {
    const { zoomSelector } = fixture.editor.footer;

    await fixture.events.click(zoomSelector.select);
    await fixture.events.sleep(300);
    await fixture.events.click(await zoomSelector.option('200%'));
    await fixture.events.sleep(300);

    const { scrollContainer, fullbleed } = fixture.editor.canvas.framesLayer;
    // 200% still isn't big enough to force a horizontal scrollbar
    expect(scrollContainer).toBeVerticallyScrollable();
    expect(scrollContainer).not.toBeHorizontallyScrollable();

    expect(fullbleed).toHaveSize(816, 1451);

    await fixture.snapshot();

    // Scroll down by 100px in the frame scroll container and validate, that the display
    // scroll container is offset the same amount
    const { fullbleed: displayFullbleed } = fixture.editor.canvas.displayLayer;
    scrollContainer.scrollBy(0, 100);
    expect(scrollContainer.scrollTop).toBe(100);

    // Wait for scroll event to be handled
    await fixture.events.sleep(100);
    expect(displayFullbleed).toHaveStyle('top', '-100px');

    await fixture.snapshot('Scrolled 100px down');
  });
});
