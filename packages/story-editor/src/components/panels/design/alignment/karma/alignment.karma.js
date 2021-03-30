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
import { Fixture } from '../../../../../karma';
import { useStory } from '../../../../../app/story';

describe('Alignment Panel', () => {
  let fixture;

  let textA;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

    textA = (await getElements())[0].id;
  });

  afterEach(() => {
    fixture.restore();
  });

  // Disable reason: not implemented yet
  // eslint-disable-next-line jasmine/no-disabled-tests
  xit('should have no active alignment buttons');

  describe('When there is one element on canvas', () => {
    beforeEach(async () => {
      // Add first text element
      await fixture.events.click(fixture.editor.library.textAdd);

      // It will correctly be selected now
    });

    describe('CUJ: Creator can Transform an Element: Align element to page', () => {
      it('should not show a border when focusing an alignment button using mouse', async () => {
        // Click left align
        await fixture.events.click(
          fixture.editor.inspector.designPanel.alignment.left
        );

        // Expect button to have focus
        expect(
          fixture.editor.inspector.designPanel.alignment.left
        ).toHaveFocus();

        // Expect element to be left-aligned
        const textFrame = fixture.editor.canvas.framesLayer.frame(textA);
        expect(textFrame.node).toHaveStyle('left', '0px');

        // Get screenshot with left-aligned element and button without visible outline
        await fixture.snapshot(
          'Element is left-aligned, "Left align" has no visible focus'
        );
      });

      it('should show a border when focusing an alignment button using keyboard', async () => {
        // Click left align
        await fixture.events.click(
          fixture.editor.inspector.designPanel.alignment.left
        );

        // Press "tab" once - focus should now be on "center align"
        await fixture.events.keyboard.press('tab');
        expect(
          fixture.editor.inspector.designPanel.alignment.center
        ).toHaveFocus();

        // Expect "center align" button to have visible outline
        await fixture.snapshot(
          'Element is left-aligned, "Center align" has visible focus'
        );
      });

      // Disable reason: not implemented yet
      // eslint-disable-next-line jasmine/no-disabled-tests
      xit('should have the correct active alignment buttons');

      // Disable reason: not implemented yet
      // eslint-disable-next-line jasmine/no-disabled-tests
      xit('should align element left on canvas');

      // Disable reason: not implemented yet
      // eslint-disable-next-line jasmine/no-disabled-tests
      xit('should align element center on canvas');

      // Disable reason: not implemented yet
      // eslint-disable-next-line jasmine/no-disabled-tests
      xit('should align element right on canvas');

      // Disable reason: not implemented yet
      // eslint-disable-next-line jasmine/no-disabled-tests
      xit('should align element top on canvas');

      // Disable reason: not implemented yet
      // eslint-disable-next-line jasmine/no-disabled-tests
      xit('should align element middle on canvas');

      // Disable reason: not implemented yet
      // eslint-disable-next-line jasmine/no-disabled-tests
      xit('should align element bottom on canvas');
    });

    describe('CUJ: Creator can Transform an Element: Align element to on another', () => {
      // Disable reason: not implemented yet
      // eslint-disable-next-line jasmine/no-disabled-tests
      xdescribe('When there are two elements on canvas', () => {
        beforeEach(async () => {
          // Add second text element
          await fixture.events.click(fixture.editor.library.textAdd);

          // TODO: move second text element to appropriate place

          // TODO: Select both
        });

        it('should have the correct active alignment buttons');

        it('should align elements left');

        it('should align elements center');

        it('should align elements right');

        it('should align elements top');

        it('should align elements middle');

        it('should align elements bottom');

        describe('When there are three elements on canvas', () => {
          beforeEach(async () => {
            // Add third text element
            await fixture.events.click(fixture.editor.library.textAdd);

            // TODO: move third text element to appropriate place

            // TODO: Select all three
          });

          it('should have the correct active alignment buttons');

          it('should distribute elements horizontally');

          it('should distribute elements vertically');
        });
      });
    });
  });

  async function getElements() {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.currentPage.elements;
  }
});
