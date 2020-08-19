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

describe('TextFrame integration', () => {
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

  describe('interop with edit mode', () => {
    let element;
    let frame;
    let editor;
    let canvas;

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
      canvas = fixture.querySelector('[data-testid="fullbleed"]');
    });

    it('clicking', async () => {
      await fixture.events.mouse.clickOn(canvas);

      frame = fixture.editor.canvas.framesLayer.frame(element.id);

      await fixture.events.click(frame.node, { clickCount: 3 });

      await fixture.events.keyboard.type('hello world after select element!');

      editor = fixture.querySelector(`[data-testid="textEditor"]`);
      await fixture.events.mouse.clickOn(editor, -10, 0);

      const storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds).toEqual([element.id]);
      expect(storyContext.state.selectedElements[0].content).toEqual(
        'hello world after select element!'
      );

      expect(frame.node.textContent).toEqual(
        'hello world after select element!'
      );
    });

    it('pressing Enter', async () => {
      await fixture.events.mouse.clickOn(canvas);

      frame = fixture.editor.canvas.framesLayer.frame(element.id);

      await fixture.events.mouse.clickOn(frame.node);

      await fixture.events.keyboard.press('Enter');

      await fixture.events.keyboard.type('hello world after press Enter!');

      editor = fixture.querySelector(`[data-testid="textEditor"]`);
      await fixture.events.mouse.clickOn(editor, -10, 0);

      const storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds).toEqual([element.id]);
      expect(storyContext.state.selectedElements[0].content).toEqual(
        'hello world after press Enter!'
      );

      expect(frame.node.textContent).toEqual('hello world after press Enter!');
    });

    it('typing', async () => {
      await fixture.events.mouse.clickOn(canvas);

      frame = fixture.editor.canvas.framesLayer.frame(element.id);

      await fixture.events.mouse.clickOn(frame.node);

      await fixture.events.keyboard.type('hello world after type!');

      editor = fixture.querySelector(`[data-testid="textEditor"]`);
      await fixture.events.mouse.clickOn(editor, -10, 0);

      const storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds).toEqual([element.id]);
      expect(storyContext.state.selectedElements[0].content).toEqual(
        'hello world after type!'
      );

      expect(frame.node.textContent).toEqual('hello world after type!');
    });
  });
});
