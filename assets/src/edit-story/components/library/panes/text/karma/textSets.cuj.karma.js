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
    await waitFor(() =>
      expect(fixture.editor.library.text.textSets.length).toBeGreaterThan(1)
    );
  });

  it('should allow inserting text sets', async () => {
    await waitFor(() =>
      expect(fixture.editor.library.text.textSets.length).toBeTruthy()
    );
    const textSets = fixture.editor.library.text.textSets;
    await fixture.events.click(textSets[1]);

    const storyContext = await fixture.renderHook(() => useStory());
    const selection = storyContext.state.selectedElements;
    // Text sets contain at least 2 elements.
    expect(selection.length).toBeGreaterThan(1);
  });

  it('should allow user to drag and drop text set onto page', async () => {
    await waitFor(() =>
      expect(fixture.editor.library.text.textSets.length).toBeTruthy()
    );

    const textSet = fixture.editor.library.text.textSets[0];
    const page = fixture.editor.canvas.fullbleed.container;

    await fixture.events.mouse.moveRel(textSet, 25, 25);
    await fixture.events.mouse.down();

    await fixture.events.mouse.moveRel(page, 50, 100);
    await fixture.snapshot('Text set dragged');
    await fixture.events.mouse.up();

    await fixture.renderHook(() => useStory());

    // After text set has been added, there should some text elements
    await fixture.snapshot('Text set added');

    const storyContext = await fixture.renderHook(() => useStory());
    expect(storyContext.state.selectedElements.length).toBeGreaterThan(1);
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
    expect(fixture.editor.library.text.textSets.length).toBe(30);
  });

  it('should position the text sets as expected by category', async () => {
    await waitFor(() =>
      expect(fixture.editor.library.text.textSets.length).toBeTruthy()
    );

    await fixture.events.click(
      fixture.editor.library.text.textSetFilter('Editorial')
    );
    let textSets = fixture.editor.library.text.textSets;
    await fixture.events.click(textSets[0]);
    await fixture.snapshot('Editorial text set positioning');

    await fixture.events.click(fixture.editor.canvas.framesLayer.addPage);
    await fixture.events.click(
      fixture.editor.library.text.textSetFilter('Header')
    );
    textSets = fixture.editor.library.text.textSets;
    await fixture.events.click(textSets[0]);
    await fixture.snapshot('List text set positioning');

    await fixture.events.click(fixture.editor.canvas.framesLayer.addPage);
    await fixture.events.click(
      fixture.editor.library.text.textSetFilter('Steps')
    );
    textSets = fixture.editor.library.text.textSets;
    await fixture.events.click(textSets[0]);
    await fixture.snapshot('Steps text set positioning');
  });
});
