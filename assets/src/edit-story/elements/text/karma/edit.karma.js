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
import { useStory } from '../../../app/story';
import { useInsertElement } from '../../../components/canvas';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../app/font/defaultFonts';

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

  describe('add a text', () => {
    let element;
    let frame;

    beforeEach(async () => {
      const insertElement = await fixture.renderHook(() => useInsertElement());
      element = await fixture.act(() =>
        insertElement('text', {
          font: TEXT_ELEMENT_DEFAULT_FONT,
          content: 'hello world!',
        })
      );

      frame = fixture.querySelector(
        `[data-element-id="${element.id}"] [data-testid="textFrame"]`
      );
    });

    it('should render initial content', () => {
      expect(frame.textContent).toEqual('hello world!');
    });

    describe('edit mode', () => {
      let editor;
      let editLayer;
      let boldToggle;

      beforeEach(async () => {
        await fixture.events.click(frame);
        editor = fixture.querySelector('[data-testid="textEditor"]');
        editLayer = fixture.querySelector('[data-testid="editLayer"]');
        boldToggle = fixture.querySelector('[data-testid="boldToggle"]');
      });

      it('should mount editor', () => {
        expect(editor).toBeTruthy();
        expect(editLayer).toBeTruthy();
      });

      it('should handle a commnad, exit and save', async () => {
        const draft = editor.querySelector('[contenteditable="true"]');
        await fixture.events.focus(draft);

        // Select all.
        await fixture.events.click(draft, { clickCount: 3 });

        expect(boldToggle.checked).toEqual(false);

        // @todo: Linux uses ctrlKey.
        // @todo: would be preferable to be more semantic here. E.g.
        // `keys('mod+B')`.
        await fixture.events.keyDown(draft, {
          key: 'b',
          code: 'KeyB',
          keyCode: 66,
          metaKey: true,
        });

        expect(boldToggle.checked).toEqual(true);

        // Exit edit mode.
        await fixture.events.mouseDown(editLayer);

        expect(fixture.querySelector('[data-testid="textEditor"]')).toBeNull();

        // The element is still selected and updated.
        const storyContext = await fixture.renderHook(() => useStory());
        expect(storyContext.state.selectedElementIds).toEqual([element.id]);
        expect(storyContext.state.selectedElements[0].content).toEqual(
          '<span style="font-weight: 700">hello world!</span>'
        );

        // The content is updated in the frame.
        expect(frame.innerHTML).toEqual(
          '<span style="font-weight: 700">hello world!</span>'
        );
      });
    });
  });
});
