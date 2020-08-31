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
import { Fixture } from '../../../../../karma/fixture';

describe('CUJ: Creator can Add and Write Text: Consecutive text presets', () => {
  let fixture;
  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should add text presets below each other if added consecutively', async () => {
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Heading 1'));
    await fixture.events.click(fixture.editor.library.text.preset('Heading 3'));
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));

    await fixture.snapshot('consecutively added different text presets');
  });

  it('should ensure staggered presets fit on the page', async () => {
    await fixture.editor.library.textTab.click();
    // Stagger all different text presets.
    await fixture.events.click(fixture.editor.library.text.preset('Heading 1'));
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await fixture.events.click(fixture.editor.library.text.preset('Heading 2'));
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await fixture.events.click(fixture.editor.library.text.preset('Heading 3'));
    await fixture.events.click(fixture.editor.library.text.preset('Caption'));
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await fixture.events.click(fixture.editor.library.text.preset('OVERLINE'));

    await fixture.snapshot('staggered all text presets');
  });
});
