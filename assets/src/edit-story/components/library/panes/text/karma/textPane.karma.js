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
    await fixture.container.querySelector('#library-tab-text').click();
    const h1 = fixture.screen.getByText('Heading 1');
    expect(h1).toBeDefined();
    const h3 = fixture.screen.getByText('Heading 3');
    expect(h3).toBeDefined();
    const p = fixture.screen.getByText('Paragraph');
    expect(p).toBeDefined();
    await h1.click();
    await h3.click();
    await p.click();

    await fixture.snapshot('consecutively added text presets');
  });
});
