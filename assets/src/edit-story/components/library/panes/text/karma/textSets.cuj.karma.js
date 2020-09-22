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
import { waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../../../karma/fixture';
import { useStory } from '../../../../../app/story';

describe('CUJ: Text Sets (Text and Shape Combinations): Using Text Sets', () => {
  let fixture;
  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.editor.library.textTab.click();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should display text sets', async () => {
    expect(fixture.editor.library.text.textSetList()).toBeTruthy();
    await waitFor(() =>
      expect(fixture.editor.library.text.textSets().length).toEqual(3)
    );
  });

  it('should allow inserting text sets', async () => {
    await waitFor(() =>
      expect(fixture.editor.library.text.textSets().length).toBeTruthy()
    );
    const textSets = fixture.editor.library.text.textSets();
    await fixture.events.click(textSets[1]);

    const storyContext = await fixture.renderHook(() => useStory());
    const selection = storyContext.state.selectedElements;
    expect(selection.length).toEqual(2);
    expect(selection[0].content).toContain('Good design is aesthetic');
    expect(selection[1].content).toContain('The possibilities for innovation');
  });

  it('should allow filtering text sets by category', async () => {
    await waitFor(() =>
      expect(
        fixture.editor.library.text.textSetFilter('Editorial')
      ).toBeTruthy()
    );
    await fixture.events.click(
      fixture.editor.library.text.textSetFilter('Editorial')
    );
    expect(fixture.editor.library.text.textSets().length).toBe(3);

    // @todo Add other filters, too.
    await fixture.events.click(
      fixture.editor.library.text.textSetFilter('Steps')
    );
    expect(fixture.editor.library.text.textSets().length).toBe(8);
  });

  it('should position the text sets as expected by category', async () => {
    await fixture.events.click(
      fixture.editor.library.text.textSetFilter('Editorial')
    );
    let textSets = fixture.editor.library.text.textSets();
    await fixture.events.click(textSets[0]);
    await fixture.snapshot('Editorial text set positioning');

    await fixture.events.click(
      fixture.editor.library.text.textSetFilter('List')
    );
    textSets = fixture.editor.library.text.textSets();
    await fixture.events.click(textSets[0]);
    await fixture.snapshot('List text set positioning');

    await fixture.events.click(
      fixture.editor.library.text.textSetFilter('Steps')
    );
    textSets = fixture.editor.library.text.textSets();
    await fixture.events.click(textSets[0]);
    await fixture.snapshot('Steps text set positioning');
  });
});
