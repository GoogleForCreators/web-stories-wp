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

describe('Footer menu', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should have no aXe violations', async () => {
    await expectAsync(fixture.editor.footer.node).toHaveNoViolations();
  });

  it('should show correct tooltip on hover', async () => {
    const { gridViewToggle } = fixture.editor.footer;
    await fixture.events.mouse.moveRel(gridViewToggle, '50%', '50%', {
      steps: 2,
    });

    await fixture.snapshot('Grid view tooltip visible');
  });
});
