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
import useInsertElement from '../../../components/canvas/useInsertElement';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../app/font/defaultFonts';
import { useStory } from '../../../app/story';
import { Fixture } from '../../../karma/fixture';

describe('Text Style Panel', () => {
  let fixture;

  const addText = async (extraProps = null) => {
    const insertElement = await fixture.renderHook(() => useInsertElement());
    await fixture.act(() =>
      insertElement('text', {
        font: TEXT_ELEMENT_DEFAULT_FONT,
        content: 'hello world!',
        x: 40,
        y: 40,
        width: 250,
        ...extraProps,
      })
    );
  };

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await addText();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('Font controls', () => {
    it('should allow whole number font sizes', async () => {
      const { fontSize } = fixture.editor.inspector.designPanel.textStyle;

      const size = 42;

      await fixture.events.focus(fontSize);
      await fixture.events.keyboard.type(`${size}`);
      await fixture.events.keyboard.press('tab');

      const {
        state: {
          currentPage: { elements },
        },
      } = await fixture.renderHook(() => useStory());
      expect(elements[1].fontSize).toBe(size);
    });

    it('should allow fractional font sizes', async () => {
      const { fontSize } = fixture.editor.inspector.designPanel.textStyle;

      const size = 15.25;

      await fixture.events.focus(fontSize);
      await fixture.events.keyboard.type(`${size}`);
      await fixture.events.keyboard.press('tab');

      const {
        state: {
          currentPage: { elements },
        },
      } = await fixture.renderHook(() => useStory());
      expect(elements[1].fontSize).toBe(size);
    });
  });
});
