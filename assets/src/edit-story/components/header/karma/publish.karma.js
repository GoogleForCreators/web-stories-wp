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

describe('Publish integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('CUJ: Creator can Preview & Publish Their Story: Publish story', () => {
    it('should be warned when trying to publish without a title', async () => {
      await fixture.events.click(fixture.editor.canvas.header.publish);

      await fixture.events.sleep(500);

      await fixture.snapshot('Publish without title dialog');

      await fixture.events.click(
        fixture.editor.getByRoleIn(fixture.document, 'button', {
          name: /Add a title/i,
        })
      );

      await fixture.events.sleep(500);

      await fixture.snapshot('Adding a title');
    });
  });
});
