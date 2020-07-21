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
import createSolidFromString from '../utils/createSolidFromString';
import useInsertElement from '../components/canvas/useInsertElement';
import { Fixture } from './fixture';

describe('CUJ: Creator Can Add A Link', () => {
  let fixture;
  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('Action: Add Web Address', () => {
    let frame;
    const addElement = async () => {
      const insertElement = await fixture.renderHook(() => useInsertElement());
      const element = await fixture.act(() =>
        insertElement('shape', {
          backgroundColor: createSolidFromString('#ff00ff'),
          mask: { type: 'rectangle' },
          x: 10,
          y: 10,
          width: 50,
          height: 50,
        })
      );
      frame = fixture.editor.canvas.framesLayer.frame(element.id).node;
    };
    const clickOnTarget = async (target) => {
      const { x, y, width, height } = target.getBoundingClientRect();
      await fixture.events.mouse.click(x + width / 2, y + height / 2);
    };
    const addLink = async (link) => {
      // Type in link.
      const input = fixture.screen.getByLabelText('Edit: Element link');
      await fixture.events.click(input);
      await fixture.events.keyboard.type(link);
    };

    it('should add protocol automatically on blurring', async () => {
      await addElement();
      await clickOnTarget(frame);
      await addLink('example.com');
      const input = fixture.screen.getByLabelText('Edit: Element link');
      await input.dispatchEvent(new window.Event('blur'));
      expect(input.value).toBe('http://example.com');
    });

    it('should not add additional protocol if already present', async () => {
      await addElement();
      await clickOnTarget(frame);
      await addLink('https://example.com');
      const input = fixture.screen.getByLabelText('Edit: Element link');
      await input.dispatchEvent(new window.Event('blur'));
      expect(input.value).toBe('https://example.com');
    });
  });
});
