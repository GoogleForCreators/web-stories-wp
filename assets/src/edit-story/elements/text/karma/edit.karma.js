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

fdescribe('TextEdit integration', () => {
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
          x: 40,
          y: 40,
          width: 250,
        })
      );

      frame = fixture.editor.canvas.framesLayer.frame(element.id).node;
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

      it('should mount editor', async () => {
        expect(editor).toBeTruthy();
        expect(editLayer).toBeTruthy();
        await fixture.snapshot();
      });

      it('should handle a command, exit and save', async () => {
        const draft = editor.querySelector('[contenteditable="true"]');

        // Select all.
        await fixture.events.click(draft, { clickCount: 3 });

        expect(boldToggle.checked).toEqual(false);

        await fixture.snapshot('before mod+b');

        await fixture.events.keyboard.shortcut('mod+b');

        await fixture.snapshot('after mod+b');

        expect(boldToggle.checked).toEqual(true);

        // Exit edit mode by clicking right outside the editor.
        await fixture.events.mouse.seq(({ moveRel, down }) => [
          moveRel(editor, -10),
          down(),
        ]);

        expect(fixture.querySelector('[data-testid="textEditor"]')).toBeNull();

        // The element is still selected and updated.
        const storyContext = await fixture.renderHook(() => useStory());
        expect(storyContext.state.selectedElementIds).toEqual([element.id]);
        expect(storyContext.state.selectedElements[0].content).toEqual(
          '<span style="font-weight: 700">hello world!</span>'
        );

        // The content is updated in the frame.
        // @todo: What to do with `<p>` and containers?
        expect(frame.querySelector('p').innerHTML).toEqual(
          '<span style="font-weight: 700">hello world!</span>'
        );
      });
    });

    describe('shortcuts', () => {
      it('should enter/exit edit mode using the keyboard', async () => {
        // Enter edit mode using the Enter key
        expect(fixture.querySelector('[data-testid="textEditor"]')).toBeNull();
        await fixture.events.keyboard.press('Enter');
        expect(
          fixture.querySelector('[data-testid="textEditor"]')
        ).toBeDefined();

        // Exit edit mode using the Esc key
        await fixture.events.keyboard.press('Esc');
        expect(fixture.querySelector('[data-testid="textEditor"]')).toBeNull();
      });
    });
  });

  fdescribe('add a multiline text element', () => {
    let element;
    let frame;
    const textWithMultipleLinebreaks =
      '\n\nThis is some test text.\n\nThis is more test text.\n\n';

    beforeEach(async () => {
      const insertElement = await fixture.renderHook(() => useInsertElement());

      element = await fixture.act(() =>
        insertElement('text', {
          font: TEXT_ELEMENT_DEFAULT_FONT,
          content: textWithMultipleLinebreaks,
          x: 40,
          y: 40,
          width: 400,
        })
      );

      frame = fixture.editor.canvas.framesLayer.frame(element.id).node;
    });

    it('should render initial content', () => {
      expect(frame.textContent).toEqual(textWithMultipleLinebreaks);
    });

    fdescribe('edit mode', () => {
      let editor;
      let editLayer;

      beforeEach(async () => {
        // await fixture.events.click(frame);
        // editor = fixture.querySelector('[data-testid="textEditor"]');
        // editLayer = fixture.querySelector('[data-testid="editLayer"]');
      });

      it('wip', () => {
        debugger;
      });
    });
  });
});
