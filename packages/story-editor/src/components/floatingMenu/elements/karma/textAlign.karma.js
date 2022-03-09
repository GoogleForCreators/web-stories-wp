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
import { Fixture } from '../../../../karma';
import { useStory } from '../../../../app/story';

describe('Design Menu: Text alignment', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ floatingMenu: true });
    try {
      await fixture.render();
    } catch {
      // ignore
    }

    await fixture.collapseHelpCenter();

    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
  });

  afterEach(() => {
    fixture.restore();
  });

  const getTextAlignForSelectedElement = async () => {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElements[0].textAlign || 'left';
  };

  const alignments = [
    {
      value: 'left',
      label: 'Align text left',
      otherLabel: 'Align text center',
    },
    {
      value: 'center',
      label: 'Align text center',
      otherLabel: 'Align text left',
    },
    {
      value: 'right',
      label: 'Align text right',
      otherLabel: 'Align text left',
    },
    {
      value: 'justify',
      label: 'Align text justified',
      otherLabel: 'Align text left',
    },
  ];

  alignments.forEach(({ value, label, otherLabel }) => {
    it(`should display the correct control when the alignment is "${value}"`, async () => {
      // Select the relevant alignment in the text style panel
      await fixture.events.click(
        fixture.editor.inspector.designPanel.textStyle.align(label)
      );

      // Check that the value on the element matches
      expect(await getTextAlignForSelectedElement()).toBe(value);

      // Check that the icon in the  matches
      expect(fixture.editor.canvas.designMenu.textAlignType).toBe(value);

      // Click the input and check the icon in the sub menu
      await fixture.events.click(fixture.editor.canvas.designMenu.textAlign);
      const alignOption =
        fixture.editor.canvas.designMenu.textAlignOption(label);
      expect(alignOption.getAttribute('aria-pressed')).toBe('true');
    });

    it(`should set the alignment to "${value}" when selected`, async () => {
      // Select another alignment in the text style panel
      await fixture.events.click(
        fixture.editor.inspector.designPanel.textStyle.align(otherLabel)
      );

      // Check that the value on the element is not a match
      expect(await getTextAlignForSelectedElement()).not.toBe(value);

      // Click the input and click the correct option in the sub menu
      await fixture.events.click(fixture.editor.canvas.designMenu.textAlign);
      await fixture.events.click(
        fixture.editor.canvas.designMenu.textAlignOption(label)
      );

      // Check that the value on the element now is a match
      expect(await getTextAlignForSelectedElement()).toBe(value);
    });
  });
});
