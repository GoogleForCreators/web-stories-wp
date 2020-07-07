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
import { Fixture } from './fixture';

describe('CUJ: Creator can Add a Page Attachment', () => {
  describe('Action: Add Page Attachment', () => {
    let fixture;
    const setPageAttachmentLink = async (link) => {
      const input = fixture.screen.getByLabelText('Edit: Page Attachment link');
      await fixture.events.click(input, { clickCount: 3 });
      await fixture.events.keyboard.type(link);
      await input.dispatchEvent(new window.Event('blur'));
    };

    const setCtaText = async (text) => {
      const input = fixture.screen.getByLabelText(
        'Edit: Page Attachment CTA text'
      );
      await fixture.events.click(input, { clickCount: 3 });
      await fixture.events.keyboard.type(text);
      await input.dispatchEvent(new window.Event('blur'));
    };

    const clickOnTarget = async (target) => {
      const { x, y, width, height } = target.getBoundingClientRect();
      await fixture.events.mouse.click(x + width / 2, y + height / 2);
    };

    beforeEach(async () => {
      fixture = new Fixture();
      await fixture.render();
      // Select Page by default.
      const safezone = fixture.querySelector('[data-testid="safezone"]');
      await clickOnTarget(safezone);
    });

    afterEach(() => {
      fixture.restore();
    });

    it('it should allow adding Page Attachment with custom CTA Text', async () => {
      await setPageAttachmentLink('http://example.com');
      await setCtaText('Click me!');
      const ctaText = fixture.screen.getByText('Click me!');
      expect(ctaText).toBeDefined();
    });

    // Disable reason: Not implemented yet
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('it should display warning for a link in the Page Attachment Area');

    // Disable reason: Not implemented yet
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('it should display warning for an invalid link');
  });

  describe('Action: Remove Page Attachment', () => {
    // Disable reason: Not implemented yet
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('it should allow removing a Page Attachment');
  });

  describe('Action: Transforming link with Page Attachment', () => {
    // Disable reason: Not implemented yet
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('it should display tooltip for a link in Attachment area');

    // Disable reason: Not implemented yet
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('it should cancel link transformation ending in Attachment area');
  });
});
